// Utility for official Indonesian educational letter numbering

export const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export function getRomanMonth(date: Date = new Date()): string {
  return ROMAN_MONTHS[date.getMonth()];
}

export function generateLetterNumber(
  typeCode: string = '421.3',
  schoolCode: string = 'SMAN1',
  sequenceNumber?: number
): string {
  const date = new Date();
  const roman = getRomanMonth(date);
  const year = date.getFullYear();
  const seq = sequenceNumber !== undefined 
    ? String(sequenceNumber).padStart(3, '0') 
    : String(Math.floor(Math.random() * 200) + 1).padStart(3, '0');

  return `${typeCode} / ${seq} / ${schoolCode} / ${roman} / ${year}`;
}

export function formatIndonesianDate(dateInput: Date | string = new Date()): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return dateInput.toString();

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
