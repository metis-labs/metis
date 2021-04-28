export default function printParamValue(value: any): string {
  if (value === 'true' || value === 'True') {
    return 'True';
  }
  if (value === 'false' || value === 'False') {
    return 'False';
  }
  if (typeof value === 'string') {
    return `${value}`;
  }
  return JSON.stringify(value);
}
