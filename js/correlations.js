const Correlations = {
    calculateCorrelation(x, y) {
        const n = Math.min(x.length, y.length);
        if (n < 2) return 0;
        const sumX = x.slice(0,n).reduce((a,b) => a+b, 0);
        const sumY = y.slice(0,n).reduce((a,b) => a+b, 0);
        const sumXY = x.slice(0,n).reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.slice(0,n).reduce((sum, xi) => sum + xi*xi, 0);
        const sumY2 = y.slice(0,n).reduce((sum, yi) => sum + yi*yi, 0);
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX*sumX) * (n * sumY2 - sumY*sumY));
        return denominator === 0 ? 0 : numerator / denominator;
    },
    
    render(stocks) {
        const teams = Object.values(stocks).slice(0, 12); // Top 12 for readability
        const matrix = [];
        for (let i = 0; i < teams.length; i++) {
            matrix[i] = [];
            for (let j = 0; j < teams.length; j++) {
                matrix[i][j] = this.calculateCorrelation(teams[i].sparkline, teams[j].sparkline);
            }
        }
        
        const strongPairs = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i+1; j < teams.length; j++) {
                const corr = matrix[i][j];
                if (Math.abs(corr) > 0.5) {
                    strongPairs.push({ a: teams[i], b: teams[j], corr });
                }
            }
        }
        strongPairs.sort((a, b) => Math.abs(b.corr) - Math.abs(a.corr));
        
        return `<div class="main-header"><h1 class="main-title">🔗 Correlations</h1><p class="main-subtitle">How team prices move together — Pearson correlation matrix</p></div>
        
        <div class="grid-2 gap-5" style="margin-bottom:var(--space-5);">
            <div class="card">
                <div class="card-header"><span class="card-title">Strongest Positive</span></div>
                ${strongPairs.filter(p => p.corr > 0).slice(0, 3).map(p => `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border-subtle);">
                        <div style="display:flex;align-items:center;gap:var(--space-2);">
                            <span style="font-size:16px;">${p.a.flag}</span><span>${p.a.symbol}</span>
                            <span style="color:var(--text-muted);">↔</span>
                            <span style="font-size:16px;">${p.b.flag}</span><span>${p.b.symbol}</span>
                        </div>
                        <span class="text-mono" style="color:var(--accent-up);font-weight:700;">+${p.corr.toFixed(2)}</span>
                    </div>
                `).join('') || '<p style="color:var(--text-secondary);padding:var(--space-3);">No strong positive correlations yet.</p>'}
            </div>
            <div class="card">
                <div class="card-header"><span class="card-title">Strongest Negative</span></div>
                ${strongPairs.filter(p => p.corr < 0).slice(0, 3).map(p => `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--border-subtle);">
                        <div style="display:flex;align-items:center;gap:var(--space-2);">
                            <span style="font-size:16px;">${p.a.flag}</span><span>${p.a.symbol}</span>
                            <span style="color:var(--text-muted);">↔</span>
                            <span style="font-size:16px;">${p.b.flag}</span><span>${p.b.symbol}</span>
                        </div>
                        <span class="text-mono" style="color:var(--accent-down);font-weight:700;">${p.corr.toFixed(2)}</span>
                    </div>
                `).join('') || '<p style="color:var(--text-secondary);padding:var(--space-3);">No strong negative correlations yet.</p>'}
            </div>
        </div>
        
        <div class="card">
            <div class="card-header"><span class="card-title">Correlation Matrix</span></div>
            <div style="overflow-x:auto;margin-top:var(--space-4);">
                <table style="border-collapse:collapse;font-size:12px;">
                    <thead>
                        <tr>
                            <th style="padding:8px;border-bottom:1px solid var(--border-subtle);"></th>
                            ${teams.map(t => `<th style="padding:8px;border-bottom:1px solid var(--border-subtle);text-align:center;font-family:var(--font-mono);font-size:10px;">${t.symbol}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${teams.map((t, i) => `
                            <tr>
                                <td style="padding:8px;border-right:1px solid var(--border-subtle);font-weight:600;">
                                    <div style="display:flex;align-items:center;gap:var(--space-2);"><span style="font-size:14px;">${t.flag}</span><span style="font-family:var(--font-mono);font-size:11px;">${t.symbol}</span></div>
                                </td>
                                ${teams.map((_, j) => {
                                    const corr = matrix[i][j];
                                    const intensity = Math.abs(corr);
                                    const r = corr > 0 ? Math.round(0 * intensity) : Math.round(255 * intensity);
                                    const g = Math.round(212 * (1 - intensity) + (corr > 0 ? 170 : 0) * intensity);
                                    const b = corr > 0 ? Math.round(170 * intensity) : Math.round(87 * intensity);
                                    const bg = i === j ? 'var(--bg-elevated)' : `rgba(${r},${g},${b},${0.1 + intensity * 0.3})`;
                                    return `<td style="padding:8px;text-align:center;font-family:var(--font-mono);font-size:11px;background:${bg};color:${intensity > 0.5 ? (corr > 0 ? 'var(--accent-up)' : 'var(--accent-down)') : 'var(--text-secondary)'};font-weight:${intensity > 0.7 ? '700' : '400'};">${i === j ? '1.00' : corr.toFixed(2)}</td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }
};

export { Correlations };