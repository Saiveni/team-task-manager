const router = require('express').Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/dashboard', (req, res) => {
  const tasks = db.prepare(`
    SELECT t.*, u.name as assigned_name, p.name as project_name FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assigned_to = ? OR t.created_by = ?
  `).all(req.user.id, req.user.id);
  res.json(tasks);
});

router.get('/project/:projectId', (req, res) => {
  const tasks = db.prepare(`
    SELECT t.*, u.name as assigned_name FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.project_id = ?
  `).all(req.params.projectId);
  res.json(tasks);
});

router.post('/', (req, res) => {
  const { title, description, due_date, project_id, assigned_to } = req.body;
  const result = db.prepare(`
    INSERT INTO tasks (title, description, due_date, project_id, assigned_to, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, description, due_date, project_id, assigned_to, req.user.id);
  res.json({ id: result.lastInsertRowid, title, status: 'todo' });
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Only admins can delete tasks' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;