const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

const items = [ //arreglo con informacion de las cartas
  { name: "definicion-card", image: "Recursos/img/definicion-card.jpg" },
  { name: "agresor-card", image: "Recursos/img/agresor-card.jpg" },
  { name: "victima-card", image: "Recursos/img/victima-card.jpg" },
  { name: "sintomas-card", image: "Recursos/img/sintomas-card.jpg" },
  { name: "transtornos-card", image: "Recursos/img/transtornos-card.jpg" },
  { name: "ayuda-card", image: "Recursos/img/ayuda-card.jpg" },
];

let seconds = 0, minutes = 0;   //valores iniciales del timer
let movesCount = 0, winCount = 0;  //valores iniciales para la cantidad de movimientos y la bandera de verificacion de victoria

const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {  //si la variable seconds llega a 60 la reinicia y aumenta en 1 la variable minutes
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;  //agregar 0 en numeros del 0 al 9
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;  //para tener siempr 2 digitos
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {  //muestra los movimientos
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};


const generateRandom = (size = 4) => { //elije valores al azar para las cartas, en caso de agregarse mas tipos de cartas el tamaño puede quedar igual y las cartas que aparecerian variarian
 
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size-size) / 2;    //tamaño de la matriz (el tablero)

  for (let i = 0; i < size; i++) {    //seleccion al azar de una carta en el arreglo temporal
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);

    tempArray.splice(randomIndex, 1); //se elimina la carta del arreglo temporal para evitar mas de 2 cartas de un solo tipo
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => { //creacion del tablero
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);   //reordenamiendo de orden de las cartas
  for (let i = 0; i < size * size-size; i++)    //creacion de cartas
  { gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">
            <img src="Recursos/img/CartaTrasera.jpg" class="image"/>
        </div>
        <div class="card-after">
            <img src="${cardValues[i].image}" class="image"/>
        </div>
     </div>
     `;
  }

  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`; //crea el grid

  cards = document.querySelectorAll(".card-container");  
  cards.forEach((card) => {
    card.addEventListener("click", () => {    //clicks en cartas
     
      if (!card.classList.contains("matched")) { //verificacion que la carta no tenga el par descubierto
        
        card.classList.add("flipped"); //añade la clase para la animacion del volteo
        
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          
          movesCounter();  //actualiza la cantidad de movimientos
          
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {   //cartas iguales
            firstCard.classList.add("matched"); 
            secondCard.classList.add("matched");

            showCardInfo(firstCardValue);
            
            firstCard = false;   //cambia el estado de la carta inicial para la siguiente carta seleccionada sea la primera
            winCount += 1;  //aumento de la bandera

            if (winCount == Math.floor(cardValues.length / 2)) {  //condicion de victoria
              setTimeout(() => {
                result.innerHTML = `<h2>Ganaste!</h2> <h4>Moves: ${movesCount}</h4>`;
                stopGame();
              },1000); //delay de 1 seg antes de mostrar el mensaje de victoria
            }

          } else { //cartas desiguales
            let [tempFirst, tempSecond] = [firstCard, secondCard]; //variables temporales animacion para poder seleccionar cartas seguidas
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {  //delay en la animacion voltear cartas de nuevo
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

const showCardInfo = (infoCardValue) => {
  const infoCards = document.querySelectorAll('.fila-info-card');
  infoCards.forEach((card) => {   
    if (card.getAttribute('data-card-value') === infoCardValue) {   //verifica en todas las lineas si hay alguna que tenga el mismo data-card-value
      const h1 = card.querySelector('h1');
      const p = card.querySelector('p');

      switch (infoCardValue) {
        case 'definicion-card':
          h1.textContent = 'Definicion Del Stalking';
          p.textContent = 'Stalking es conocido como un “acecho” o “acoso físico” de forma de agresión que se lleva a cabo mediante una persecución sistemática. Un acechador (o stalker) interfiere repetidamente en la vida de otra persona de una manera no deseada y destructiva. Esto puede afectar a la victima de forma física o psicológica, afectando su vida cotidiana y generando estados de miedo y ansiedad.';
          break;
        case 'agresor-card':
          h1.textContent = 'El Stalker';
          p.textContent = 'Un stalker o acechador, en general, manifiestan problemas en los ámbitos afectivo-emocional, relacional y comunicativo. Expertos en diversos campos sugieren que existen ciertas características comunes de un stalker, pero aún no hay un consenso absoluto.';
          break;
        case 'victima-card':
          h1.textContent = 'La Victima';
          p.textContent = 'Las victimas generan emociones intensas como miedo, ira y desprecio hacia el Stalker. También experimentan culpa y vergüenza, y crea dificultad para pedir ayuda y los lleva a aislarse.';
          break;
        case 'sintomas-card':
          h1.textContent = 'Sintomas';
          p.textContent = 'Algunas víctimas pueden tener síntomas similares, pero hay algunos que no desarrollan trastornos psiquiátricos y algunos síntomas pueden ser subclínicos o transitorios.';
          break;
        case 'transtornos-card':
          h1.textContent = 'Transtornos';
          p.textContent = 'Los trastornos pueden ser afectados en cualquier parte del cuerpo y con una variedad de síntomas, dependiendo de que parte de cuerpo fue afectada y con que especifica naturaleza del trastorno.';
          break;
        case 'ayuda-card':
          h1.textContent = 'Ayuda';
          p.textContent = 'Tratamientos para las victimas debe ser realizado en un entorno terapéutico y seguro. También se tiene que combinar con estrategias practicas para enfrentar al acecho con apoyo social, intervenciones cognitivo-conductuales, psicoeducación y tomar acciones específicas según la víctima.';
          break;
        default:
          break;
      }
    }
  });
};

startButton.addEventListener("click", () => {   //Boton inicio
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  interval = setInterval(timeGenerator, 1000); //inicia el timer y llama a la funcion 1 vez por segundo
  controls.classList.add("hide");
  stopButton.classList.remove("hide"); //visibilidad botones
  startButton.classList.add("hide");
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`; //movimientos
  timeValue.innerHTML = `<span>Time:</span> 00:00`;
  initializer();
});

stopButton.addEventListener("click", (stopGame = () => {   //boton stop
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval); //Detiene las llamadas de la funcion dl timer
  })
);

const initializer = () => {  //iniciar valores y llamar funciones
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};