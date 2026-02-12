// Landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadLeagues();
});

function loadLeagues() {
    const leagues = storage.getLeagues();
    const grid = document.getElementById('leaguesGrid');
    const emptyState = document.getElementById('emptyLeagues');
    
    if (leagues.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = leagues.map(league => {
        // Get league stats
        const teams = storage.getTeams(league.id);
        const players = storage.getPlayers();
        const leaguePlayers = players.filter(p => {
            const team = teams.find(t => t.id === p.teamId);
            return team !== undefined;
        });
        const matches = storage.getMatches(league.id);
        const completedMatches = matches.filter(m => m.status === 'completed');
        
        return `
            <a href="dashboard.html?league=${league.id}" class="league-card">
                <div class="league-card-header">
                    <div class="league-icon">${league.sport.charAt(0)}</div>
                    <span class="league-status ${league.status}">${league.status}</span>
                </div>
                
                <div class="league-info">
                    <h3 class="league-name">${league.name}</h3>
                    <div class="league-meta">
                        <span class="league-meta-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <circle cx="8" cy="8" r="7"/>
                            </svg>
                            ${league.sport}
                        </span>
                        <span class="league-meta-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5 3h6v1H5V3zm0 3h6v1H5V6zm0 3h6v1H5V9z"/>
                            </svg>
                            ${league.season}
                        </span>
                    </div>
                </div>
                
                <div class="league-stats">
                    <div class="league-stat">
                        <div class="league-stat-value">${teams.length}</div>
                        <div class="league-stat-label">Teams</div>
                    </div>
                    <div class="league-stat">
                        <div class="league-stat-value">${leaguePlayers.length}</div>
                        <div class="league-stat-label">Players</div>
                    </div>
                    <div class="league-stat">
                        <div class="league-stat-value">${completedMatches.length}</div>
                        <div class="league-stat-label">Matches</div>
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

function showCreateLeagueModal() {
    document.getElementById('createLeagueModal').classList.add('active');
}

function closeCreateLeagueModal() {
    document.getElementById('createLeagueModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('createLeagueModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeCreateLeagueModal();
    }
});
