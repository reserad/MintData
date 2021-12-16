const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

class CurrencyFormatter {
    format = (value: number) => {
        return formatter.format(value);
    }
}

export default new CurrencyFormatter();