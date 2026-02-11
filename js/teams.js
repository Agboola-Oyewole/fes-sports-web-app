// Teams page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadTeams();
});

function loadTeams() {
    const league = storage.getActiveLeague();
    const teams = storage.getTeams(league.id);
    const grid = document.getElementById('teamsGrid');
    
    if (teams.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg viewBox="0 0 64 64" fill="currentColor">
                    <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11.1 0 20 8.9 20 20s-8.9 20-20 20-20-8.9-20-20 8.9-20 20-20z"/>
                </svg>
                <h3>No Teams Yet</h3>
                <p>Teams will appear here once added</p>
            </div>
        `;
        return;
    }
    
    // Sort teams by points
    const sortedTeams = teams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
    });
    
    grid.innerHTML = sortedTeams.map(team => `
        <div class="team-card" onclick="viewTeam('${team.id}')">
            <div class="team-header">
                <div class="team-points">${team.points} PTS</div>
                <div class="team-badge-large">${team.code}</div>
                <h3 class="team-name">${team.name}</h3>
                <p class="team-code">${team.code}</p>
            </div>
            
            <div class="team-stats">
                <div class="team-form">
                    ${team.form.length > 0 ? team.form.slice(0, 5).map(result => `
                        <div class="form-indicator ${result}">${result}</div>
                    `).join('') : '<span class="text-secondary">No matches yet</span>'}
                </div>
                
                <div class="team-record">
                    <div class="record-item">
                        <div class="record-label">W</div>
                        <div class="record-value wins">${team.won}</div>
                    </div>
                    <div class="record-item">
                        <div class="record-label">D</div>
                        <div class="record-value draws">${team.drawn}</div>
                    </div>
                    <div class="record-item">
                        <div class="record-label">L</div>
                        <div class="record-value losses">${team.lost}</div>
                    </div>
                </div>
                
                <div class="team-goals">
                    <div class="goals-item">
                        <div class="goals-label">GF/GA</div>
                        <div class="goals-value">
                            <span class="goals-for">${team.goalsFor}</span>
                            <span class="text-secondary">/</span>
                            <span class="goals-against">${team.goalsAgainst}</span>
                        </div>
                    </div>
                    <div class="goals-item">
                        <div class="goals-label">GD</div>
                        <div class="goals-value goal-diff">
                            ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="team-action">
                <button class="view-team-btn">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    View Team
                </button>
            </div>
        </div>
    `).join('');
}

function viewTeam(teamId) {
    const team = storage.getTeam(teamId);
    const players = storage.getPlayers(teamId);
    const matches = storage.getMatches().filter(m => 
        m.homeTeam === teamId || m.awayTeam === teamId
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const modalBody = document.getElementById('teamModalBody');
    
    modalBody.innerHTML = `
        <div class="team-detail-header">
            <div class="team-detail-badge">${team.code}</div>
            <div class="team-detail-info">
                <h3>${team.name}</h3>
                <div class="team-detail-meta">
                    <span>${team.code}</span>
                    <span>•</span>
                    <span>${team.played} games played</span>
                </div>
            </div>
        </div>
        
        <div class="team-detail-stats">
            <div class="team-detail-stat">
                <div class="team-detail-stat-label">Points</div>
                <div class="team-detail-stat-value">${team.points}</div>
            </div>
            <div class="team-detail-stat">
                <div class="team-detail-stat-label">Wins</div>
                <div class="team-detail-stat-value">${team.won}</div>
            </div>
            <div class="team-detail-stat">
                <div class="team-detail-stat-label">Goals</div>
                <div class="team-detail-stat-value">${team.goalsFor}</div>
            </div>
            <div class="team-detail-stat">
                <div class="team-detail-stat-label">Goal Diff</div>
                <div class="team-detail-stat-value">${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}</div>
            </div>
        </div>
        
        <div class="team-squad">
            <h4>Squad (${players.length})</h4>
            <div class="squad-grid">
                ${players.length > 0 ? players.map(player => `
                    <div class="squad-player">
                        <div class="squad-player-info">
                            <div class="squad-player-number">#${player.number}</div>
                            <div class="squad-player-details">
                                <span class="squad-player-name">${player.name}</span>
                                <span class="position-badge ${player.position.toLowerCase()}">${player.position}</span>
                            </div>
                        </div>
                        <div class="squad-player-stats">
                            <div class="squad-player-stat">
                                <span>${player.goals}</span>
                                <span class="text-tertiary">G</span>
                            </div>
                            <div class="squad-player-stat">
                                <span>${player.assists}</span>
                                <span class="text-tertiary">A</span>
                            </div>
                        </div>
                    </div>
                `).join('') : '<p class="text-secondary">No players in squad</p>'}
            </div>
        </div>
        
        <div class="team-recent-matches">
            <h4>Recent Matches</h4>
            <div class="recent-match-list">
                ${matches.length > 0 ? matches.slice(0, 5).map(match => {
                    const isHome = match.homeTeam === teamId;
                    const opponent = storage.getTeam(isHome ? match.awayTeam : match.homeTeam);
                    const teamScore = isHome ? match.homeScore : match.awayScore;
                    const oppScore = isHome ? match.awayScore : match.homeScore;
                    const result = match.status === 'completed' 
                        ? (teamScore > oppScore ? 'W' : teamScore < oppScore ? 'L' : 'D')
                        : 'scheduled';
                    
                    return `
                        <div class="recent-match-item">
                            <div class="match-result">
                                ${match.status === 'completed' ? `
                                    <div class="form-indicator ${result}">${result}</div>
                                ` : `
                                    <span class="match-status scheduled">SCH</span>
                                `}
                                <span>${isHome ? 'vs' : '@'} ${opponent.name}</span>
                            </div>
                            ${match.status === 'completed' ? `
                                <span class="match-score">${teamScore} - ${oppScore}</span>
                            ` : `
                                <span class="text-secondary">${formatDate(match.date)}</span>
                            `}
                        </div>
                    `;
                }).join('') : '<p class="text-secondary">No matches yet</p>'}
            </div>
        </div>
    `;
    
    document.getElementById('teamModalTitle').textContent = team.name;
    document.getElementById('teamModal').classList.add('active');
}

function closeTeamModal() {
    document.getElementById('teamModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('teamModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTeamModal();
    }
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
