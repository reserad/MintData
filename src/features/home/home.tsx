import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { homeSelector, HomePayload, getAllTransactions} from './homeSlice';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import transactionsService from '../../services/transactionsService';
import { TransactionsGrid } from '../../models/transactionsGrid';
import { MonthlySpendingPieChart } from '../../components/monthlySpendingPieChart';
import moment from 'moment';
import { Transaction } from '../../models/transaction';
import { Panel } from '../../components/panel';
import Grid from '../../components/grid/grid';
import {Column} from '../../components/grid/gridHeaderColumn';
import CurrencyFormatter from '../../helpers/currencyFormatter';
import { GridModifiers } from '../../models/gridModifiers';
import { GridColumnFilterType } from '../../models/gridColumn';

export type MonthlySpendingHeaderProps = {
    selectedMonth: string;
};

export const MonthlySpendingHeader: React.FunctionComponent<MonthlySpendingHeaderProps> = ({selectedMonth}) => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div data-testid="monthly-spending-header" style={{marginLeft: 20}}>{moment(selectedMonth, 'MM/DD/YYYY').format("MMMM YYYY")} Spending</div>
        </div>
    );
}

export const provideMonthlySpendingHeaderDropdownOptions = (date: moment.Moment) => {
    return Array.from(Array(12).keys()).map((i) => {
        if (i !== 0) {
            date.subtract(1, 'M');
        }

        return (<MenuItem data-testid={`${date.format("MM/DD/YYYY")}-${i}`} key={`${date.format("MM/DD/YYYY")}-${i}`} value={date.format("MM/DD/YYYY")}>{date.format("MMMM YYYY")}</MenuItem>)
    });
}

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const { isGettingTransactions, transactionsError } = useSelector(homeSelector) as HomePayload;
    const [gridModifiers, setGridModifiers] = useState<GridModifiers>({page: 1, take: 20, sortBy: null, direction: 'desc', columnFilters: []});
    const [grid, setGrid] = useState<TransactionsGrid>({data: [], pagination: null});
    const [monthlySpending, setMonthlySpending] = useState<Transaction[]>([]);
    const [isLoadingGrid, setIsLoadingGrid] = useState(true);
    const [gridError, setGridError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(moment().format("MM/DD/YYYY"));

    const now = moment();

    useEffect(() => {
        loadGrid(gridModifiers);
    }, [gridModifiers]);

    useEffect(() => {
        dispatch(getAllTransactions());
    }, [dispatch]);

    useEffect(() => {
        loadMonthlySpendingPieChart();
    }, [selectedMonth])

    const loadGrid = async (gridModifiers: GridModifiers) => {
        const {page, take, sortBy, direction, columnFilters} = gridModifiers;
        const result = await transactionsService.grid(page, take, sortBy, direction, columnFilters);
        setGrid(result);
        setIsLoadingGrid(false);
    }
    
    const loadMonthlySpendingPieChart = async () => {
        const end = moment(selectedMonth).endOf('month');
        const start = end.clone().subtract(1, "M");
        const pieData = await transactionsService.filter(start.format("MM/DD/YYYY"), end.format("MM/DD/YYYY"));
        setMonthlySpending(pieData.data);
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
                        gridModifiers={gridModifiers}
                        onGridChange={setGridModifiers}>
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
                            render={(value: number) => {
                                return <div>{CurrencyFormatter.format(value)}</div>
                            }}
                        />
                    </Grid>
                </Panel>
            )}
            <div className="monthly-spending-web">
                <Panel header={<MonthlySpendingHeader selectedMonth={selectedMonth} />}>
                    <FormControl size='small' variant='outlined' style={{width: 250, marginTop: 15}}>
                        <InputLabel id="month-label">Month</InputLabel>
                        <Select
                            labelId="month-label"
                            id="month-select"
                            value={selectedMonth}
                            label="Month"
                            onChange={(event, data) => setSelectedMonth(event.target.value as string)}
                        >
                            {provideMonthlySpendingHeaderDropdownOptions(now)}
                        </Select>
                    </FormControl>
                    <MonthlySpendingPieChart data={monthlySpending} />
                </Panel>
            </div>
            <div className="monthly-spending-mobile">
                <Panel header={<MonthlySpendingHeader selectedMonth={selectedMonth} />}>
                    <FormControl size='small' variant='outlined' style={{width: 250, marginTop: 15}}>
                        <InputLabel id="month-label">Month</InputLabel>
                        <Select
                            labelId="month-label"
                            id="month-select"
                            value={selectedMonth}
                            label="Month"
                            onChange={(event, data) => setSelectedMonth(event.target.value as string)}
                        >
                            {provideMonthlySpendingHeaderDropdownOptions(now)}
                        </Select>
                    </FormControl>
                    <MonthlySpendingPieChart data={monthlySpending} size='small' />
                </Panel>
            </div>
        </div>
    );
}

export default Home;