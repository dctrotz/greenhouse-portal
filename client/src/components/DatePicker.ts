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
        // Use valueAsDate if available, otherwise parse the string
        let date: Date;
        if (this.input.valueAsDate) {
          date = this.input.valueAsDate;
        } else {
          date = new Date(this.input.value + 'T00:00:00');
        }
        this.onChangeCallback(date);
      }
    });
  }

  setDate(date: Date): void {
    // Create a date at midnight in local timezone to represent just the calendar date
    // This avoids any timezone conversion issues
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const localMidnightDate = new Date(year, month, day, 0, 0, 0, 0);
    
    // Use valueAsDate property instead of value string
    // This ensures the browser handles the date correctly without timezone conversion
    // HTML5 date inputs work with Date objects directly, which is more reliable
    try {
      this.input.valueAsDate = localMidnightDate;
      
      // Verify it was set correctly by reading it back
      if (this.input.valueAsDate) {
        const setYear = this.input.valueAsDate.getFullYear();
        const setMonth = this.input.valueAsDate.getMonth();
        const setDay = this.input.valueAsDate.getDate();
        
        // If the date doesn't match what we set, fall back to string method
        if (setYear !== year || setMonth !== month || setDay !== day) {
          console.warn('DatePicker: valueAsDate mismatch, using string fallback', {
            expected: { year, month, day },
            actual: { year: setYear, month: setMonth, day: setDay }
          });
          // Fall back to string method
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          this.input.value = dateStr;
        }
      }
    } catch (e) {
      // Fall back to string method if valueAsDate is not supported
      console.warn('DatePicker: valueAsDate not supported, using string fallback', e);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.input.value = dateStr;
    }
  }

  getDate(): Date {
    if (!this.input.value) {
      return new Date();
    }
    // Use valueAsDate if available, otherwise parse the string
    // valueAsDate returns a Date object at midnight in local time, which is what we want
    if (this.input.valueAsDate) {
      return this.input.valueAsDate;
    }
    // Fallback: parse as local date (date input already gives us local date)
    return new Date(this.input.value + 'T00:00:00');
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

