export interface requestKakaoAlimtalkParams {
  store_code?: string,
  receiverNum: string,
}

export interface RamType {
  total: number,
  app: number,
  used: number,
}

export interface StorageType {
  used: number,
  free: number,
}

export interface WifiType {
  ssid: string,
  speed: number,
  strength: number,
}

export interface DeviceInfoType {
  time: number,
  battery: number,
  bright: number,
  version: string,
  gps: string,
  cpu: number,
  ram: RamType,
  storage: StorageType,
  wifi: WifiType,
}
