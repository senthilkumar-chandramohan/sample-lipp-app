var express = require('express');
var app = express();
var axios = require('axios');
var querystring = require('querystring');

var port = process.env.PORT || 3000;

app.get('/privacy', function(req, res) {
  res.send('Privacy Policy');
});

app.get('/ua', function(req, res) {
  res.send('User Agreement');
});

app.get('/return', (req, res) => {
  const requestToken = req.query.code; // Auth code is request token
  
  var clientID = '<PASTE_CLIENT_ID_HERE>';
  var secret = '<PASTE_CLIENT_SECRET_HERE>';
  var authString = new Buffer(clientID + ':' + secret).toString('base64');

	axios({
		method: 'POST',
    url: `https://api.sandbox.paypal.com/v1/oauth2/token`,
    headers: {
      'Authorization': `Basic ${authString}`
    },
    data: querystring.stringify({
      'grant_type': 'authorization_code',
      'code': requestToken
    })
	}).then((response) => {
    const accessToken = response.data.access_token;
    res.redirect(`/info.html?access_token=${accessToken}`);
    // (OR) do an axios call using accessToken here to https://api.sandbox.paypal.com/v1/identity/oauth2/userinfo?schema=paypalv1.1
    // and store user info in DB
  })
  .catch((error) => {
    res.send(error);
  });
});

app.use(express.static(__dirname + '/public'));
app.listen(port, function() {
  console.log('Server listening on port...');
});
