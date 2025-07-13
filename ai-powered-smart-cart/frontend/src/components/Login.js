import React, { useState, useEffect } from 'react';
import { FaGoogle, FaSpinner } from 'react-icons/fa';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const Login = ({ onLoginSuccess, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          if (onLoginSuccess) onLoginSuccess(result.user);
        }
      })
      .catch((error) => {
        setErrors({ api: error.message || 'Google login failed. Please try again.' });
      });
    // eslint-disable-next-line
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onLoginSuccess will be triggered via auth state listener
    } catch (error) {
      setErrors({
        api: error.message.includes('user-not-found')
          ? 'No account found with this email'
          : error.message.includes('wrong-password')
          ? 'Incorrect password'
          : error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      // onLoginSuccess will be triggered via redirect result or auth listener
    } catch (error) {
      setErrors({ api: error.message || 'Google login failed. Please try again.' });
      setIsGoogleLoading(false); // Only set loading false if not redirecting
    }
    // If using redirect, user will leave the page so we don't need to set loading false
  };

  const handleForgotPassword = () => {
    // Implement forgot password flow if needed
    alert('Forgot password flow would be implemented here');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          {/* Add your logo here if you have one */}
          {/* <img src="/logo.png" alt="Smart Cart" className="auth-logo" /> */}
          <h2>Welcome Back</h2>
          <p>Sign in to access your smart shopping cart</p>
        </div>

        {errors.api && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {errors.api}
          </div>
        )}

        <form className="auth-form" onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="loading-spinner" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="social-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="social-btn google"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <FaGoogle className="social-icon" />
            {isGoogleLoading ? 'Signing In...' : 'Continue with Google'}
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <button
            type="button"
            className="switch-mode-btn"
            onClick={switchToRegister}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;