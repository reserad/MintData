import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { homeSelector, HomePayload, getAllTransactions} from './homeSlice';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import transactionsService from '../../services/transactionsService';
import { TransactionsGrid } from '../../models/transactionsGrid';
import { MonthlySpendingPieChart } from '../../components/monthlySpendingPieChart';
import moment from 'moment';
import { Transaction } from '../../models/transaction';
import { Panel } from '../../components/panel';
import Grid from '../../components/grid/grid';
import {Column} from '../../components/grid/gridHeaderColumn';
import CurrencyFormatter from '../../helpers/currencyFormatter';
import { GridFilters } from '../../models/gridFilters';
import { GridColumnFilterType } from '../../models/gridColumn';

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const { isGettingTransactions, transactionsError } = useSelector(homeSelector) as HomePayload;
    const [gridFilters, setGridFilters] = useState<GridFilters>({page: 1, take: 20, sortBy: null, direction: 'desc', columnFilters: []});
    const [grid, setGrid] = useState<TransactionsGrid>({data: [], pagination: null});
    const [monthlySpending, setMonthlySpending] = useState<Transaction[]>([]);
    const [isLoadingGrid, setIsLoadingGrid] = useState(true);
    const [gridError, setGridError] = useState(null);
    const [month, setMonth] = useState(moment().format("MM/DD/YYYY"));

    useEffect(() => {
        loadGrid(gridFilters);
    }, [gridFilters]);

    useEffect(() => {
        dispatch(getAllTransactions());
    }, [dispatch]);

    useEffect(() => {
        loadMonthlySpendingPieChart();
    }, [month])

    const loadGrid = async (gridFilters: GridFilters) => {
        const {page, take, sortBy, direction, columnFilters} = gridFilters;
        const result = await transactionsService.grid(page, take, sortBy, direction, columnFilters);
        setGrid(result);
        setIsLoadingGrid(false);
    }
    
    const loadMonthlySpendingPieChart = async () => {
        const end = moment(month).endOf('month');
        const start = end.clone().subtract(1, "M");
        const pieData = await transactionsService.filter(start.format("MM/DD/YYYY"), end.format("MM/DD/YYYY"));
        setMonthlySpending(pieData.data);
    }

    const provideMonthlySpendingHeaderDropdownOptions = () => {
        let date = moment();
        return Array.from(Array(12).keys()).map((i) => {
            if (i !== 0) {
                date.subtract(1, 'M');
            }

            return (<MenuItem key={`${date.format("MM/DD/YYYY")}-${i}`} value={date.format("MM/DD/YYYY")}>{date.format("MMMM YYYY")}</MenuItem>)
        });
    }

    const MonthlySpendingHeader = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{marginLeft: 20}}>{moment(month).format("MMMM YYYY")} Spending</div>
            </div>
        );
    }

    if (isLoadingGrid || isGettingTransactions) return <div>....loading</div>
    if (transactionsError) return <div>{transactionsError.message}</div>
    if (gridError) return <div>{gridError.message}</div>

    return (
        <div className="page-wrapper">
            {!isLoadingGrid && !gridError && grid && (
                <Panel header="Transactions">
                    <Grid
                        gridData={grid}
                        enableSort={true}
                        enableFooter={true}
                        gridFilters={gridFilters}
                        onGridChange={setGridFilters}>
                        <Column
                            name="date"
                            width={95} 
                            title="Date"
                            render={(value: string) => {
                                return <div>{moment(value).format("MM/DD/YYYY")}</div>
                            }}
                        />
                        <Column
                            name="description"
                            className="tr-fill" 
                            title="Description"
                            filterType={GridColumnFilterType.Contains}
                        />
                        <Column
                            name="category"
                            className="category" 
                            title="Category"
                            filterType={GridColumnFilterType.Contains}
                        />
                        <Column
                            name="amount"
                            width={95}
                            title="Amount"
                            filterType={GridColumnFilterType.Equals}
                            render={(value: string) => {
                                return <div>{CurrencyFormatter.format(parseFloat(value))}</div>
                            }}
                        />
                    </Grid>
                </Panel>
            )}
            <div className="monthly-spending-web">
                <Panel header={<MonthlySpendingHeader />}>
                    <FormControl size='small' variant='outlined' style={{width: 250, marginTop: 15}}>
                        <InputLabel id="month-label">Month</InputLabel>
                        <Select
                            labelId="month-label"
                            id="month-select"
                            value={month}
                            label="Month"
                            onChange={(event, data) => setMonth(event.target.value as string)}
                        >
                            {provideMonthlySpendingHeaderDropdownOptions()}
                        </Select>
                    </FormControl>
                    <MonthlySpendingPieChart data={monthlySpending} />
                </Panel>
            </div>
            <div className="monthly-spending-mobile">
                <Panel header={<MonthlySpendingHeader />}>
                <FormControl size='small' variant='outlined' style={{width: 250, marginTop: 15}}>
                        <InputLabel id="month-label">Month</InputLabel>
                        <Select
                            labelId="month-label"
                            id="month-select"
                            value={month}
                            label="Month"
                            onChange={(event, data) => setMonth(event.target.value as string)}
                        >
                            {provideMonthlySpendingHeaderDropdownOptions()}
                        </Select>
                    </FormControl>
                    <MonthlySpendingPieChart data={monthlySpending} size='small' />
                </Panel>
            </div>
        </div>
    );
}

export default Home;