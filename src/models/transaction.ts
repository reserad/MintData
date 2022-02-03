export type Transaction = {
    id: string,
    date: string,
    description: string,
    originalDescription: string,
    amount: number,
    transactionType: string,
    category: string,
    accountName: string,
    labels: string,
    notes: string
}