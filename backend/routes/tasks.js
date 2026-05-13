const router = require('express').Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/dashboard', (req, res) => {
  db.all(`SELECT t.*, u.name as assigned_name, p.name as project_name FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assigned_to = ? OR t.created_by = ?`,
    [req.user.id, req.user.id],
    (err, rows) => res.json(rows || []));
});

router.get('/project/:projectId', (req, res) => {
  db.all(`SELECT t.*, u.name as assigned_name FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.project_id = ?`,
    [req.params.projectId],
    (err, rows) => res.json(rows || []));
});

router.post('/', (req, res) => {
  const { title, description, due_date, project_id, assigned_to } = req.body;
  db.run(`INSERT INTO tasks (title, description, due_date, project_id, assigned_to, created_by)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, due_date, project_id, assigned_to, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, status: 'todo' });
    });
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  db.run('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id],
    (err) => res.json({ success: !err }));
});

router.delete('/:id', (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Only admins can delete tasks' });
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id],
    (err) => res.json({ success: !err }));
});

module.exports = router;