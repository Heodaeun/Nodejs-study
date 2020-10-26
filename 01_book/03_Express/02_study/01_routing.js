app.get('/', function(req,res) {
    res.render('index.jade');
});


app.post('/post', function(req, res){
    res.render('write.jade', {
        id: req.body.id, 
        name: req.body.name 
    });
})

app.get('/hello/:id', function(req, res) {
    var id = req.params.id;
    
});