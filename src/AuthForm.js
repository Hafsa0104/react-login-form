import React, { useState, useRef, useEffect } from 'react';
import boyLogin from "./images/boy-login.png";
import loginPage from "./images/login-image.png";
import boy2 from "./images/boy2.png";
import girl from "./images/girl2.png";

const images = [boyLogin, loginPage, boy2, girl];

// Simple, reliable email format check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimum accepted password length
const PASSWORD_MIN_LENGTH = 8;

// How long a success message stays visible before it auto-clears
const MESSAGE_AUTO_CLEAR_MS = 3000;

// How long to show the success message before redirecting to Login
const REDIRECT_DELAY_MS = 1800;

// Small artificial delay so the submit button can show a loading state.
// There is no real network request here (auth is simulated via localStorage,
// see the block below), but the delay keeps the interaction feeling honest
// instead of an instant, jarring flash of success/error.
const SUBMIT_DELAY_MS = 600;

// ============================================================================
// SIMULATED AUTHENTICATION (localStorage only)
// ----------------------------------------------------------------------------
// There is no backend here. "Signing up" writes a plain user record into
// localStorage, and "logging in" just looks that record back up and compares
// the password as plain text. This is only good enough for a local demo -
// passwords are NOT hashed and anyone with access to the browser's dev tools
// can read them directly. Do not reuse this pattern for real accounts.
// ============================================================================
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

function getUsers() {
    // Reads the simulated "users table" from localStorage.
    try {
        const raw = localStorage.getItem(USERS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    // Overwrites the simulated "users table" in localStorage.
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
        // localStorage may be unavailable (e.g. private browsing quota) - fail silently
    }
}

function findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    return getUsers().find((u) => u.email.toLowerCase() === normalized);
}

function setCurrentUser(user) {
    // Simulates a login session by stashing the current user in localStorage.
    // A real app would use a server-issued session/JWT instead of trusting
    // whatever is sitting in the browser's storage.
    try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }));
    } catch {
        // ignore storage failures
    }
}

