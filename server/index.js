const express = require('express');
const path = require('path');
const indexRouter = require('./router.js');
const port = 3000;

const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`listening to port ${port}...`);
});