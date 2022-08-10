var arr = [];
var n = 20;
let dragX,dragY,moveX,moveY;
function setup() {
  angleMode(DEGREES);
  var cm = cmass();
  var ai = init();

  createCanvas(n*100, n*100);
  for(var i=0;i<n;i++){
    for(var j=0;j<n;j++){
      var temp_state;
      if(ai[i][j] == 1){ temp_state = true }
      else { temp_state = false }
      //arr.push(new arrow(cm[j],cm[i],temp_state));
      arr.push(new dot(cm[j],cm[i],temp_state));
    }
  }
  print(ai);
  print(cm);
}

function init() {
  var ai = [...Array(n)].map(e => Array(n));
  var choice = [1,-1];
  for(var i=0;i<n;i++){
    for(var j=0;j<n;j++){
      ai[i][j] = random(choice);
    }
  }
  return ai;
}

function cmass() {
  var pos = [];
  for(var i=0;i<n;i++){
    pos[i] = (i*100)+50;
  }
  return pos;
}

function draw() {
  //background(220);
  for(var k=0;k<=5;k++){
    arr[k]; 
  }
  //arrow(100,100,true);
}

function dot(x,y,status){
  if(status === true) { 
    fill(150,20,255);
    angle = 0;
   }
  else {
    fill(255,20,60);
    angle = 180;
   }
  angleMode(DEGREES);
  var angle;
  
  //rotate(0)
  beginShape();
  vertex(x,y-20);
  vertex(x+10,y-20);
  vertex(x+10,y-30);
  vertex(x+30,y-15);
  vertex(x+10,y);
  vertex(x+10,y-10);
  vertex(x,y-10);
  vertex(x,y-20);
  endShape();
}

function arrow(x,y,status){
  var angle;
  angleMode("degrees");
  if(status === true) {angle = 0}
  else {angle = 180}
  
  fill(250,80,20);
  push();
  translate(x,y);
  rotate(angle);

  beginShape();
  vertex(x,y-20);
  vertex(x+100,y-20);
  vertex(x+100,y-60);
  vertex(x+190,y);
  vertex(x+100,y+60);
  vertex(x+100,y+20);
  vertex(x,y+20);
  vertex(x,y-20);
  endShape();
  pop();
}

