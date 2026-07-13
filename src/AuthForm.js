import React, { useState } from 'react';
import boyLogin from "./images/boy-login.png";
import loginPage from "./images/login-image.png";
import boy2 from "./images/boy2.png";
import girl from "./images/girl2.png";

const VISUALS = [
    { src: boyLogin, label: "Welcome back" },
    { src: loginPage, label: "Sign in securely" },
    { src: boy2, label: "Stay connected" },
    { src: girl, label: "Pick up where you left off" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [fields, setFields] = useState({ fullName: "", email: "", password: "" });
    const [errors, setErrors] = useState({});

    function updateField(name, value) {
        setFields((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }

    function validate() {
        const next = {};
        if (!isLogin && !fields.fullName.trim()) {
            next.fullName = "Enter your full name";
        }
        if (!fields.email.trim()) {
            next.email = "Enter your email";
        } else if (!EMAIL_RE.test(fields.email)) {
            next.email = "Enter a valid email address";
        }
        if (!fields.password) {
            next.password = "Enter your password";
        } else if (!isLogin && fields.password.length < 8) {
            next.password = "Password must be at least 8 characters";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setSubmitted(false);
        // Placeholder for real auth call
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 900);
    }

    function switchMode(toLogin) {
        setIsLogin(toLogin);
        setErrors({});
        setSubmitted(false);
        setFields({ fullName: "", email: "", password: "" });
    }

    return (
        <div className={isLogin ? "auth-page" : "auth-page auth-page-signup"}>
            <div className="auth-form">
                <form onSubmit={handleSubmit} noValidate>
                    {isLogin ? (
                        <>
                            <h2>Login</h2>
                            <p>Welcome back, enter your details below</p>

                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={fields.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    className={errors.email ? "input-error" : ""}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                />
                                {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
                            </div>

                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Your password"
                                        value={fields.password}
                                        onChange={(e) => updateField("password", e.target.value)}
                                        className={errors.password ? "input-error" : ""}
                                        aria-invalid={!!errors.password}
                                        aria-describedby={errors.password ? "password-error" : undefined}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-visibility"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.password && <span className="field-error" id="password-error">{errors.password}</span>}
                            </div>

                            <a href="#" className="forgot-link">Forgot Password?</a>
                            <a href="#" className="switch-link" onClick={(e) => { e.preventDefault(); switchMode(false); }}>
                                Create account
                            </a>

                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? <span className="spinner" aria-hidden="true" /> : "Login"}
                            </button>

                            {submitted && <p className="success-msg" role="status">You're logged in!</p>}
                        </>
                    ) : (
                        <>
                            <h2>Signup</h2>
                            <p>Create an account to get started</p>

                            <div className="field">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Full Name"
                                    value={fields.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    className={errors.fullName ? "input-error" : ""}
                                    aria-invalid={!!errors.fullName}
                                    aria-describedby={errors.fullName ? "name-error" : undefined}
                                />
                                {errors.fullName && <span className="field-error" id="name-error">{errors.fullName}</span>}
                            </div>

                            <div className="field">
                                <label htmlFor="signup-email">Email</label>
                                <input
                                    id="signup-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={fields.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    className={errors.email ? "input-error" : ""}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? "signup-email-error" : undefined}
                                />
                                {errors.email && <span className="field-error" id="signup-email-error">{errors.email}</span>}
                            </div>

                            <div className="field">
                                <label htmlFor="signup-password">Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="At least 8 characters"
                                        value={fields.password}
                                        onChange={(e) => updateField("password", e.target.value)}
                                        className={errors.password ? "input-error" : ""}
                                        aria-invalid={!!errors.password}
                                        aria-describedby={errors.password ? "signup-password-error" : undefined}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-visibility"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.password && <span className="field-error" id="signup-password-error">{errors.password}</span>}
                            </div>

                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? <span className="spinner" aria-hidden="true" /> : "Signup"}
                            </button>

                            {submitted && <p className="success-msg" role="status">Account created!</p>}

                            <p className="small-text">
                                Already have an account?{" "}
                                <a href="#" onClick={(e) => { e.preventDefault(); switchMode(true); }}>Login</a>
                            </p>
                        </>
                    )}
                </form>

                <div className="thumb-list" role="tablist" aria-label="Preview images">
                    {VISUALS.map((visual, i) => (
                        <button
                            type="button"
                            key={i}
                            role="tab"
                            aria-selected={activeImage === i}
                            className={activeImage === i ? "thumb active" : "thumb"}
                            onClick={() => setActiveImage(i)}
                        >
                            <img src={visual.src} alt={visual.label} />
                            <span />
                        </button>
                    ))}
                </div>
            </div>

            <div className="auth-visual">
                <div className="visual-wrapper">
                    {VISUALS.map((visual, i) => (
                        <img
                            key={i}
                            src={visual.src}
                            alt={visual.label}
                            className={activeImage === i ? "visual-img active" : "visual-img"}
                        />
                    ))}
                </div>
                <p className="visual-caption">{VISUALS[activeImage].label}</p>
            </div>
        </div>
    );
}
