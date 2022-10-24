export function required(msg: string) {
  return (value: unknown) => (value === "" || value === null || value === undefined ? msg : true);
}

export function minLength(min: number, msg: string) {
  return (value: any) => (`${value}`.length < min ? msg : true);
}

export function maxLength(max: number, msg: string) {
  return (value: any) => (`${value}`.length > max ? msg : true);
}
