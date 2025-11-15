// Test what happens when we set a date input value
// Simulate what the DatePicker.setDate() method does

// Scenario: It's Nov 14, 2025 8:45 PM local time (UTC-8)
// UTC time is Nov 15, 2025 4:45 AM
const timestamp = 1763181900; // Nov 15, 2025 4:45 AM UTC

console.log('=== Test DatePicker.setDate() logic ===');
console.log('');

// Step 1: Create Date from timestamp (what client receives)
const dateFromTimestamp = new Date(timestamp * 1000);
console.log('1. Date from timestamp:');
console.log('   Local time:', dateFromTimestamp.toLocaleString());
console.log('   UTC time:', dateFromTimestamp.toUTCString());
console.log('   getFullYear():', dateFromTimestamp.getFullYear());
console.log('   getMonth():', dateFromTimestamp.getMonth());
console.log('   getDate():', dateFromTimestamp.getDate());
console.log('   getUTCDate():', dateFromTimestamp.getUTCDate());
console.log('');

// Step 2: Extract local date components (what setDate() does)
const year = dateFromTimestamp.getFullYear();
const month = String(dateFromTimestamp.getMonth() + 1).padStart(2, '0');
const day = String(dateFromTimestamp.getDate()).padStart(2, '0');
const dateStr = `${year}-${month}-${day}`;
console.log('2. Date string created:');
console.log('   Date string:', dateStr);
console.log('');

// Step 3: Create local date from components (what we do in loadCurrentData)
const localDate = new Date(
  dateFromTimestamp.getFullYear(),
  dateFromTimestamp.getMonth(),
  dateFromTimestamp.getDate()
);
console.log('3. Local date created from components:');
console.log('   Local date:', localDate.toLocaleString());
console.log('   getFullYear():', localDate.getFullYear());
console.log('   getMonth():', localDate.getMonth());
console.log('   getDate():', localDate.getDate());
console.log('');

// Step 4: If we pass localDate to setDate(), what happens?
const year2 = localDate.getFullYear();
const month2 = String(localDate.getMonth() + 1).padStart(2, '0');
const day2 = String(localDate.getDate()).padStart(2, '0');
const dateStr2 = `${year2}-${month2}-${day2}`;
console.log('4. Date string from localDate:');
console.log('   Date string:', dateStr2);
console.log('');

// Step 5: Test what happens when we parse the date string
// (This is what getDate() does)
const parsedDate = new Date(dateStr2 + 'T00:00:00');
console.log('5. Parsed date string (getDate() behavior):');
console.log('   Parsed local time:', parsedDate.toLocaleString());
console.log('   Parsed UTC time:', parsedDate.toUTCString());
console.log('   getFullYear():', parsedDate.getFullYear());
console.log('   getMonth():', parsedDate.getMonth());
console.log('   getDate():', parsedDate.getDate());
console.log('   getUTCDate():', parsedDate.getUTCDate());
console.log('');

// Step 6: Compare with "today"
const today = new Date();
console.log('6. Today (for comparison):');
console.log('   Today local time:', today.toLocaleString());
console.log('   getFullYear():', today.getFullYear());
console.log('   getMonth():', today.getMonth());
console.log('   getDate():', today.getDate());
console.log('   Date string would be:', 
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
);
