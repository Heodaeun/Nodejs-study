var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');

//3. Create 버튼 클릭 시 페이지
router.get('/create', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.html(title, list,
      '',
      `
      <form action="/topic/create" method="post">
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
    response.send(html);
  });
  
//4. create>제출 버튼 클릭 시 페이지
router.post('/create', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8',
    function(err) {
        response.redirect(`/topic/${title}`);
    });
});
  
//5. update 버튼 클릭 시 페이지
router.get('/update/:pageId', function(request, response){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.html(title, list,
        //form 부분
        `
        <form action="/topic/update" method="post">
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
        response.send(html);
    });
});
  
//6. update>제출 버튼 클릭 시 페이지
router.post('/update', function(request, response){
    console.log(request.list);
    var post=  request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf8',
        function(err) {
        response.redirect(`/topic/${title}`);
        });
    });
})

//7. delete 버튼 클릭 시 페이지
router.post('/delete_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
        response.redirect('/');
    });
})

// 2. pageId 링크 클릭 시 페이지
router.get('/:pageId', function(request, response, next){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
        next(err);
        }else{
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description);
        var list = template.list(request.list);
        var html = template.html(sanitizedTitle, list,
            `<a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
            </form>
            `,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`);
        response.send(html);
        }
    });
});

module.exports = router;