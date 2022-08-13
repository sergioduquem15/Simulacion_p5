var n = 5;
var temperatura = 0.5;
x=1;


// ---------------------------------------------
// --------- SET UP - INICIALIZACIÓN ------------
// ---------------------------------------------
function setup() {

  frameRate(1);
  angleMode(DEGREES);
  createCanvas(n*100, n*100);

  primerEstado = new estadoInicial(5);
  console.log("Estado inicial", primerEstado.matixEstadoInicial)
  
  //estadoInicial(initialState, massCenter);
  
}


// ------------------------------------
// --------- LOOP DIBUJAR ------------
// ------------------------------------
function draw() {
  background(220);
  x++;
  ellipse(x,200,10,10);


  // Evolución de Estados
  evol = primerEstado.evolucionar(temperatura)
  console.log(evol)

}



// ------------------------------------
// --------- ESTADO INICIAL ------------
// ------------------------------------
class estadoInicial {

  matixEstadoInicial = [];

  constructor(tamanio) {
    this.n = tamanio;
    // var initialState = [...Array(n)].map(
    //   e => Array(n)
    //   );
    for (let i = 0; i < n; i++) {
      var filas = [];
      for (let j = 0; j < n; j++) {
        filas.push(random([-1, 1]));
      }
      this.matixEstadoInicial.push(filas);
    }
  }

   // Evolucionar el estado Inicial
    evolucionar =  function(T){
    let estadoEvol =  MonteCarlo(this.matixEstadoInicial, 1/T);
    return estadoEvol;
  } 

}


// Modulo entre dos números
function mod(n, m) {
  return ((n % m) + m) % m;
}


// ----------------------------------
// --------- MONTE CARLO ------------
// ----------------------------------
function MonteCarlo(conf, beta){

  var L = conf.length; 
  newConfig = [...conf]; // Copia de la configuracion

  for(let i = 0;i < L; i++){
    for(let j = 0;j < L; j++){

      var a = Math.floor(Math.random() * (L)); // 0,1,2,3,4
      var b = Math.floor(Math.random() * (L));

      var sigma = conf[a][b];

      var config1 = conf[mod((a+1), L) ][b];
      var config2 = conf[a][mod((a+1), L)];
      var config3 = conf[mod((a-1), L)][b];
      var config4 = conf[a][mod((b-1), L)];
      var neighbors = config1 + config2 + config3 + config4;

      var del_E = 2 * sigma * neighbors;

      if(del_E < 0) { 
        sigma *= -1;
      } else if(Math.random() < Math.exp(-1 * del_E * beta)) {
        sigma *= -1;
      }

      newConfig[a][b] = sigma;
    }
  }

  return newConfig;
}



function cmass() {
  var pos = [];
  for(var i=0;i<n;i++){
    pos[i] = (i*100)+50;
  }
  console.log(pos)
  return pos;
}






// -------------------------------------

// function estadoInicial(initialState, massCenter){
//   for(var i=0;i<n;i++){
//     for(var j=0;j<n;j++){
//       var temp_state;
//       if(initialState[i][j] == 1){ temp_state = true }
//       else { temp_state = false }
//       //arr.push(new arrow(massCenter[j],massCenter[i],temp_state));
//       arr.push(new dot(massCenter[j],massCenter[i],temp_state));
//     }
//   }
//   print("initialState", initialState);
// }



// function dot(x,y,status){
//   if(status === true) { 
//     fill(150,20,255);
//     angle = 0;
//    }
//   else {
//     fill(255,20,60);
//     angle = 180;
//    }
//   angleMode(DEGREES);
//   var angle;
  
//   //rotate(0)
//   beginShape();
//   vertex(x,y-20);
//   vertex(x+10,y-20);
//   vertex(x+10,y-30);
//   vertex(x+30,y-15);
//   vertex(x+10,y);
//   vertex(x+10,y-10);
//   vertex(x,y-10);
//   vertex(x,y-20);
//   endShape();
// }

// function arrow(x,y,status){
//   var angle;
//   angleMode("degrees");
//   if(status === true) {angle = 0}
//   else {angle = 180}
  
//   fill(250,80,20);
//   push();
//   translate(x,y);
//   rotate(angle);

//   beginShape();
//   vertex(x,y-20);
//   vertex(x+100,y-20);
//   vertex(x+100,y-60);
//   vertex(x+190,y);
//   vertex(x+100,y+60);
//   vertex(x+100,y+20);
//   vertex(x,y+20);
//   vertex(x,y-20);
//   endShape();
//   pop();
// }

