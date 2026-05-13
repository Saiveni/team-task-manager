const router = require('express').Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', (req, res) => {
  const projects = db.prepare(`
    SELECT DISTINCT p.* FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = ? OR pm.user_id = ?
  `).all(req.user.id, req.user.id);
  res.json(projects);
});

router.post('/', (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Only admins can create projects' });
  const { name, description } = req.body;
  const result = db.prepare('INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)')
    .run(name, description, req.user.id);
  res.json({ id: result.lastInsertRowid, name, description, owner_id: req.user.id });
});

router.post('/:id/members', (req, res) => {
  const { user_id } = req.body;
  db.prepare('INSERT OR IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)')
    .run(req.params.id, user_id);
  res.json({ success: true });
});

router.get('/:id/members', (req, res) => {
  const members = db.prepare(`
    SELECT u.id, u.name, u.email, u.role FROM users u
    JOIN project_members pm ON u.id = pm.user_id
    WHERE pm.project_id = ?
  `).all(req.params.id);
  res.json(members);
});

router.get('/users/all', (req, res) => {
  const users = db.prepare('SELECT id, name, email, role FROM users').all();
  res.json(users);
});

module.exports = router;