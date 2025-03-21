//pantalla carga

window.onload = function(){
    setTimeout(() => {
        loading.style.display = "none";
        pPrincipal.style.display = "block";
    }, 2000);
}

const btnF = document.getElementById("facil");
const btnD = document.getElementById("dificil");
const btnE = document.getElementById("extremo");
btnF.addEventListener("click", () => dificultad(2));
btnD.addEventListener("click", () => dificultad(10));
btnE.addEventListener("click", () => dificultad(15));
const dificultad = (dif) => {
    velocidad = velocidad * dif;
    pPrincipal.style.display = "none";
    juego.style.display = "block";
    animarAzul();
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const loading = document.getElementById("loading");
const pPrincipal = document.getElementById("principal");
const juego = document.getElementById("juego");
const gameOver = document.getElementById("gameOver");
const btnIzq = document.getElementById("izq");
const btnDer = document.getElementById("der");
const reset = document.getElementById("reset");
const puntoDiv = document.getElementById("puntos");
const vidaDiv = document.getElementById("cantVidas");
const lvlDiv = document.getElementById("lvl");
const crash = document.getElementById("crash");
const gOPunts = document.getElementById("goPuntos");
const lista = document.getElementById("lista");

let anchoCanvas = canvas.width;
let altoCanvas = canvas.height;
let puntos = 0;
let vida = 3;
let lvl = 1;
let intervaloBtn;
let velocidad = 1;
let dificultadB = velocidad;
let anchoCar = anchoCanvas / 4;
let altoCar = altoCanvas / 8;

let xPj = 0;
let yPj = altoCanvas - altoCar;

let xCar = Math.random() * (anchoCanvas - anchoCar);
let yCar = 0;

//Dibujar pj
const redCar = new Image();
redCar.src = "redCar.png"; 

const azulCar = new Image();
azulCar.src = "azulCar.png"

const draw = () => {
    ctx.clearRect(0, 0, anchoCanvas, altoCanvas);
    ctx.drawImage(redCar, xPj, yPj, anchoCar, altoCar);
    ctx.drawImage(azulCar, xCar, yCar, anchoCar, altoCar);
    
};

redCar.onload = () => draw();
azulCar.onload = () => draw();

redCar.onerror = () => {
    console.error("Error al cargar la imagen redCar");
};

azulCar.onerror = () => {
    console.error("Error al cargar la imagen azulCar");
};

//mover Pj
let mover = false;
const moverPj = (direccion) => {
    if (!mover) {
        xPj += anchoCar * direccion;
        if (xPj < 0) {
            xPj = 0;
        } else if (xPj + anchoCar > anchoCanvas) {
            xPj = anchoCanvas - anchoCar;
        }
    }
    draw();
};

btnIzq.addEventListener("click", () => moverPj(-1));
btnIzq.addEventListener("mousedown", () => intervaloBtn = setInterval(() => moverPj(-1), 100));
btnIzq.addEventListener('mouseup', () => clearInterval(intervaloBtn));

btnDer.addEventListener("click", () => moverPj(1));
btnDer.addEventListener("mousedown", () => intervaloBtn = setInterval(() => moverPj(1), 100));
btnDer.addEventListener('mouseup', () => clearInterval(intervaloBtn));

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        moverPj(-1);
    } else if (e.key === "ArrowRight") {
        moverPj(1);
    }
});


//mover azul y choca
let detener = false;
const animarAzul = () => { 
    dificultadB = velocidad
    yCar += velocidad;

    if (yCar > altoCanvas) {
        yCar = 0;
        xCar = Math.random() * (anchoCanvas - anchoCar);
        sumarPuntos();
    }

    colision();
    draw();
    if (!detener) { requestAnimationFrame(animarAzul); }
};

//colision  
const colision = () => {
    const margenX = anchoCar / 8;
	const margenY = altoCar / 8;

    if (
        xPj + anchoCar - margenX > xCar &&
        xPj + margenX < xCar + anchoCar &&
        yPj + altoCar - margenY > yCar &&
        yPj + margenY < yCar + altoCar
    ) {
        return siColision();
    }
}

const siColision = () => {
    vida--;
    vidaDiv.innerText = vida;
    velocidad = 0;
    detener = true;
    mover = true;
    crash.style.display = "block";
    gOPunts.innerText = puntos

    if (vida === 0) {
        detener = true;
        guardarMemoria(puntos, "Isay", "");
        mostrarPuntos();
        juego.style.display = "none";
        crash.style.display = "none";
        gameOver.style.display = "flex";
        return;
    }else{
        setTimeout(() => {
            velocidad = dificultadB;
            detener = false;
            mover = false;
            yCar = 0;
            xCar = Math.random() * (anchoCanvas - anchoCar);
            crash.style.display = "none";
            animarAzul();
        }, 1000);
    }
};

//puntos, cada 5 sube velocidad.
const sumarPuntos = () => {
    puntos++;
    puntoDiv.innerText = puntos;
    if (puntos % 5 === 0) {
        lvl++;
        lvlDiv.innerText = lvl;
        velocidad++;
    }
};

//restart
reset.addEventListener("click", () => {
    puntos = 0;
    vida = 3;
    lvl = 1;
    velocidad = 1;

    puntoDiv.innerText = puntos;
    vidaDiv.innerText = vida;
    lvlDiv.innerText = "1";
    detener = false;
    mover = false;

    xPj = 0;
    yPj = altoCanvas - altoCar;
    yCar = 0;
    xCar = Math.random() * (anchoCanvas - anchoCar);

    gameOver.style.display = "none";
    pPrincipal.style.display = "block";
});

//localStor
const guardarMemoria = (puntos, nombre, fecha) => {
    let dia = new Date();
    fecha = dia.toLocaleDateString();

    const datosJuego = {
        nombre: nombre,
        puntos: puntos,
        fecha: fecha,
    };

    let datosGuardados = JSON.parse(localStorage.getItem("datosJuego")) || [];
    datosGuardados.push(datosJuego);

    // si mas de 8, acomoda y elimina el menor
    if (datosGuardados.length > 8) {
        datosGuardados.sort((a, b) => a.puntos - b.puntos);
        datosGuardados.shift();
    }

    localStorage.setItem("datosJuego", JSON.stringify(datosGuardados));
};

const datosRecuperados = JSON.parse(localStorage.getItem("datosJuego"));

// crear lista en html
const mostrarPuntos = () => {
    const datosRecuperados = JSON.parse(localStorage.getItem("datosJuego"));
    const lista = document.getElementById("lista");

    // Limpiar antes de agregar
    lista.innerHTML = "";

    if (datosRecuperados) { 
        datosRecuperados.sort((a, b) => b.puntos - a.puntos);

        datosRecuperados.forEach((array) => {
            const { nombre, puntos, fecha } = array; 

            lista.innerHTML += `
                <li>
                    <div class="memory">
                        <div class="punt">${puntos}</div>
                        <div class="nombre">${nombre}</div>
                        <div class="fecha">${fecha}</div>
                    </div>
                </li>
            `;
        });
    }
};
mostrarPuntos();

const limpiarMemory = () => {
    localStorage.removeItem("datosJuego");
    console.log("LocalSt limpio");
    mostrarPuntos(); 
};

//limpiarMemory()
