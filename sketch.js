let mic;														//dichiaro microfono
let alt = [];													//dichiaro array dove andrano altezze dei rettangoli in base al suono
let interval = 2;
let durataIndex=0;
let intervalIndex = 0;
let micLevel;
let h;
let start;
let stops;
let phase = 0;
let sfondo;
let flag = 0;

function preload(){
  sfondo = loadImage('./resources/images/starfield.gif')		//carico gif di sfondo
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  next = new Tasto(windowWidth/2, 2*(windowHeight/3), 100, "Next")				//creo tasto per cambiare fase
  start = new Tasto(windowWidth/2, 2*(windowHeight/3), 150, "Find out")			//creo tasto per iniziare attività
  stops = new Tasto(windowWidth/2, 2*(windowHeight/3), 100, "Stop")				//creo tasto per finire attività
  input = createInput();														//input dove scrivere frasi
  input.size (windowWidth/5, 12);
  input.position((windowWidth/2)-input.width/2, windowHeight/2);



}

function draw() {
  background("black");
  fill("white");
  push()
  imageMode(CORNER);
  if(windowHeight/windowWidth<=sfondo.height/sfondo.width){                       //immagine di sfondo adattabile a dimensione
    image(sfondo, 0, 0, windowWidth, sfondo.height*windowWidth/sfondo.width);
  }else{
    image(sfondo, 0, 0, sfondo.width*windowHeight/sfondo.height, windowHeight);
  }
  pop()
  textAlign(CENTER, CENTER);
  textSize(50);
  textFont('Raleway');
  recordAudio();																	//richiamo funzione recordAudio
  showGraph();																		//richiamo funzione showGraph aka quarta fase

  if (phase == 0){																	//prima fase
    text("How silent are you on your pc?", width/2, height/3);
    start.show();
    input.style("display: none");
  }

  else if(phase == 1){																//seconda fase
    text('Type the phrase\n\"The quick brown fox jumps over the lazy dog\"', width/2, height/3);
    input.style("display: initial");
    next.show();
  }

  else if(phase == 2){																//terza fase
    text('Type the phrase\n\"The five boxing wizards jump quickly\"', width/2, height/3);
    if (flag == 0){																	//sistema con flag per svuotare input alla terza fase
      input.value("");
      flag = 1;
    }
    input.style("display: initial");
    stops.show();
  }

}

function mousePressed() {					//cambio delle funzioni dei tasti in base alla fase

  
  if(phase == 0){
  start.cambio();

  } else if(phase == 1){
    next.cambio();
  }
  
  else if (phase == 2){
  stops.stopRecording();
  }

}

function showGraph(){								//funzione per mostrare grafico volumi
  if(phase == 3){
    input.style("display: none");
    text("This is the noise you made during the exercises", windowWidth/2, 2*(windowHeight/3))
    for (let i = 0; i < alt.length; i++){							//ciclo for per riportare volumi come tanti rettangoli alti in proporzione all'audio ricevuto dal microfono
      rect(i*(windowWidth/(alt.length-6))-6*(windowWidth/alt.length), windowHeight/2,windowWidth/alt.length, 10*alt[i])
    }
  }
}

function recordAudio(){

  if(mic){
    micLevel = mic.getLevel();
    h = map(micLevel, 0, 1, 0, windowHeight);

    if(phase==1 || phase == 2){									//ciclo if per registrare valori del volume
      if(intervalIndex==interval){
      alt[durataIndex]=-h;                                      //registra altezze come valori nell'array
      durataIndex++;
      intervalIndex=0;
    }else{
      intervalIndex++;
    }
    }
  }
}

class Tasto {                                          
  constructor(xpos, ypos, radius, title){						//classe tasto
    this.x = xpos;
    this.y = ypos;
    this.r = radius;
    this.color = "white";
    this.name = title;
  }
  show(){          												//funzione per mostrare il tasto
    push();                                      
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.r);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill("black");
    text(this.name, this.x, this.y);
    pop();
  }
  cambio(){                                                		//funzione per aumentare la fase e far partire la registrazione   
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.r){
      if(phase == 0 || phase == 1){
        phase++;

        userStartAudio();
        mic = new p5.AudioIn();
        mic.start();

        print(phase);
      }
      // phase = phase + 1;
      // print(phase);
    }
  }
  stopRecording(){												//funzione per aumentare la fase un'ultima volta e interrompere la registrazione
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.r){
      if(phase == 2){
        phase = 3;
        print(phase);
      }
    }
    }
}