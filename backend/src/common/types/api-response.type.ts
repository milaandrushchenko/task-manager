export interface ApiListResponse<T> {
  list: T[];
}

export type ApiActionResponse<T> = {
  success: boolean;
} & T;

export function toActionResponse<T extends Record<string, any>>(
  data: T,
): ApiActionResponse<T> {
  return {
    success: true,
    ...data,
  };
}
