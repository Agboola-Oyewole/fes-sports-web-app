// Rules page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadRules();
});

function loadRules() {
    const league = storage.getActiveLeague();
    const rules = storage.getRules(league.id);
    
    // Update rules count
    document.getElementById('rulesCount').textContent = 
        `${rules.length} rule${rules.length !== 1 ? 's' : ''} governing league play and conduct`;
    
    // Show/hide empty state
    const emptyState = document.getElementById('rulesEmpty');
    const rulesList = document.getElementById('rulesList');
    
    if (rules.length === 0) {
        emptyState.style.display = 'block';
        rulesList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        rulesList.style.display = 'flex';
        renderRules(rules);
    }
}

function renderRules(rules) {
    const container = document.getElementById('rulesList');
    
    container.innerHTML = rules.map((rule, index) => `
        <div class="rule-card">
            <div class="rule-header">
                <div class="rule-number">${index + 1}</div>
                <div class="rule-title-section">
                    <span class="rule-category ${rule.category || 'general'}">${rule.category || 'General'}</span>
                    <h3 class="rule-title">${rule.title}</h3>
                    <p class="rule-meta">Last updated: ${formatDate(rule.created)}</p>
                </div>
            </div>
            <div class="rule-content">
                ${rule.description}
            </div>
            ${rule.penalty ? `
                <div class="rule-footer">
                    <strong>Penalty:</strong> ${rule.penalty}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
