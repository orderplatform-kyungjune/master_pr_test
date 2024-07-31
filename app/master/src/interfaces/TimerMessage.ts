export interface TimerMessageType {
  id: number,
  message: string,
  messageUse: string,
  startTime: string,
  endTime: string,
}

export interface requestTimerCreateType {
  storeCode?: string,
  message: string,
  messageUse: string,
  startTime: string,
  endTime: string,
}

export interface requestTimerUpdateType {
  storeCode?: string,
  id: number,
  message: string,
  messageUse: string,
  startTime: string,
  endTime: string,
}

export interface requestTimerDeleteType {
  storeCode?: string,
  id: number,
}

export interface requestTimerListType {
  storeCode?: string,
}

export interface requestTimerDetailType {
  storeCode?: string,
  id: number,
}
