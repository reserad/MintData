import { ApiResponse } from '../models/apiRequest';
import { TransactionsGrid } from '../models/transactionsGrid';
import axios from './baseService';

class TransactionsService {
    getAll = () => {
        return axios.get('/transactions');
    }

    getById = (id: string) => {
        return axios.get(`/transactions/${id}`);
    }

    paginate = async (page: number, take: number): Promise<TransactionsGrid> => {
        const {data} = await axios.post(`/transactions/paginate`, {page, take});
        return data;
    }
    
    filter = (start: string, end: string) => {
        return axios.post(`/transactions/filter`, {start, end});
    }
}

export default new TransactionsService();