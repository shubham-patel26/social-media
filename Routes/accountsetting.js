const express = require('express');
const router = express.Router();
const db = require('../Database/getQuery');
const pool = require('../Database/pool');
const showpost = require('./showpost');
var bCrypt = require('bcrypt');
var authenticate = require('../authenticate');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

/*
    name
    fb link
    linkedin link
    intro
*/


module.exports = router;