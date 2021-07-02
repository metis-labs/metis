// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

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
