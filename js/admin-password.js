// Simple admin password check
const ADMIN_PASSWORD = 'admin123';

function checkAdminPassword() {
    const password = prompt('Enter admin password:');
    
    if (password === null) {
        // User clicked cancel - go back
        window.history.back();
        return;
    }
    
    if (password !== ADMIN_PASSWORD) {
        // Wrong password
        alert('Incorrect password!');
        window.history.back();
    }
    
    // Correct password - do nothing, page stays loaded
}
