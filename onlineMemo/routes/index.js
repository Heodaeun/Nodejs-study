var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbUser:6331@cluster0.jcc4d.mongodb.net/dbname?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection; //데이터베이스가 연결되면 mongoose.connection 인스턴스가 생성된다
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { //데이터베이스가 연결되면 "open"이벤트가 발생
	console.log("DB connected");
});

var Schema = mongoose.Schema;
//모델 정의하기.
var Memo = new Schema({ 
	author: String,
	contents: String,
	date: Date
});

var memoModel = mongoose.model('Memo', Memo); //모델 접근하기 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/load', function(req, res, next) {
	memoModel.find({}, function(err, data){
		res.json(data);
	});
});

//(1) 생성
router.post('/write', function(req,res,next) {
	var author = req.body.author;
	var contents = req.body.contents;
	var date = Date.now();
	
	var memo = new memoModel(); //생성한 모델의 인스턴스를 생성 -> 실제 데이터베이스 작업 수행
	
	memo.author = author;
	memo.contents = contents;
	memo.date = date;
	memo.comments = [];
	
  //생성한 메모를 컬렉션에 저장함
	memo.save(function (err) {
		if (err) {
			throw err;
		}
		else {
			res.json({status: "SUCCESS"});
		}
	});
});

// (2) 삭제
router.post('/del', function(req, res, next) {
  var _id = req.body._id;
  //특정 도큐먼트 하나만 삭제
	memoModel.deleteOne({_id: _id}, function(err, result) {
		if(err) {
			throw err;
		}
		else {
			res.json({status: "SUCCESS"});
		}
	});
});

// (3) 수정
router.post('/modify', function(req, res, next) {
	var _id = req.body._id;
	var contents = req.body.contents;
  
  //메모 찾기
	memoModel.findOne({_id: _id}, function(err, memo) {
		if(err) {
			throw err;
		}
		else {
      //찾은 메모를 수정함
			memo.contents = contents;
			//컬렉션에 메모 저장
			memo.save(function (err) {
				if (err) {
					throw err;
				}
				else {
					res.json({status: "SUCCESS"});
				}
			});
		}
	});
});

module.exports = router;