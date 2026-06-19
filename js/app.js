/**
 * FOOTBALL STOCK EXCHANGE — PHASE 2
 * Live match engine, price discovery, portfolio system
 */

import { TEAM_REGISTRY, simulateMatch, calculatePriceChange } from './data.js';
import { Portfolio } from './portfolio.js';

const CONFIG = { refreshInterval: 30000, currency: 'FSE', version: '2.0.0-beta', matchSpeed: 5000 };

// Initialize team stocks from registry
function initStocks() {
    const stocks = {};
    for (const [code, team] of Object.entries(TEAM_REGISTRY)) {
        stocks[code] = {
            symbol: code,
            name: team.name,
            flag: team.flag,
            price: team.basePrice,
            basePrice: team.basePrice,
            change: 0,
            changePct: 0,
            volume: '0',
            marketCap: (team.basePrice * 1000000).toLocaleString(),
            momentum: 50,
            confidence: 'Medium',
            volatility: 'Medium',
            sparkline: Array(10).fill(team.basePrice),
            history: [],
            elo: team.elo
        };
    }
    return stocks;
}

let STOCKS = initStocks();
let PORTFOLIO = new Portfolio();
let MATCH_LOG = [];
let LIVE_MATCH = null;
let IS_SIMULATING = false;

// ============================================
// COMPONENT RENDERERS
// ============================================

const Components = {
    sparkline(data, width = 80, height = 24) {
        const min = Math.min(...data), max = Math.max(...data), range = max - min || 1, stepX = width / (data.length - 1);
        const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`).join(' ');
        const color = data[data.length - 1] >= data[0] ? 'var(--accent-up)' : 'var(--accent-down)';
        return `<svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><polyline fill="none" stroke="${color}" stroke-width="1.5" points="${points}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${width}" cy="${height - ((data[data.length-1] - min) / range) * height}" r="2" fill="${color}"/></svg>`;
    },
    
    indexCard(index) {
        const isUp = index.change >= 0;
        return `<div class="card"><div class="card-header"><span class="card-title">${index.name}</span><span class="card-badge ${isUp ? 'badge-up' : 'badge-down'}">${isUp ? '▲' : '▼'} ${Math.abs(index.changePct).toFixed(2)}%</span></div><div style="font-family:var(--font-mono);font-size:32px;font-weight:700;margin-bottom:var(--space-2);">${index.value.toLocaleString()}</div><div style="font-family:var(--font-mono);font-size:13px;color:${isUp ? 'var(--accent-up)' : 'var(--accent-down)'};">${isUp ? '+' : ''}${index.change.toFixed(2)} today</div></div>`;
    },
    
    teamRow(team) {
        const isUp = team.change >= 0;
        const volColor = team.volatility === 'High' ? 'var(--accent-warn)' : team.volatility === 'Medium' ? 'var(--accent-info)' : 'var(--accent-up)';
        const pnl = PORTFOLIO.getPnL(team.symbol, team.price);
        const owned = pnl ? `<span style="color:var(--accent-up);font-size:11px;">● ${pnl.quantity} @ ${pnl.avgPrice.toFixed(2)}</span>` : '';
        return `<tr data-symbol="${team.symbol}"><td><div style="display:flex;align-items:center;gap:var(--space-3);"><span style="font-size:20px;">${team.flag}</span><div><div style="font-weight:600;color:var(--text-primary);">${team.symbol} ${owned}</div><div style="font-size:12px;color:var(--text-muted);">${team.name}</div></div></div></td><td class="col-number" style="font-size:16px;font-weight:700;color:var(--text-primary);">${team.price.toFixed(2)}</td><td class="col-number ${isUp ? 'text-up' : 'text-down'}" style="font-weight:600;">${isUp ? '+' : ''}${team.change.toFixed(2)} (${isUp ? '+' : ''}${team.changePct.toFixed(2)}%)</td><td class="col-number text-mono">${team.volume}</td><td class="col-number text-mono">${team.marketCap}</td><td class="col-number"><div style="display:flex;align-items:center;gap:var(--space-2);"><div style="width:60px;height:4px;background:var(--bg-elevated);border-radius:2px;overflow:hidden;"><div style="width:${team.momentum}%;height:100%;background:linear-gradient(90deg,var(--accent-up),${team.momentum > 80 ? 'var(--accent-warn)' : 'var(--accent-up)'});border-radius:2px;"></div></div><span class="text-mono" style="font-size:12px;">${team.momentum}</span></div></td><td class="col-number" style="color:${volColor};font-weight:600;font-size:13px;">${team.volatility.toUpperCase()}</td><td>${this.sparkline(team.sparkline)}</td></tr>`;
    },
    
    matchCard(match) {
        const teamA = TEAM_REGISTRY[match.teamA];
        const teamB = TEAM_REGISTRY[match.teamB];
        const status = match.status || 'FINAL';
        const liveIndicator = status === 'LIVE' ? '<span class="live-badge" style="margin-left:8px;"><span class="live-dot"></span>LIVE</span>' : '';
        return `<div class="card" style="margin-bottom:var(--space-4);"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);"><span style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);">GROUP STAGE • MATCHDAY 2${liveIndicator}</span><span style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);">${match.time || 'FT'}</span></div><div style="display:flex;align-items:center;justify-content:space-between;"><div style="display:flex;align-items:center;gap:var(--space-3);flex:1;"><span style="font-size:32px;">${teamA.flag}</span><div><div style="font-weight:700;font-size:18px;">${teamA.name}</div><div style="font-size:12px;color:var(--text-muted);">${match.teamA}</div></div></div><div style="font-family:var(--font-mono);font-size:36px;font-weight:700;text-align:center;min-width:100px;">${match.goalsA} - ${match.goalsB}</div><div style="display:flex;align-items:center;gap:var(--space-3);flex:1;justify-content:flex-end;"><div style="text-align:right;"><div style="font-weight:700;font-size:18px;">${teamB.name}</div><div style="font-size:12px;color:var(--text-muted);">${match.teamB}</div></div><span style="font-size:32px;">${teamB.flag}</span></div></div>${match.upset ? '<div style="margin-top:var(--space-3);padding:8px 12px;background:rgba(255,184,0,0.1);border:1px solid rgba(255,184,0,0.3);border-radius:var(--radius-sm);font-size:13px;color:var(--accent-warn);font-weight:600;">⚡ MAJOR UPSET DETECTED</div>' : ''}</div>`;
    }
};

