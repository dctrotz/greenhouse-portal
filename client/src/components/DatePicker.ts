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
        const date = new Date(this.input.value + 'T00:00:00');
        this.onChangeCallback(date);
      }
    });
  }

  setDate(date: Date): void {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Temporarily remove the change listener to prevent it from firing when we set the value programmatically
    // We'll add it back after setting the value
    const hadValue = this.input.value !== '';
    const oldValue = this.input.value;
    
    // Set the value directly without triggering events
    // Note: Setting input.value programmatically doesn't normally trigger 'change' event,
    // but we'll be explicit about not wanting side effects
    this.input.value = dateStr;
  }

  getDate(): Date {
    if (!this.input.value) {
      return new Date();
    }
    // Parse as local date (date input already gives us local date)
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

