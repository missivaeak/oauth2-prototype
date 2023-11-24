var express = require('express');
var router = express.Router();



router.get('/authcallback', async function(req, res, next) {
  const code = req.query.code;
  const state = req.query.state;

  const response = await fetch(`http://localhost:1337/customer/auth`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code, state }),
    redirect: 'follow'
  });
  const result = await response.json();

  console.log(result);

  res.render('authcallback', { oAuthToken: result.data.authentication.token ?? "failed" });
});

router.get('/jwt', async function(req, res, next) {
  const oAuthToken = req.query.token;
  const response = await fetch(`http://localhost:1337/customer/token`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      oAuthToken
    }),
    redirect: 'follow'
  });
  let result;

  try {
    result = await response.json()
  } catch (error) {
    console.error(error);
  }

  res.render('jwt', { data: result?.data ?? "failed" });
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  const response = await fetch("http://localhost:1337/customer/auth?redirectUrl=http://localhost:3000/authcallback");
  const result = await response.json();

  res.render('index', { authUrl: result.data.url });
});

module.exports = router;
