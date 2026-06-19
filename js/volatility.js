const VolatilityLab = {
    calculateVariance(sparkline) {
        const n = sparkline.length;
        if (n < 2) return 0;
        const mean = sparkline.reduce((a, b) => a + b, 0) / n;
        const squaredDiffs = sparkline.map(v => Math.pow(v - mean, 2));
        return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / n);
    },
    
    marketVolatilityIndex(stocks) {
        const vols = Object.values(stocks).map(t => this.calculateVariance(t.sparkline));
        return vols.reduce((a, b) => a + b, 0) / vols.length;
    },
    
    render(stocks) {
        const teams = Object.values(stocks).sort((a, b) => {
            const aVar = this.calculateVariance(a.sparkline);
            const bVar = this.calculateVariance(b.sparkline);
            return bVar - aVar;
        });
        
        return `<div class="main-header"><h1 class="main-title">⚡ Volatility Lab</h1><p class="main-subtitle">Risk surface analysis for all 48 teams</p></div>
        <div class="grid-2 gap-5" style="margin-bottom:var(--space-5);">
            <div class="card"><div class="card-header"><span class="card-title">Market Volatility Index</span></div>
            <div style="font-family:var(--font-mono);font-size:48px;font-weight:700;color:var(--accent-warn);">${this.marketVolatilityIndex(stocks).toFixed(2)}</div>
            <div style="font-size:14px;color:var(--text-secondary);margin-top:var(--space-2);">Average standard deviation across all teams</div>
            </div>
            <div class="card"><div class="card-header"><span class="card-title">Highest Risk Teams</span></div>
            ${teams.slice(0, 3).map(t => {
                const vol = this.calculateVariance(t.sparkline);
                return `<div style="display:flex;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle);">
                    <span style="font-weight:600;">${t.flag} ${t.symbol}</span>
                    <span class="text-mono" style="color:var(--accent-warn);font-weight:600;">σ = ${vol.toFixed(2)}</span>
                </div>`;
            }).join('')}
            </div>
        </div>
        <div class="card"><div class="card-header"><span class="card-title">Risk Heatmap</span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:var(--space-2);margin-top:var(--space-3);">
            ${Object.values(stocks).map(t => {
                const vol = this.calculateVariance(t.sparkline);
                const intensity = Math.min(1, vol / 15);
                const r = Math.round(255 * intensity);
                const g = Math.round(212 * (1 - intensity));
                const b = Math.round(170 * (1 - intensity));
                return `<div style="padding:var(--space-3);border-radius:var(--radius-sm);text-align:center;background:rgba(${r},${g},${b},0.15);border:1px solid rgba(${r},${g},${b},0.3);">
                    <div style="font-size:20px;margin-bottom:var(--space-1);">${t.flag}</div>
                    <div style="font-weight:600;font-size:13px;">${t.symbol}</div>
                    <div class="text-mono" style="font-size:11px;color:var(--text-secondary);">σ${vol.toFixed(1)}</div>
                </div>`;
            }).join('')}
        </div></div>
        <div class="card" style="margin-top:var(--space-5);"><div class="card-header"><span class="card-title">Volatility Distribution</span></div>
        <div style="margin-top:var(--space-4);">${this.renderDistributionChart(stocks)}</div></div>`;
    },
    
    renderDistributionChart(stocks) {
        const buckets = { Low: 0, Medium: 0, High: 0 };
        Object.values(stocks).forEach(t => {
            const vol = this.calculateVariance(t.sparkline);
            if (vol < 4) buckets.Low++;
            else if (vol < 8) buckets.Medium++;
            else buckets.High++;
        });
        const total = Object.values(buckets).reduce((a, b) => a + b, 0);
        
        return `<div style="display:flex;align-items:flex-end;gap:var(--space-4);height:200px;padding:var(--space-4) 0;">
            ${Object.entries(buckets).map(([label, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                const color = label === 'Low' ? 'var(--accent-up)' : label === 'Medium' ? 'var(--accent-info)' : 'var(--accent-warn)';
                return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:var(--space-2);">
                    <span style="font-family:var(--font-mono);font-weight:700;font-size:18px;">${count}</span>
                    <div style="width:100%;height:${pct}%;background:${color};border-radius:var(--radius-sm);min-height:20px;"></div>
                    <span style="font-size:12px;color:var(--text-secondary);">${label}</span>
                </div>`;
            }).join('')}
        </div>`;
    }
};

export { VolatilityLab };