// ============================================
// LIVE MATCH ENGINE
// ============================================

function startLiveMatch() {
    if (IS_SIMULATING) return;
    IS_SIMULATING = true;
    
    const codes = Object.keys(TEAM_REGISTRY);
    const a = codes[Math.floor(Math.random() * codes.length)];
    let b = codes[Math.floor(Math.random() * codes.length)];
    while (b === a) b = codes[Math.floor(Math.random() * codes.length)];
    
    const match = simulateMatch(TEAM_REGISTRY[a], TEAM_REGISTRY[b]);
    match.status = 'LIVE';
    match.time = '0\'';
    match.minute = 0;
    LIVE_MATCH = match;
    
    updateLiveMatchDisplay();
    
    const interval = setInterval(() => {
        match.minute += Math.floor(Math.random() * 5) + 1;
        if (match.minute >= 90) {
            match.minute = 90;
            match.status = 'FINAL';
            match.time = 'FT';
            clearInterval(interval);
            finalizeMatch(match);
            IS_SIMULATING = false;
            setTimeout(startLiveMatch, CONFIG.matchSpeed * 2);
        } else {
            match.time = match.minute + '\'';
            // Simulate in-match events
            if (Math.random() < 0.15) {
                const scorer = Math.random() < 0.5 ? 'A' : 'B';
                if (scorer === 'A') match.goalsA++;
                else match.goalsB++;
            }
        }
        updateLiveMatchDisplay();
    }, 800);
}

function finalizeMatch(match) {
    MATCH_LOG.unshift(match);
    if (MATCH_LOG.length > 20) MATCH_LOG.pop();
    
    // Update prices
    const changeA = calculatePriceChange(match, TEAM_REGISTRY[match.teamA], true);
    const changeB = calculatePriceChange(match, TEAM_REGISTRY[match.teamB], false);
    
    updateStockPrice(match.teamA, changeA, match);
    updateStockPrice(match.teamB, changeB, match);
    
    // Update indices
    updateIndices();
    
    // Refresh views if on overview
    if (App.currentView === 'overview') {
        App.renderView('overview');
    }
}

