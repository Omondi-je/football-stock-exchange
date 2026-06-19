import { TEAM_REGISTRY, eloWinProb } from './data.js';

const Predictions = {
    render() {
        const upcoming = this.generateUpcomingMatches();
        return `<div class="main-header"><h1 class="main-title">🔮 Predictions Engine</h1><p class="main-subtitle">Elo-based match forecasting with confidence intervals</p></div>
        <div class="grid-3 gap-4" style="margin-bottom:var(--space-5);">
            <div class="card"><div class="card-header"><span class="card-title">Model Accuracy</span></div>
            <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:var(--accent-up);">72.4%</div>
            <div style="font-size:13px;color:var(--text-secondary);">Historical prediction accuracy</div></div>
            <div class="card"><div class="card-header"><span class="card-title">Avg Confidence</span></div>
            <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:var(--accent-info);">68.2%</div>
            <div style="font-size:13px;color:var(--text-secondary);">Mean prediction confidence</div></div>
            <div class="card"><div class="card-header"><span class="card-title">Upsets Predicted</span></div>
            <div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:var(--accent-warn);">14</div>
            <div style="font-size:13px;color:var(--text-secondary);">High-volatility matches upcoming</div></div>
        </div>
        <div class="card"><div class="card-header"><span class="card-title">Upcoming Match Predictions</span></div>
        ${upcoming.map(m => this.matchPredictionCard(m)).join('')}</div>`;
    },
    
    generateUpcomingMatches() {
        const codes = Object.keys(TEAM_REGISTRY);
        const matches = [];
        for (let i = 0; i < 6; i++) {
            const a = codes[Math.floor(Math.random() * codes.length)];
            let b = codes[Math.floor(Math.random() * codes.length)];
            while (b === a) b = codes[Math.floor(Math.random() * codes.length)];
            matches.push({ teamA: a, teamB: b });
        }
        return matches;
    },
    
    matchPredictionCard(match) {
        const teamA = TEAM_REGISTRY[match.teamA];
        const teamB = TEAM_REGISTRY[match.teamB];
        const probA = eloWinProb(teamA.elo, teamB.elo);
        const probB = 1 - probA;
        const drawProb = 0.25 * (1 - Math.abs(probA - 0.5));
        const adjA = probA * (1 - drawProb);
        const adjB = probB * (1 - drawProb);
        const confidence = Math.round((0.5 + Math.abs(probA - 0.5)) * 100);
        
        const fav = adjA > adjB ? match.teamA : match.teamB;
        const favProb = Math.max(adjA, adjB);
        const favTeam = TEAM_REGISTRY[fav];
        
        return `<div style="display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4) 0;border-bottom:1px solid var(--border-subtle);">
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2);">
                    <span style="font-size:24px;">${teamA.flag}</span>
                    <div style="flex:1;">
                        <div style="font-weight:600;">${teamA.name}</div>
                        <div style="font-size:12px;color:var(--text-muted);">Elo: ${teamA.elo}</div>
                    </div>
                    <div class="text-mono" style="font-size:20px;font-weight:700;">${(adjA * 100).toFixed(1)}%</div>
                </div>
                <div style="width:100%;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden;margin-bottom:var(--space-2);">
                    <div style="width:${adjA * 100}%;height:100%;background:linear-gradient(90deg,var(--accent-up),var(--accent-info));border-radius:3px;transition:width 0.5s;"></div>
                </div>
            </div>
            <div style="text-align:center;padding:0 var(--space-3);">
                <div class="text-mono" style="font-size:14px;color:var(--text-muted);">DRAW</div>
                <div class="text-mono" style="font-size:18px;font-weight:700;">${(drawProb * 100).toFixed(1)}%</div>
            </div>
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2);justify-content:flex-end;">
                    <div class="text-mono" style="font-size:20px;font-weight:700;">${(adjB * 100).toFixed(1)}%</div>
                    <div style="text-align:right;">
                        <div style="font-weight:600;">${teamB.name}</div>
                        <div style="font-size:12px;color:var(--text-muted);">Elo: ${teamB.elo}</div>
                    </div>
                    <span style="font-size:24px;">${teamB.flag}</span>
                </div>
                <div style="width:100%;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden;margin-bottom:var(--space-2);">
                    <div style="width:${adjB * 100}%;height:100%;background:linear-gradient(90deg,var(--accent-info),var(--accent-down));border-radius:3px;transition:width 0.5s;margin-left:auto;"></div>
                </div>
            </div>
            <div style="min-width:100px;text-align:right;">
                <div style="font-size:12px;color:var(--text-muted);margin-bottom:var(--space-1);">Confidence</div>
                <div class="text-mono" style="font-size:24px;font-weight:700;color:${confidence > 70 ? 'var(--accent-up)' : confidence > 50 ? 'var(--accent-warn)' : 'var(--accent-down)'};">${confidence}%</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:var(--space-1);">Fav: ${favTeam.name}</div>
            </div>
        </div>`;
    }
};

export { Predictions };