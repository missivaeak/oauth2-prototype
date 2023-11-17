var express = require('express');
var router = express.Router();
const { OAuthApp, Octokit } = require('octokit')

const clientId = "ab37ccfd44b552a7f961";
const clientSecret = "1bb0534a49e6243820daddb3e308a33b93b07c2e";
const oauth2Client = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ["user:email"]
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  const response = oauth2Client.getWebFlowAuthorizationUrl({
    redirectUrl: "http://localhost:3000/authcallback"
  })

  res.render('index', { authUrl: response.url });
});

router.get('/authcallback', async function(req, res, next) {
  const result = await oauth2Client.createToken({
    code: req.query.code
  })

  res.render('authcallback', { token: result.authentication.token });
});

router.get('/email', async function(req, res, next) {
  const token = req.query.token;
  const octokit = new Octokit({ auth: token });
  const result = await octokit.request("GET /user/emails");
  console.log(result)
  let primaryEmail = "";
  for (const email of result.data) {
    if (email.primary) {
      primaryEmail = email.email;
    }
  }

  res.render('email', {
    email: primaryEmail
  })
});

module.exports = router;
