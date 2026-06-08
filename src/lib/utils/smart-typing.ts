export function toTitleCase(value: string): string {
  return value.replace(/(^\w|(?:\s|[-'])\w)/g, (match) => match.toUpperCase());
}

export function toSentenceCase(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
