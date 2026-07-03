export interface ResponseEnvelope<T> {
  code: number;
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export function buildEnvelope<T>(
  code: number,
  success: boolean,
  message: string,
  data: T | null = null,
): ResponseEnvelope<T> {
  return { code, success, message, data, timestamp: new Date().toISOString() };
}
