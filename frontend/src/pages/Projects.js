import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {});
  }, []);

  const createProject = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await api.post('/projects', { name, description });
      setProjects([...projects, res.data]);
      setName(''); setDescription('');
      setMsg('Project created successfully!');
      setShowForm(false);
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error creating project');
    }
    setLoading(false);
  };

  const colors = ['#6c3aff','#00c9ff','#ff6b6b','#10b981','#f59e0b','#ec4899'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0d0d1f; color: #fff; }
        .page { min-height: 100vh; background: #0d0d1f; }
        .navbar { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #6c3aff, #00c9ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-btn { padding: 8px 16px; border-radius: 10px; border: none; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.1); }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .btn-accent { background: linear-gradient(135deg, #6c3aff, #00c9ff); color: #fff; }
        .btn-accent:hover { opacity: 0.9; transform: translateY(-1px); }

        .content { padding: 40px 24px; max-width: 1100px; margin: 0 auto; }
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; }
        .page-title span { background: linear-gradient(135deg, #6c3aff, #00c9ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .create-form {
          background: rgba(108,58,255,0.08); border: 1px solid rgba(108,58,255,0.25);
          border-radius: 20px; padding: 28px; margin-bottom: 32px;
          animation: fadeUp 0.4s ease;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .form-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        .field-input { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 15px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.3s; }
        .field-input:focus { border-color: #6c3aff; background: rgba(108,58,255,0.1); box-shadow: 0 0 0 3px rgba(108,58,255,0.15); }
        .field-input::placeholder { color: rgba(255,255,255,0.25); }
        .form-actions { display: flex; gap: 10px; }

        .success-msg { background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25); color: #34d399; padding: 12px 18px; border-radius: 12px; margin-bottom: 20px; font-size: 14px; animation: fadeUp 0.3s ease; }

        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 20px; }
        .proj-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px; position: relative; overflow: hidden;
          transition: all 0.3s; cursor: pointer;
          animation: fadeUp 0.5s ease both;
        }
        .proj-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.16); box-shadow: 0 24px 48px rgba(0,0,0,0.35); }
        .proj-accent { position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 20px 20px 0 0; }
        .proj-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
        .proj-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
        .proj-desc { color: rgba(255,255,255,0.45); font-size: 13px; line-height: 1.5; margin-bottom: 20px; min-height: 40px; }
        .proj-btn { width: 100%; padding: 11px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .proj-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .empty-state { text-align: center; padding: 80px 20px; }
        .empty-icon { font-size: 56px; margin-bottom: 20px; display: block; }
        .empty-text { color: rgba(255,255,255,0.35); font-size: 16px; line-height: 1.6; }

        .spinner { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; margin-right:8px; vertical-align:middle; }
        @keyframes spin { to { transform:rotate(360deg); } }

        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr; }
          .page-title { font-size: 24px; }
          .content { padding: 24px 16px; }
          .projects-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <nav className="navbar">
          <span className="nav-logo">⚡ TaskFlow</span>
          <div style={{display:'flex', gap:10}}>
            <button className="nav-btn btn-ghost" onClick={() => navigate('/dashboard')}>← Dashboard</button>
            {user?.role === 'admin' && (
              <button className="nav-btn btn-accent" onClick={() => setShowForm(!showForm)}>
                {showForm ? '✕ Cancel' : '+ New Project'}
              </button>
            )}
          </div>
        </nav>

        <div className="content">
          <div className="page-header">
            <h1 className="page-title">📁 <span>Projects</span></h1>
            <span style={{color:'rgba(255,255,255,0.4)', fontSize:14}}>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
          </div>

          {msg && <div className="success-msg">✅ {msg}</div>}

          {showForm && user?.role === 'admin' && (
            <div className="create-form">
              <div className="form-title">Create New Project</div>
              <div className="form-row">
                <input className="field-input" placeholder="Project name" value={name} onChange={e => setName(e.target.value)} />
                <input className="field-input" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="form-actions">
                <button className="nav-btn btn-accent" onClick={createProject} disabled={loading}>
                  {loading && <span className="spinner" />}
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                <button className="nav-btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📂</span>
              <p className="empty-text">No projects yet.<br />{user?.role === 'admin' ? 'Create your first project to get started!' : 'Projects you are part of will appear here.'}</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((p, i) => {
                const color = colors[i % colors.length];
                return (
                  <div key={p.id} className="proj-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="proj-accent" style={{ background: color }} />
                    <div className="proj-icon" style={{ background: `${color}22` }}>📋</div>
                    <div className="proj-name">{p.name}</div>
                    <div className="proj-desc">{p.description || 'No description added.'}</div>
                    <button className="proj-btn" onClick={() => navigate(`/projects/${p.id}`)}>
                      View Tasks →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}