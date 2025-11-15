export class TimeSlider {
  private container: HTMLElement;
  private slider: HTMLInputElement;
  private timeDisplay: HTMLElement;
  private timestamps: number[] = [];
  private onChangeCallback: ((timestamp: number) => void) | null = null;
  private debounceTimer: number | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;

    this.timeDisplay = document.createElement('div');
    this.timeDisplay.className = 'time-display';
    this.container.appendChild(this.timeDisplay);

    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.className = 'time-slider';
    this.container.appendChild(this.slider);

    // Update display immediately on input (for visual feedback)
    this.slider.addEventListener('input', () => {
      this.updateDisplay();
    });

    // Only trigger callback when user stops sliding (on change or after debounce)
    this.slider.addEventListener('change', () => {
      this.triggerCallback();
    });

    // Also handle mouseup/touchend for better UX when dragging
    this.slider.addEventListener('mouseup', () => {
      this.triggerCallback();
    });
    this.slider.addEventListener('touchend', () => {
      this.triggerCallback();
    });
  }

  private triggerCallback(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // Small debounce to ensure we only fire once when user stops
    this.debounceTimer = window.setTimeout(() => {
      if (this.onChangeCallback && this.timestamps.length > 0) {
        const index = parseInt(this.slider.value, 10);
        const timestamp = this.timestamps[index];
        this.onChangeCallback(timestamp);
      }
      this.debounceTimer = null;
    }, 100);
  }

  setTimestamps(timestamps: number[]): void {
    this.timestamps = timestamps;
    if (timestamps.length === 0) {
      this.slider.disabled = true;
      this.slider.min = '0';
      this.slider.max = '0';
      this.slider.value = '0';
      this.timeDisplay.textContent = 'No data available';
      return;
    }

    // Always enable the slider when there are timestamps
    this.slider.disabled = false;
    this.slider.min = '0';
    this.slider.max = String(timestamps.length - 1);
    
    // Only update value if it's out of bounds or if we're setting initial timestamps
    const currentIndex = parseInt(this.slider.value, 10);
    if (isNaN(currentIndex) || currentIndex >= timestamps.length || currentIndex < 0) {
      this.slider.value = String(timestamps.length - 1); // Default to latest
    }
    this.updateDisplay();
  }

  setTimestamp(timestamp: number): void {
    const index = this.timestamps.indexOf(timestamp);
    if (index !== -1) {
      this.slider.value = String(index);
      this.updateDisplay();
    }
  }

  getSelectedTimestamp(): number | null {
    if (this.timestamps.length === 0) {
      return null;
    }
    const index = parseInt(this.slider.value, 10);
    return this.timestamps[index];
  }

  private updateDisplay(): void {
    if (this.timestamps.length === 0) {
      this.timeDisplay.textContent = 'No data available';
      return;
    }

    const index = parseInt(this.slider.value, 10);
    const timestamp = this.timestamps[index];
    const date = new Date(timestamp * 1000);
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.timeDisplay.textContent = timeStr;
  }

  onChange(callback: (timestamp: number) => void): void {
    this.onChangeCallback = callback;
  }
}

