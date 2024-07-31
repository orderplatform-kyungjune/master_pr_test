export interface ToastType {
  id: number,
  message: string,
  status: 'error' | 'warning' | 'success' | 'info',
  duration: number,
  teleport?: boolean,
}