function updateStockPrice(symbol, changePct, match) {
    const stock = STOCKS[symbol];
    const oldPrice = stock.price;
    stock.price = Math.max(10, stock.price * (1 + changePct / 100));
    stock.change = stock.price - oldPrice;
    stock.changePct = changePct;
    stock.sparkline.push(stock.price);
    if (stock.sparkline.length > 20) stock.sparkline.shift();
    
    // Update momentum
    stock.momentum = Math.max(0, Math.min(100, stock.momentum + (changePct > 0 ? 5 : -5)));
    
    // Update volatility
    const recentChanges = stock.sparkline.slice(-5);
    const variance = recentChanges.reduce((sum, v, i, arr) => i > 0 ? sum + Math.abs(v - arr[i-1]) : sum, 0) / 4;
    stock.volatility = variance > 8 ? 'High' : variance > 4 ? 'Medium' : 'Low';
    
    // Update volume
    const volNum = parseFloat(stock.volume) || 0;
    stock.volume = (volNum + Math.random() * 2).toFixed(1) + 'M';
    
    // Update market cap
    stock.marketCap = (stock.price * 1000000).toLocaleString();
    
    stock.history.push({ price: stock.price, changePct, match: `${match.goalsA}-${match.goalsB}`, time: new Date().toISOString() });
}

function updateIndices() {
    const prices = Object.values(STOCKS).map(s => s.price);
    const global = prices.reduce((a, b) => a + b, 0) / prices.length;
    const momentum = Object.values(STOCKS).reduce((a, s) => a + s.momentum, 0) / prices.length;
    
    LIVE_DATA.indices[0].value = global * 20;
    LIVE_DATA.indices[0].change = global * 20 - 2847.32;
    LIVE_DATA.indices[0].changePct = (LIVE_DATA.indices[0].change / 2847.32) * 100;
    
    LIVE_DATA.indices[3].value = momentum;
    LIVE_DATA.indices[3].change = momentum - 67.21;
    LIVE_DATA.indices[3].changePct = (LIVE_DATA.indices[3].change / 67.21) * 100;
}

function updateLiveMatchDisplay() {
    const container = document.getElementById('live-match');
    if (container) {
        container.innerHTML = LIVE_MATCH ? Components.matchCard(LIVE_MATCH) : '<div class="card" style="text-align:center;padding:var(--space-6);"><div style="font-size:32px;margin-bottom:var(--space-3);">⏳</div><p style="color:var(--text-secondary);">Waiting for next match...</p></div>';
    }
}

// ============================================
// VIEWS
// ============================================

