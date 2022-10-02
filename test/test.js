const { $e, $s, $f } = require('../bin/compiled.js');

async function myFunction() {
  let myObject = $e('bash test.sh').offerstdin('Andrew').execute();
  console.log((await myObject.waitUntilFinished()).stdout);
}

myFunction();
