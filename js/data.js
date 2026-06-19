const TEAM_REGISTRY = {
    GER: { name: 'Germany', flag: '🇩🇪', conf: 'UEFA', elo: 1980, group: 'A', basePrice: 120 },
    ARG: { name: 'Argentina', flag: '🇦🇷', conf: 'CONMEBOL', elo: 2140, group: 'A', basePrice: 135 },
    FRA: { name: 'France', flag: '🇫🇷', conf: 'UEFA', elo: 2020, group: 'B', basePrice: 128 },
    ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf: 'UEFA', elo: 2000, group: 'B', basePrice: 125 },
    ESP: { name: 'Spain', flag: '🇪🇸', conf: 'UEFA', elo: 2050, group: 'C', basePrice: 130 },
    BRA: { name: 'Brazil', flag: '🇧🇷', conf: 'CONMEBOL', elo: 2100, group: 'C', basePrice: 132 },
    POR: { name: 'Portugal', flag: '🇵🇹', conf: 'UEFA', elo: 1960, group: 'D', basePrice: 118 },
    BEL: { name: 'Belgium', flag: '🇧🇪', conf: 'UEFA', elo: 1920, group: 'D', basePrice: 115 },
    NED: { name: 'Netherlands', flag: '🇳🇱', conf: 'UEFA', elo: 1940, group: 'E', basePrice: 117 },
    ITA: { name: 'Italy', flag: '🇮🇹', conf: 'UEFA', elo: 1900, group: 'E', basePrice: 112 },
    USA: { name: 'United States', flag: '🇺🇸', conf: 'CONCACAF', elo: 1820, group: 'F', basePrice: 85 },
    MEX: { name: 'Mexico', flag: '🇲🇽', conf: 'CONCACAF', elo: 1800, group: 'F', basePrice: 82 },
    MOR: { name: 'Morocco', flag: '🇲🇦', conf: 'CAF', elo: 1840, group: 'G', basePrice: 78 },
    SEN: { name: 'Senegal', flag: '🇸🇳', conf: 'CAF', elo: 1780, group: 'G', basePrice: 75 },
    GHA: { name: 'Ghana', flag: '🇬🇭', conf: 'CAF', elo: 1680, group: 'H', basePrice: 65 },
    CIV: { name: 'Ivory Coast', flag: '🇨🇮', conf: 'CAF', elo: 1720, group: 'H', basePrice: 70 },
    RSA: { name: 'South Africa', flag: '🇿🇦', conf: 'CAF', elo: 1580, group: 'I', basePrice: 55 },
    NGA: { name: 'Nigeria', flag: '🇳🇬', conf: 'CAF', elo: 1650, group: 'I', basePrice: 62 },
    EGY: { name: 'Egypt', flag: '🇪🇬', conf: 'CAF', elo: 1700, group: 'J', basePrice: 68 },
    TUN: { name: 'Tunisia', flag: '🇹🇳', conf: 'CAF', elo: 1640, group: 'J', basePrice: 60 },
    JPN: { name: 'Japan', flag: '🇯🇵', conf: 'AFC', elo: 1860, group: 'K', basePrice: 88 },
    KOR: { name: 'South Korea', flag: '🇰🇷', conf: 'AFC', elo: 1820, group: 'K', basePrice: 85 },
    AUS: { name: 'Australia', flag: '🇦🇺', conf: 'AFC', elo: 1740, group: 'L', basePrice: 72 },
    IRN: { name: 'Iran', flag: '🇮🇷', conf: 'AFC', elo: 1760, group: 'L', basePrice: 74 },
    URU: { name: 'Uruguay', flag: '🇺🇾', conf: 'CONMEBOL', elo: 1920, group: 'M', basePrice: 110 },
    COL: { name: 'Colombia', flag: '🇨🇴', conf: 'CONMEBOL', elo: 1880, group: 'M', basePrice: 105 },
    ECU: { name: 'Ecuador', flag: '🇪🇨', conf: 'CONMEBOL', elo: 1840, group: 'N', basePrice: 95 },
    CHI: { name: 'Chile', flag: '🇨🇱', conf: 'CONMEBOL', elo: 1780, group: 'N', basePrice: 88 },
    CAN: { name: 'Canada', flag: '🇨🇦', conf: 'CONCACAF', elo: 1740, group: 'O', basePrice: 78 },
    CRC: { name: 'Costa Rica', flag: '🇨🇷', conf: 'CONCACAF', elo: 1660, group: 'O', basePrice: 68 },
    CRO: { name: 'Croatia', flag: '🇭🇷', conf: 'UEFA', elo: 1940, group: 'P', basePrice: 115 },
    DEN: { name: 'Denmark', flag: '🇩🇰', conf: 'UEFA', elo: 1880, group: 'P', basePrice: 108 },
    SRB: { name: 'Serbia', flag: '🇷🇸', conf: 'UEFA', elo: 1860, group: 'Q', basePrice: 102 },
    SUI: { name: 'Switzerland', flag: '🇨🇭', conf: 'UEFA', elo: 1840, group: 'Q', basePrice: 98 },
    WAL: { name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', conf: 'UEFA', elo: 1760, group: 'R', basePrice: 85 },
    POL: { name: 'Poland', flag: '🇵🇱', conf: 'UEFA', elo: 1780, group: 'R', basePrice: 87 },
    SWE: { name: 'Sweden', flag: '🇸🇪', conf: 'UEFA', elo: 1720, group: 'S', basePrice: 80 },
    UKR: { name: 'Ukraine', flag: '🇺🇦', conf: 'UEFA', elo: 1740, group: 'S', basePrice: 82 },
    QAT: { name: 'Qatar', flag: '🇶🇦', conf: 'AFC', elo: 1640, group: 'T', basePrice: 55 },
    KSA: { name: 'Saudi Arabia', flag: '🇸🇦', conf: 'AFC', elo: 1660, group: 'T', basePrice: 58 },
    PAR: { name: 'Paraguay', flag: '🇵🇾', conf: 'CONMEBOL', elo: 1700, group: 'U', basePrice: 72 },
    BOL: { name: 'Bolivia', flag: '🇧🇴', conf: 'CONMEBOL', elo: 1560, group: 'U', basePrice: 52 },
    NZL: { name: 'New Zealand', flag: '🇳🇿', conf: 'OFC', elo: 1520, group: 'V', basePrice: 48 },
    FJI: { name: 'Fiji', flag: '🇫🇯', conf: 'OFC', elo: 1380, group: 'V', basePrice: 35 },
    PAN: { name: 'Panama', flag: '🇵🇦', conf: 'CONCACAF', elo: 1600, group: 'W', basePrice: 58 },
    CUW: { name: 'Curacao', flag: '🇨🇼', conf: 'CONCACAF', elo: 1480, group: 'W', basePrice: 42 },
    ALG: { name: 'Algeria', flag: '🇩🇿', conf: 'CAF', elo: 1760, group: 'X', basePrice: 76 },
    CMR: { name: 'Cameroon', flag: '🇨🇲', conf: 'CAF', elo: 1740, group: 'X', basePrice: 74 }
};

