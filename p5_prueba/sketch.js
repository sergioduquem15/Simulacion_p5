//var temperatura = 0.5;
tamanio = 10;
WIDTH = tamanio * 100;
HEIGHT = tamanio * 100;

let temperatura; 
let valTemp = 100;


// ---------------------------------------------
// --------- SET UP - INICIALIZACIÓN ------------
// ---------------------------------------------
function setup() {

  frameRate(1);
  createCanvas(WIDTH, HEIGHT);

  temperatura = createSlider(0, 100,valTemp, 0.1); 
  temperatura.position(10,10); 
  temperatura.style('width', '20%');

  primerEstado = new estadoInicial(tamanio);
  primerEstado.dibujar();

  console.log("Estado inicial", primerEstado.matixEstadoInicial);
  
}


// ------------------------------------
// --------- LOOP DIBUJAR ------------
// ------------------------------------
function draw() {
	background(220);
  
  valTemp = temperatura.value(); 

  // Evolución de Estados
	primerEstado.evolucionar(valTemp);
  primerEstado.dibujar();
  fill(0);
  text("Temperatura: "+nfc(valTemp), 150, 35);

  //console.log(primerEstado.matixEstadoInicial)

  }

// ------------------------------------
// --------- ESTADO INICIAL ------------
// ------------------------------------
class estadoInicial {

	matixEstadoInicial = [];
  
	constructor(tamanio) {
	  this.n = tamanio;
	  for (let i = 0; i < this.n; i++) {
		var filas = [];
		for (let j = 0; j < this.n; j++) {
		  filas.push(random([-1, 1]));
		}
		this.matixEstadoInicial.push(filas);
	  }
	}

  evolucionar =  function(T){
		this.matixEstadoInicial =  MonteCarlo(this.matixEstadoInicial, 1/T);
	  } 
	
	dibujar = function(){
		var arr = [];
		var cm = cmass(this.n);
		
    for(var i=0;i<this.n;i++){
			for(var j=0;j<this.n;j++){
				var temp_state;
				if(this.matixEstadoInicial[i][j] == 1){ temp_state = true }
				else { temp_state = false }
				arr.push(new dot(cm[j],cm[i],temp_state));
			}
		}
		return arr;
	}
	
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
  


// CENTRO DE MASA
function cmass(n) {
  var pos = [];
  for(var i=0;i<n;i++){
    pos[i] = (i*100);
  }
  return pos;
}

  
  
// Módulo entre dos números
function mod(n, m) {
	return ((n % m) + m) % m;
  }


function dot(x,y,status){
  if(status === true) { 
    fill(255,200,100);
    // angle = 0;
   }
  else {
    fill(0,255,255);
    // angle = 180;
   }
  // angleMode(DEGREES);
  // var angle;
  
  square(x,y,100);

  //rotate(0)
  // beginShape();
  // vertex(x,y-20);
  // vertex(x+10,y-20);
  // vertex(x+10,y-30);
  // vertex(x+30,y-15);
  // vertex(x+10,y);
  // vertex(x+10,y-10);
  // vertex(x,y-10);
  // vertex(x,y-20);
  // endShape();
 

}
 
