import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.get('/tasks/dashboard').then(r => setTasks(r.data)).catch(() => {});
  }, []);

  const todo = tasks.filter(t => t.status === 'todo');
  const inprogress = tasks.filter(t => t.status === 'inprogress');
  const done = tasks.filter(t => t.status === 'done');
  const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done');

  const statusColor = { todo: '#6c3aff', inprogress: '#f59e0b', done: '#10b981' };
  const statusLabel = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0d0d1f; color: #fff; min-height: 100vh; }

        .dash-page { min-height: 100vh; background: #0d0d1f; }

        /* NAVBAR */
        .navbar {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #6c3aff, #00c9ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-user { display: flex; align-items: center; gap: 10px; }
        .nav-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6c3aff, #00c9ff); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        .nav-name { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8); }
        .nav-role { font-size: 11px; color: rgba(255,255,255,0.4); }
        .nav-btn { padding: 8px 16px; border-radius: 10px; border: none; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.1); }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .btn-accent { background: linear-gradient(135deg, #6c3aff, #00c9ff); color: #fff; }
        .btn-accent:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-danger { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
        .btn-danger:hover { background: rgba(239,68,68,0.25); }

        /* HAMBURGER */
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
        .hamburger span { width: 22px; height: 2px; background: rgba(255,255,255,0.7); border-radius: 2px; transition: all 0.3s; display: block; }
        .mobile-menu { display: none; position: fixed; top: 64px; left: 0; right: 0; background: #12122a; border-bottom: 1px solid rgba(255,255,255,0.08); z-index: 99; padding: 16px; flex-direction: column; gap: 10px; }
        .mobile-menu.open { display: flex; }

        /* CONTENT */
        .dash-content { padding: 32px 24px; max-width: 1200px; margin: 0 auto; }
        .dash-greeting { margin-bottom: 32px; }
        .dash-greeting h1 { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 4px; }
        .dash-greeting p { color: rgba(255,255,255,0.45); font-size: 15px; }

        /* STATS */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px;
          position: relative; overflow: hidden;
          animation: fadeUp 0.5s ease both;
          transition: transform 0.2s, border-color 0.2s;
        }
        .stat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); }
        .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:20px 20px 0 0; }
        .stat-todo::before { background: #6c3aff; }
        .stat-inprogress::before { background: #f59e0b; }
        .stat-done::before { background: #10b981; }
        .stat-overdue::before { background: #ef4444; }
        .stat-icon { font-size: 28px; margin-bottom: 12px; display: block; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .stat-label { color: rgba(255,255,255,0.45); font-size: 13px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.1s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.2s; }

        /* TASKS */
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; }
        .task-count { background: rgba(108,58,255,0.2); color: #a78bfa; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }

        .tasks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .task-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 20px;
          position: relative; overflow: hidden;
          animation: fadeUp 0.4s ease both;
          transition: all 0.3s;
        }
        .task-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .task-stripe { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 18px 18px 0 0; }
        .task-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
        .task-desc { color: rgba(255,255,255,0.45); font-size: 13px; margin-bottom: 14px; line-height: 1.5; }
        .task-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .task-tag { padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 500; }
        .tag-project { background: rgba(108,58,255,0.15); color: #a78bfa; }
        .tag-user { background: rgba(0,201,255,0.12); color: #00c9ff; }
        .tag-date { background: rgba(239,68,68,0.12); color: #f87171; }
        .tag-date-ok { background: rgba(16,185,129,0.12); color: #34d399; }

        .status-select {
          width: 100%; padding: 10px 14px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; cursor: pointer; transition: all 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          padding-right: 32px;
        }
        .status-select:focus { border-color: #6c3aff; }
        .status-select option { background: #1a1a3a; color: #fff; }

        .empty-state { text-align: center; padding: 60px 20px; }
        .empty-icon { font-size: 48px; margin-bottom: 16px; display: block; }
        .empty-text { color: rgba(255,255,255,0.35); font-size: 15px; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .nav-right { display: none; }
          .hamburger { display: flex; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-greeting h1 { font-size: 24px; }
          .tasks-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .dash-content { padding: 20px 16px; }
          .stat-num { font-size: 32px; }
        }
      `}</style>

      <div className="dash-page">
        {/* NAVBAR */}
        <nav className="navbar">
          <span className="nav-logo">⚡ TaskFlow</span>
          <div className="nav-right">
            <div className="nav-user">
              <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="nav-name">{user?.name}</div>
                <div className="nav-role">{user?.role}</div>
              </div>
            </div>
            <button className="nav-btn btn-ghost" onClick={() => navigate('/projects')}>📁 Projects</button>
            {user?.role === 'admin' && (
              <button className="nav-btn btn-accent" onClick={() => navigate('/tasks/new')}>+ New Task</button>
            )}
            <button className="nav-btn btn-danger" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </nav>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <button className="nav-btn btn-ghost" onClick={() => { navigate('/projects'); setMenuOpen(false); }}>📁 Projects</button>
          {user?.role === 'admin' && (
            <button className="nav-btn btn-accent" onClick={() => { navigate('/tasks/new'); setMenuOpen(false); }}>+ New Task</button>
          )}
          <button className="nav-btn btn-danger" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>

        <div className="dash-content">
          <div className="dash-greeting">
            <h1>Good day, {user?.name?.split(' ')[0]} 👋</h1>
            <p>Here's what's happening with your tasks today.</p>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card stat-todo">
              <span className="stat-icon">📝</span>
              <div className="stat-num">{todo.length}</div>
              <div className="stat-label">To Do</div>
            </div>
            <div className="stat-card stat-inprogress">
              <span className="stat-icon">⏳</span>
              <div className="stat-num">{inprogress.length}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card stat-done">
              <span className="stat-icon">✅</span>
              <div className="stat-num">{done.length}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card stat-overdue">
              <span className="stat-icon">🚨</span>
              <div className="stat-num">{overdue.length}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>

          {/* TASKS */}
          <div className="section-header">
            <span className="section-title">My Tasks</span>
            <span className="task-count">{tasks.length} total</span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎯</span>
              <p className="empty-text">No tasks yet. {user?.role === 'admin' ? 'Create your first task!' : 'Tasks assigned to you will appear here.'}</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task, i) => {
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
                return (
                  <div key={task.id} className="task-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="task-stripe" style={{ background: statusColor[task.status] || '#6c3aff' }} />
                    <div className="task-title">{task.title}</div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                    <div className="task-meta">
                      {task.project_name && <span className="task-tag tag-project">📁 {task.project_name}</span>}
                      {task.assigned_name && <span className="task-tag tag-user">👤 {task.assigned_name}</span>}
                      {task.due_date && (
                        <span className={`task-tag ${isOverdue ? 'tag-date' : 'tag-date-ok'}`}>
                          📅 {task.due_date}
                        </span>
                      )}
                    </div>
                    <select className="status-select" value={task.status}
  onChange={async e => {
    const newStatus = e.target.value;
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? {...t, status: newStatus} : t));
    } catch(err) {
      alert('Failed to update status. Please try again.');
    }
  }}>
                      <option value="todo">📝 To Do</option>
                      <option value="inprogress">⏳ In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>
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