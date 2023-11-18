var express = require('express');
var router = express.Router();
const { OAuthApp, Octokit } = require('octokit')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const response = await fetch("http://localhost:1337/customer/authurl");
  const result = await response.json();

  res.render('index', { authUrl: result.data.url });
});

router.get('/authcallback', async function(req, res, next) {
  const code = req.query.code;
  const state = req.query.state;
  const response = await fetch(`http://localhost:1337/customer/auth?code=${code}&state=${state}`);
  const result = await response.json();

  res.render('authcallback', { oAuthToken: result.authentication?.token ?? "failed" });
});

router.get('/jwt', async function(req, res, next) {
  const token = req.query.token;
  const response = await fetch(`http://localhost:1337/customer/token?token=${token}`);
  let result;

  try {
    result = await response.json()
    console.log(result)
  } catch (error) {
    console.error(error);
  }

  res.render('jwt', { data: result?.data ?? "failed" });
});

module.exports = router;
