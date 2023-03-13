const express = require('express');
const router = express.Router();
const users = require('./users');

/* GET about page. */
router.get('/', (req, res, next) => {
    res.render('about', { title: 'About' });
  });
  
module.exports = router;