const STORAGE_KEY = 'fse_portfolio_v3';

class Portfolio {
    constructor() {
        this.holdings = this.load();
        this.cash = this.loadCash();
        this.trades = this.loadTrades();
        if (this.cash === null || isNaN(this.cash)) this.cash = 100000;
    }
    
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY + '_holdings');
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    }
    
    loadCash() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY + '_cash');
            return raw ? parseFloat(raw) : null;
        } catch { return null; }
    }
    
    loadTrades() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY + '_trades');
            return raw ? JSON.parse(raw) : [];
        } catch { return []; }
    }
    
    save() {
        localStorage.setItem(STORAGE_KEY + '_holdings', JSON.stringify(this.holdings));
        localStorage.setItem(STORAGE_KEY + '_cash', String(this.cash));
        localStorage.setItem(STORAGE_KEY + '_trades', JSON.stringify(this.trades));
    }
    
    buy(symbol, price, quantity = 1) {
        const cost = price * quantity;
        if (cost > this.cash) return { success: false, error: 'Insufficient funds' };
        this.cash -= cost;
        if (!this.holdings[symbol]) {
            this.holdings[symbol] = { quantity: 0, avgPrice: 0, totalCost: 0 };
        }
        const h = this.holdings[symbol];
        h.totalCost += cost;
        h.quantity += quantity;
        h.avgPrice = h.totalCost / h.quantity;
        
        this.trades.unshift({
            id: Date.now(),
            type: 'BUY',
            symbol,
            price,
            quantity,
            total: cost,
            timestamp: new Date().toISOString(),
            pnl: null
        });
        this.save();
        return { success: true, holding: this.holdings[symbol] };
    }
    
    sell(symbol, price, quantity = 1) {
        const h = this.holdings[symbol];
        if (!h || h.quantity < quantity) return { success: false, error: 'Insufficient shares' };
        const proceeds = price * quantity;
        const costBasis = h.avgPrice * quantity;
        const pnl = proceeds - costBasis;
        
        this.cash += proceeds;
        h.quantity -= quantity;
        h.totalCost -= costBasis;
        if (h.quantity === 0) delete this.holdings[symbol];
        else h.avgPrice = h.totalCost / h.quantity;
        
        this.trades.unshift({
            id: Date.now(),
            type: 'SELL',
            symbol,
            price,
            quantity,
            total: proceeds,
            timestamp: new Date().toISOString(),
            pnl: pnl
        });
        this.save();
        return { success: true, pnl, proceeds };
    }
    
    getValue(currentPrices) {
        let stockValue = 0;
        for (const [sym, h] of Object.entries(this.holdings)) {
            const price = currentPrices[sym];
            if (price && !isNaN(price)) stockValue += price * h.quantity;
        }
        return {
            cash: Math.round(this.cash * 100) / 100,
            stockValue: Math.round(stockValue * 100) / 100,
            total: Math.round((this.cash + stockValue) * 100) / 100,
            holdings: this.holdings
        };
    }
    
    getPnL(symbol, currentPrice) {
        const h = this.holdings[symbol];
        if (!h || !currentPrice || isNaN(currentPrice)) return null;
        return {
            unrealized: (currentPrice - h.avgPrice) * h.quantity,
            unrealizedPct: ((currentPrice - h.avgPrice) / h.avgPrice) * 100,
            avgPrice: h.avgPrice,
            quantity: h.quantity
        };
    }
    
    getTrades() {
        return this.trades;
    }
    
    reset() {
        this.holdings = {};
        this.cash = 100000;
        this.trades = [];
        this.save();
    }
}

export { Portfolio };