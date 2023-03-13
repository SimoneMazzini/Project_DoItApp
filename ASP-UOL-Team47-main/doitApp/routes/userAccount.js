const express = require('express');
const router = express.Router();
const users =require('./users');

/* GET user account page. */
router.get('/', (req, res, next) => {
  res.render('userAccount', { title: 'Account' });
});
  
module.exports = router;