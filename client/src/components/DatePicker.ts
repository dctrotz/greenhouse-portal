export class DatePicker {
  private container: HTMLElement;
  private input: HTMLInputElement;
  private onChangeCallback: ((date: Date) => void) | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.input = document.createElement('input');
    this.input.type = 'date';
    this.input.className = 'date-picker';
    this.container.appendChild(this.input);

    this.input.addEventListener('change', () => {
      if (this.onChangeCallback) {
        // Parse the date string as a local date at midnight
        // The input.value is in YYYY-MM-DD format representing a local date
        // We append 'T00:00:00' (without Z) to ensure it's parsed as local time
        const dateStr = this.input.value;
        const date = new Date(dateStr + 'T00:00:00');
        this.onChangeCallback(date);
      }
    });
  }

  setDate(date: Date): void {
    // Extract local date components - these represent the calendar date in the user's local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // HTML5 date inputs work with date strings in YYYY-MM-DD format
    // The browser interprets this as a local date (no timezone conversion)
    // This is the most reliable method across all browsers
    this.input.value = dateStr;
  }

  getDate(): Date {
    if (!this.input.value) {
      return new Date();
    }
    // Parse the date string as a local date at midnight
    // The input.value is already in YYYY-MM-DD format representing a local date
    // We append 'T00:00:00' (without Z) to ensure it's parsed as local time, not UTC
    // This creates a Date object representing midnight in the user's local timezone
    const dateStr = this.input.value;
    return new Date(dateStr + 'T00:00:00');
  }

  setMaxDate(date: Date): void {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    this.input.max = dateStr;
  }

  setMinDate(date: Date): void {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    this.input.min = dateStr;
  }

  onChange(callback: (date: Date) => void): void {
    this.onChangeCallback = callback;
  }
}