function eloWinProb(eloA, eloB) {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

function simulateMatch(teamA, teamB) {
    const probA = eloWinProb(teamA.elo, teamB.elo);
    const probB = 1 - probA;
    const drawProb = 0.25;
    const adjustedDraw = drawProb * (1 - Math.abs(probA - 0.5));
    const adjustedA = probA * (1 - adjustedDraw);
    const adjustedB = probB * (1 - adjustedDraw);
    const rand = Math.random();
    let result, goalsA, goalsB, xGA, xGB;
    const eloDiff = teamA.elo - teamB.elo;
    xGA = Math.max(0.3, 1.2 + eloDiff / 800 + (Math.random() - 0.5) * 0.8);
    xGB = Math.max(0.3, 1.2 - eloDiff / 800 + (Math.random() - 0.5) * 0.8);
    
    if (rand < adjustedA) {
        result = 'W';
        goalsA = Math.max(1, Math.round(xGA + Math.random() * 1.5));
        goalsB = Math.round(Math.random() * xGB * 0.7);
    } else if (rand < adjustedA + adjustedDraw) {
        result = 'D';
        goalsA = Math.round(xGA * 0.6 + Math.random() * 0.5);
        goalsB = goalsA;
    } else {
        result = 'L';
        goalsA = Math.round(Math.random() * xGA * 0.7);
        goalsB = Math.max(1, Math.round(xGB + Math.random() * 1.5));
    }
    
    const aSym = Object.keys(TEAM_REGISTRY).find(k => TEAM_REGISTRY[k] === teamA);
    const bSym = Object.keys(TEAM_REGISTRY).find(k => TEAM_REGISTRY[k] === teamB);
    
    return {
        teamA: aSym,
        teamB: bSym,
        resultA: result,
        resultB: result === 'W' ? 'L' : result === 'L' ? 'W' : 'D',
        goalsA, goalsB, xGA, xGB,
        upset: (result === 'W' && probA < 0.35) || (result === 'L' && probA > 0.65),
        margin: Math.abs(goalsA - goalsB),
        cleanSheet: goalsA === 0 || goalsB === 0
    };
}

function calculatePriceChange(match, team, isTeamA) {
    const { resultA, resultB, goalsA, goalsB, xGA, xGB, upset, margin } = match;
    const result = isTeamA ? resultA : resultB;
    const myGoals = isTeamA ? goalsA : goalsB;
    const theirGoals = isTeamA ? goalsB : goalsA;
    const myXG = isTeamA ? xGA : xGB;
    const opponentElo = isTeamA ? TEAM_REGISTRY[match.teamB].elo : TEAM_REGISTRY[match.teamA].elo;
    const myElo = team.elo;
    const strengthDiff = (opponentElo - myElo) / 200;
    
    let change = 0;
    if (result === 'W') change += 5;
    else if (result === 'D') change += 0;
    else change -= 5;
    
    if (result === 'W') change += strengthDiff * 3;
    else if (result === 'L') change -= strengthDiff * 3;
    
    if (margin >= 3) change += result === 'W' ? 3 : -3;
    else if (margin >= 2) change += result === 'W' ? 1.5 : -1.5;
    
    const xgDiff = myGoals - myXG;
    if (xgDiff > 1) change += 1;
    else if (xgDiff < -1) change -= 1;
    
    if (theirGoals === 0 && result === 'W') change += 1;
    if (upset) change *= 1.5;
    
    return Math.max(-20, Math.min(20, change));
}

export { TEAM_REGISTRY, eloWinProb, simulateMatch, calculatePriceChange };