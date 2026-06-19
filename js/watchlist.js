const WATCHLIST_KEY = 'fse_watchlist_v1';

const Watchlist = {
    getItems() {
        try {
            const raw = localStorage.getItem(WATCHLIST_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch { return []; }
    },
    
    saveItems(items) {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    },
    
    toggle(symbol) {
        const items = this.getItems();
        const idx = items.indexOf(symbol);
        if (idx >= 0) items.splice(idx, 1);
        else items.push(symbol);
        this.saveItems(items);
        return idx < 0; // true if added
    },
    
    isWatched(symbol) {
        return this.getItems().includes(symbol);
    },
    
    render(stocks) {
        const watched = this.getItems();
        const watchedTeams = watched.map(sym => stocks[sym]).filter(Boolean);
        
        return `<div class="main-header"><h1 class="main-title">⭐ Watchlist</h1><p class="main-subtitle">Quick access to your favorite teams</p></div>
        
        <div class="grid-4 gap-4" style="margin-bottom:var(--space-5);">
            <div class="card">
                <div class="card-header"><span class="card-title">Watched</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;">${watched.length}</div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Avg Price</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;">
                    ${watchedTeams.length > 0 ? (watchedTeams.reduce((sum,t) => sum+t.price,0)/watchedTeams.length).toFixed(2) : '-'}
                </div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Avg Momentum</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:${watchedTeams.length > 0 && watchedTeams.reduce((sum,t) => sum+t.momentum,0)/watchedTeams.length > 70 ? 'var(--accent-up)' : 'var(--text-primary)'};">
                    ${watchedTeams.length > 0 ? Math.round(watchedTeams.reduce((sum,t) => sum+t.momentum,0)/watchedTeams.length) : '-'}
                </div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Gainers</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:var(--accent-up);">
                    ${watchedTeams.filter(t => t.change > 0).length}
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header"><span class="card-title">Your Watchlist</span></div>
            ${watchedTeams.length === 0 ? '<p style="color:var(--text-secondary);padding:var(--space-4);">No teams watched. Click the ⭐ on any team to add.</p>' :
                `<table class="data-table">
                    <thead>
                        <tr><th>Team</th><th style="text-align:right;">Price</th><th style="text-align:right;">Change</th><th style="text-align:right;">Momentum</th><th style="text-align:right;">Volatility</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        ${watchedTeams.map(t => {
                            const isUp = t.change >= 0;
                            return `<tr onclick="window.router('team-detail','${t.symbol}')" style="cursor:pointer;">
                                <td><div style="display:flex;align-items:center;gap:var(--space-3);"><span style="font-size:20px;">${t.flag}</span><div><div style="font-weight:600;">${t.symbol}</div><div style="font-size:12px;color:var(--text-muted);">${t.name}</div></div></div></td>
                                <td class="col-number" style="font-weight:700;">${t.price.toFixed(2)}</td>
                                <td class="col-number ${isUp ? 'text-up' : 'text-down'}">${isUp ? '+' : ''}${t.changePct.toFixed(2)}%</td>
                                <td class="col-number"><div style="display:flex;align-items:center;gap:var(--space-2);"><div style="width:50px;height:4px;background:var(--bg-elevated);border-radius:2px;overflow:hidden;"><div style="width:${t.momentum}%;height:100%;background:var(--accent-up);border-radius:2px;"></div></div><span class="text-mono" style="font-size:12px;">${t.momentum}</span></div></td>
                                <td class="col-number" style="font-size:13px;">${t.volatility.toUpperCase()}</td>
                                <td><button onclick="event.stopPropagation();window.toggleWatchlist('${t.symbol}')" style="padding:6px 12px;background:transparent;border:1px solid var(--accent-warn);color:var(--accent-warn);border-radius:var(--radius-sm);font-size:12px;cursor:pointer;">★ REMOVE</button></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>`
            }
        </div>
        
        <div class="card" style="margin-top:var(--space-5);">
            <div class="card-header"><span class="card-title">All Teams — Click ⭐ to Watch</span></div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-3);margin-top:var(--space-4);">
                ${Object.values(stocks).map(t => {
                    const isWatched = this.isWatched(t.symbol);
                    return `<div onclick="window.toggleWatchlist('${t.symbol}')" style="padding:var(--space-3);border-radius:var(--radius-sm);border:1px solid ${isWatched ? 'var(--accent-warn)' : 'var(--border-subtle)'};background:${isWatched ? 'rgba(255,184,0,0.05)' : 'var(--bg-surface)'};cursor:pointer;text-align:center;transition:all 0.2s;">
                        <div style="font-size:24px;margin-bottom:var(--space-1);">${t.flag}</div>
                        <div style="font-weight:600;font-size:13px;">${t.symbol}</div>
                        <div class="text-mono" style="font-size:12px;color:var(--text-muted);">${t.price.toFixed(2)}</div>
                        <div style="margin-top:var(--space-1);font-size:16px;color:${isWatched ? 'var(--accent-warn)' : 'var(--text-muted)'};">${isWatched ? '★' : '☆'}</div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }
};

export { Watchlist };