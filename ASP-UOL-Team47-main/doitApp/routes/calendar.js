const express = require('express');
const router = express.Router();
const users =require('./users');

/* GET calendar page. */
router.get('/', (req, res, next) => {
    res.render('calendar', { title: 'Calendar' });
  });
  
module.exports = router;