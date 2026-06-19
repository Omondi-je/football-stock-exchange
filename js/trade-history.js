const TradeHistory = {
    render(stocks) {
        const trades = typeof window !== 'undefined' && window.PORTFOLIO_GLOBAL ? window.PORTFOLIO_GLOBAL.getTrades() : [];
        
        const buyCount = trades.filter(t => t.type === 'BUY').length;
        const sellCount = trades.filter(t => t.type === 'SELL').length;
        const totalPnL = trades.filter(t => t.pnl !== null).reduce((sum, t) => sum + t.pnl, 0);
        
        return `<div class="main-header"><h1 class="main-title">📜 Trade History</h1><p class="main-subtitle">Complete audit of all transactions</p></div>
        
        <div class="grid-4 gap-4" style="margin-bottom:var(--space-5);">
            <div class="card">
                <div class="card-header"><span class="card-title">Total Trades</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;">${trades.length}</div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Buys</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:var(--accent-up);">${buyCount}</div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Sells</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:var(--accent-down);">${sellCount}</div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Realized P&L</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:${totalPnL >= 0 ? 'var(--accent-up)' : 'var(--accent-down)'};">${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}</div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header"><span class="card-title">All Transactions</span></div>
            ${trades.length === 0 ? '<p style="color:var(--text-secondary);padding:var(--space-4);">No trades yet. Start buying!</p>' : 
                `<table class="data-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Team</th>
                            <th style="text-align:right;">Price</th>
                            <th style="text-align:right;">Qty</th>
                            <th style="text-align:right;">Total</th>
                            <th style="text-align:right;">P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${trades.map(t => {
                            const stock = stocks[t.symbol] || { flag: '', name: t.symbol };
                            const pnlDisplay = t.pnl !== null ? 
                                `<span class="${t.pnl >= 0 ? 'text-up' : 'text-down'}">${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}</span>` : 
                                '<span style="color:var(--text-muted);">-</span>';
                            return `<tr>
                                <td style="font-family:var(--font-mono);font-size:12px;">${new Date(t.timestamp).toLocaleTimeString()}</td>
                                <td><span style="padding:4px 10px;border-radius:100px;font-size:11px;font-weight:600;font-family:var(--font-mono);background:${t.type === 'BUY' ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)'};color:${t.type === 'BUY' ? 'var(--accent-up)' : 'var(--accent-down)'};">${t.type}</span></td>
                                <td><div style="display:flex;align-items:center;gap:var(--space-2);"><span style="font-size:16px;">${stock.flag}</span><span style="font-weight:600;">${t.symbol}</span></div></td>
                                <td class="col-number text-mono">${t.price.toFixed(2)}</td>
                                <td class="col-number text-mono">${t.quantity}</td>
                                <td class="col-number text-mono">${t.total.toFixed(2)}</td>
                                <td class="col-number">${pnlDisplay}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>`
            }
        </div>`;
    }
};

export { TradeHistory };