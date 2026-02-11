// Dashboard functionality
document.addEventListener('DOMContentLoaded', function () {
    loadDashboard();
});

function loadDashboard() {
    const league = storage.getActiveLeague();

    // Load stats
    loadStats(league.id);

    // Load recent results
    loadRecentResults(league.id);

    // Load standings
    loadTopStandings(league.id);

    // Load upcoming matches
    loadUpcomingMatches(league.id);

    // Load top scorers
    loadTopScorers();
}

function loadStats(leagueId) {
    const teams = storage.getTeams(leagueId);
    const players = storage.getPlayers();
    const matches = storage.getMatches(leagueId);
    const completedMatches = matches.filter(m => m.status === 'completed');

    // Get top fantasy points
    const topFantasyPoints = players.length > 0
        ? Math.max(...players.map(p => p.fantasyPoints))
        : 0;

    // Update stat cards
    document.getElementById('totalTeams').textContent = teams.length;
    document.getElementById('totalPlayers').textContent = players.length;
    document.getElementById('matchesPlayed').textContent = completedMatches.length;
    document.getElementById('topFantasyPoints').textContent = topFantasyPoints;
}

function loadRecentResults(leagueId) {
    const matches = storage.getMatches(leagueId);
    const completedMatches = matches
        .filter(m => m.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const container = document.getElementById('recentResults');

    if (completedMatches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 64 64" fill="currentColor">
                    <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11.1 0 20 8.9 20 20s-8.9 20-20 20-20-8.9-20-20 8.9-20 20-20z"/>
                </svg>
                <h3>No Results Yet</h3>
                <p>Recent match results will appear here</p>
            </div>
        `;
        return;
    }

    container.innerHTML = completedMatches.map(match => {
        const homeTeam = storage.getTeam(match.homeTeam);
        const awayTeam = storage.getTeam(match.awayTeam);
        const homeWon = match.homeScore > match.awayScore;
        const awayWon = match.awayScore > match.homeScore;

        return `
            <div class="result-item">
                <div class="result-teams">
                    <span class="result-team ${homeWon ? 'winner' : ''}">${homeTeam.name}</span>
                    <span class="result-score">
                        <span class="${homeWon ? 'winner-score' : ''}">${match.homeScore}</span>
                        -
                        <span class="${awayWon ? 'winner-score' : ''}">${match.awayScore}</span>
                    </span>
                    <span class="result-team ${awayWon ? 'winner' : ''}">${awayTeam.name}</span>
                </div>
                <span class="result-date">${formatDate(match.date)}</span>
            </div>
        `;
    }).join('');
}

function loadTopStandings(leagueId) {
    const standings = storage.getStandings(leagueId).slice(0, 3);
    const tbody = document.getElementById('topStandings');

    tbody.innerHTML = standings.map((team, index) => `
        <tr>
            <td>${index + 1}</td>
            <td class="team-name">${team.name}</td>
            <td class="${team.goalDifference > 0 ? 'positive' : team.goalDifference < 0 ? 'negative' : ''}">
                ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}
            </td>
            <td class="font-bold">${team.points}</td>
        </tr>
    `).join('');
}

function loadUpcomingMatches(leagueId) {
    const matches = storage.getMatches(leagueId);
    const upcomingMatches = matches
        .filter(m => m.status === 'scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    const container = document.getElementById('upcomingMatches');

    if (upcomingMatches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 64 64" fill="currentColor">
                    <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11.1 0 20 8.9 20 20s-8.9 20-20 20-20-8.9-20-20 8.9-20 20-20z"/>
                </svg>
                <h3>No Upcoming Matches</h3>
                <p>Scheduled matches will appear here</p>
            </div>
        `;
        return;
    }

    container.innerHTML = upcomingMatches.map(match => {
        const homeTeam = storage.getTeam(match.homeTeam);
        const awayTeam = storage.getTeam(match.awayTeam);

        return `
            <div class="match-item">
                <span class="match-status scheduled">SCHEDULED</span>
                <div class="match-teams">
                    <span class="match-team">${homeTeam.name}</span>
                    <span class="match-vs">VS</span>
                    <span class="match-team">${awayTeam.name}</span>
                </div>
                <div class="match-details">
                    <span class="match-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor"
                            class="bi bi-calendar-date" viewBox="0 0 16 16">
                            <path
                                d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
                            <path
                                d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                        </svg>
                        ${formatDate(match.date)}
                    </span>
                    <span class="match-detail match-time">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="8" r="7"/>
                            <path d="M8 4v4l3 2" stroke="white" stroke-width="1.5" fill="none"/>
                        </svg>
                        ${match.time}
                    </span>
                    <span class="match-detail">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 2L3 6v7h10V6L8 2zm0 2l3 3v5H5V7l3-3z"/>
                        </svg>
                        ${match.venue}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function loadTopScorers() {
    const players = storage.getPlayers();
    const topScorers = players
        .filter(p => p.goals > 0 || p.assists > 0)
        .sort((a, b) => {
            if (b.goals !== a.goals) return b.goals - a.goals;
            return b.assists - a.assists;
        })
        .slice(0, 5);

    const container = document.getElementById('topScorers');

    if (topScorers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 64 64" fill="currentColor">
                    <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11.1 0 20 8.9 20 20s-8.9 20-20 20-20-8.9-20-20 8.9-20 20-20z"/>
                </svg>
                <h3>No Goals Yet</h3>
                <p>Top scorers will appear here</p>
            </div>
        `;
        return;
    }

    container.innerHTML = topScorers.map((player, index) => {
        const team = storage.getTeam(player.teamId);

        return `
            <div class="scorer-item">
                <div class="scorer-rank">${index + 1}</div>
                <div class="scorer-info">
                    <div class="scorer-name">${player.name}</div>
                    <div class="scorer-team">${team.name}</div>
                </div>
                <div class="scorer-stats">
                    <div class="scorer-stat">
                        <div class="scorer-stat-value">${player.goals}</div>
                        <div class="scorer-stat-label">Goals</div>
                    </div>
                    <div class="scorer-stat">
                        <div class="scorer-stat-value">${player.assists}</div>
                        <div class="scorer-stat-label">Assists</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
