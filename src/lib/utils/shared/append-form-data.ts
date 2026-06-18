export function appendFormDataScalar(
  formData: FormData,
  key: string,
  value: string | number | boolean | undefined | null,
): void {
  if (value === undefined || value === null) return;
  formData.append(key, String(value));
}

export function appendFormDataArray(
  formData: FormData,
  key: string,
  values: string[] | undefined,
): void {
  if (!values?.length) return;
  for (const value of values) {
    formData.append(key, value);
  }
}

export function appendFormDataFile(
  formData: FormData,
  key: string,
  file: File | null | undefined,
): void {
  if (!file) return;
  formData.append(key, file);
}
