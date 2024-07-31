export interface requestDashboardParams {
  store_code?: string,
  start_date: string,
  end_date: string,
  type: string,
}

export interface GoodOrder {
  orderCnt: number,
  previousDayComparison: number,
  lastWeekComparison: number,
}

export interface ServiceOrder {
  orderCnt: number,
  previousDayComparison: number,
  lastWeekComparison: number,
}

export interface Xaxis {
  categories: string[],
}

export interface Series {
  name: string,
  data: number[],
}

export interface LineSeries {
  data: number[],
}

export interface LineChart {
  series: LineSeries,
  xaxis: Xaxis,
}

export interface BarChart {
  series: Series[],
  xaxis: Xaxis,
}

export interface BestGood {
  goodCode: string,
  goodName: string,
  orderCnt: number,
}

export interface OrderData {
  total: number,
  goodOrder: GoodOrder,
  serviceOrder: ServiceOrder,
}
export interface DonutChar {
  series: number[],
  labels: string[],
}

export interface DashboardResultType {
  orderData: OrderData,
  barChart: BarChart,
  lineChart: LineChart,
  bestGoods: BestGood[],
  donutChar: DonutChar,
}
