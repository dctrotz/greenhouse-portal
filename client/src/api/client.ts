import { DataPointWithData } from '../types';

const API_BASE = '/api';

export interface DataPointResponse {
  timestamps: number[];
}

export class ApiClient {
  async getCurrentData(): Promise<DataPointWithData> {
    const response = await fetch(`${API_BASE}/data/current`);
    if (!response.ok) {
      throw new Error(`Failed to fetch current data: ${response.statusText}`);
    }
    return response.json();
  }

  async getDataByTimestamp(timestamp: number): Promise<DataPointWithData> {
    const response = await fetch(`${API_BASE}/data/${timestamp}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
  }

  getImageUrl(filename: string): string {
    if (!filename) return '';
    // The filename from DB is an absolute path, we pass it to the API
    return `${API_BASE}/images${filename}`;
  }

  async getDataPointsForDate(date: Date): Promise<number[]> {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const response = await fetch(`${API_BASE}/dates/${dateStr}/data-points`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data points: ${response.statusText}`);
    }
    const data: DataPointResponse = await response.json();
    return data.timestamps;
  }

  async getChartDataForDay(date: Date): Promise<any> {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const response = await fetch(`${API_BASE}/charts/day/${dateStr}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }
    return response.json();
  }

  async getChartDataForMonth(year: number, month: number): Promise<any> {
    const response = await fetch(`${API_BASE}/charts/month/${year}/${month}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }
    return response.json();
  }

  async getChartDataForYear(year: number): Promise<any> {
    const response = await fetch(`${API_BASE}/charts/year/${year}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();

