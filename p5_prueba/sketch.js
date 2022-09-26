/**
 * ----------********-----------
 * ------ MODELO DE ISING ------
 * ----------********-----------
 * Autores: 
 *    Sergio Duque Mejía
 *    Daniela Andrea Torres Gómez
 * Universidad de Antioquia
 */


// ----------------------
// ---- VARIABLES -------
// ----------------------
let temperatura; 
let avmagn;
let magn;
let magtx;
let apagar;
let encender;
var numParticulas = 10;




//dimensiones = 50;
WIDTH = 1200;
HEIGHT = 600;



// ---------------------------------------------
// ----- INICIALIZACIÓN DE LA SIMULACIÓN -------
// ---------------------------------------------
function setup() {

  // Aquí se inicializan los parámetros 

  frameRate(3);
  createCanvas(WIDTH, HEIGHT);

  // número de paticulas

  temperatura = 0.1;

  // Se crea el primer estado
  estado = new estadoDelSistema(numParticulas);

  // Se sibuja el primer estado
  estado.dibujar();
  
  // Ingresar la cantidad de partículas
  input = createInput( );
  input.position(850, 560);
  button = createButton("Enviar");
  button.position(850 + 140, 560);

  // Si se presiona se establece el numero de 
  // partículas ingresadas en el input y refresca
  button.mousePressed(() => {
    numParticulas = input.value();
    setup();
  });

}



// ------------------------------------
// --- DIBUJAR CONTINUAMENTE (LOOP) ---
// ------------------------------------
function draw() {

  background(220);
  textSize(20);

  /**
   * Se evoluciona el primer estado,
   * y cada que entra al loop, el
   * estado evoluciona 
   */
  estado.evolucionar(temperatura);
  avmagn = estado.actualizar();
  magtx = estado.magtext()
  estado.dibujar();


  fill(0);
  text("Temperatura: " + nfc(temperatura, 2), HEIGHT + 10, 520);
  text("Magnetizacion: " + nfc(magtx), HEIGHT + 10, 550);

  /**
   * Botones para continuar, pausar y reiniciar
   */

  temperatura += 0.1;
  encender = createButton("Continuar");
  encender.position(850, 520);
  encender.mousePressed(loop);

  apagar = createButton("Pausar");
  apagar.position(950, 520);
  apagar.mousePressed(noLoop);

  reiniciar = createButton("Reiniciar");
  reiniciar.position(1050, 520);
  reiniciar.mousePressed(setup);

  text("Número de partículas", HEIGHT + 10, 580);

}


// ------------------------------------
// ------- ESTADO DEL SISTEMA ---------
// ------------------------------------
class estadoDelSistema {

  matrizDeEstado = [];

  // -------------------------------
  // --- Constructor de la clase ---
  // -------------------------------
  constructor(numParticulas) {

    this.n = numParticulas;

    /** 
     * Este recorrerá la retícula y asignará un valor 
     * de 1 ó -1 a cada partícula 
     */
    for (let i = 0; i < this.n; i++) {
      var filas = [];
      for (let j = 0; j < this.n; j++) {
        // Agrega -1 o 1, aleatoriamente 
        filas.push(random([-1, 1]));
      }
      // Agrega una fila a la matriz en cada iteración
      this.matrizDeEstado.push(filas);
    }

  }

  // -------------------------------
  // ---- Funciones de la clase ----
  // -------------------------------

  evolucionar = function (T) {

    // Guarda el resultado de la función Montecarlo
    this.matrizDeEstado = MonteCarlo(this.matrizDeEstado, 1 / T);
  }


  actualizar = function () {
    this.magnetizacion = 0;
    this.magabs = 0

    this.promedioMagnetizacion = 0;

    for (var i = 0; i < numParticulas; i++) {
      for (var j = 0; j < numParticulas; j++) {
        this.magnetizacion += this.matrizDeEstado[i][j];
      }
    }
    this.magtxt = this.magnetizacion
    if (this.magnetizacion < 0) { this.magabs += this.magnetizacion * (-1) }
    else { this.magabs += this.magnetizacion }

    this.promedioMagnetizacion += this.magabs / (numParticulas * numParticulas);


    return this.promedioMagnetizacion
  }

