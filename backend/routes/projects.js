const router = require('express').Router();
const db = require('../database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', (req, res) => {
  db.all(`SELECT DISTINCT p.* FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = ? OR pm.user_id = ?`,
    [req.user.id, req.user.id],
    (err, rows) => res.json(rows || []));
});

router.post('/', (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Only admins can create projects' });
  const { name, description } = req.body;
  db.run('INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)',
    [name, description, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, description, owner_id: req.user.id });
    });
});

router.post('/:id/members', (req, res) => {
  const { user_id } = req.body;
  db.run('INSERT OR IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)',
    [req.params.id, user_id],
    (err) => res.json({ success: !err }));
});

router.get('/:id/members', (req, res) => {
  db.all(`SELECT u.id, u.name, u.email, u.role FROM users u
    JOIN project_members pm ON u.id = pm.user_id
    WHERE pm.project_id = ?`,
    [req.params.id],
    (err, rows) => res.json(rows || []));
});

router.get('/users/all', (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [],
    (err, rows) => res.json(rows || []));
});

module.exports = router;