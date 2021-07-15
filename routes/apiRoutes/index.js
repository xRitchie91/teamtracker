const express = require('express');
const router = express.Router();

router.use(require('./employees'))
router.use(require('./roles'))
router.use(require('./departments'))

module.exports = router;