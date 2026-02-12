// Simple admin passcode check
const ADMIN_PASSCODE = 'admin123';

// Function to show passcode dialog
function showAdminPasscodeDialog() {
    const passcode = prompt('Enter admin passcode:');
    
    if (passcode === null) {
        // User clicked cancel
        window.history.back();
        return false;
    }
    
    if (passcode === ADMIN_PASSCODE) {
        // Correct passcode
        return true;
    } else {
        // Wrong passcode
        alert('Incorrect passcode!');
        window.history.back();
        return false;
    }
}

// Check admin access when admin page loads
function checkAdminAccess() {
    // Only run on admin page
    if (window.location.pathname.includes('admin.html')) {
        const hasAccess = showAdminPasscodeDialog();
        if (!hasAccess) {
            return false;
        }
    }
    return true;
}