const Views = {
    overview() {
        const teams = Object.values(STOCKS).sort((a, b) => b.price - a.price);
        const gainers = [...teams].sort((a, b) => b.changePct - a.changePct).slice(0, 5);
        const losers = [...teams].sort((a, b) => a.changePct - b.changePct).slice(0, 5);
        
        return `<div class="main-header"><h1 class="main-title">Market Overview</h1><p class="main-subtitle">World Cup 2026 Group Stage • Live Market Data</p></div>
        <div class="grid-4 gap-4" style="margin-bottom:var(--space-6);">${LIVE_DATA.indices.map(i => Components.indexCard(i)).join('')}</div>
        <div class="grid-2 gap-5">
        <div id="live-match">${LIVE_MATCH ? Components.matchCard(LIVE_MATCH) : '<div class="card" style="text-align:center;padding:var(--space-6);"><div style="font-size:32px;margin-bottom:var(--space-3);">⏳</div><p style="color:var(--text-secondary);">Waiting for next match...</p></div>'}</div>
        <div class="card"><div class="card-header"><span class="card-title">💼 Portfolio</span><span class="card-badge badge-up">LIVE</span></div>${renderPortfolioSummary()}</div>
        </div>
        <div class="grid-2 gap-5" style="margin-top:var(--space-5);">
        <div class="card"><div class="card-header"><span class="card-title">🔥 Top Gainers</span><span class="card-badge badge-up">24H</span></div>${gainers.map(t => `<div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border-subtle);"><div style="display:flex;align-items:center;gap:var(--space-3);"><span style="font-size:20px;">${t.flag}</span><div><div style="font-weight:600;">${t.symbol}</div><div style="font-size:12px;color:var(--text-muted);">${t.name}</div></div></div><div style="text-align:right;"><div class="text-mono" style="font-weight:700;color:var(--text-primary);">${t.price.toFixed(2)}</div><div class="text-mono text-up" style="font-size:13px;font-weight:600;">+${t.changePct.toFixed(2)}%</div></div></div>`).join('')}</div>
        <div class="card"><div class="card-header"><span class="card-title">📉 Top Losers</span><span class="card-badge badge-down">24H</span></div>${losers.map(t => `<div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border-subtle);"><div style="display:flex;align-items:center;gap:var(--space-3);"><span style="font-size:20px;">${t.flag}</span><div><div style="font-weight:600;">${t.symbol}</div><div style="font-size:12px;color:var(--text-muted);">${t.name}</div></div></div><div style="text-align:right;"><div class="text-mono" style="font-weight:700;color:var(--text-primary);">${t.price.toFixed(2)}</div><div class="text-mono text-down" style="font-size:13px;font-weight:600;">${t.changePct.toFixed(2)}%</div></div></div>`).join('')}</div>
        </div>
        <div class="card" style="margin-top:var(--space-5);"><div class="card-header"><span class="card-title">📊 Full Market Board</span><span style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);">${teams.length} Teams Trading</span></div><table class="data-table"><thead><tr><th>Team</th><th style="text-align:right;">Price</th><th style="text-align:right;">Change</th><th style="text-align:right;">Volume</th><th style="text-align:right;">Mkt Cap</th><th style="text-align:right;">Momentum</th><th style="text-align:right;">Volatility</th><th>Trend</th></tr></thead><tbody>${teams.map(t => Components.teamRow(t)).join('')}</tbody></table></div>`;
    },
    
    teams() {
        const teams = Object.values(STOCKS).sort((a, b) => b.price - a.price);
        return `<div class="main-header"><h1 class="main-title">Team Stocks</h1><p class="main-subtitle">All 48 nations trading live</p></div>
        <div class="card"><table class="data-table"><thead><tr><th>Team</th><th style="text-align:right;">Price</th><th style="text-align:right;">Change</th><th style="text-align:right;">Volume</th><th style="text-align:right;">Mkt Cap</th><th style="text-align:right;">Momentum</th><th style="text-align:right;">Volatility</th><th>Trend</th><th>Action</th></tr></thead><tbody>${teams.map(t => Components.teamRow(t) + `<td><button onclick="window.buyStock('${t.symbol}')" style="padding:6px 14px;background:var(--accent-up);color:var(--bg-base);border:none;border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:12px;font-weight:600;cursor:pointer;">BUY</button></td>`).join('')}</tbody></table></div>`;
    },
    
    portfolio() {
        const val = PORTFOLIO.getValue(Object.fromEntries(Object.entries(STOCKS).map(([k, v]) => [k, v.price])));
        return `<div class="main-header"><h1 class="main-title">My Portfolio</h1><p class="main-subtitle">Track your investments across all teams</p></div>
        <div class="grid-3 gap-4" style="margin-bottom:var(--space-5);">
        <div class="card"><div class="card-header"><span class="card-title">Cash</span></div><div style="font-family:var(--font-mono);font-size:28px;font-weight:700;">$${val.cash.toLocaleString()}</div></div>
        <div class="card"><div class="card-header"><span class="card-title">Stock Value</span></div><div style="font-family:var(--font-mono);font-size:28px;font-weight:700;color:var(--accent-up);">$${val.stockValue.toLocaleString()}</div></div>
        <div class="card"><div class="card-header"><span class="card-title">Total Equity</span></div><div style="font-family:var(--font-mono);font-size:28px;font-weight:700;color:var(--accent-info);">$${val.total.toLocaleString()}</div></div>
        </div>
        <div class="card"><div class="card-header"><span class="card-title">Holdings</span></div>${Object.keys(val.holdings).length === 0 ? '<p style="color:var(--text-secondary);padding:var(--space-4);">No positions yet. Buy some stocks!</p>' : '<table class="data-table"><thead><tr><th>Team</th><th>Quantity</th><th>Avg Price</th><th>Current</th><th>P&L</th><th>Action</th></tr></thead><tbody>' + Object.entries(val.holdings).map(([sym, h]) => { const cur = STOCKS[sym].price; const pnl = (cur - h.avgPrice) * h.quantity; const pnlPct = ((cur - h.avgPrice) / h.avgPrice) * 100; return `<tr><td><div style="display:flex;align-items:center;gap:var(--space-2);"><span style="font-size:18px;">${STOCKS[sym].flag}</span><span style="font-weight:600;">${sym}</span></div></td><td class="col-number text-mono">${h.quantity}</td><td class="col-number text-mono">${h.avgPrice.toFixed(2)}</td><td class="col-number text-mono">${cur.toFixed(2)}</td><td class="col-number ${pnl >= 0 ? 'text-up' : 'text-down'}">${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} (${pnl >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%)</td><td><button onclick="window.sellStock('${sym}')" style="padding:6px 14px;background:var(--accent-down);color:var(--text-primary);border:none;border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:12px;font-weight:600;cursor:pointer;">SELL</button></td></tr>`; }).join('') + '</tbody></table>'}</div>`;
    },
    
    matches() {
        return `<div class="main-header"><h1 class="main-title">Live Matches</h1><p class="main-subtitle">Real-time match simulation & price impact</p></div>
        <div id="live-match" style="margin-bottom:var(--space-5);">${LIVE_MATCH ? Components.matchCard(LIVE_MATCH) : '<div class="card" style="text-align:center;padding:var(--space-6);"><div style="font-size:32px;margin-bottom:var(--space-3);">⏳</div><p style="color:var(--text-secondary);">Waiting for next match...</p></div>'}</div>
        <div class="card"><div class="card-header"><span class="card-title">📜 Recent Matches</span></div>${MATCH_LOG.length === 0 ? '<p style="color:var(--text-secondary);padding:var(--space-4);">No matches played yet.</p>' : MATCH_LOG.map(m => Components.matchCard(m)).join('')}</div>`;
    }
};

