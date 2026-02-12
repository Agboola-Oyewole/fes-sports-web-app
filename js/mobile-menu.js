// Mobile sidebar toggle - shared across all pages
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    }
}

// Close sidebar when clicking on a nav link (mobile)
// And protect admin links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        // Check if it's an admin link
        if (link.getAttribute('href') === 'admin.html' || link.getAttribute('href') === 'pages/admin.html') {
            link.addEventListener('click', function(e) {
                if (!isAuthenticated || !isAuthenticated()) {
                    e.preventDefault();
                    checkAdminAccess(e);
                    return;
                }
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    const sidebar = document.querySelector('.sidebar');
                    const overlay = document.getElementById('sidebarOverlay');
                    if (sidebar && overlay) {
                        sidebar.classList.remove('mobile-open');
                        overlay.classList.remove('active');
                    }
                }
            });
        } else {
            // Regular links - just close sidebar
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const sidebar = document.querySelector('.sidebar');
                    const overlay = document.getElementById('sidebarOverlay');
                    if (sidebar && overlay) {
                        sidebar.classList.remove('mobile-open');
                        overlay.classList.remove('active');
                    }
                }
            });
        }
    });
});