  magtext = function () {
    this.magtxt = 0
    this.magtxt += this.magnetizacion;
    return this.magtxt;
  }

  dibujar = function () {

    /**
     * Esta función dibuja cada partícula 
     * en la retícula 
     */
    var arreglo = [];

    // [0]: Posiciones de las partículas [1]: sus dimensiones
    var centro_masa = centroMasa(this.n);

    // Arrelgo con las posiciones
    var cm = centro_masa[0];

    // Dimensiones de cada "partícula" en la retícula
    var dim = centro_masa[1];

    // Recorre la matriz para dibujar cada partícula en la retícula
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        var estadoTemporal;

        if (this.matrizDeEstado[i][j] == 1) { estadoTemporal = true }
        else { estadoTemporal = false }

        // Se agerga al arreglo, un dibujo con sus dimensiones y estado (color)
        arreglo.push(new cuadrado(cm[j], cm[i], estadoTemporal, dim));
      }
    }
    return arreglo;
  }



}


// ----------------------------------
// --------- MONTE CARLO ------------
// ----------------------------------
function MonteCarlo(configuracion, beta) {

  var L = configuracion.length;
  nuevaConfig = [...configuracion]; // Copia de la configuracion

  for (let i = 0; i < L; i++) {
    for (let j = 0; j < L; j++) {

      var a = Math.floor(Math.random() * (L)); // 0,1,2,3,4
      var b = Math.floor(Math.random() * (L));

      var sigma = configuracion[a][b];

      var config1 = configuracion[mod((a + 1), L)][b];
      var config2 = configuracion[a][mod((a + 1), L)];
      var config3 = configuracion[mod((a - 1), L)][b];
      var config4 = configuracion[a][mod((b - 1), L)];

      var neighbors = config1 + config2 + config3 + config4;

      var del_E = 2 * sigma * neighbors;

      if (del_E < 0) {
        sigma *= -1;
      } else if (Math.random() < Math.exp(-1 * del_E * beta)) {
        sigma *= -1;
      }

      nuevaConfig[a][b] = sigma;
    }
  }

  return nuevaConfig;
}


// -------------------------------------
// ------ CALCULA EL CENTRO DE MASA ----
// -------------------------------------
function centroMasa(n) {

  /**
   * Esta fucción calcula la posición de cada una
   * de las partículas en la retícula
   */
  var posiciones = [];

  // Establece la distancia de la reticula con el canvas
  let borde = 50;

  // La reticula tiene dimensiones de la altura 
  // del canvas menos el borde
  let dimReticula = HEIGHT - borde;

  // Se divide el tamaño de la reticula por el número de partículas
  var dimParticula = dimReticula / numParticulas;

  // Se crea el vector de posiciones
  for (var i = 0; i < n; i++) {
    posiciones[i] = (i * dimParticula + borde);
  }

  return [posiciones, dimParticula];
}



// -----------------------------------------
// --- CALCULA EL MÓDULO ENTRE 2 NUMEROS ---
// -----------------------------------------
function mod(n, m) {
  return ((n % m) + m) % m;
}

// -----------------------------------------
// ------------ DIBUJA PARTÍCULAS ----------
// -----------------------------------------
function cuadrado(x, y, estado, dimensiones) {

  // Si el estado es true, pinta la partícula blanco
  if (estado === true) {
    fill(255, 255, 255);
  }
  // Si no, pinta la partícula naranja
  else {
    fill(255, 200, 100);
  }

  // Cuadrados en posicion (x,y) y el 80% de la dimensión
  square(x, y, dimensiones * 0.8);
}