function renderPortfolioSummary() {
    const val = PORTFOLIO.getValue(Object.fromEntries(Object.entries(STOCKS).map(([k, v]) => [k, v.price])));
    const pnl = val.total - 100000;
    const pnlPct = (pnl / 100000) * 100;
    return `<div style="display:flex;flex-direction:column;gap:var(--space-3);">
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary);">Cash</span><span class="text-mono" style="font-weight:600;">$${val.cash.toLocaleString()}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary);">Stocks</span><span class="text-mono" style="font-weight:600;">$${val.stockValue.toLocaleString()}</span></div>
    <div style="height:1px;background:var(--border-subtle);margin:var(--space-2) 0;"></div>
    <div style="display:flex;justify-content:space-between;"><span style="font-weight:600;">Total</span><span class="text-mono" style="font-weight:700;font-size:18px;">$${val.total.toLocaleString()}</span></div>
    <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-secondary);">P&L</span><span class="text-mono ${pnl >= 0 ? 'text-up' : 'text-down'}" style="font-weight:600;">${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString()} (${pnl >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%)</span></div>
    <div style="margin-top:var(--space-3);"><button onclick="window.resetPortfolio()" style="width:100%;padding:10px;background:var(--bg-elevated);color:var(--text-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:12px;cursor:pointer;">RESET PORTFOLIO</button></div>
    </div>`;
}

// ============================================
// APP SHELL
// ============================================

