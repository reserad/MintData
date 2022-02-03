import { Transaction } from "./transaction";

export type PieChartData = {
    name: string,
    value: number,
    transactions: Transaction[]
};