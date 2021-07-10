const express = require('express');
const router = express.Router();

router.use(require('../../apiRoutes/employees'))
router.use(require('../../apiRoutes/roles'))
router.use(require('../../apiRoutes/department'))

module.exports = router;