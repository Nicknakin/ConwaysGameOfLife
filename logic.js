class Cell{
  constructor(x, y){
	  this.x = x;
	  this.y = y;
	  this.state = 0;
	  this.newState = 0;
  }

  update(){
	  this.state = this.newState;
  }
}

var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

canvas.addEventListener('click', on_canvas_click, false);

var width = 31;
var height = 35;

var Hz = 60;

var cellSize = 40;

var cells = new Array(height);
for(i = 0; i < height; i++){
  cells[i] = new Array(width);
  for(k = 0; k < width; k++){
	  cells[i][k] = new Cell(k*cellSize, i*cellSize);
  }
}

var interval;
var active = true;

function main(){
  randomize();
  interval = setInterval(activeLoop, 1000/Hz);
}

function randomize(){
  for(i = 0; i < width*height; i++){
	  var x = Math.floor(Math.random() * width);
	  var y = Math.floor(Math.random() * height);
	  cells[y][x].newState = Math.round(Math.random());
	  cells[y][x].update();
  }
}

function activeLoop(){
  for(i = 0; i < height; i++){
	  for(k = 0; k < width; k++){
		  setNextState(k, i);
	  }
  }
  
  draw();
}

function draw(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,width*cellSize, height*cellSize);
  for(i = 0; i < height; i++){
	  for(k = 0; k < width; k++){
		  cells[i][k].update();
		  ctx.fillStyle = (cells[i][k].state == 1)? "white": "gray";
		  ctx.fillRect(cells[i][k].x+1, cells[i][k].y+1, cellSize-2, cellSize-2);
	   }
  }
}

function setNextState(k, i){
  let surr = 0;
  for(y = i-1; y <= i+1; y++){
	  for(x = k-1; x <= k+1; x++){
		  if(!(y == i && x == k)){
			  if(cells[(y+height)%height][(x+width)%width].state == 1)
				  surr++;
		  }
	  }
  }
  if(cells[i][k].state){
	  if(surr < 2){
		  cells[i][k].newState = 0;
	  } else if(surr < 4){
		  cells[i][k].newState = 1;
	  } else{
		  cells[i][k].newState = 0;
	  }
  } else {
	  if(surr == 3){
		  cells[i][k].newState = 1;
	  } else {
		  cells[i][k].newstate = 0;
	  }
  }
}

function togglePlay(){
	if(!active) {
		interval = setInterval(activeLoop, 1000/Hz);
	} else {
		interval = clearInterval(interval);
	}
	active = !active;
}

document.onkeydown = function(event){
	if(event.keyCode === 32)
		togglePlay();
	if(event.keyCode === 68 || event.keyCode === 39)	//d
		if(!active) activeLoop();
}


function on_canvas_click(ev) {
	let x = Math.floor(ev.clientX/cellSize);
	let y = Math.floor(ev.clientY/cellSize);
	
	cells[y][x].newState = !cells[y][x].state;
	cells[y][x].update();
	draw();
}

main();
