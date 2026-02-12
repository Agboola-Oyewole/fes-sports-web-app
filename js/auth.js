// Authentication System for Admin Access
const ADMIN_PASSCODE = 'admin123'; // Change this to your desired passcode

// Check if user is authenticated
function isAuthenticated() {
    return sessionStorage.getItem('adminAuth') === 'true';
}

// Set authentication
function setAuthentication(value) {
    if (value) {
        sessionStorage.setItem('adminAuth', 'true');
    } else {
        sessionStorage.removeItem('adminAuth');
    }
}

// Check admin access and show password dialog
function checkAdminAccess(event) {
    if (event) {
        event.preventDefault();

    }

    // If already authenticated, allow access
    if (isAuthenticated()) {
        return true;
    }

    // Show password dialog
    showPasswordDialog();
    return false;
}

// Show password dialog
function showPasswordDialog() {
    const dialogHTML = `
        <div class="auth-overlay" id="authOverlay">
            <div class="auth-dialog">
                <div class="auth-header">
                    <h2>Admin Access Required</h2>
                    <button class="auth-close" onclick="closePasswordDialog()">&times;</button>
                </div>
                <div class="auth-body">
                    <p class="auth-description">Enter the admin passcode to continue</p>
                    <form onsubmit="return verifyPasscode(event)" class="auth-form">
                        <div class="form-group">
                            <label for="passcode">Passcode</label>
                            <input 
                                type="password" 
                                id="passcode" 
                                placeholder="Enter passcode"
                                autocomplete="off"
                                autofocus
                                required
                            />
                        </div>
                        <div class="auth-error" id="authError" style="display: none;">
                            Incorrect passcode. Please try again.
                        </div>
                        <div class="auth-actions">
                            <button type="button" class="btn btn-secondary" onclick="closePasswordDialog()">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-shield-check" viewBox="0 0 16 16">
                            <path
                                d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                            <path
                                d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                        </svg>
                                Access Admin
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Add dialog to body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = dialogHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    // Focus on input
    setTimeout(() => {
        document.getElementById('passcode')?.focus();
    }, 100);
}

// Close password dialog
function closePasswordDialog() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Verify passcode
function verifyPasscode(event) {
    event.preventDefault();

    const passcodeInput = document.getElementById('passcode');
    const errorDiv = document.getElementById('authError');
    const enteredCode = passcodeInput.value;

    if (enteredCode === ADMIN_PASSCODE) {
        // Correct passcode
        setAuthentication(true);
        closePasswordDialog();

        // Navigate to admin page
        const currentPage = window.location.pathname;
        if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('fes-sports/')) {
            window.location.href = 'pages/admin.html';
        } else if (currentPage.includes('pages/')) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'pages/admin.html';
        }

        return false;
    } else {
        // Incorrect passcode
        errorDiv.style.display = 'block';
        passcodeInput.value = '';
        passcodeInput.focus();

        // Shake animation
        const dialog = document.querySelector('.auth-dialog');
        dialog.classList.add('shake');
        setTimeout(() => {
            dialog.classList.remove('shake');
        }, 500);

        return false;
    }
}

// Protect admin page
function protectAdminPage() {
    if (!isAuthenticated()) {
        // Store the current page URL
        const currentPath = window.location.pathname;

        // Redirect to landing page with return URL
        if (currentPath.includes('admin.html')) {
            const landingPath = currentPath.includes('pages/') ? '../index.html' : 'index.html';
            window.location.href = landingPath;

            // Show password dialog after redirect
            setTimeout(() => {
                showPasswordDialog();
            }, 100);
        }
    }
}

// Logout function
function adminLogout() {
    if (confirm('Are you sure you want to logout from admin?')) {
        setAuthentication(false);
        const currentPath = window.location.pathname;
        const landingPath = currentPath.includes('pages/') ? '../index.html' : 'index.html';
        window.location.href = landingPath;
    }
}

// Add CSS for auth dialog
const authStyles = `
<style>
.auth-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease-out;
}

.auth-dialog {
    background-color: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    max-width: 450px;
    width: 90%;
    border: 1px solid var(--border-color);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.3s ease-out;
}

.auth-dialog.shake {
    animation: shake 0.5s ease-out;
}

.auth-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.auth-header h2 {
    font-size: var(--font-size-xl);
    font-weight: 700;
}

.auth-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 32px;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
}

.auth-close:hover {
    background-color: var(--hover-bg);
    color: var(--text-primary);
}

.auth-body {
    margin-bottom: var(--spacing-md);
}

.auth-description {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.form-group label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--text-secondary);
}

.form-group input {
    padding: 14px 16px;
    background-color: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--font-size-base);
    font-family: var(--font-family);
    transition: border-color 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--accent-green);
}

.auth-error {
    padding: 12px 16px;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid var(--accent-red);
    border-radius: var(--radius-md);
    color: var(--accent-red);
    font-size: var(--font-size-sm);
    font-weight: 600;
}

.auth-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
}

.auth-actions button {
    padding: 12px 24px;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}
</style>
`;

// Inject styles
if (!document.getElementById('authStyles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'authStyles';
    styleElement.innerHTML = authStyles;
    document.head.appendChild(styleElement);
}
