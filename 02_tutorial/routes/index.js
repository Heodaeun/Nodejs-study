var express = require('express');
var router = express.Router();
var template = require('../lib/template');

// 1. 홈 페이지
// app.get('/', (req, res) => {  res.send('Hello World!')})
router.get('/', function(request, response){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list,
      `<a href="/topic/create">create</a>`,
      `<h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px"; display:block; margin-top: 10px;>`
    );
    response.send(html);
});

module.exports = router;