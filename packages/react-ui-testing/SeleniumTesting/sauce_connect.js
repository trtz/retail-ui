var sauceConnectLauncher = require('sauce-connect-launcher');
const uuidv1 = require('uuid/v1');
var cmd = require('node-cmd')
var os = require('os')

const tunnelIdentifier = os.hostname();

sauceConnectLauncher({
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier
}, function (err, sauceConnectProcess) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Sauce Connect ready");
});