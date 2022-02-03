import { PieChartData } from "../models/pieChartData";
import { Transaction } from "../models/transaction";
import { filterInsiginificantCategories, getMonthlySpendingPieChartData } from "./monthlySpendingPieChart";

test('Expect pie chart data to have 2 categories', () => {
    const transactions: Transaction[] = [
        {
            id: '1',
            accountName: '',
            amount: 10,
            category: 'a',
            date: '',
            description: '',
            labels: '',
            notes: '',
            originalDescription: '',
            transactionType: ''
        },
        {
            id: '2',
            accountName: '',
            amount: 20,
            category: 'b',
            date: '',
            description: '',
            labels: '',
            notes: '',
            originalDescription: '',
            transactionType: ''
        },
        {
            id: '3',
            accountName: '',
            amount: 30,
            category: 'b',
            date: '',
            description: '',
            labels: '',
            notes: '',
            originalDescription: '',
            transactionType: ''
        }
    ];

    let pieChartData = getMonthlySpendingPieChartData(transactions);

    expect(pieChartData.length === 2).toBeTruthy();
});

test('Expect pie chart data category to sum properly', () => {
    const transactions: Transaction[] = [
        {
            id: '1',
            accountName: '',
            amount: 10,
            category: 'a',
            date: '',
            description: '',
            labels: '',
            notes: '',
            originalDescription: '',
            transactionType: ''
        },
        {
            id: '2',
            accountName: '',
            amount: 20,
            category: 'b',
            date: '',
            description: '',
            labels: '',
            notes: '',
            originalDescription: '',
            transactionType: ''
        },
        {
            id: '3',
            accountName: '',
            amount: 30,
            category: 'b',
            date: '',
            description: '',
            labels: '',
            notes: '',
            originalDescription: '',
            transactionType: ''
        }
    ];

    let pieChartData = getMonthlySpendingPieChartData(transactions);

    expect(pieChartData.find(data => data.name === 'b').value).toEqual(50)
});

test('Expect pie chart to filter out insignificant categories (1% or less of month)', () => {
    let pieChartData: PieChartData[] = [
        {
            name: 'a',
            transactions: [
                {
                    id: '1',
                    accountName: '',
                    amount: 0.1,
                    category: 'a',
                    date: '',
                    description: '',
                    labels: '',
                    notes: '',
                    originalDescription: '',
                    transactionType: ''
                }
            ],
            value: 0.1
        },
        {
            name: 'b',
            transactions: [
                {
                    id: '2',
                    accountName: '',
                    amount: 20,
                    category: 'b',
                    date: '',
                    description: '',
                    labels: '',
                    notes: '',
                    originalDescription: '',
                    transactionType: ''
                },
                {
                    id: '3',
                    accountName: '',
                    amount: 30,
                    category: 'b',
                    date: '',
                    description: '',
                    labels: '',
                    notes: '',
                    originalDescription: '',
                    transactionType: ''
                }
            ],
            value: 50
        },
    ];

    pieChartData = filterInsiginificantCategories(pieChartData);

    expect(pieChartData.length === 1).toBeTruthy();
    expect(pieChartData[0].value).toEqual(50)
});