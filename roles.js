// dependencies
const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const checkInput = require('../../utils/checkInput');

// get retrieves roles 
router.get('/roles', (req, res) => {
  const sql = `SELECT roles.*, departments.dept_name FROM roles LEFT JOIN departments ON roles.dept_id = departments.id;`

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
})

// create command that creates a role and adds it to the database
router.post('/role', ({ body }, res) => {
  const errors = checkInput(body, 'title', 'salary', 'dept_id')
  if (errors) {
    res.json({ error: errors });
    return
  }
  const sql = `INSERT INTO roles (title, salary, dept_id) VALUES (?,?,?)`;
  const params = [body.title, body.salary, body.dept_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({
        error: err.message
      })
    }
    res.json({
      message: 'Role added successfully!',
      data: body
    })
  })
})

// deletes selected role
router.delete('/role/:id', (req, res) => {
  const sql = `DELETE FROM roles WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.json({ error: err.message });
      return
    }
    else if (!result.affectedRows) {
      res.json({ message: 'Role was not found.' })
    }
    else {
      res.json({
        message: 'Role was successfully deleted and removed from db.',
        changes: result.affectedRows,
        id: req.params.id
      })
    }
  })
})

module.exports = router;