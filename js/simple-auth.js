// Simple admin password check
const ADMIN_PASSWORD = 'admin123';

function checkAdminPassword() {
    const password = prompt('Enter admin password:');
    
    if (password === null) {
        // User clicked cancel
        window.history.back();
        return false;
    }
    
    if (password === ADMIN_PASSWORD) {
        // Correct password - allow access
        return true;
    } else {
        // Wrong password - go back
        alert('Incorrect password!');
        window.history.back();
        return false;
    }
}
