export interface DataPoint {
    session: string | number;
    weight: number;
}

export interface LineChartInterface {

    data: DataPoint[];
    width?: string | number;
    height?: number;
}

export interface RechargeBarInterface {
    value: number;
    max?: number;
    label?: string;
}