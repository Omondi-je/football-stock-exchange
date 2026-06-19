/**
 * FOOTBALL STOCK EXCHANGE
 * Core Application Module
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    refreshInterval: 30000,
    currency: 'FSE',
    version: '1.0.0-alpha'
};

// ============================================
// DATA LAYER — Live World Cup 2026 Data
// ============================================

const LIVE_DATA = {
    tournament: {
        name: 'FIFA World Cup 2026™',
        host: 'USA / Canada / Mexico',
        stage: 'Group Stage',
        matchday: 2,
        totalTeams: 48,
        matchesPlayed: 24,
        matchesTotal: 104
    },
    
    indices: [
        { name: 'FSE Global 50', value: 2847.32, change: 1.24, changePct: 0.04 },
        { name: 'FSE Power', value: 1421.88, change: -8.42, changePct: -0.59 },
        { name: 'FSE Upset', value: 89.45, change: 12.30, changePct: 15.93 },
        { name: 'FSE Momentum', value: 67.21, change: 3.15, changePct: 4.92 }
    ],
    
    teams: [
        { symbol: 'GER', name: 'Germany', flag: '🇩🇪', price: 142.50, change: 8.20, changePct: 6.11, volume: '2.4M', marketCap: '4.2B', momentum: 94, confidence: 'High', volatility: 'Low', sparkline: [120,125,128,130,134,142] },
        { symbol: 'ARG', name: 'Argentina', flag: '🇦🇷', price: 138.20, change: 3.10, changePct: 2.29, volume: '3.1M', marketCap: '5.8B', momentum: 88, confidence: 'High', volatility: 'Low', sparkline: [130,132,131,133,135,138] },
        { symbol: 'FRA', name: 'France', flag: '🇫🇷', price: 135.75, change: 2.80, changePct: 2.11, volume: '2.8M', marketCap: '5.1B', momentum: 85, confidence: 'High', volatility: 'Medium', sparkline: [128,130,129,131,133,136] },
        { symbol: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', price: 128.40, change: 5.60, changePct: 4.56, volume: '2.1M', marketCap: '4.5B', momentum: 82, confidence: 'Medium', volatility: 'Medium', sparkline: [118,120,119,122,125,128] },
        { symbol: 'MOR', name: 'Morocco', flag: '🇲🇦', price: 89.30, change: 12.50, changePct: 16.27, volume: '4.2M', marketCap: '1.8B', momentum: 91, confidence: 'Medium', volatility: 'High', sparkline: [65,70,72,78,82,89] },
        { symbol: 'BRA', name: 'Brazil', flag: '🇧🇷', price: 118.50, change: -2.40, changePct: -1.99, volume: '3.5M', marketCap: '6.2B', momentum: 72, confidence: 'Medium', volatility: 'High', sparkline: [125,124,122,121,120,119] },
        { symbol: 'USA', name: 'United States', flag: '🇺🇸', price: 95.20, change: 7.80, changePct: 8.92, volume: '3.8M', marketCap: '2.1B', momentum: 86, confidence: 'High', volatility: 'Medium', sparkline: [82,85,88,90,92,95] },
        { symbol: 'ESP', name: 'Spain', flag: '🇪🇸', price: 112.00, change: -0.50, changePct: -0.44, volume: '1.9M', marketCap: '4.8B', momentum: 78, confidence: 'Medium', volatility: 'Low', sparkline: [115,114,113,112,112,112] },
        { symbol: 'GHA', name: 'Ghana', flag: '🇬🇭', price: 72.40, change: 8.90, changePct: 14.02, volume: '2.6M', marketCap: '980M', momentum: 84, confidence: 'Medium', volatility: 'High', sparkline: [58,62,65,68,70,72] },
        { symbol: 'SEN', name: 'Senegal', flag: '🇸🇳', price: 78.20, change: -4.10, changePct: -4.98, volume: '1.4M', marketCap: '1.1B', momentum: 68, confidence: 'Low', volatility: 'High', sparkline: [85,83,82,80,79,78] }
    ],
    
    recentTrades: [
        { time: '14:32', team: 'GER', action: 'BUY', price: 142.50, volume: '450K', match: 'GER 7-1 CUW' },
        { time: '14:28', team: 'MOR', action: 'BUY', price: 89.30, volume: '820K', match: 'MOR 1-1 BRA' },
        { time: '14:15', team: 'USA', action: 'BUY', price: 95.20, volume: '1.2M', match: 'USA 4-1 PAR' },
        { time: '13:58', team: 'SEN', action: 'SELL', price: 78.20, volume: '680K', match: 'FRA 3-1 SEN' },
        { time: '13:42', team: 'GHA', action: 'BUY', price: 72.40, volume: '390K', match: 'GHA 1-0 PAN' },
        { time: '12:20', team: 'ARG', action: 'BUY', price: 138.20, volume: '2.1M', match: 'ARG 3-0 ALG' }
    ]
};

// ============================================
// COMPONENT RENDERERS
// ============================================

const Components = {
    sparkline(data, width = 80, height = 24) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const stepX = width / (data.length - 1);
        
        const points = data.map((val, i) => {
            const x = i * stepX;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');
        
        const isUp = data[data.length - 1] >= data[0];
        const color = isUp ? 'var(--accent-up)' : 'var(--accent-down)';
        
        return `<svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <polyline fill="none" stroke="${color}" stroke-width="1.5" points="${points}" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="${width}" cy="${height - ((data[data.length-1] - min) / range) * height}" r="2" fill="${color}"/>
        </svg>`;
    },
    
    indexCard(index) {
        const isUp = index.change >= 0;
        return `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">${index.name}</span>
                    <span class="card-badge ${isUp ? 'badge-up' : 'badge-down'}">
                        ${isUp ? '▲' : '▼'} ${Math.abs(index.changePct).toFixed(2)}%
                    </span>
                </div>
                <div style="font-family: var(--font-mono); font-size: 32px; font-weight: 700; margin-bottom: var(--space-2);">
                    ${index.value.toLocaleString()}
                </div>
                <div style="font-family: var(--font-mono); font-size: 13px; color: ${isUp ? 'var(--accent-up)' : 'var(--accent-down)'};">
                    ${isUp ? '+' : ''}${index.change.toFixed(2)} today
                </div>
            </div>
        `;
    },
    
    teamRow(team) {
        const isUp = team.change >= 0;
        const volColor = team.volatility === 'High' ? 'var(--accent-warn)' : 
                        team.volatility === 'Medium' ? 'var(--accent-info)' : 'var(--accent-up)';
        
        return `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:var(--space-3);">
                        <span style="font-size:20px;">${team.flag}</span>
                        <div>
                            <div style="font-weight:600; color:var(--text-primary);">${team.symbol}</div>
                            <div style="font-size:12px; color:var(--text-muted);">${team.name}</div>
                        </div>
                    </div>
                </td>
                <td class="col-number" style="font-size:16px; font-weight:700; color:var(--text-primary);">
                    ${team.price.toFixed(2)}
                </td>
                <td class="col-number ${isUp ? 'text-up' : 'text-down'}" style="font-weight:600;">
                    ${isUp ? '+' : ''}${team.change.toFixed(2)} (${isUp ? '+' : ''}${team.changePct.toFixed(2)}%)
                </td>
                <td class="col-number text-mono">${team.volume}</td>
                <td class="col-number text-mono">${team.marketCap}</td>
                <td class="col-number">
                    <div style="display:flex; align-items:center; gap:var(--space-2);">
                        <div style="width:60px; height:4px; background:var(--bg-elevated); border-radius:2px; overflow:hidden;">
                            <div style="width:${team.momentum}%; height:100%; background: linear-gradient(90deg, var(--accent-up), ${team.momentum > 80 ? 'var(--accent-warn)' : 'var(--accent-up)'}); border-radius:2px;"></div>
                        </div>
                        <span class="text-mono" style="font-size:12px;">${team.momentum}</span>
                    </div>
                </td>
                <td class="col-number" style="color:${volColor}; font-weight:600; font-size:13px;">
                    ${team.volatility.toUpperCase()}
                </td>
                <td>${this.sparkline(team.sparkline)}</td>
            </tr>
        `;
    },
    
    tradeItem(trade) {
        const isBuy = trade.action === 'BUY';
        return `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--space-3) 0; border-bottom:1px solid var(--border-subtle);">
                <div style="display:flex; align-items:center; gap:var(--space-3);">
                    <span style="font-size:18px;">${LIVE_DATA.teams.find(t => t.symbol === trade.team)?.flag || ''}</span>
                    <div>
                        <div style="font-weight:600; font-size:14px;">
                            <span style="color:${isBuy ? 'var(--accent-up)' : 'var(--accent-down)'};">${trade.action}</span> ${trade.team}
                        </div>
                        <div style="font-size:12px; color:var(--text-muted);">${trade.match}</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div class="text-mono" style="font-weight:600;">${trade.price.toFixed(2)}</div>
                    <div class="text-mono" style="font-size:12px; color:var(--text-muted);">${trade.volume} • ${trade.time}</div>
                </div>
            </div>
        `;
    }
};

// ============================================
// VIEW RENDERERS
// ============================================

const Views = {
    overview() {
        const topGainers = [...LIVE_DATA.teams].sort((a,b) => b.changePct - a.changePct).slice(0, 5);
        const topLosers = [...LIVE_DATA.teams].sort((a,b) => a.changePct - b.changePct).slice(0, 5);
        
        return `
            <div class="main-header">
                <h1 class="main-title">Market Overview</h1>
                <p class="main-subtitle">World Cup 2026 Group Stage • Matchday ${LIVE_DATA.tournament.matchday} of 3</p>
            </div>
            
            <div class="grid-4 gap-4" style="margin-bottom: var(--space-6);">
                ${LIVE_DATA.indices.map(i => Components.indexCard(i)).join('')}
            </div>
            
            <div class="grid-2 gap-5">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">🔥 Top Gainers</span>
                        <span class="card-badge badge-up">24H</span>
                    </div>
                    ${topGainers.map(t => `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--space-3) 0; border-bottom:1px solid var(--border-subtle);">
                            <div style="display:flex; align-items:center; gap:var(--space-3);">
                                <span style="font-size:20px;">${t.flag}</span>
                                <div>
                                    <div style="font-weight:600;">${t.symbol}</div>
                                    <div style="font-size:12px; color:var(--text-muted);">${t.name}</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div class="text-mono" style="font-weight:700; color:var(--text-primary);">${t.price.toFixed(2)}</div>
                                <div class="text-mono text-up" style="font-size:13px; font-weight:600;">+${t.changePct.toFixed(2)}%</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">📉 Top Losers</span>
                        <span class="card-badge badge-down">24H</span>
                    </div>
                    ${topLosers.map(t => `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--space-3) 0; border-bottom:1px solid var(--border-subtle);">
                            <div style="display:flex; align-items:center; gap:var(--space-3);">
                                <span style="font-size:20px;">${t.flag}</span>
                                <div>
                                    <div style="font-weight:600;">${t.symbol}</div>
                                    <div style="font-size:12px; color:var(--text-muted);">${t.name}</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div class="text-mono" style="font-weight:700; color:var(--text-primary);">${t.price.toFixed(2)}</div>
                                <div class="text-mono text-down" style="font-size:13px; font-weight:600;">${t.changePct.toFixed(2)}%</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="card" style="margin-top: var(--space-5);">
                <div class="card-header">
                    <span class="card-title">📊 Full Market Board</span>
                    <span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">
                        ${LIVE_DATA.teams.length} Teams Trading
                    </span>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th style="text-align:right;">Price</th>
                            <th style="text-align:right;">Change</th>
                            <th style="text-align:right;">Volume</th>
                            <th style="text-align:right;">Mkt Cap</th>
                            <th style="text-align:right;">Momentum</th>
                            <th style="text-align:right;">Volatility</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${LIVE_DATA.teams.sort((a,b) => b.price - a.price).map(t => Components.teamRow(t)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
};

// ============================================
// APP SHELL
// ============================================

const App = {
    currentView: 'overview',
    
    init() {
        this.renderShell();
        this.renderView('overview');
        this.startTicker();
    },
    
    renderShell() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="app-shell">
                <header class="app-header">
                    <div class="header-brand">
                        <div class="brand-icon">FSE</div>
                        <div>
                            <div class="brand-text">Football Stock Exchange</div>
                            <div class="brand-sub">WC 2026 EDITION</div>
                        </div>
                    </div>
                    <div class="header-meta">
                        <div class="live-badge">
                            <span class="live-dot"></span>
                            MARKET OPEN
                        </div>
                        <div class="market-status">
                            ${new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})} UTC
                        </div>
                    </div>
                </header>
                
                <aside class="app-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-label">Market</div>
                        <div class="nav-item active" data-view="overview">
                            <span class="nav-icon">📊</span> Overview
                        </div>
                        <div class="nav-item" data-view="indices">
                            <span class="nav-icon">📈</span> Indices
                        </div>
                        <div class="nav-item" data-view="teams">
                            <span class="nav-icon">⚽</span> Team Stocks
                        </div>
                        <div class="nav-item" data-view="matches">
                            <span class="nav-icon">🏟️</span> Live Matches
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-label">Portfolio</div>
                        <div class="nav-item" data-view="watchlist">
                            <span class="nav-icon">⭐</span> Watchlist
                        </div>
                        <div class="nav-item" data-view="portfolio">
                            <span class="nav-icon">💼</span> My Portfolio
                        </div>
                        <div class="nav-item" data-view="history">
                            <span class="nav-icon">📜</span> Trade History
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-label">Analytics</div>
                        <div class="nav-item" data-view="predictions">
                            <span class="nav-icon">🔮</span> Predictions
                        </div>
                        <div class="nav-item" data-view="correlations">
                            <span class="nav-icon">🔗</span> Correlations
                        </div>
                        <div class="nav-item" data-view="volatility">
                            <span class="nav-icon">⚡</span> Volatility Lab
                        </div>
                    </div>
                </aside>
                
                <main class="app-main" id="main-content">
                </main>
                
                <div class="app-ticker" id="ticker">
                </div>
            </div>
        `;
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const view = item.dataset.view;
                this.renderView(view);
            });
        });
    },
    
    renderView(viewName) {
        const main = document.getElementById('main-content');
        this.currentView = viewName;
        
        if (Views[viewName]) {
            main.innerHTML = Views[viewName]();
        } else {
            main.innerHTML = `
                <div class="main-header">
                    <h1 class="main-title">${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h1>
                    <p class="main-subtitle">Coming in Phase 2...</p>
                </div>
                <div class="card" style="text-align:center; padding:var(--space-8);">
                    <div style="font-size:48px; margin-bottom:var(--space-4);">🚧</div>
                    <h2 style="font-family:var(--font-heading); margin-bottom:var(--space-3);">Under Construction</h2>
                    <p style="color:var(--text-secondary);">This view is being built in the next phase.</p>
                </div>
            `;
        }
    },
    
    startTicker() {
        const ticker = document.getElementById('ticker');
        const items = [...LIVE_DATA.teams, ...LIVE_DATA.teams];
        
        const tickerHTML = items.map(t => {
            const isUp = t.change >= 0;
            return `
                <div class="ticker-item">
                    <span class="ticker-flag">${t.flag}</span>
                    <span class="ticker-symbol">${t.symbol}</span>
                    <span>${t.price.toFixed(2)}</span>
                    <span class="ticker-change ${isUp ? 'up' : 'down'}">
                        ${isUp ? '▲' : '▼'} ${Math.abs(t.changePct).toFixed(2)}%
                    </span>
                </div>
            `;
        }).join('');
        
        ticker.innerHTML = `<div class="ticker-track">${tickerHTML}</div>`;
    }
};

// ============================================
// BOOT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    console.log('🏟️ Football Stock Exchange v' + CONFIG.version + ' initialized');
});
