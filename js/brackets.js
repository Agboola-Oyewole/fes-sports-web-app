// Brackets page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadBrackets();
});

function loadBrackets() {
    const brackets = storage.getBrackets();
    const league = storage.getActiveLeague();
    const standings = storage.getStandings(league.id);
    
    // Update info cards
    document.getElementById('bracketTeams').textContent = brackets.teams || 3;
    document.getElementById('bracketRounds').textContent = brackets.rounds || 3;
    
    // Load seeding
    loadSeeding(standings);
    
    // Load bracket visualization
    loadBracketVisualization(brackets);
    
    // Load matchups
    loadMatchups(brackets, standings);
}

function loadSeeding(standings) {
    const grid = document.getElementById('seedingGrid');
    
    const topSeeds = standings.slice(0, 8).map((team, index) => ({
        seed: index + 1,
        team: team,
        points: team.points
    }));
    
    grid.innerHTML = topSeeds.map(seed => `
        <div class="seed-card">
            <div class="seed-number ${seed.seed <= 4 ? 'top' : ''}">${seed.seed}</div>
            <div class="seed-info">
                <div class="seed-team">${seed.team.name}</div>
                <div class="seed-points">${seed.points} pts</div>
            </div>
        </div>
    `).join('');
}

function loadBracketVisualization(brackets) {
    const container = document.getElementById('bracketVisualization');
    
    // Create bracket structure
    const quarterFinals = brackets.quarterFinals || [
        { match: 1, team1: 'ELT', team2: 'TBD', winner: null, score1: null, score2: null },
        { match: 2, team1: 'CRD', team2: 'TBD', winner: null, score1: null, score2: null },
        { match: 3, team1: 'TBD', team2: 'TBD', winner: null, score1: null, score2: null },
        { match: 4, team1: 'TBD', team2: 'TBD', winner: null, score1: null, score2: null }
    ];
    
    const semiFinals = [
        { match: 1, team1: 'TBD', team2: 'TBD', winner: null },
        { match: 2, team1: 'TBD', team2: 'TBD', winner: null }
    ];
    
    const final = { team1: 'TBD', team2: 'TBD', winner: null };
    
    container.innerHTML = `
        <div class="bracket-rounds">
            <!-- Quarter Finals -->
            <div class="bracket-round">
                <div class="bracket-round-header">Quarter Finals</div>
                ${quarterFinals.map(match => renderBracketMatch(match)).join('')}
            </div>
            
            <!-- Semi Finals -->
            <div class="bracket-round">
                <div class="bracket-round-header">Semi Finals</div>
                ${semiFinals.map(match => renderBracketMatch(match)).join('')}
            </div>
            
            <!-- Final -->
            <div class="bracket-round">
                <div class="bracket-round-header">Final</div>
                ${renderBracketMatch(final)}
            </div>
        </div>
    `;
}

function renderBracketMatch(match) {
    const team1 = match.team1 === 'TBD' ? null : storage.getTeam(match.team1);
    const team2 = match.team2 === 'TBD' ? null : storage.getTeam(match.team2);
    
    const team1Name = team1 ? team1.name : 'TBD';
    const team2Name = team2 ? team2.name : 'TBD';
    
    const team1Winner = match.winner === match.team1;
    const team2Winner = match.winner === match.team2;
    
    return `
        <div class="bracket-matchup">
            <div class="bracket-team ${team1Winner ? 'winner' : ''} ${!team1 ? 'tbd' : ''}">
                <span class="bracket-team-name">${team1Name}</span>
                ${match.score1 !== null && match.score1 !== undefined ? `
                    <span class="bracket-team-score">${match.score1}</span>
                ` : `
                    <span class="bracket-team-score">-</span>
                `}
            </div>
            <div class="bracket-team ${team2Winner ? 'winner' : ''} ${!team2 ? 'tbd' : ''}">
                <span class="bracket-team-name">${team2Name}</span>
                ${match.score2 !== null && match.score2 !== undefined ? `
                    <span class="bracket-team-score">${match.score2}</span>
                ` : `
                    <span class="bracket-team-score">-</span>
                `}
            </div>
        </div>
    `;
}

function loadMatchups(brackets, standings) {
    const grid = document.getElementById('matchupsGrid');
    
    // Standard bracket matchups (1v8, 4v5, 3v6, 2v7)
    const matchups = [
        { seed1: 1, seed2: 8 },
        { seed1: 4, seed2: 5 },
        { seed1: 3, seed6: 6 },
        { seed1: 2, seed2: 7 }
    ];
    
    grid.innerHTML = matchups.map((matchup, index) => {
        const team1 = standings[matchup.seed1 - 1];
        const team2 = standings[matchup.seed2 - 1];
        
        return `
            <div class="matchup-card">
                <div class="matchup-header">
                    <div class="matchup-number">${index + 1}</div>
                    <div class="matchup-title">${getMatchupName(team1, team2)}</div>
                </div>
                <div class="matchup-teams">
                    <div class="matchup-team">
                        <div class="matchup-team-info">
                            <div class="matchup-seed">${matchup.seed1}</div>
                            <div class="matchup-team-name">${team1 ? team1.name : 'TBD'}</div>
                        </div>
                    </div>
                    <div class="matchup-vs">vs</div>
                    <div class="matchup-team">
                        <div class="matchup-team-info">
                            <div class="matchup-seed">${matchup.seed2}</div>
                            <div class="matchup-team-name">${team2 ? team2.name : 'TBD'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getMatchupName(team1, team2) {
    if (team1 && team2) {
        return `${team1.name} vs ${team2.name}`;
    } else if (team1) {
        return `${team1.name} vs TBD`;
    } else if (team2) {
        return `TBD vs ${team2.name}`;
    }
    return 'TBD vs TBD';
}
