// Standings page functionality
document.addEventListener('DOMContentLoaded', function () {
    loadStandings();
});

function loadStandings() {
    const league = storage.getActiveLeague();
    const standings = storage.getStandings(league.id);
    const tbody = document.getElementById('standingsTableBody');

    if (standings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center">
                    <div class="empty-state">
                        <svg viewBox="0 0 64 64" fill="currentColor">
                            <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11.1 0 20 8.9 20 20s-8.9 20-20 20-20-8.9-20-20 8.9-20 20-20z"/>
                        </svg>
                        <h3>No Teams Yet</h3>
                        <p>Add teams to see standings</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = standings.map((team, index) => `
        <tr>
            <td class="position">${index + 1}</td>
            <td>
                <div class="team-info">
                    <div class="team-badge">${team.code}</div>
                    <div class="team-name-wrapper">
                        <span class="team-name">${team.name}</span>
                        <span class="team-code">${team.code}</span>
                    </div>
                </div>
            </td>
            <td class="stat">${team.played}</td>
            <td class="stat">${team.won}</td>
            <td class="stat">${team.drawn}</td>
            <td class="stat">${team.lost}</td>
            <td class="stat">${team.goalsFor}</td>
            <td class="stat">${team.goalsAgainst}</td>
            <td class="goal-diff ${team.goalDifference > 0 ? 'positive' : team.goalDifference < 0 ? 'negative' : ''}">
                ${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}
            </td>
            <td class="points">${team.points}</td>
        </tr>
    `).join('');
}
