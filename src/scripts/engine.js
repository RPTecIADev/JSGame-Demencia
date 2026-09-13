// Dicionário de Associações Macabras
const paresMacabros = {
    "🔪": "🩸",
    "🩸": "🔪",

    "📈": "📉",
    "📉": "📈",          
    
    "🔍": "🔎",
    "🔎": "🔍",
    
    "🎮": "🕹️",
    "🕹️": "🎮",
    
    "⚰️": "💀",
    "💀": "⚰️",            
    
    "🧟": "🧠",
    "🧠": "🧟",

    "🕸️": "🕷️",
    "🕷️": "🕸️",
    
    "🕒": "🕞",
    "🕞": "🕒",
};

// Transforma as chaves do dicionário em uma lista para o jogo embaralhar
let emojis = Object.keys(paresMacabros);

let openCards = [];

let shuffleEmojis = emojis.sort(()=>(Math.random() > 0.5 ? 2 : -1));


for (let i=0; i < emojis.length; i++)
    {
        let box = document.createElement("div");
        box.className = "item";
        box.innerHTML = shuffleEmojis[i];
        box.onclick = handleClick;
        document.querySelector(".game").appendChild(box);
    }


    function handleClick() {
        if(openCards.length < 2) {
            this.classList.add("boxOpen")
            openCards.push(this);
     
        }

        if(openCards.length ==2 ){
            setTimeout(checkMatch, 500);
        }

        console.log(openCards);
    }


let sanityLevel = 0;
let panicInterval;

function startPanicTimer () {
    panicInterval = setInterval(() => {
        sanityLevel += 1;
        const gameContainer = document.querySelector('.game');

        if (sanityLevel > 5) {
            gameContainer.classList.add('panic-mode');
        }
        
        if (sanityLevel > 10) {
            gameContainer.classList.add('shaking');

        }

         if (sanityLevel > 15) {
            gameContainer.classList.style.filter = 'blur (${sanityLevel - 10}px) grayscale(100%)'; 
        }
    }, 1000); // a cada segundo piora as coisas
}

//Resetar a visãpo quando acerta
function recoverSanity() {
    sanityLevel = 0;
    const gameContainer= document = document.querySelector('.game');
    gameContainer.classList.remove('panic-mode' , 'shaking');
    gameContainer.style.filter = 'none';

}

    function checkMatch(){
// Lê o emoji da primeira carta, joga no dicionário e vê se o resultado bate com a segunda
if (paresMacabros[openCards[0].innerHTML] === openCards[1].innerHTML) {
    
    // MATCH! O jogador acertou a associação!
    openCards[0].classList.add("boxMatch");
    openCards[1].classList.add("boxMatch");

    // O acerto traz clareza
    recoverSanity();

    // Toda vez que acerta mudam as posições
    setTimeout(applyLayoutCaos, 400);

} else {
    // ERROU! (Aqui continua o seu código de punirErro, virar as cartas de volta, etc)
    openCards[0].classList.remove("boxOpen");
    openCards[1].classList.remove("boxOpen");
    punirErro();


    // O caos aumenta
            sanityLevel += 2;
            setTimeout(() => {
                    shuffleUnmatchedCards();
            }, 500);
            
            
        }
    openCards = [];

    //verifica vitória    
   if (document.querySelectorAll(".boxMatch").length === emojis.length) {
    declararVitoria();
}}

startPanicTimer ();

    // --- SISTEMA DE ÁUDIO DE TERROR ---
const trilhaTerror = document.getElementById("trilha-terror");

// Define o volume (0.0 é mudo, 1.0 é no máximo). 
// 0.3 é ideal para música de fundo não atrapalhar muito
trilhaTerror.volume = 0.3; 

// Adiciona um evento que escuta o primeiro clique em qualquer lugar da tela
document.body.addEventListener("click", () => {
    // Se a música estiver pausada, ela começa a tocar
    if (trilhaTerror.paused) {
        trilhaTerror.play().catch(error => {
            console.log("O navegador bloqueou o áudio:", error);
        });
    }
}, { once: true }); // O { once: true } garante que esse evento só dispare UMA vez

// --- SISTEMA DE CRONÔMETRO DA MORTE ---
const timerElement = document.getElementById("timer");
let tempoRestante = 120; // 2:00 minutos = 120 segundos
let cronometroIntervalo;

function iniciarCronometro() {
    // Garante que não há múltiplos cronômetros rodando
    clearInterval(cronometroIntervalo);
    tempoRestante = 120; 
    timerElement.classList.remove("urgente");
    atualizarDisplayTimer();

    cronometroIntervalo = setInterval(() => {
        tempoRestante--;
        atualizarDisplayTimer();

        // Faltando 30 segundos, ativa o efeito de desespero (coração batendo)
        if (tempoRestante <= 30) {
            timerElement.classList.add("urgente");
        }

        // Condição de Derrota (Game Over)
        if (tempoRestante <= 0) {
            clearInterval(cronometroIntervalo);
            derrotaMacabra();
        }
    }, 1000);
}

