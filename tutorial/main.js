const express = require('express')
const fs = require('fs');
const template = require('./lib/template');
const app = express()
const port = 3000

// app.get('/', (req, res) => {  res.send('Hello World!')})
app.get('/', function(request, response){
  fs.readdir('./data', function(err, filelist){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.html(title, list,
      `<a href="/create">create</a>`,
      `<h2>${title}</h2>${description}`
    );
    response.send(html);
  });
});

app.get('/page', function(req, res){
  return res.send('/page')
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
/*
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('qs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname
    console.log(pathname);
    if(pathname === '/'){
      // 1. home 페이지
      if(queryData.id === undefined){
        fs.readdir('./data', function(err, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.html(title, list,
            `<a href="/create">create</a>`,
            `<h2>${title}</h2>${description}`);
          response.writeHead(200);  //200: 파일을 성공적으로 전송하였음
          response.end(html);
        });
      // 2. id값을 선택한 page
      } else {
        fs.readdir('./data', function(err, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);
            var list = template.list(filelist);
            var html = template.html(title, list,
              `<a href="/create">create</a>
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="delete_process" method="post" onsubmit="blarblar">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>
              `,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`);
            response.writeHead(200);  //200: 파일을 성공적으로 전송하였음
            response.end(html);
          });
        });
      }
    // 3. create 버튼을 누른 페이지
    }else if(pathname === '/create') {
      fs.readdir('./data', function(err, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.html(title, list,
          '',
          `
          <form action="/create_process" method="post">
            <p><input type="text" name="title"
              placeholder="title">
            </p>
            <p>
              <textarea name="description"
              placeholder="description"></textarea>
            </p>
            <p><input type="submit"></p>
          </form>
        `);
        response.writeHead(200);  //200: 파일을 성공적으로 전송하였음
        response.end(html);
      });
    // 4. create button을 눌러 데이터를 제출한 페이지
    }else if(pathname === "/create_process"){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8',
        function(err) {
          response.writeHead(302, {Location: `/?id=${title}`});  //302: redirection. 수정된 페이지로 이동
          response.end();
        });
      });
    // 5. update 버튼을 누른 페이지
    }else if(pathname == '/update'){
      fs.readdir('./data', function(err, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.html(title, list,
            //form 부분
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value=${title}>
              <p><input type="text" name="title"
                placeholder="title" value="${title}">
              </p>
              <p>
                <textarea name="description"
                placeholder="description">${description}</textarea>
              </p>
              <p><input type="submit"></p>
            </form>
            `,
            ``);
          response.writeHead(200);  //200: 파일을 성공적으로 전송하였음
          response.end(html);
        });
      });
    //6. update 페이지에서 제출 버튼을 누른 페이지
    }else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        // title, description 뿐 아니라 name="id"값도 받아야 한다.
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(err){
          fs.writeFile(`data/${title}`, description, 'utf8',
          function(err) {
            response.writeHead(302, {Location: `/?id=${title}`}); //302: redirection. 수정된 페이지로 이동
            response.end();
          });
        });
      });
    // 7. delete 버튼을 눌렀을 때
    }else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        // id만 받으면 된다
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });
    // 8. 그 외 페이지
    }else{
      response.writeHead(404);  //404: 파일을 찾을 수 없음
      response.end('Not found');
    }
});
app.listen(3000);
*/