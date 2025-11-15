import { Chart, registerables } from 'chart.js';
import { formatTemperature } from '../utils/temperature';
import { TemperatureUnit } from './UnitSelector';

Chart.register(...registerables);

export type TimePeriod = 'day' | 'month' | 'year';

export class ChartDisplay {
  private container: HTMLElement;
  private chart: Chart | null = null;
  private currentPeriod: TimePeriod = 'day';
  private currentDate: Date = new Date();
  private unit: TemperatureUnit = 'C';

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  setUnit(unit: TemperatureUnit): void {
    this.unit = unit;
    if (this.chart) {
      this.updateChart();
    }
  }

  async render(data: any, period: TimePeriod, date: Date, unit: TemperatureUnit): Promise<void> {
    this.currentPeriod = period;
    this.currentDate = date;
    this.unit = unit;

    if (!data || !data.sensorData || data.sensorData.length === 0) {
      this.container.innerHTML = '<p>No chart data available</p>';
      return;
    }

    // Get the first sensor for now (can be extended to show all sensors)
    const sensorData = data.sensorData[0];

    // Prepare labels based on period
    let labels: string[] = [];
    if (period === 'day') {
      labels = (data.timestamps as number[]).map((ts: number) => {
        const d = new Date(ts * 1000);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      });
    } else if (period === 'month') {
      labels = (data.dates as string[]).map((dateStr: string) => {
        const d = new Date(dateStr);
        return d.getDate().toString();
      });
    } else if (period === 'year') {
      labels = (data.months as string[]).map((monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const d = new Date(parseInt(year), parseInt(month) - 1);
        return d.toLocaleDateString('en-US', { month: 'short' });
      });
    }

    // Store original temperature data in Celsius for tooltip formatting
    const tempAvgRaw = sensorData.temperature_avg;
    const tempMinRaw = sensorData.temperature_min;
    const tempMaxRaw = sensorData.temperature_max;

    // Prepare temperature data
    const tempAvg = tempAvgRaw.map((t: number) => 
      isNaN(t) ? null : this.unit === 'F' ? (t * 9/5 + 32) : t
    );
    const tempMin = tempMinRaw.map((t: number) => 
      isNaN(t) ? null : this.unit === 'F' ? (t * 9/5 + 32) : t
    );
    const tempMax = tempMaxRaw.map((t: number) => 
      isNaN(t) ? null : this.unit === 'F' ? (t * 9/5 + 32) : t
    );

    // Prepare humidity data
    const humAvg = sensorData.humidity_avg.map((h: number) => isNaN(h) ? null : h);
    const humMin = sensorData.humidity_min.map((h: number) => isNaN(h) ? null : h);
    const humMax = sensorData.humidity_max.map((h: number) => isNaN(h) ? null : h);

    // Clear container
    this.container.innerHTML = '<canvas id="temp-humidity-chart"></canvas>';
    const canvas = document.getElementById('temp-humidity-chart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Temp Avg (${this.unit === 'C' ? '°C' : '°F'})`,
            data: tempAvg,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y',
            tension: 0.1,
            pointRadius: 2,
          },
          {
            label: `Temp Min (${this.unit === 'C' ? '°C' : '°F'})`,
            data: tempMin,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            yAxisID: 'y',
            tension: 0.1,
            pointRadius: 1,
            borderDash: [5, 5],
          },
          {
            label: `Temp Max (${this.unit === 'C' ? '°C' : '°F'})`,
            data: tempMax,
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            yAxisID: 'y',
            tension: 0.1,
            pointRadius: 1,
            borderDash: [5, 5],
          },
          {
            label: 'Humidity Avg (%)',
            data: humAvg,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            yAxisID: 'y1',
            tension: 0.1,
            pointRadius: 2,
          },
          {
            label: 'Humidity Min (%)',
            data: humMin,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            yAxisID: 'y1',
            tension: 0.1,
            pointRadius: 1,
            borderDash: [5, 5],
          },
          {
            label: 'Humidity Max (%)',
            data: humMax,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            yAxisID: 'y1',
            tension: 0.1,
            pointRadius: 1,
            borderDash: [5, 5],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Temperature & Humidity',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (label.includes('Temp')) {
                    // Get the raw Celsius value from the original data
                    const dataIndex = context.dataIndex;
                    let rawTemp: number | null = null;
                    
                    if (context.datasetIndex === 0) {
                      // Temp Avg
                      rawTemp = tempAvgRaw[dataIndex];
                    } else if (context.datasetIndex === 1) {
                      // Temp Min
                      rawTemp = tempMinRaw[dataIndex];
                    } else if (context.datasetIndex === 2) {
                      // Temp Max
                      rawTemp = tempMaxRaw[dataIndex];
                    }
                    
                    if (rawTemp !== null && !isNaN(rawTemp)) {
                      label += formatTemperature(rawTemp, this.unit);
                    } else {
                      label += 'N/A';
                    }
                  } else {
                    label += context.parsed.y.toFixed(1) + '%';
                  }
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: period === 'day' ? 'Time' : period === 'month' ? 'Day' : 'Month',
            },
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: `Temperature (${this.unit === 'C' ? '°C' : '°F'})`,
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Humidity (%)',
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }

  private updateChart(): void {
    // This will be called when unit changes
    // For now, we'll need to re-render with new data
    // The app will handle fetching new data
  }

  destroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

