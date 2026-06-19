/**
 * FOOTBALL STOCK EXCHANGE — PORTFOLIO SYSTEM
 * Buy, sell, track P&L with localStorage persistence
 */

const STORAGE_KEY = 'fse_portfolio_v1';

class Portfolio {
    constructor() {
        this.holdings = this.load();
        this.cash = this.loadCash();
        if (this.cash === null) this.cash = 100000; // Starting capital: $100K
    }
    
    load() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY + '_holdings')) || {};
        } catch { return {}; }
    }
    
    loadCash() {
        try {
            return parseFloat(localStorage.getItem(STORAGE_KEY + '_cash'));
        } catch { return null; }
    }
    
    save() {
        localStorage.setItem(STORAGE_KEY + '_holdings', JSON.stringify(this.holdings));
        localStorage.setItem(STORAGE_KEY + '_cash', this.cash.toString());
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
        this.save();
        
        return { success: true, pnl, proceeds };
    }
    
    getValue(currentPrices) {
        let stockValue = 0;
        for (const [sym, h] of Object.entries(this.holdings)) {
            stockValue += (currentPrices[sym] || 0) * h.quantity;
        }
        return {
            cash: this.cash,
            stockValue,
            total: this.cash + stockValue,
            holdings: this.holdings
        };
    }
    
    getPnL(symbol, currentPrice) {
        const h = this.holdings[symbol];
        if (!h) return null;
        return {
            unrealized: (currentPrice - h.avgPrice) * h.quantity,
            unrealizedPct: ((currentPrice - h.avgPrice) / h.avgPrice) * 100,
            avgPrice: h.avgPrice,
            quantity: h.quantity
        };
    }
    
    reset() {
        this.holdings = {};
        this.cash = 100000;
        this.save();
    }
}

export { Portfolio };