// Reusable eye / eye-slash icon (no external icon library needed)
function EyeIcon({ visible }) {
    return visible ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3c2711" strokeWidth="2" aria-hidden="true" focusable="false">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3c2711" strokeWidth="2" aria-hidden="true" focusable="false">
            <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.76 19.76 0 015.06-6.06" />
            <path d="M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.62 19.62 0 01-3.22 4.36" />
            <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // ---------- Login state ----------
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});
    const [loginSuccess, setLoginSuccess] = useState('');
    const [loginSubmitting, setLoginSubmitting] = useState(false);

    // ---------- Signup state ----------
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
    const [signupErrors, setSignupErrors] = useState({});
    const [signupSuccess, setSignupSuccess] = useState('');
    const [signupSubmitting, setSignupSubmitting] = useState(false);

    // ---------- Forgot password state ----------
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
    const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
    const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
    const [forgotErrors, setForgotErrors] = useState({});
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [forgotSubmitting, setForgotSubmitting] = useState(false);

    // ---------- Pending timeouts (submit delay, auto-clear, auto-redirect) ----------
    // Kept in refs (not state) since they're bookkeeping, not something we render.
    const timeoutRefs = useRef({
        loginSubmit: null,
        loginMessage: null,
        signupSubmit: null,
        signupRedirect: null,
        forgotSubmit: null,
        forgotRedirect: null,
    });

    const clearTimeoutRef = (key) => {
        if (timeoutRefs.current[key]) {
            clearTimeout(timeoutRefs.current[key]);
            timeoutRefs.current[key] = null;
        }
    };

    const clearAllTimeouts = () => {
        Object.keys(timeoutRefs.current).forEach(clearTimeoutRef);
    };

    // Make sure nothing tries to update state after the component unmounts
    useEffect(() => {
        return () => clearAllTimeouts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetAllMessages = () => {
        setLoginErrors({});
        setLoginSuccess('');
        setSignupErrors({});
        setSignupSuccess('');
        setForgotErrors({});
        setForgotSuccess('');
    };

    const goToLogin = () => {
        clearAllTimeouts();
        setLoginSubmitting(false);
        setSignupSubmitting(false);
        setForgotSubmitting(false);
        resetAllMessages();
        setShowForgotPassword(false);
        setIsLogin(true);
    };

    const goToSignup = (e) => {
        e.preventDefault();
        clearAllTimeouts();
        setLoginSubmitting(false);
        setSignupSubmitting(false);
        setForgotSubmitting(false);
        resetAllMessages();
        setShowForgotPassword(false);
        setIsLogin(false);
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        clearAllTimeouts();
        setLoginSubmitting(false);
        setSignupSubmitting(false);
        setForgotSubmitting(false);
        resetAllMessages();
        setShowForgotPassword(true);
    };

    // ---------- Thumbnails ----------
    const handleThumbClick = (index) => {
        setActiveImage(index);
    };

    // ---------- Login field handlers (clear error-on-type) ----------
    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value);
        if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: undefined }));
        if (loginSuccess) setLoginSuccess('');
    };

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
        if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: undefined }));
        if (loginSuccess) setLoginSuccess('');
    };

    // ---------- Signup field handlers (clear error-on-type) ----------
    const handleSignupNameChange = (e) => {
        setSignupName(e.target.value);
        if (signupErrors.name) setSignupErrors((prev) => ({ ...prev, name: undefined }));
    };

    const handleSignupEmailChange = (e) => {
        setSignupEmail(e.target.value);
        if (signupErrors.email) setSignupErrors((prev) => ({ ...prev, email: undefined }));
    };

    const handleSignupPasswordChange = (e) => {
        setSignupPassword(e.target.value);
        if (signupErrors.password) setSignupErrors((prev) => ({ ...prev, password: undefined }));
        if (signupErrors.confirmPassword) setSignupErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    };

    const handleSignupConfirmPasswordChange = (e) => {
        setSignupConfirmPassword(e.target.value);
        if (signupErrors.confirmPassword) setSignupErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    };

    // ---------- Forgot password field handlers (clear error-on-type) ----------
    const handleForgotEmailChange = (e) => {
        setForgotEmail(e.target.value);
        if (forgotErrors.email) setForgotErrors((prev) => ({ ...prev, email: undefined }));
    };

    const handleForgotNewPasswordChange = (e) => {
        setForgotNewPassword(e.target.value);
        if (forgotErrors.newPassword) setForgotErrors((prev) => ({ ...prev, newPassword: undefined }));
        if (forgotErrors.confirmPassword) setForgotErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    };

    const handleForgotConfirmPasswordChange = (e) => {
        setForgotConfirmPassword(e.target.value);
        if (forgotErrors.confirmPassword) setForgotErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    };

    // ---------- Login submit ----------
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (loginSubmitting) return;

        clearTimeoutRef('loginMessage');
        setLoginSuccess('');
        setLoginSubmitting(true);

        // Simulated network delay so the "Logging in..." state is visible
        timeoutRefs.current.loginSubmit = setTimeout(() => {
            const errors = {};

            if (!loginEmail.trim()) {
                errors.email = 'Email is required';
            } else if (!EMAIL_REGEX.test(loginEmail)) {
                errors.email = 'Please enter a valid email address';
            }

            if (!loginPassword.trim()) {
                errors.password = 'Password is required';
            }

            // Simulated authentication check against the localStorage "users table"
            if (!errors.email && !errors.password) {
                const user = findUserByEmail(loginEmail);

                if (!user) {
                    errors.email = 'Email not found. Please sign up first.';
                } else if (user.password !== loginPassword) {
                    errors.password = 'Incorrect password.';
                }
            }

            setLoginErrors(errors);
            setLoginSubmitting(false);

            if (Object.keys(errors).length === 0) {
                const user = findUserByEmail(loginEmail);
                setCurrentUser(user);
                setLoginSuccess('Login successful.');

                // Auto-clear the success message after a few seconds
                timeoutRefs.current.loginMessage = setTimeout(() => {
                    setLoginSuccess('');
                }, MESSAGE_AUTO_CLEAR_MS);
            }
        }, SUBMIT_DELAY_MS);
    };

    // ---------- Signup submit ----------
    const handleSignupSubmit = (e) => {
        e.preventDefault();
        if (signupSubmitting) return;

        setSignupSuccess('');
        setSignupSubmitting(true);

        // Simulated network delay so the "Creating account..." state is visible
        timeoutRefs.current.signupSubmit = setTimeout(() => {
            const errors = {};

            if (!signupName.trim()) {
                errors.name = 'Full name is required';
            }

            if (!signupEmail.trim()) {
                errors.email = 'Email is required';
            } else if (!EMAIL_REGEX.test(signupEmail)) {
                errors.email = 'Please enter a valid email address';
            }

            if (!signupPassword.trim()) {
                errors.password = 'Password is required';
            } else if (signupPassword.length < PASSWORD_MIN_LENGTH) {
                errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
            }

            if (!signupConfirmPassword.trim()) {
                errors.confirmPassword = 'Please confirm your password';
            } else if (signupPassword !== signupConfirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }

            // Simulated "unique email" constraint against the localStorage "users table"
            if (!errors.email && findUserByEmail(signupEmail)) {
                errors.email = 'Email already registered. Please login instead.';
            }

            setSignupErrors(errors);
            setSignupSubmitting(false);

            if (Object.keys(errors).length === 0) {
                const users = getUsers();
                users.push({
                    name: signupName.trim(),
                    email: signupEmail.trim(),
                    password: signupPassword,
                });
                saveUsers(users);

                setSignupSuccess('Account created successfully! Redirecting to login...');
                setSignupName('');
                setSignupEmail('');
                setSignupPassword('');
                setSignupConfirmPassword('');

                // Give the user a moment to read the confirmation, then return to Login
                timeoutRefs.current.signupRedirect = setTimeout(() => {
                    goToLogin();
                }, REDIRECT_DELAY_MS);
            }
        }, SUBMIT_DELAY_MS);
    };

    // ---------- Forgot password submit ----------
    const handleForgotSubmit = (e) => {
        e.preventDefault();
        if (forgotSubmitting) return;

        setForgotSuccess('');
        setForgotSubmitting(true);

        // Simulated network delay so the "Resetting..." state is visible
        timeoutRefs.current.forgotSubmit = setTimeout(() => {
            const errors = {};

            if (!forgotEmail.trim()) {
                errors.email = 'Email is required';
            } else if (!EMAIL_REGEX.test(forgotEmail)) {
                errors.email = 'Please enter a valid email address';
            }

            if (!forgotNewPassword.trim()) {
                errors.newPassword = 'New password is required';
            } else if (forgotNewPassword.length < PASSWORD_MIN_LENGTH) {
                errors.newPassword = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
            }

            if (!forgotConfirmPassword.trim()) {
                errors.confirmPassword = 'Please confirm your new password';
            } else if (forgotNewPassword !== forgotConfirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }

            // Simulated lookup against the localStorage "users table"
            let user = null;
            if (!errors.email) {
                user = findUserByEmail(forgotEmail);
                if (!user) {
                    errors.email = 'Email not found. Please sign up first.';
                }
            }

            setForgotErrors(errors);
            setForgotSubmitting(false);

            if (Object.keys(errors).length === 0 && user) {
                const users = getUsers();
                const updatedUsers = users.map((u) =>
                    u.email.toLowerCase() === forgotEmail.trim().toLowerCase()
                        ? { ...u, password: forgotNewPassword }
                        : u
                );
                saveUsers(updatedUsers);

                setForgotSuccess('Password reset successful! Redirecting to login...');
                setForgotNewPassword('');
                setForgotConfirmPassword('');

                // Give the user a moment to read the confirmation, then return to Login
                timeoutRefs.current.forgotRedirect = setTimeout(() => {
                    setForgotEmail('');
                    goToLogin();
                }, REDIRECT_DELAY_MS);
            }
        }, SUBMIT_DELAY_MS);
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                {showForgotPassword ? (
                    <div className="form">
                        <h2>Reset Password</h2>
                        <p>Enter your email and choose a new password.</p>

                        <form onSubmit={handleForgotSubmit} noValidate>
                            <label htmlFor="forgot-email" className="sr-only">Email</label>
                            <input
                                id="forgot-email"
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={forgotEmail}
                                onChange={handleForgotEmailChange}
                                aria-invalid={!!forgotErrors.email}
                                aria-describedby={forgotErrors.email ? 'forgot-email-error' : undefined}
                            />
                            {forgotErrors.email && <span id="forgot-email-error" className="error-text" role="alert">{forgotErrors.email}</span>}

                            <label htmlFor="forgot-new-password" className="sr-only">New Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="forgot-new-password"
                                    type={showForgotNewPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    autoComplete="new-password"
                                    value={forgotNewPassword}
                                    onChange={handleForgotNewPasswordChange}
                                    aria-invalid={!!forgotErrors.newPassword}
                                    aria-describedby={forgotErrors.newPassword ? 'forgot-new-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    className="toggle-eye"
                                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                                    aria-label={showForgotNewPassword ? 'Hide new password' : 'Show new password'}
                                    aria-pressed={showForgotNewPassword}
                                >
                                    <EyeIcon visible={showForgotNewPassword} />
                                </button>
                            </div>
                            {forgotErrors.newPassword && <span id="forgot-new-password-error" className="error-text" role="alert">{forgotErrors.newPassword}</span>}

                            <label htmlFor="forgot-confirm-password" className="sr-only">Confirm New Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="forgot-confirm-password"
                                    type={showForgotConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    autoComplete="new-password"
                                    value={forgotConfirmPassword}
                                    onChange={handleForgotConfirmPasswordChange}
                                    aria-invalid={!!forgotErrors.confirmPassword}
                                    aria-describedby={forgotErrors.confirmPassword ? 'forgot-confirm-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    className="toggle-eye"
                                    onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                                    aria-label={showForgotConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                    aria-pressed={showForgotConfirmPassword}
                                >
                                    <EyeIcon visible={showForgotConfirmPassword} />
                                </button>
                            </div>
                            {forgotErrors.confirmPassword && <span id="forgot-confirm-password-error" className="error-text" role="alert">{forgotErrors.confirmPassword}</span>}

                            {forgotSuccess && <span className="success-text" role="status">{forgotSuccess}</span>}

                            <button type="submit" className="auth-buttons" disabled={forgotSubmitting} aria-busy={forgotSubmitting}>
                                {forgotSubmitting ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>

                        <p>
                            Remember your password?{' '}
                            <button
                                type="button"
                                className="link-button"
                                onClick={goToLogin}
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                ) : isLogin ? (
                    <div className="form">
                        <h2>Login</h2>

                        <form onSubmit={handleLoginSubmit} noValidate>
                            <label htmlFor="login-email" className="sr-only">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={loginEmail}
                                onChange={handleLoginEmailChange}
                                aria-invalid={!!loginErrors.email}
                                aria-describedby={loginErrors.email ? 'login-email-error' : undefined}
                            />
                            {loginErrors.email && <span id="login-email-error" className="error-text" role="alert">{loginErrors.email}</span>}

                            <label htmlFor="login-password" className="sr-only">Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="login-password"
                                    type={showLoginPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    value={loginPassword}
                                    onChange={handleLoginPasswordChange}
                                    aria-invalid={!!loginErrors.password}
                                    aria-describedby={loginErrors.password ? 'login-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    className="toggle-eye"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                                    aria-pressed={showLoginPassword}
                                >
                                    <EyeIcon visible={showLoginPassword} />
                                </button>
                            </div>
                            {loginErrors.password && <span id="login-password-error" className="error-text" role="alert">{loginErrors.password}</span>}

                            <button
                                type="button"
                                className="link-button"
                                onClick={handleForgotPasswordClick}
                            >
                                Forgot Password?
                            </button>

                            {loginSuccess && <span className="success-text" role="status">{loginSuccess}</span>}

                            <button type="submit" className="auth-buttons" disabled={loginSubmitting} aria-busy={loginSubmitting}>
                                {loginSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="form">
                        <h2>Signup</h2>

                        <form onSubmit={handleSignupSubmit} noValidate>
                            <label htmlFor="signup-name" className="sr-only">Full Name</label>
                            <input
                                id="signup-name"
                                type="text"
                                placeholder="Full Name"
                                autoComplete="name"
                                value={signupName}
                                onChange={handleSignupNameChange}
                                aria-invalid={!!signupErrors.name}
                                aria-describedby={signupErrors.name ? 'signup-name-error' : undefined}
                            />
                            {signupErrors.name && <span id="signup-name-error" className="error-text" role="alert">{signupErrors.name}</span>}

                            <label htmlFor="signup-email" className="sr-only">Email</label>
                            <input
                                id="signup-email"
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={signupEmail}
                                onChange={handleSignupEmailChange}
                                aria-invalid={!!signupErrors.email}
                                aria-describedby={signupErrors.email ? 'signup-email-error' : undefined}
                            />
                            {signupErrors.email && <span id="signup-email-error" className="error-text" role="alert">{signupErrors.email}</span>}

                            <label htmlFor="signup-password" className="sr-only">Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="signup-password"
                                    type={showSignupPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    autoComplete="new-password"
                                    value={signupPassword}
                                    onChange={handleSignupPasswordChange}
                                    aria-invalid={!!signupErrors.password}
                                    aria-describedby={signupErrors.password ? 'signup-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    className="toggle-eye"
                                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                                    aria-pressed={showSignupPassword}
                                >
                                    <EyeIcon visible={showSignupPassword} />
                                </button>
                            </div>
                            {signupErrors.password && <span id="signup-password-error" className="error-text" role="alert">{signupErrors.password}</span>}

                            <label htmlFor="signup-confirm-password" className="sr-only">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="signup-confirm-password"
                                    type={showSignupConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    value={signupConfirmPassword}
                                    onChange={handleSignupConfirmPasswordChange}
                                    aria-invalid={!!signupErrors.confirmPassword}
                                    aria-describedby={signupErrors.confirmPassword ? 'signup-confirm-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    className="toggle-eye"
                                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                                    aria-label={showSignupConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                    aria-pressed={showSignupConfirmPassword}
                                >
                                    <EyeIcon visible={showSignupConfirmPassword} />
                                </button>
                            </div>
                            {signupErrors.confirmPassword && <span id="signup-confirm-password-error" className="error-text" role="alert">{signupErrors.confirmPassword}</span>}

                            {signupSuccess && <span className="success-text" role="status">{signupSuccess}</span>}

                            <button type="submit" className="auth-buttons" disabled={signupSubmitting} aria-busy={signupSubmitting}>
                                {signupSubmitting ? 'Creating account...' : 'Signup'}
                            </button>
                        </form>

                        <p>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="link-button"
                                onClick={goToLogin}
                            >
                                Login
                            </button>
                        </p>
                    </div>
                )}

                <div className="thumb-list">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`thumb ${activeImage === index ? 'active' : ''}`}
                            onClick={() => handleThumbClick(index)}
                            aria-label={`Show visual ${index + 1} of ${images.length}`}
                            aria-pressed={activeImage === index}
                        >
                            <img src={img} alt="" />
                        </button>
                    ))}
                </div>

                {!showForgotPassword && isLogin && (
                    <p>Don't have an account? <button
                        type="button"
                        className="link-button"
                        onClick={goToSignup}
                    >
                        Sign Up
                    </button></p>
                )}
            </div>

            <div className="auth-visual">
                <div className="visual-wrapper">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt=""
                            className={`visual-img ${activeImage === index ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}