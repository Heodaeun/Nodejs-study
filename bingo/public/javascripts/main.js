var bingo = {
	is_my_turn: Boolean,
	socket: null,
		
	init: function(socket){
		var self = this;
		var user_cnt = 0;   //접속중인 유저 수. 1명일 때 게임 시작 막기 위해 생성
		
		this.is_my_turn = false;    //초기 bingo.is_my_turn은 false
		
        socket = io();
        
        // 처음 연결되었을 때
		socket.on("connect", function() {
			socket.emit("join", { username: $('#username').val() });
        });
        
        socket.on("game_started", function(data){
			console.log("enter the game_started");
			self.print_msg(data.username + " 님이 게임을 시작했습니다.");
			$("#start_button").hide();
		});
        

        //(data : select_num에서 username: username, num: this.text() 선택한 숫자)
		socket.on("check_number", function (data) {
			self.where_is_it(data.num);
			self.print_msg(data.username + "님이 '" + data.num + "'을 선택했습니다.");
		});
		
        // (data: users, user_count: user_count)
		socket.on("update_users", function (data, user_count) {
			console.log(data);
			user_cnt = user_count;  //클라이언트에서 count 업데이트
			self.update_userlist(data, socket); //유저 리스트 업데이트
		});
		
		var numbers = [];
		for(var i=1; i<=25; i++){
			numbers.push(i);    //1~25 숫자 기입
		}
        
        //숫자 랜덤 배치하기
		numbers.sort(function (a,b) {
			var temp = parseInt(Math.random() * 10);    //랜덤값
			var isOddOrEven = temp%2;
			var isPosOrNeg = temp > 5 ? 1 : -1;
			return (isOddOrEven*isPosOrNeg);
		});
		
		$("table.bingo-board td").each(function (i) {
			$(this).html(numbers[i]);   //랜덤배치한 숫자를 표에 넣음
			
			$(this).click(function (){  //표가 클릭되었을 때
				if(user_cnt == 1){
					self.print_msg("<알림> 최소 2명부터 게임이 가능합니다.");
				}
				else{
					self.select_num(this, socket);
				}
			});
		});
        
        //start 버튼을 눌렀을 때
		$("#start_button").click(function () {
			if(user_cnt == 1){
			   self.print_msg("<알림> 최소 2명부터 게임이 가능합니다.");
			}
			else{
				socket.emit('game_start', { username: $('#username').val() });
				self.print_msg("<알림> 게임을 시작했습니다.");
				$("#start_button").hide();
			}
		});
		
	},
    // init 끝
    

	select_num: function (obj, socket) {   //obj: this(bingo), socket: this.socket
        if(this.is_my_turn && !$(obj).attr("checked")) {    //obj요소의 "checked"속성의 값을 가져옴
        //내 차례 && chcked=false
			//send num to other players
			socket.emit("select", { username: $('#username').val(), num: $(obj).text() });		
			this.check_num(obj);
			
			this.is_my_turn = false;
		}
		else {
			this.print_msg("<알림> 차례가 아닙니다!");
		}
	},
    
    // 선택한 숫자 위치 찾기
	where_is_it: function (num) {
		var self = this;
		var obj = null;
		
		$("table.bingo-board td").each(function (i) {
			if ($(this).text() == num) {
				self.check_num(this);   //찾아서 체크표시함
			}
		});
	},
	
	check_num: function (obj) {
		$(obj).css("text-decoration", "line-through");
		$(obj).css("color", "lightgray");
		$(obj).attr("checked", true);
	},
	
	update_userlist: function (data, this_socket) {
		var self = this;
		$("#list").empty();
		console.log(data);
		
		$.each(data, function (key, value) {
			var turn = "(-) ";  //내 차례가 아닌 경우
			if(value.turn === true) {   //내 차례인 경우
				turn = "(*) ";
				
				if(value.id == this_socket.id ) {
					self.is_my_turn = true;
				}
			}
			if(value.id == this_socket.id){ //리스트에 자신을 표시
				$("#list").append("<font color='DodgerBlue'>" + turn + value.name + "<br></font>");
			}
			else{   //리스트에 상대 표시
				$("#list").append("<font color='black'>" + turn + value.name  + "<br></font>");
			}
		});
	},
	
	
	print_msg: function (msg) { //게임 기록
		$("#logs").append(msg + "<br />");
        $('#logs').scrollTop($('#logs')[0].scrollHeight); //스크롤 가장 아래로
	}
};

$(document).ready(function () {
	bingo.init();
});