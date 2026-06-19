 Football Stock Exchange

> **A live financial market for World Cup 2026 nations.**
>
> Treat countries like stocks. Every match changes their value.

---

What is this?

The Football Stock Exchange is a **sports analytics + financial modeling** project that reimagines the FIFA World Cup as a tradable market. Each of the 48 participating nations is a "stock" with a live price that fluctuates based on match results, Elo ratings, momentum, and volatility.

Built during the 2026 World Cup, this project demonstrates:
- **Real-time data simulation** with live match engine
- **Price discovery algorithms** using Elo-based probabilistic modeling
- **Risk analytics** with volatility surfaces and correlation matrices
- **Predictive modeling** with confidence intervals
- **Portfolio management** with buy/sell, P&L tracking, and audit trails

---

 Live Demo

Open in your browser: `https://your-codespace-url.github.dev`

Or run locally:
```bash
git clone https://github.com/yourusername/football-stock-exchange.git
cd football-stock-exchange
npx serve . -l 8080
```

---

📊 Core Features

 1. Live Match Engine
- Simulates real-time World Cup matches with realistic scorelines
- Goals are probabilistically generated based on Elo difference and xG (expected goals)
- Upset detection flags major surprises
- Match timer counts from 0' to 90' with in-match events

 2. Price Discovery Algorithm
Every match result triggers a price recalculation:

| Factor | Impact |
|--------|--------|
| Win vs stronger opponent | +8% to +15% |
| Win vs weaker opponent | +2% to +5% |
| Draw vs stronger opponent | +1% to +3% |
| Loss vs weaker opponent | -8% to -15% |
| Upset multiplier | ±20% with volatility spike |
| Clean sheet bonus | +1% extra |
| xG efficiency | ±1% for over/underperformance |

**Formula:** `Price Change = f(Match Result, Opponent Strength, Margin, xG Efficiency, Upset)`

 3. Portfolio System
- **$100,000 starting capital**
- Buy/sell any team at live market price
- Real-time P&L tracking (unrealized + realized)
- Full transaction audit trail with timestamps
- `localStorage` persistence across sessions

4. Market Indices
| Index | Description |
|-------|-------------|
| **FSE Global 50** | Broad market benchmark across all 48 teams |
| **FSE Power** | Top 10 teams by market capitalization |
| **FSE Upset** | Volatility and surprise metric |
| **FSE Momentum** | Aggregate performance trend |

5. Volatility Lab ⚡
- Risk heatmap for all 48 teams
- Market Volatility Index (average σ across all teams)
- Volatility distribution histogram (Low/Medium/High)
- Highest risk team identification

6. Predictions Engine 🔮
- Pre-match win probability using Elo ratings
- Confidence intervals per prediction
- Draw probability adjustment
- Favorite identification with certainty score
 7. Team Detail View
Click any team in the market board for deep analytics:
- Price history bar chart
- Match-by-match performance log
- Momentum trajectory
- Current portfolio position (if any)
- Direct buy/sell buttons

 8. Correlations Matrix 🔗
- Pearson correlation between team price movements
- Color-coded heatmap (green = positive, red = negative)
- Strongest positive/negative pair identification

 9. Watchlist ⭐
- Star favorite teams for quick access
- Grid selector with live prices
- One-click add/remove

---

 Architecture

```
football-stock-exchange/
├── index.html              # App shell
├── styles/
│   └── main.css            # Design system (CSS variables, grid, components)
├── js/
│   ├── app.js              # Core app shell, routing, views
│   ├── data.js             # 48-team registry, Elo ratings, match simulation
│   ├── portfolio.js        # Portfolio class with buy/sell/trade logging
│   ├── team-detail.js      # Deep analytics dashboard per team
│   ├── volatility.js       # Risk surface analysis
│   ├── predictions.js      # Elo-based forecasting engine
│   ├── trade-history.js    # Transaction audit log
│   ├── indices-view.js     # Market indices dashboard
│   ├── watchlist.js        # Favorite teams system
│   └── correlations.js     # Pearson correlation matrix
```

**Tech Stack:** Vanilla JavaScript (ES modules), CSS Grid/Flexbox, SVG sparklines. No frameworks, no build step.

---

 The Price Discovery Algorithm

```javascript
// Elo-based win probability
function eloWinProb(eloA, eloB) {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

// Price impact calculation
function calculatePriceChange(match, team, isTeamA) {
    let change = baseResultImpact(result);        // ±5% for W/L/D
    change += opponentStrengthAdjustment();        // ±3% based on Elo diff
    change += marginBonus();                       // ±3% for 3+ goal margin
    change += xgEfficiency();                      // ±1% for over/underperformance
    change += cleanSheetBonus();                   // +1% if shutout
    if (upset) change *= 1.5;                     // 1.5x multiplier
    return Math.max(-20, Math.min(20, change));   // Cap at ±20%
}
```

---

Sample Data

| Team | Symbol | Base Price | Elo | Confederation |
|------|--------|-----------|-----|---------------|
| Argentina | ARG | 135.00 | 2140 | CONMEBOL |
| Brazil | BRA | 132.00 | 2100 | CONMEBOL |
| Spain | ESP | 130.00 | 2050 | UEFA |
| France | FRA | 128.00 | 2020 | UEFA |
| England | ENG | 125.00 | 2000 | UEFA |
| Germany | GER | 120.00 | 1980 | UEFA |
| Morocco | MOR | 78.00 | 1840 | CAF |
| Ghana | GHA | 65.00 | 1680 | CAF |

---

Why This Project?

Most sports analytics projects predict match outcomes. This one asks a harder question: **"What is a team worth?"**

By treating teams as financial assets, we combine:
- **Sports analytics** (Elo ratings, xG, match simulation)
- **Financial modeling** (price discovery, volatility, correlation)
- **Software engineering** (real-time systems, state management, data visualization)

The result is a memorable, interactive demonstration of cross-domain thinking.

---

 License

MIT — Built for the 2026 FIFA World Cup.

---

> *"The pitch is the market. Every match is a trade."*
```

---

## **Download**

[README.md](sandbox:///mnt/agents/output/README.md)

---

## **Final Step: Add to Repo**

```bash
cp /mnt/agents/output/README.md README.md
git add README.md
git commit -m "Add README with project overview, features, architecture, and algorithm docs"
git push origin main
```
