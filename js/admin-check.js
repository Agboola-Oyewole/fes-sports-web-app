// Simple password check for admin page
const ADMIN_PASSWORD = 'admin123';

// Check password immediately when page loads
(function() {
    const password = prompt('Enter admin password:');
    
    if (password === null || password !== ADMIN_PASSWORD) {
        // Wrong password or cancelled - go back
        if (password !== null) {
            alert('Incorrect password!');
        }
        window.history.back();
    }
    // If correct, do nothing - page will load normally
})();
