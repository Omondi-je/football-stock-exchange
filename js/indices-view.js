const IndicesView = {
    render(stocks) {
        const globalData = this.calculateGlobal50(stocks);
        const powerData = this.calculatePowerIndex(stocks);
        const upsetData = this.calculateUpsetIndex(stocks);
        const momentumData = this.calculateMomentumIndex(stocks);
        
        return `<div class="main-header"><h1 class="main-title">📈 Market Indices</h1><p class="main-subtitle">Composite benchmarks tracking the Football Stock Exchange</p></div>
        
        <div class="grid-2 gap-5">
            ${this.indexCard('FSE Global 50', 'Broad market benchmark', globalData, 'var(--accent-up)')}
            ${this.indexCard('FSE Power', 'Top 10 teams by market cap', powerData, 'var(--accent-info)')}
        </div>
        <div class="grid-2 gap-5" style="margin-top:var(--space-5);">
            ${this.indexCard('FSE Upset', 'Volatility & surprise metric', upsetData, 'var(--accent-warn)')}
            ${this.indexCard('FSE Momentum', 'Performance trend aggregate', momentumData, 'var(--accent-down)')}
        </div>`;
    },
    
    indexCard(name, desc, data, color) {
        const sparkline = this.generateSparkline(data.history);
        const isUp = data.change >= 0;
        return `<div class="card">
            <div class="card-header">
                <div>
                    <span class="card-title">${name}</span>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${desc}</div>
                </div>
                <span class="card-badge ${isUp ? 'badge-up' : 'badge-down'}">${isUp ? '▲' : '▼'} ${Math.abs(data.changePct).toFixed(2)}%</span>
            </div>
            <div style="display:flex;align-items:baseline;gap:var(--space-3);margin:var(--space-4) 0;">
                <span style="font-family:var(--font-mono);font-size:42px;font-weight:700;">${data.value.toLocaleString()}</span>
                <span style="font-family:var(--font-mono);font-size:16px;color:${isUp ? 'var(--accent-up)' : 'var(--accent-down)'};">${isUp ? '+' : ''}${data.change.toFixed(2)}</span>
            </div>
            <div style="height:80px;margin:var(--space-3) 0;">${sparkline}</div>
            <div class="grid-3 gap-4" style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--border-subtle);">
                <div style="text-align:center;">
                    <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">High</div>
                    <div class="text-mono" style="font-weight:700;margin-top:var(--space-1);">${data.high.toLocaleString()}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Low</div>
                    <div class="text-mono" style="font-weight:700;margin-top:var(--space-1);">${data.low.toLocaleString()}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Avg</div>
                    <div class="text-mono" style="font-weight:700;margin-top:var(--space-1);">${data.avg.toLocaleString()}</div>
                </div>
            </div>
        </div>`;
    },
    
    calculateGlobal50(stocks) {
        const prices = Object.values(stocks).map(s => s.price);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        const value = avg * 20;
        const history = Array(20).fill(0).map((_, i) => value + (Math.random() - 0.5) * 200);
        history[history.length - 1] = value;
        return { value, change: value - 2847.32, changePct: ((value - 2847.32) / 2847.32) * 100, high: Math.max(...history), low: Math.min(...history), avg: history.reduce((a,b) => a+b,0)/history.length, history };
    },
    
    calculatePowerIndex(stocks) {
        const top10 = Object.values(stocks).sort((a, b) => b.price - a.price).slice(0, 10);
        const avg = top10.reduce((sum, t) => sum + t.price, 0) / 10;
        const value = avg * 10;
        const history = Array(20).fill(0).map((_, i) => value + (Math.random() - 0.5) * 150);
        history[history.length - 1] = value;
        return { value, change: value - 1421.88, changePct: ((value - 1421.88) / 1421.88) * 100, high: Math.max(...history), low: Math.min(...history), avg: history.reduce((a,b) => a+b,0)/history.length, history };
    },
    
    calculateUpsetIndex(stocks) {
        const vols = Object.values(stocks).map(s => {
            const recent = s.sparkline.slice(-5);
            const mean = recent.reduce((a,b) => a+b,0)/recent.length;
            return Math.sqrt(recent.reduce((sum,v) => sum + Math.pow(v-mean,2),0)/recent.length);
        });
        const value = vols.reduce((a,b) => a+b,0) / vols.length * 10;
        const history = Array(20).fill(0).map((_, i) => 50 + Math.random() * 80);
        history[history.length - 1] = value;
        return { value, change: value - 89.45, changePct: ((value - 89.45) / 89.45) * 100, high: Math.max(...history), low: Math.min(...history), avg: history.reduce((a,b) => a+b,0)/history.length, history };
    },
    
    calculateMomentumIndex(stocks) {
        const mom = Object.values(stocks).reduce((sum, s) => sum + s.momentum, 0) / Object.keys(stocks).length;
        const history = Array(20).fill(0).map((_, i) => 40 + Math.random() * 40);
        history[history.length - 1] = mom;
        return { value: mom, change: mom - 67.21, changePct: ((mom - 67.21) / 67.21) * 100, high: Math.max(...history), low: Math.min(...history), avg: history.reduce((a,b) => a+b,0)/history.length, history };
    },
    
    generateSparkline(data) {
        const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
        const stepX = 300 / (data.length - 1);
        const points = data.map((v, i) => `${i * stepX},${60 - ((v - min) / range) * 60}`).join(' ');
        const isUp = data[data.length - 1] >= data[0];
        const color = isUp ? 'var(--accent-up)' : 'var(--accent-down)';
        return `<svg width="100%" height="80" viewBox="0 0 300 60" preserveAspectRatio="none"><polyline fill="none" stroke="${color}" stroke-width="2" points="${points}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="300" cy="${60 - ((data[data.length-1] - min) / range) * 60}" r="3" fill="${color}"/></svg>`;
    }
};

export { IndicesView };