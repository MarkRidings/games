const express = require('express');
const path = require('path');
const open = require('open');

const PORT = process.env.PORT || 5001;

const app = express();

app.use('/', express.static(path.join(__dirname, "/dist")));
// app.use(express.static(path.join(__dirname, 'node_modules/core-js/**/*')));
// app.use(express.static(path.join(__dirname, 'node_modules/zone-js/**/*')));
// app.use(express.static(path.join(__dirname, 'node_modules/systemjs/**/*')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT,  function (err) {
  if (err) {
    console.log('err');
  }
  else {
    console.log(`server listening on port ${PORT}`);
  }
});