function atualizarDisplayTimer() {
    let minutos = Math.floor(tempoRestante / 60);
    let segundos = tempoRestante % 60;
    
    // Formata para sempre exibir 2 dígitos (ex: 03:00, 02:05)
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;
    
    timerElement.innerHTML = `${minutos}:${segundos}`;
}

// Puxa o elemento de áudio de derrota lá no topo do arquivo
const somDerrota = document.getElementById("som-derrota");

function derrotaMacabra() {
    // 1. Para tudo
    clearInterval(cronometroIntervalo);
    clearTimeout(timeoutMensagem);
    
    // 2. Pausa a música de fundo
    trilhaTerror.pause();
    trilhaTerror.currentTime = 0; 
    
    // 3. Toca a risada macabra
    somDerrota.volume = 0.8; 
    somDerrota.play().catch(e => console.log("Erro no áudio de derrota:", e));

    // 4. Mostra a mensagem na tela e trava ela com a classe nova
    divMensagem.innerText = "O TEMPO ACABOU, SEU INCOMPETENTE... RESETE E PASSE VERGONHA MAIS UMA VEZ!";
    divMensagem.classList.add("mostrar");
    divMensagem.classList.add("derrota-macabra");
    
    // Opcional: Impedir que o jogador clique nas cartas depois que o tempo acabar
    document.querySelector(".game").style.pointerEvents = "none";
}

// Inicia o cronômetro assim que o script é carregado
iniciarCronometro();

// --- SISTEMA DE PUNIÇÃO (SARCASMO E SOM) ---
const somErro = document.getElementById("som-erro");
const divMensagem = document.getElementById("mensagem-sarcastica");

// O arsenal de frases sarcásticas
const provocacoes = [
    "Sério? Essa era fácil...",
    "Sua mente já está apodrecendo?",
    "Achei que o jogo da demência era só o nome.",
    "Até um zumbi tem mais memória que você.",
    "Errado de novo. Que patético.",
    "O tempo está passando...",
    "Esqueceu tão rápido?",
    "Seu cérebro está derretendo?",
    "Desista. Você não vai conseguir."
];

// Puxa o elemento de áudio novo lá no topo do arquivo (junto com os outros)
const somVitoria = document.getElementById("som-vitoria");

function declararVitoria() {
    clearInterval(cronometroIntervalo);
    clearTimeout(timeoutMensagem);
    
    // --- LÓGICA DE ÁUDIO ---
    // 1. Pausa a música de fundo e zera o tempo dela
    trilhaTerror.pause();
    trilhaTerror.currentTime = 0; 
    
    // 2. Toca a música de vitória
    somVitoria.volume = 0.5; // Ajuste o volume se precisar
    somVitoria.play().catch(e => console.log("Erro no áudio de vitória:", e));

    divMensagem.innerText = "VOCÊ SOBREVIVEU... POR ENQUANTO.";
    divMensagem.classList.add("mostrar");
    divMensagem.classList.add("vitoria-macabra");
}

let timeoutMensagem; // Variável para controlar o tempo da mensagem na tela

function punirErro() {
    // 1. Toca o som de erro
    somErro.volume = 0.6;
    somErro.currentTime = 0; // Zera o áudio para poder tocar várias vezes seguidas rápido
    somErro.play().catch(e => console.log("Erro de áudio:", e));

    // 2. Escolhe uma frase aleatória
    const indiceAleatorio = Math.floor(Math.random() * provocacoes.length);
    divMensagem.innerText = provocacoes[indiceAleatorio];
    
    // 3. Mostra a frase na tela
    divMensagem.classList.add("mostrar");

    // 4. Limpa qualquer temporizador anterior e esconde a mensagem após 2 segundos
    clearTimeout(timeoutMensagem);
    timeoutMensagem = setTimeout(() => {
        divMensagem.classList.remove("mostrar");
    }, 2000); // Fica 2 segundos na tela
}

function shuffleUnmatchedCards() {
    // Seleciona  todas as cartas que ainda não foram acertadas
    let unmatchedCards = document.querySelectorAll('.item:not(.boxMatch)');
    let emojisRestantes = [];

    // Coleta os emojis atuais dessas cartas
    unmatchedCards.forEach(card => {
        emojisRestantes.push(card.innerHTML);
    });

    // Embaralhao array de emojis coletados
    emojisRestantes.sort(() => (Math.random () > 0.5 ? 2 : -1 ));

    // Devolve os emojis embaralhados para as cartas
unmatchedCards.forEach((card, index) => {
    card.innerHTML = emojisRestantes[index];
});

}

function applyLayoutCaos () {
    const gameContainer = document.querySelector ('.game');
    const effects = ['rotate-90' , 'rotate-180' , 'mirror' , 'upside-down', ''];

    // Remove efeitos anteriores
    gameContainer.classList.remove ('rotate-90' , 'rotate-180', 'mirror' , 'upside-down');
    
    // Sorteia um novo efeito
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];

    if (randomEffect) {
        gameContainer.classList.add(randomEffet);
    }
}



