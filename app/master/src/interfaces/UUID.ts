export {};

declare global {
  interface Window {
    UUID: {
      playOrderBell: Function,
      torderPrintReceipt: Function,
      getMacAddress: Function,
      getDeviceUsage: Function,
    },
  }
}
