var d;

var arr = [];
function setup() {
  createCanvas(400, 400);
  var d = init();
  for(var i=0;i<5;i++){
    for(var j=0;j<5;j++){
      if (d[i][j] == 1){ arr.push(new MagnDipole(40*i,40*j,2, 0)) }
      else if (d[i][j] == -1) { arr.push(new MagnDipole(40*i,40*j,2, 180))}
    }
  }
  //print(Math.floor(Math.random() * (5+1)));
  //print(d);
  //var dd = MC(d,0.01);
  //print(dd);
}

function init() {
  var mic = [1,-1];
  var arr = [[],[],[],[],[]];
  for(var i=0;i<5;i++){
    for(var j=0;j<5;j++){
      arr[i][j] = random(mic);
    }
  }
  return arr;
}

function draw() {
  background(220);
  fill(200,15,30);
  //for(var i=0;i<arr.length;i++){
  //  arr[i].update();
  //}
  MagnDipole(x,y,20)
}

function MC(conf,beta){
  print(conf);
  var L = conf.length; // 5
  for(var i=0;i<L;i++){
    for(var j=0;j<L;j++){
      var a = Math.floor(Math.random() * (L+1)); // 0 1 2 3 4 5
      var b = Math.floor(Math.random() * (L+1));
      var sigma = conf[a][b];
      var neighbors = conf[(a+1)%L][b] + conf[a][(b+1)%L] + conf[(a-1)%L][b] + conf[a][(b-1)%L];
      var del_E = 2*sigma*neighbors;
      print(sigma);
      print(neighbors);
      print(Math.exp(-del_E*beta));
      print(Math.random() < Math.exp(-del_E*beta));
      print("---");
      if(del_E < 0) { sigma *= -1;}
      else if(Math.random() < Math.exp(-del_E*beta)) {sigma *= -1;}
      print(sigma);
      print("***")
      conf[a][b] = sigma;
    }
  }
  return conf;
}

// magnetic_dipole class:
function MagnDipole(x,y,length){
  this.x = x;
  this.y = y;
  this.length = length;
  //angle = atan2(mouseY-y,mouseX-x);

  angleMode(DEGREES);  

  this.update = function(){
    push();
    translate(this.x+40,this.y+20);
    rotate(angle);

    beginShape();
    vertex(0, -this.length);
    vertex(5*this.length,-this.length);
    vertex(5*this.length,-3*this.length);
    vertex(9*this.length,0);
    vertex(5*this.length,3*this.length);
    vertex(5*this.length,this.length);
    vertex(0,this.length);
    vertex(0,-this.length);
    endShape(CLOSE);
    pop();
  }
}
