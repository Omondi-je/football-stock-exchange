const TeamDetail = {
    render(symbol, stocks) {
        const team = stocks[symbol];
        if (!team) return '<div class="card" style="text-align:center;padding:var(--space-8);"><h2>Team not found</h2></div>';
        
        const registry = this.getRegistryInfo(symbol);
        const history = team.history.slice(-10).reverse();
        const pnl = this.getPortfolioPnL(symbol, team.price);
        
        return `<div class="main-header">
            <div style="display:flex;align-items:center;gap:var(--space-4);">
                <span style="font-size:48px;cursor:pointer;" onclick="window.router('overview')">←</span>
                <div>
                    <h1 class="main-title" style="display:flex;align-items:center;gap:var(--space-3);">
                        <span style="font-size:40px;">${team.flag}</span>
                        ${team.name} <span style="color:var(--text-muted);font-size:20px;">${symbol}</span>
                    </h1>
                    <p class="main-subtitle">${registry.conf} • Group ${registry.group} • Elo ${registry.elo}</p>
                </div>
            </div>
        </div>
        
        <div class="grid-4 gap-4" style="margin-bottom:var(--space-5);">
            <div class="card">
                <div class="card-header"><span class="card-title">Current Price</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;">${team.price.toFixed(2)}</div>
                <div class="${team.change >= 0 ? 'text-up' : 'text-down'}" style="font-family:var(--font-mono);font-size:14px;font-weight:600;">
                    ${team.change >= 0 ? '+' : ''}${team.change.toFixed(2)} (${team.change >= 0 ? '+' : ''}${team.changePct.toFixed(2)}%)
                </div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Momentum</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:${team.momentum > 70 ? 'var(--accent-up)' : team.momentum < 40 ? 'var(--accent-down)' : 'var(--accent-warn)'};">${team.momentum}</div>
                <div style="width:100%;height:6px;background:var(--bg-elevated);border-radius:3px;margin-top:var(--space-2);overflow:hidden;">
                    <div style="width:${team.momentum}%;height:100%;background:linear-gradient(90deg,var(--accent-up),${team.momentum > 80 ? 'var(--accent-warn)' : 'var(--accent-up)'});border-radius:3px;"></div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Volatility</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:${team.volatility === 'High' ? 'var(--accent-warn)' : team.volatility === 'Medium' ? 'var(--accent-info)' : 'var(--accent-up)'};">${team.volatility.toUpperCase()}</div>
                <div style="font-size:13px;color:var(--text-secondary);margin-top:var(--space-2);">Risk classification</div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Market Cap</span></div>
                <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;">${team.marketCap}</div>
                <div style="font-size:13px;color:var(--text-secondary);margin-top:var(--space-2);">Volume: ${team.volume}</div>
            </div>
        </div>
        
        ${pnl ? `<div class="card" style="margin-bottom:var(--space-5);background:rgba(0,212,170,0.05);border-color:var(--accent-up);">
            <div class="card-header"><span class="card-title">Your Position</span><span class="card-badge badge-up">OPEN</span></div>
            <div class="grid-3 gap-4">
                <div><div style="font-size:12px;color:var(--text-muted);">Quantity</div><div class="text-mono" style="font-size:24px;font-weight:700;">${pnl.quantity}</div></div>
                <div><div style="font-size:12px;color:var(--text-muted);">Avg Price</div><div class="text-mono" style="font-size:24px;font-weight:700;">${pnl.avgPrice.toFixed(2)}</div></div>
                <div><div style="font-size:12px;color:var(--text-muted);">Unrealized P&L</div><div class="text-mono" style="font-size:24px;font-weight:700;color:${pnl.unrealized >= 0 ? 'var(--accent-up)' : 'var(--accent-down)'};">${pnl.unrealized >= 0 ? '+' : ''}${pnl.unrealized.toFixed(2)} (${pnl.unrealizedPct >= 0 ? '+' : ''}${pnl.unrealizedPct.toFixed(2)}%)</div></div>
            </div>
        </div>` : ''}
        
        <div class="grid-2 gap-5">
            <div class="card">
                <div class="card-header"><span class="card-title">Price History</span></div>
                <div style="margin-top:var(--space-4);height:200px;display:flex;align-items:flex-end;gap:2px;padding:var(--space-3) 0;">
                    ${this.renderPriceBars(team.sparkline)}
                </div>
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Recent Matches</span></div>
                ${history.length === 0 ? '<p style="color:var(--text-secondary);padding:var(--space-4);">No matches played yet.</p>' : 
                    history.map(h => `<div style="display:flex;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border-subtle);">
                        <div>
                            <div style="font-weight:600;font-size:14px;">${h.match}</div>
                            <div style="font-size:12px;color:var(--text-muted);">${new Date(h.time).toLocaleDateString()}</div>
                        </div>
                        <div style="text-align:right;">
                            <div class="text-mono" style="font-weight:700;">${h.price.toFixed(2)}</div>
                            <div class="text-mono ${h.changePct >= 0 ? 'text-up' : 'text-down'}" style="font-size:13px;">${h.changePct >= 0 ? '+' : ''}${h.changePct.toFixed(2)}%</div>
                        </div>
                    </div>`).join('')}
            </div>
        </div>
        
        <div class="card" style="margin-top:var(--space-5);">
            <div class="card-header"><span class="card-title">Trade</span></div>
            <div style="display:flex;gap:var(--space-4);margin-top:var(--space-3);">
                <button onclick="window.buyStock('${symbol}');window.router('team-detail','${symbol}')" style="flex:1;padding:14px;background:var(--accent-up);color:var(--bg-base);border:none;border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:16px;font-weight:700;cursor:pointer;">BUY 1 SHARE @ ${team.price.toFixed(2)}</button>
                <button onclick="window.sellStock('${symbol}');window.router('team-detail','${symbol}')" style="flex:1;padding:14px;background:var(--accent-down);color:var(--text-primary);border:none;border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:16px;font-weight:700;cursor:pointer;">SELL 1 SHARE @ ${team.price.toFixed(2)}</button>
            </div>
        </div>`;
    },
    
    getRegistryInfo(symbol) {
        // Import from data.js would be cleaner, but we need a synchronous lookup
        // We'll use a minimal mapping or fetch from window
        const map = {
            GER: { conf: 'UEFA', group: 'A', elo: 1980 },
            ARG: { conf: 'CONMEBOL', group: 'A', elo: 2140 },
            FRA: { conf: 'UEFA', group: 'B', elo: 2020 },
            ENG: { conf: 'UEFA', group: 'B', elo: 2000 },
            ESP: { conf: 'UEFA', group: 'C', elo: 2050 },
            BRA: { conf: 'CONMEBOL', group: 'C', elo: 2100 },
            POR: { conf: 'UEFA', group: 'D', elo: 1960 },
            BEL: { conf: 'UEFA', group: 'D', elo: 1920 },
            NED: { conf: 'UEFA', group: 'E', elo: 1940 },
            ITA: { conf: 'UEFA', group: 'E', elo: 1900 },
            USA: { conf: 'CONCACAF', group: 'F', elo: 1820 },
            MEX: { conf: 'CONCACAF', group: 'F', elo: 1800 },
            MOR: { conf: 'CAF', group: 'G', elo: 1840 },
            SEN: { conf: 'CAF', group: 'G', elo: 1780 },
            GHA: { conf: 'CAF', group: 'H', elo: 1680 },
            CIV: { conf: 'CAF', group: 'H', elo: 1720 },
            RSA: { conf: 'CAF', group: 'I', elo: 1580 },
            NGA: { conf: 'CAF', group: 'I', elo: 1650 },
            EGY: { conf: 'CAF', group: 'J', elo: 1700 },
            TUN: { conf: 'CAF', group: 'J', elo: 1640 },
            JPN: { conf: 'AFC', group: 'K', elo: 1860 },
            KOR: { conf: 'AFC', group: 'K', elo: 1820 },
            AUS: { conf: 'AFC', group: 'L', elo: 1740 },
            IRN: { conf: 'AFC', group: 'L', elo: 1760 },
            URU: { conf: 'CONMEBOL', group: 'M', elo: 1920 },
            COL: { conf: 'CONMEBOL', group: 'M', elo: 1880 },
            ECU: { conf: 'CONMEBOL', group: 'N', elo: 1840 },
            CHI: { conf: 'CONMEBOL', group: 'N', elo: 1780 },
            CAN: { conf: 'CONCACAF', group: 'O', elo: 1740 },
            CRC: { conf: 'CONCACAF', group: 'O', elo: 1660 },
            CRO: { conf: 'UEFA', group: 'P', elo: 1940 },
            DEN: { conf: 'UEFA', group: 'P', elo: 1880 },
            SRB: { conf: 'UEFA', group: 'Q', elo: 1860 },
            SUI: { conf: 'UEFA', group: 'Q', elo: 1840 },
            WAL: { conf: 'UEFA', group: 'R', elo: 1760 },
            POL: { conf: 'UEFA', group: 'R', elo: 1780 },
            SWE: { conf: 'UEFA', group: 'S', elo: 1720 },
            UKR: { conf: 'UEFA', group: 'S', elo: 1740 },
            QAT: { conf: 'AFC', group: 'T', elo: 1640 },
            KSA: { conf: 'AFC', group: 'T', elo: 1660 },
            PAR: { conf: 'CONMEBOL', group: 'U', elo: 1700 },
            BOL: { conf: 'CONMEBOL', group: 'U', elo: 1560 },
            NZL: { conf: 'OFC', group: 'V', elo: 1520 },
            FJI: { conf: 'OFC', group: 'V', elo: 1380 },
            PAN: { conf: 'CONCACAF', group: 'W', elo: 1600 },
            CUW: { conf: 'CONCACAF', group: 'W', elo: 1480 },
            ALG: { conf: 'CAF', group: 'X', elo: 1760 },
            CMR: { conf: 'CAF', group: 'X', elo: 1740 }
        };
        return map[symbol] || { conf: 'Unknown', group: '-', elo: 1500 };
    },
    
    getPortfolioPnL(symbol, currentPrice) {
        // Access PORTFOLIO from window if available
        if (typeof window !== 'undefined' && window.PORTFOLIO_GLOBAL) {
            return window.PORTFOLIO_GLOBAL.getPnL(symbol, currentPrice);
        }
        return null;
    },
    
    renderPriceBars(sparkline) {
        if (sparkline.length < 2) return '<div style="color:var(--text-muted);">No data</div>';
        const min = Math.min(...sparkline);
        const max = Math.max(...sparkline);
        const range = max - min || 1;
        return sparkline.map((v, i) => {
            const h = ((v - min) / range) * 100;
            const isUp = i > 0 && v >= sparkline[i - 1];
            return `<div style="flex:1;height:${Math.max(10, h)}%;background:${isUp ? 'var(--accent-up)' : 'var(--accent-down)'};border-radius:2px;opacity:0.8;transition:height 0.3s;"></div>`;
        }).join('');
    }
};

export { TeamDetail };