import React, { useState } from 'react';
import { FaGoogle, FaSpinner } from 'react-icons/fa';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';

const Login = ({ onLoginSuccess, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          : 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onLoginSuccess will be triggered via auth state listener
    } catch (error) {
      setErrors({ api: 'Google login failed. Please try again.' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password flow
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