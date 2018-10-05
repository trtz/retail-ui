var sauceConnectLauncher = require('sauce-connect-launcher');
const uuidv1 = require('uuid/v1');
var cmd = require('node-cmd')

const tunnelIdentifier = uuidv1();
cmd.run(`set TUN_ID=${tunnelIdentifier}`);

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
/*
  const processRefPages= await cmd.run(`npm run install-versions --prefix TestPages && npm start --prefix TestPages`);
  const processRefTest = cmd.run(`set TUN_ID=${tunnelIdentifier} && dotnet test ./TestsCore/TestsCore.csproj`);


  process.on('exit', () => {
    sauceConnectProcess.close(function () {
      console.log("Closed Sauce Connect process");
    })
  })*/
});
/*
cmd.get(
  `npm run install-versions --prefix TestPages && npm start --prefix TestPages`,
  function(err, data, stderr){
    if (err){
      console.log(err);
    }
    console.log(data);
  }
)*/