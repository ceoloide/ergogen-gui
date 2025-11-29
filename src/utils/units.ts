
// Helper to convert mm to display unit
export const toDisplay = (mm: number, unit: string) => {
    if (unit === 'U') return mm / 19.05;
    if (unit === 'u') return mm / 19.00;
    return mm;
};

// Helper to convert display unit to mm
export const toMM = (val: number, unit: string) => {
    if (unit === 'U') return val * 19.05;
    if (unit === 'u') return val * 19.00;
    return val;
};
