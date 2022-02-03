import React, { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, Sector } from "recharts";
import CurrencyFormatter from "../helpers/currencyFormatter";
import { PieChartData } from "../models/pieChartData";
import { Transaction } from "../models/transaction";

type MonthlySpendingPieChartProps = {
    data: Transaction[];
    size?: 'small' | 'large'
}

const colors = ['#0275d8','#5cb85c','#5bc0de','#f0ad4e','#d9534f','#292b2c','#fd5b78','#cb3d5e','#7e90a9','#536878','#191919','#f06545','#40d3a5','#acc2f1','#c26591','#3f60b0','#3a4439'];
const radian = Math.PI / 180;

export const getMonthlySpendingPieChartData = (transactions: Transaction[]): PieChartData[] => {
    const categories = [...new Set(
        transactions.map(transaction => transaction.category)
    )];

    return categories.map(category => {
        let categoryTotal = 0;
        let categoryTransactions: Transaction[] = [];
        transactions.forEach(transaction => {
            if (transaction.category === category) {
                categoryTransactions.push(transaction);
                categoryTotal += transaction.amount;
            }
        });
        return {
            name: category,
            value: categoryTotal,
            transactions: categoryTransactions
        };
    });
}

export const filterInsiginificantCategories = (pieChartData: PieChartData[]): PieChartData[] => {
    const totalMonthlyTransactionsAmount = pieChartData.map(p => p.value).reduce((sum, x) => sum + x);
    return pieChartData.filter(d => {
        return (d.value * 100 / (totalMonthlyTransactionsAmount)) > 1
    });
}

export const MonthlySpendingPieChart = (props: MonthlySpendingPieChartProps) => {
    const {data, size = 'large'} = props;

    if (data.length === 0) {
        return <div style={{marginTop: 10}}>No data available</div>
    }

    const [pieData, setPieData] = useState<PieChartData[]>([]);
    const [pieActiveIndex, setPieActiveIndex] = useState(0);
    useEffect(() => {
        formattedData(data);
    }, [data]);

    const formattedData = (transactions: Transaction[]) => {
        let pieData = getMonthlySpendingPieChartData(transactions);
        pieData = filterInsiginificantCategories(pieData);
        setPieData(pieData);
    }

    const renderCustomizedLabel = (props: any) => {
        const {  
            cx, 
            cy, 
            midAngle, 
            innerRadius, 
            outerRadius, 
            percent
        } = props;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + (1.6*radius) * Math.cos(-midAngle * radian);
        const y = cy + (1.6*radius) * Math.sin(-midAngle * radian);

        return (
            percent * 100 >= (size === 'large' ? 0.75 : 1.5) ? 
                <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            : null
        );
    };

    const width = size === 'large' ? 550 : 300;
    const height = size === 'large' ? 550 : 450;

    const handlePieChartSectorClick = () => {
        console.log(pieActiveIndex);
    }

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
        return (
          <g>
            <text x={cx} y={cy} textAnchor="middle" fill={fill} style={{fontSize: size === 'large' ? 16 : 14}}>
                {payload.name}
            </text>
            <text x={cx} y={cy + 20} textAnchor="middle" fill={fill}>
                {CurrencyFormatter.format(payload.value)}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius - 2}
                outerRadius={outerRadius + 2}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                onClick={handlePieChartSectorClick}
            />
          </g>
        );
      };

    return (
        <PieChart width={width} height={height}>
            <Pie 
                dataKey="value" 
                data={pieData} 
                innerRadius={size === 'large' ? 95 : 60} 
                outerRadius={size === 'large' ? 140 : 88} 
                fill="#82ca9d"
                labelLine={true}
                label={renderCustomizedLabel}
                paddingAngle={1} minAngle={1}
                activeShape={renderActiveShape}
                activeIndex={pieActiveIndex}
                onMouseEnter={(_, i) => setPieActiveIndex(i)}
            >
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Legend/>
        </PieChart>
    );
}