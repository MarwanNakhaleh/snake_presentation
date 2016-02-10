$(document).ready(function(){

	$("a").click(function(event){
		alert("You can't click this link!");
		event.preventDefault();
	});

	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	var cell_width = 20;
	var direction;
	var food;
	var score;
	var snake_array;
	
	function init(){
		direction = "right"; 
		create_snake();
		create_food();
		score = 0;
		
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 100);
	}

	init();
	
	function create_snake(){
		var length = 6;
		snake_array = [];
		for(var i = length-1; i>=0; i--){ 
			snake_array.push({x: i, y:0});
		}
	}
	
	function create_food(){
		food = {
			x: Math.round(Math.random()*(w-cell_width)/cell_width), 
			y: Math.round(Math.random()*(h-cell_width)/cell_width), 
		};
	}
	
	function paint(){
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		if(direction == "right") nx++;
		else if(direction == "left") nx--;
		else if(direction == "up") ny--;
		else if(direction == "down") ny++;

		if(nx == -1 || nx == w/cell_width || ny == -1 || ny == h/cell_width || check_collision(nx, ny, snake_array)){
			init();
			return;
		}
		
		if(nx == food.x && ny == food.y){
			var tail = {x: nx, y: ny};
			score++;
			create_food();
		}else{
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}
		
		snake_array.unshift(tail);
		
		for(var i = 0; i < snake_array.length; i++){
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		paint_cell(food.x, food.y);
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}

	function paint_cell(x, y){
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
	}
	
	function check_collision(x, y, arr){
		for(var i = 0; i < arr.length; i++){
			if(arr[i].x == x && arr[i].y == y) return true;
		}
		return false;
	}
	
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";
	});
});