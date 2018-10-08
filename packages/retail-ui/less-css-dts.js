const DtsCreator = require('typed-css-modules');
const less = require('less');
const fs = require('fs');
let creator = new DtsCreator();
const path = './Button/Button.less';
less
  .render(fs.readFileSync(path, 'utf-8'), { filename: path })
  .then(output => creator.create(path, output.css))
  .then(content => content.writeFile());
