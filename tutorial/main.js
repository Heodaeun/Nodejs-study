var http = require('http');
var url = require('url');
var fs = require('fs');

function templateHTML(title, list, body) {
  var template = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
  return template;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){

        fs.readdir('./data', function(err, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
          response.writeHead(200);  //200: 파일을 성공적으로 전송하였음
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(err, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200);  //200: 파일을 성공적으로 전송하였음
            response.end(template);
          });
        });
      }
    }else{
      response.writeHead(404);  //404: 파일을 찾을 수 없음
      response.end('Not found');
    }
});
app.listen(3000);
