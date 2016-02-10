$(document).ready(function(){

	$("a").click(function(event){
		alert("You can't click this link!");
		event.preventDefault();
	});

	// I'm about to comment liberally as notes to myself on when and how to describe everything

	var canvas = $("#canvas")[0]; // access the element with id of canvas, and [0] gets the first canvas, which is just our canvas
	var ctx = canvas.getContext("2d"); // get context is nevessary to manipulate the canvas
	var w = $("#canvas").width(); // width and height needed to manipulate canvas and its objects
	var h = $("#canvas").height();

	var cell_width = 10; //each cell that the snake can move will be ten pixels wide
	var direction; // simplifies changing direction
	var food; // snake food
	var score; // how many foods the snake has eaten
	var snake_array; // this is where the body of the snake is stored
	
	function init(){
		direction = "right"; // the snake will begin by moving right 
		create_snake(); // build the snake upon init
		create_food(); // create a food item
		score = 0; // set initial score to 0
		
		if(typeof game_loop != "undefined") clearInterval(game_loop); // if there is no game, clear the game loop
		game_loop = setInterval(paint, 50); // game loop repaints the canvas every 50 milleseconds
	}

	init(); // start the game
	
	function create_snake(){
		var length = 6; // snake is six blocks long
		snake_array = []; // initialize empty array for snake
		for(var i = length-1; i>=0; i--){ // push coordinates for each block
			snake_array.push({x: i, y:0});
		}
	}
	
	// put the food in a random place on the canvas at x and y coordinates that are divisible by the cell width
	function create_food(){
		food = {
			x: Math.round(Math.random()*(w-cell_width)/cell_width), 
			y: Math.round(Math.random()*(h-cell_width)/cell_width), 
		};
	}
	
	function paint(){
		// paint the canvas white with a black border
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		// x and y coordinates of the snake's head
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		// manipulate coordinates based on direction
		if(direction == "right") nx++;
		else if(direction == "left") nx--;
		else if(direction == "up") ny--;
		else if(direction == "down") ny++;
		
		// if the snake hits a wall or the snake hits itself, restart the game
		if(nx == -1 || nx == w/cell_width || ny == -1 || ny == h/cell_width || check_collision(nx, ny, snake_array)){
			init();
			return;
		}
		
		// if the snake's head reaches the food's coordinates, we want to add the food to the beginning of the snake body, increment the score, and recreate food
		if(nx == food.x && ny == food.y){
			var tail = {x: nx, y: ny};
			score++;
			create_food();
		}else{
			var tail = snake_array.pop(); //moves the tail forward
			tail.x = nx; tail.y = ny;
		}
		
		snake_array.unshift(tail); // regardless, adds tail, empty or not, to the beginning of the snake
		
		// paints the snake at its new coordinates
		for(var i = 0; i < snake_array.length; i++){
			var c = snake_array[i];
			paint_cell(c.x, c.y);
		}
		
		// paints the cell for the food, created by the create_food function
		paint_cell(food.x, food.y);
		var score_text = "Score: " + score; // paints the score
		ctx.fillText(score_text, 5, h-5); // paints the score at the bottom left side of the screen
	}

	// paint the cell
	function paint_cell(x, y){
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
	}
	
	// check if the snake has collided with itself
	function check_collision(x, y, arr){
		for(var i = 0; i < arr.length; i++){
			if(arr[i].x == x && arr[i].y == y) return true;
		}
		return false;
	}
	
	// key bindings
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";
	});
});