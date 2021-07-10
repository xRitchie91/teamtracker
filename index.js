const express = require('express');
const router = express.Router();

router.use(require('./routes/apiRoutes/employees'))
router.use(require('./routes/apiRoutes/roles'))
router.use(require('./routes/apiRoutes/department'))

module.exports = router;