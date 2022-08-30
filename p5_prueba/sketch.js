let temperatura; 
let avmagn;
let magn;
let valTemp = 100; 
let magtx;
let apagar;
let encender;
let plot;
let x = 0.1;
tamanio = 10; // numero de paticulas

dimensiones = 50;
WIDTH = tamanio * dimensiones + 600;
HEIGHT = tamanio * dimensiones + 100;



// ---------------------------------------------
// --------- SET UP - INICIALIZACIÓN ------------
// ---------------------------------------------
function setup() {
  frameRate(3); 
  createCanvas(WIDTH, HEIGHT);
  
  
  
  //temperatura = createSlider(0, 7,valTemp, 0.1); 
  //temperatura.position(10,10); 
  //temperatura.style('width', '20%');

  primerEstado = new estadoInicial(tamanio);
  primerEstado.dibujar();
  
  plot = new GPlot(this, 570, 0,500,500);
  plot.setTitleText("Promedio de la magnetizacion vs temperatura");
  plot.getXAxis().setAxisLabelText("Temperatura [K]");
  plot.getYAxis().setAxisLabelText("Magnetizacion promedio [A/m]");

  plot.getYAxis().setNTicks(2);
  plot.setXLim(0, 20);
  plot.setYLim(0, 2.0);
  plot.setGridLineWidth(2);
  plot.setGridLineColor(210);

  plot.setLineColor(120);
  plot.setLineWidth(1);

  console.log("Estado inicial", primerEstado.matixEstadoInicial);
  
}



// ------------------------------------
// --------- LOOP DIBUJAR ------------
// ------------------------------------
function draw() {

	background(220);  
	
	// Evolución de Estados
	//valTemp = temperatura.value(); 
	primerEstado.evolucionar(x);
    avmagn = primerEstado.update();
    //magtx = primerEstado.magtext()
  	magtx = primerEstado.magtext()
	textSize(20);
  	primerEstado.dibujar()
	fill(0);
	//text("Temperatura: "+nfc(valTemp), 220,30);
    text("Temperatura: "+nfc(x,2), 600,520);
    text("Magnetizacion: "+nfc(magtx), 600,550);
	
  
  plot.addPoint(x,avmagn);
  plot.beginDraw();

  
  plot.drawBox();
  plot.drawXAxis();
  plot.drawYAxis();
  plot.drawTitle();
  plot.drawGridLines(GPlot.BOTH);
  plot.drawLines();
  plot.drawPoints();

  plot.endDraw();
  x = x+0.1;
  
  encender = createButton("Continuar");
  encender.position(850,520);
  encender.mousePressed(loop);
  
  apagar = createButton("Pausar");
  apagar.position(950,520);
  apagar.mousePressed(noLoop);
  
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

    update = function(){
		this.magnetization = 0;
        this.magabs = 0
      
        this.averageMagnetization = 0;
      
		for(var i = 0; i < tamanio; i++){
			for(var j = 0; j < tamanio; j++){
				this.magnetization += this.matixEstadoInicial[i][j];
			}
		}
      this.magtxt = this.magnetization
      if(this.magnetization < 0) {this.magabs += this.magnetization*(-1)}
      else {this.magabs += this.magnetization}
        
        this.averageMagnetization += this.magabs/(tamanio*tamanio);
        
        
        return this.averageMagnetization
    }

    magtext = function(){
      this.magtxt = 0
      this.magtxt +=this.magnetization;
      return this.magtxt;
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
    pos[i] = (i*dimensiones+80);
  }
  return pos;
}

  
  
// Módulo entre dos números
function mod(n, m) {
	return ((n % m) + m) % m;
  }



function dot(x,y,status){
  if(status === true) { 
    fill(255,255,255);
   }
  else {
    fill(255,200,100);
   }
  
  square(x,y,dimensiones*0.8);
}