import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import '../assets/css/auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        await authService.login(email, password);
        navigate('/dashboard');
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to login')
    } finally {
        setLoading(false);
  
    }
  };

  return (
    <div className="auth-container">
        <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Access your wallet dashboard</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <button type="submit" disabled={loading} className="auth-button">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <p className="auth-link">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    </div>
  );
}

export default Login;