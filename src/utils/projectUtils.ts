
// Generate project numbers starting with 23
export const generateProjectNumber = (index: number): string => {
  const baseNumber = 230150 + index + 1;
  return baseNumber.toString();
};

// Add project numbers to project names
export const addProjectNumberToName = (name: string, index: number): string => {
  const projectNumber = generateProjectNumber(index);
  return `${projectNumber} ${name}`;
};
