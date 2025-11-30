// Auth Check for Protected Pages
// This file should be included in any page that requires authentication

async function checkAuthAndRedirect() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        // Not logged in, redirect to login page
        window.location.href = '/login.html';
        return false;
    }
    
    // User is authenticated
    return true;
}

// Initialize user info display
async function initUserInfo() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        const email = session.user.email;
        const userId = session.user.id;
        
        // Get user data from users table
        const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('uid', userId)
            .single();
        
        if (userData) {
            // Store in localStorage for quick access
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', userData.username);
            
            return userData;
        }
    }
    
    return null;
}

// Logout function
async function logout() {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/login.html';
}

// Run auth check on page load
window.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuthAndRedirect();
    if (isAuthenticated) {
        await initUserInfo();
    }
});

