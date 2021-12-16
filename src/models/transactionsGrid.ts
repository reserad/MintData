import { Pagination } from "./pagination";
import { Transaction } from "./transaction";

export type TransactionsGrid = {
    data: Transaction[],
    pagination: Pagination;
}