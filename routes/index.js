var express = require('express');
var router = express.Router();
var fun = require('../functions')
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

/* GET home page. */

router.get('/', async function (req, res) {
  res.render('index')
});
router.get('/view', async function (req, res) {
  await axios.get('https://webifly-app.herokuapp.com/db')
  .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    var data = $.html()
    console.log(data);
    
    var webcontent = data
    var path = 'views/created/hello.hbs'
    fs.appendFile(path, webcontent, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

  })

  res.render('created/hello')
});


router.get('/db', async function (req, res) {
  var webdata = await db.get().collection('websites').find().toArray()
  let web = webdata[0]
  let code = web.code
  let data = web.data
  res.render('db',{code,data})
});
router.post('/', function (req, res) {
  let content = req.body
  console.log(content);
  let code = { navbar: false, form: false }
  let data = {}
  if (content.navbar === 'on') {
    code.navbar = true
    data.navbar = {
      color: content.color,
      heading: content.heading,
      li1: content.li1,
      li2: content.li2,
      li3: content.li3,
      li4: content.li4
    }
  }
  if (content.form === 'on') {
    code.form = true
  }
  let obj = {
    code:code,data:data
  }

  db.get().collection('websites').insertOne(obj)

  res.render('created', { code, data })
    
});

module.exports = router;
