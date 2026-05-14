import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function TaskForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', due_date:'', project_id:'', assigned_to:'' });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {});
    api.get('/projects/users/all').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.project_id) return setMsg('Title and project are required');
    setLoading(true);
    try {
      await api.post('/tasks', form);
      navigate('/dashboard');
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error creating task');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0d0d1f; color: #fff; }
        .page { min-height: 100vh; background: #0d0d1f; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden; }
        .orb { position:absolute; border-radius:50%; filter:blur(100px); opacity:0.2; }
        .orb1 { width:400px; height:400px; background:#6c3aff; top:-100px; left:-100px; }
        .orb2 { width:350px; height:350px; background:#00c9ff; bottom:-100px; right:-100px; }

        .form-card {
          background: rgba(255,255,255,0.05); backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 28px;
          padding: 48px 40px; width: 100%; max-width: 500px;
          position: relative; z-index: 2;
          animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }

        .form-header { margin-bottom: 36px; }
        .form-back { background: none; border: none; color: rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
        .form-back:hover { color: rgba(255,255,255,0.8); }
        .form-title { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; margin-bottom: 6px; }
        .form-sub { color: rgba(255,255,255,0.4); font-size: 14px; }

        .field-group { margin-bottom: 18px; }
        .field-label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.45); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
        .field-input { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: #fff; font-size: 15px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.3s; }
        .field-input:focus { border-color: #6c3aff; background: rgba(108,58,255,0.1); box-shadow: 0 0 0 3px rgba(108,58,255,0.15); }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        textarea.field-input { resize: vertical; min-height: 90px; line-height: 1.5; }
        select.field-input { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }
        select.field-input option { background: #1a1a3a; color: #fff; }

        .error-msg { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #f87171; padding: 12px 16px; border-radius: 12px; font-size: 13px; margin-bottom: 16px; }

        .btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
        .btn-primary { padding: 15px; background: linear-gradient(135deg, #6c3aff, #00c9ff); color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 600; font-family: 'Syne', sans-serif; cursor: pointer; transition: all 0.3s; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(108,58,255,0.35); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-secondary { padding: 15px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; font-size: 15px; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .spinner { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; margin-right:8px; vertical-align:middle; }
        @keyframes spin { to { transform:rotate(360deg); } }

        @media (max-width: 540px) {
          .form-card { padding: 32px 20px; }
          .form-title { font-size: 24px; }
          .btn-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <div className="orb orb1" /><div className="orb orb2" />
        <div className="form-card">
          <div className="form-header">
            <button className="form-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
            <h1 className="form-title">Create Task</h1>
            <p className="form-sub">Assign work to your team members</p>
          </div>

          {msg && <div className="error-msg">⚠️ {msg}</div>}

          <div className="field-group">
            <label className="field-label">Task Title *</label>
            <input className="field-input" placeholder="e.g. Design login screen" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} />
          </div>

          <div className="field-group">
            <label className="field-label">Description</label>
            <textarea className="field-input" placeholder="Describe the task in detail..." value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="field-group">
            <label className="field-label">Due Date</label>
            <input className="field-input" type="date" value={form.due_date}
              onChange={e => setForm({...form, due_date: e.target.value})} />
          </div>

          <div className="field-group">
            <label className="field-label">Project *</label>
            <select className="field-input" value={form.project_id}
              onChange={e => setForm({...form, project_id: e.target.value})}>
              <option value="">— Select a project —</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Assign To</label>
            <select className="field-input" value={form.assigned_to}
              onChange={e => setForm({...form, assigned_to: e.target.value})}>
              <option value="">— Select team member —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>

          <div className="btn-row">
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Creating...' : '✓ Create Task'}
            </button>
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
