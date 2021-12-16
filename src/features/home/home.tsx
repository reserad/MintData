import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { homeSelector, HomePayload, getAllTransactions} from './homeSlice';
import { Dropdown, DropdownItemProps } from 'semantic-ui-react';
import {TableFooter} from '../../components/tableFooter';
import transactionsService from '../../services/transactionsService';
import { TransactionsGrid } from '../../models/transactionsGrid';
import { GridPagination } from '../../models/gridPagination';
import { MonthlySpendingPieChart } from '../../components/monthlySpendingPieChart';
import moment from 'moment';
import { Transaction } from '../../models/transaction';
import { Panel } from '../../components/panel';
import CurrencyFormatter from '../../helpers/currencyFormatter';

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const { isGettingTransactions, transactionsError } = useSelector(homeSelector) as HomePayload;
    const [gridPagnination, setGridPagination] = useState({page: 1, take: 20} as GridPagination);
    const [grid, setGrid] = useState<TransactionsGrid>({data: [], pagination: null});
    const [monthlySpending, setMonthlySpending] = useState<Transaction[]>([]);
    const [isLoadingGrid, setIsLoadingGrid] = useState(true);
    const [gridError, setGridError] = useState(null);
    const [month, setMonth] = useState(moment().format("MM/DD/YYYY"));

    useEffect(() => {
        loadGrid(gridPagnination);
    }, [gridPagnination]);

    useEffect(() => {
        dispatch(getAllTransactions());
    }, [dispatch]);

    useEffect(() => {
        loadMonthlySpendingPieChart();
    }, [month])

    const loadGrid = async (gridPagnination: GridPagination) => {
        const {page, take} = gridPagnination;
        const result = await transactionsService.paginate(page, take);
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

            return {
                key: date.format("MM/DD/YYYY"),
                text: date.format("MMMM YYYY"),
                value: date.format("MM/DD/YYYY")
            } as DropdownItemProps;
        });
    }

    const renderMonthlySpendingHeader = () => {
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
                    <table style={{width: '100%'}}>
                        <thead>
                            <tr style={{width: 120}}>
                                <th>Date</th>
                            </tr>
                            <tr className="tr-fill">
                                <th>Description</th>
                            </tr>
                            <tr className="category">
                                <th>Category</th>
                            </tr>
                            <tr style={{width: 80}}>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grid.data.map((transaction, i) => {
                                return (
                                    <tr key={transaction.id}>
                                        <td style={{width: 120}}>{moment(transaction.date).format("MM/DD/YYYY")}</td>
                                        <td className="td-fill">{transaction.description}</td>
                                        <td className="category">{transaction.category}</td>
                                        <td style={{width: 80}}>{CurrencyFormatter.format(parseFloat(transaction.amount))}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <TableFooter 
                            pagination={grid.pagination}
                            handleGridPagination={setGridPagination}/>
                    </table>
                </Panel>
            )}
            <div className="monthly-spending-web">
                <Panel header={renderMonthlySpendingHeader()}>
                    <Dropdown
                        style={{width: 325}}
                        onChange={(event, data) => setMonth(data.value as string)}
                        fluid
                        selection
                        options={provideMonthlySpendingHeaderDropdownOptions()} 
                        value={month} />
                    <MonthlySpendingPieChart data={monthlySpending} />
                </Panel>
            </div>
            <div className="monthly-spending-mobile">
                <Panel header={renderMonthlySpendingHeader()}>
                    <Dropdown
                        style={{maxWidth: 325}}
                        onChange={(event, data) => setMonth(data.value as string)}
                        fluid
                        selection
                        options={provideMonthlySpendingHeaderDropdownOptions()} 
                        value={month} />
                    <MonthlySpendingPieChart data={monthlySpending} size='small' />
                </Panel>
            </div>
        </div>
    );
}

export default Home;