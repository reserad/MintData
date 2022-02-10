import * as React from 'react';
import { render } from '@testing-library/react';
import { MonthlySpendingHeader, provideMonthlySpendingHeaderDropdownOptions } from './home';
import moment from 'moment';

describe('Home related functional components', () => {
    let now: moment.Moment;
    beforeEach(() => {
        now = moment('02/02/2022', 'MM/DD/YYYY');
    });
    
    test('Expect MonthlySpendingHeader to show currently selected month', () => {
        const body = render(
            <MonthlySpendingHeader selectedMonth='02/02/2022' />
        );

        const text = body.queryByTestId('monthly-spending-header').textContent;

        expect(text).toEqual('February 2022 Spending');
    });

    test('Expect provideMonthlySpendingHeaderDropdownOptions to return 12 MenuItems', () => {

        const menuItems = provideMonthlySpendingHeaderDropdownOptions(now);

        expect(menuItems.length).toEqual(12);
    });

    test('Expect MenuItem text to match', () => {
        const menuItem = render(provideMonthlySpendingHeaderDropdownOptions(now)[0]);
        const menuItemText = menuItem.queryByTestId('02/02/2022-0').textContent;

        expect(menuItemText).toEqual('February 2022');
    });
});