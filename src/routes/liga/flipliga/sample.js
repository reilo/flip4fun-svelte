export const demoData = {
    'name': "FLIP Liga Demo",
    'status': 'progress',
    'settings': {
        'baseline': 50, // Basispunkte für jeden Spieler zu Saisonbeginn
        'challengeSame': 1, // Wie oft der gleiche Gegner je Saison gefordert werden darf
        'matchBonus': 1, // Bonuspunkte für jedes angetretene Match
        'minMatches': 1, // Wie viele Matches ein Spieler pro Spieltag spielen muss
        'minRound': 5, // Ab welcher Runde erfolgen Matchabzüge
    },
    // Spieler-IDs aus Player-Tabelle
    'players': [
        'reinhard',
        'hoeltsche',
        'adrian',
        'bernd',
        'gunther',
        'juergen',
        'johannes',
        'xenon',
        'dominic',
        'mpautz',
        'yvonne',
        'mwerni',
        'mlindwurm',
        'piddy',
        'marcus',
    ],
    'results': {
        'rounds': [
            {
                'round': 0,
                'status': 'completed', // progress, completed
                // Ranking nach Start-Turnier, rank-Feld redundant
                'finalRank': [
                    { 'player': 'xenon', 'rank': 1, 'pTot': 54 },
                    { 'player': 'johannes', 'rank': 2, 'pTot': 53 },
                    { 'player': 'bernd', 'rank': 3, 'pTot': 53 },
                    { 'player': 'juergen', 'rank': 4, 'pTot': 52 },
                    { 'player': 'reinhard', 'rank': 5, 'pTot': 52 },
                    { 'player': 'dominic', 'rank': 6, 'pTot': 52 },
                    { 'player': 'gunther', 'rank': 7, 'pTot': 51 },
                    { 'player': 'piddy', 'rank': 8, 'pTot': 51 },
                    { 'player': 'adrian', 'rank': 9, 'pTot': 51 },
                    { 'player': 'mpautz', 'rank': 10, 'pTot': 51 },
                    { 'player': 'hoeltsche', 'rank': 11, 'pTot': 50 },
                    { 'player': 'yvonne', 'rank': 12, 'pTot': 50 },
                    { 'player': 'marcus', 'rank': 13, 'pTot': 50 },
                    { 'player': 'mwerni', 'rank': 14, 'pTot': 50 },
                    { 'player': 'mlindwurm', 'rank': 15, 'pTot': 50 },
                ],
            },
            {
                'round': 1,
                'status': 'completed', // progress, completed
                // während Spieltag auffüllen 
                'matches': [
                    { 'player1': 'reinhard', 'player2': 'hoeltsche', 'pin': 'aiq', 'score1': 3, 'score2': 1 },
                    { 'player1': 'mwerni', 'player2': 'mlindwurm', 'pin': 'ss', 'score1': 2, 'score2': 3 },
                ],
                // nach Abschluss Spieltag berechnen, rank-Feld redundant
                'finalRank': [
                    { 'player': 'xenon', 'rank': 1, 'chg': 0, 'pRnd': 0, 'pTot': 54, 'mRnd': 0, 'mTot': 0, 'pen': 0 },
                ]
            }
        ],
    }
};