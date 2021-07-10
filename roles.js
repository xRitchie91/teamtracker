// dependencies
const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const checkInput = require('../../utils/checkInput');

// get command that retrieves the roles in the database
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

