export const sortData = (data, criterion) => {
    switch (criterion) {
        case 'weekly':
            return sortByDate(data, 7);
        case 'monthly':
            return sortByDate(data, 30);
        case 'annually':
            return sortByDate(data, 365);
        case 'profit':
            return [...data].sort((a, b) => b.profit - a.profit).slice(0, 3);
        default:
            return data;
    }
};

const sortByDate = (data, daysBack) => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - daysBack);
    return data.filter(item => new Date(item.orderDate) >= threshold);
};
