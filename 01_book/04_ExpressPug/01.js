var express = require('express');
var app = express();

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'pug');
app.listen(3000, () => {
  console.log("Server has been started");
});

// Pug 파일 렌더링
app.get("/", (req, res) => {
  res.render('01', { title: 'title'});
});