const App = {
    currentView: 'overview',
    init() {
        this.renderShell();
        this.renderView('overview');
        this.startTicker();
        startLiveMatch();
        
        // Global functions for buttons
        window.buyStock = (sym) => {
            const res = PORTFOLIO.buy(sym, STOCKS[sym].price, 1);
            if (res.success) { this.renderView('portfolio'); alert(`Bought 1 share of ${sym} @ ${STOCKS[sym].price.toFixed(2)}`); }
            else alert(res.error);
        };
        window.sellStock = (sym) => {
            const res = PORTFOLIO.sell(sym, STOCKS[sym].price, 1);
            if (res.success) { this.renderView('portfolio'); alert(`Sold 1 share of ${sym} @ ${STOCKS[sym].price.toFixed(2)} • P&L: ${res.pnl >= 0 ? '+' : ''}${res.pnl.toFixed(2)}`); }
            else alert(res.error);
        };
        window.resetPortfolio = () => { PORTFOLIO.reset(); this.renderView('portfolio'); };
    },
    renderShell() {
        document.getElementById('app').innerHTML = `<div class="app-shell"><header class="app-header"><div class="header-brand"><div class="brand-icon">FSE</div><div><div class="brand-text">Football Stock Exchange</div><div class="brand-sub">WC 2026 EDITION</div></div></div><div class="header-meta"><div class="live-badge"><span class="live-dot"></span>MARKET OPEN</div><div class="market-status">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC</div></div></header><aside class="app-sidebar"><div class="sidebar-section"><div class="sidebar-label">Market</div><div class="nav-item active" data-view="overview"><span class="nav-icon">📊</span> Overview</div><div class="nav-item" data-view="indices"><span class="nav-icon">📈</span> Indices</div><div class="nav-item" data-view="teams"><span class="nav-icon">⚽</span> Team Stocks</div><div class="nav-item" data-view="matches"><span class="nav-icon">🏟️</span> Live Matches</div></div><div class="sidebar-section"><div class="sidebar-label">Portfolio</div><div class="nav-item" data-view="watchlist"><span class="nav-icon">⭐</span> Watchlist</div><div class="nav-item" data-view="portfolio"><span class="nav-icon">💼</span> My Portfolio</div><div class="nav-item" data-view="history"><span class="nav-icon">📜</span> Trade History</div></div><div class="sidebar-section"><div class="sidebar-label">Analytics</div><div class="nav-item" data-view="predictions"><span class="nav-icon">🔮</span> Predictions</div><div class="nav-item" data-view="correlations"><span class="nav-icon">🔗</span> Correlations</div><div class="nav-item" data-view="volatility"><span class="nav-icon">⚡</span> Volatility Lab</div></div></aside><main class="app-main" id="main-content"></main><div class="app-ticker" id="ticker"></div></div>`;
        document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); item.classList.add('active'); this.renderView(item.dataset.view); }));
    },
    renderView(viewName) {
        this.currentView = viewName;
        document.getElementById('main-content').innerHTML = Views[viewName] ? Views[viewName]() : `<div class="main-header"><h1 class="main-title">${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h1><p class="main-subtitle">Coming in Phase 3...</p></div><div class="card" style="text-align:center;padding:var(--space-8);"><div style="font-size:48px;margin-bottom:var(--space-4);">🚧</div><h2 style="font-family:var(--font-heading);margin-bottom:var(--space-3);">Under Construction</h2><p style="color:var(--text-secondary);">This view is being built in the next phase.</p></div>`;
    },
    startTicker() {
        const items = Object.values(STOCKS);
        document.getElementById('ticker').innerHTML = `<div class="ticker-track">${[...items, ...items].map(t => { const isUp = t.change >= 0; return `<div class="ticker-item"><span class="ticker-flag">${t.flag}</span><span class="ticker-symbol">${t.symbol}</span><span>${t.price.toFixed(2)}</span><span class="ticker-change ${isUp ? 'up' : 'down'}">${isUp ? '▲' : '▼'} ${Math.abs(t.changePct).toFixed(2)}%</span></div>`; }).join('')}</div>`;
    }
};


const LIVE_DATA = {
    indices: [
        { name: "FSE Global 50", value: 2847.32, change: 1.24, changePct: 0.04 },
        { name: "FSE Power", value: 1421.88, change: -8.42, changePct: -0.59 },
        { name: "FSE Upset", value: 89.45, change: 12.30, changePct: 15.93 },
        { name: "FSE Momentum", value: 67.21, change: 3.15, changePct: 4.92 }
    ]
};

document.addEventListener('DOMContentLoaded', () => { App.init(); console.log('🏟️ Football Stock Exchange v' + CONFIG.version + ' initialized'); });
