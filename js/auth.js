// Tab Switching
function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Clear error messages
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('signupError').classList.remove('show');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Show Error Message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 5000);
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    loginBtn.classList.add('loading');
    
    try {
        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Get user data from our users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (userError && userError.code !== 'PGRST116') {
            console.warn('User data not found in users table, will create on next action');
        }
        
        // Store session info
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', data.user.id);
        if (userData) {
            localStorage.setItem('username', userData.username);
        }
        
        // Redirect to level map
        window.location.href = 'LevelMap/dist/index.html';
        
    } catch (error) {
        console.error('Login error:', error);
        showError('loginError', error.message || 'Login failed. Please check your credentials.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
        loginBtn.classList.remove('loading');
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const school = document.getElementById('signupSchool').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    const signupBtn = document.getElementById('signupBtn');
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        showError('signupError', 'Passwords do not match!');
        return;
    }
    
    // Show loading state
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating Account...';
    signupBtn.classList.add('loading');
    
    try {
        // Create user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                    school_name: school
                }
            }
        });
        
        if (authError) throw authError;
        
        // Create user record in our users table
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    uid: authData.user.id,
                    username: username,
                    email: email,
                    school_name: school || null,
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (insertError) {
            console.error('Error creating user record:', insertError);
            // Continue anyway as auth was successful
        }
        
        // Store session info
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', authData.user.id);
        localStorage.setItem('username', username);
        
        // Check if email confirmation is required
        if (authData.user.identities && authData.user.identities.length === 0) {
            showError('signupError', 'Please check your email to confirm your account before logging in.');
            signupBtn.disabled = false;
            signupBtn.textContent = 'Sign Up';
            signupBtn.classList.remove('loading');
        } else {
            // Auto-login successful, redirect
            window.location.href = 'LevelMap/dist/index.html';
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        showError('signupError', error.message || 'Signup failed. Please try again.');
        signupBtn.disabled = false;
        signupBtn.textContent = 'Sign Up';
        signupBtn.classList.remove('loading');
    }
}

// Handle Google Signup
async function handleGoogleSignup() {
    const googleBtn = document.querySelector('.google-btn');
    
    // Show loading state
    googleBtn.disabled = true;
    googleBtn.textContent = 'Connecting to Google...';
    
    try {
        // Store that this is a signup (not login) for later processing
        sessionStorage.setItem('authFlow', 'signup');
        
        // Get current origin (works for both localhost and Vercel)
        const currentOrigin = window.location.origin;
        const redirectUrl = `${currentOrigin}/login.html`;
        
        console.log('[Auth] Redirecting to:', redirectUrl);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'select_account',
                }
            }
        });
        
        if (error) throw error;
        
        // Redirect will happen automatically to Google
        
    } catch (error) {
        console.error('Google signup error:', error);
        showError('signupError', error.message || 'Google signup failed. Please try again.');
        googleBtn.disabled = false;
        googleBtn.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
        `;
    }
}

// Check if user is already logged in or just returned from OAuth
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // User just completed OAuth or is already logged in
        const user = session.user;
        const email = user.email;
        const userId = user.id;
        
        // Check if this is a new Google signup
        const authFlow = sessionStorage.getItem('authFlow');
        sessionStorage.removeItem('authFlow');
        
        // Get or create user profile
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('uid', userId)
            .single();
        
        if (!userData) {
            // New user - create profile
            const username = user.user_metadata?.full_name || 
                           user.user_metadata?.name || 
                           email.split('@')[0];
            
            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    uid: userId,
                    username: username,
                    email: email,
                    school_name: null,
                    is_active: true,
                    created_at: new Date().toISOString()
                }]);
            
            if (insertError) {
                console.error('Error creating user profile:', insertError);
            }
            
            // Store user info
            localStorage.setItem('username', username);
        } else {
            localStorage.setItem('username', userData.username);
        }
        
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', userId);
        
        // Redirect to level map
        window.location.href = 'LevelMap/dist/index.html';
    }
}

// Run on page load
window.addEventListener('DOMContentLoaded', checkAuth);

