import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .auth-page {
          min-height: 100vh;
          background: #0a0a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: drift 8s ease-in-out infinite alternate;
        }
        .orb1 { width: 500px; height: 500px; background: #6c3aff; top: -150px; left: -150px; animation-delay: 0s; }
        .orb2 { width: 400px; height: 400px; background: #00c9ff; bottom: -100px; right: -100px; animation-delay: 2s; }
        .orb3 { width: 300px; height: 300px; background: #ff6b6b; top: 50%; left: 50%; transform: translate(-50%,-50%); animation-delay: 4s; }
        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(30px, 20px) scale(1.1); }
        }

        .auth-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 2;
          animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-logo {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #00c9ff;
          margin-bottom: 32px;
          display: block;
        }
        .auth-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .auth-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          margin-bottom: 36px;
        }

        .field-group { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .field-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s;
        }
        .field-input:focus {
          border-color: #6c3aff;
          background: rgba(108,58,255,0.1);
          box-shadow: 0 0 0 3px rgba(108,58,255,0.15);
        }
        .field-input::placeholder { color: rgba(255,255,255,0.25); }

        .error-msg {
          background: rgba(255,107,107,0.15);
          border: 1px solid rgba(255,107,107,0.3);
          color: #ff6b6b;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 16px;
          text-align: center;
        }

        .btn-primary {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #6c3aff, #00c9ff);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(108,58,255,0.4); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .auth-link {
          text-align: center;
          margin-top: 24px;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
        }
        .auth-link a {
          color: #00c9ff;
          text-decoration: none;
          font-weight: 500;
        }
        .auth-link a:hover { text-decoration: underline; }

        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .auth-card { padding: 36px 24px; }
          .auth-title { font-size: 28px; }
        }
      `}</style>

      <div className="auth-page">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div className="auth-card">
          <span className="auth-logo">⚡ TaskFlow</span>
          <h1 className="auth-title">Welcome<br />back</h1>
          <p className="auth-subtitle">Sign in to manage your team's work</p>

          {error && <div className="error-msg">{error}</div>}

          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e)} />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <p className="auth-link">
            No account? <Link to="/signup">Create one free</Link>
          </p>
        </div>
      </div>
    </>
  );
}