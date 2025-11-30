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

// Check if user is already logged in
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // User is logged in, redirect to level map
        window.location.href = 'LevelMap/dist/index.html';
    }
}

// Run on page load
window.addEventListener('DOMContentLoaded', checkAuth);

