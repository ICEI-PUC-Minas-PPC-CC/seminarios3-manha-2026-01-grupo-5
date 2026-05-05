const configFases = {
    1: { pares: 2, colunas: 2 }, // 4 cartas
    2: { pares: 3, colunas: 3 }, // 6 cartas
    3: { pares: 4, colunas: 4 }, // 8 cartas
    4: { pares: 5, colunas: 5 }, // 10 cartas
    5: { pares: 6, colunas: 4 }, // 12 cartas
    6: { pares: 7, colunas: 5 }, // 14 cartas (Compacto)
    7: { pares: 8, colunas: 4 }, // 16 cartas (Compacto)
    8: { pares: 10, colunas: 5 } // 20 cartas (Compacto)
};

let nivelAtual = 1;
let cartasViradas = [];
let bloqueado = true; 

const icones = ['❤️', '🤝', '🌈', '⭐', '☀️', '🌸', '🎁', '🎈', '🍀', '🍎'];

function prepararTabuleiro() {
    const grid = document.getElementById('memory-grid');
    const btn = document.getElementById('btn-jogar');
    const config = configFases[nivelAtual];
    
    document.getElementById('nivel-titulo').innerText = `Nível ${nivelAtual}`;
    btn.disabled = false; 
    btn.innerText = "JOGAR";
    bloqueado = true; 

    // Ativa modo compacto a partir do nível 5
    if (nivelAtual >= 5) {
        grid.classList.add('grid-compacto');
    } else {
        grid.classList.remove('grid-compacto');
    }

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${config.colunas}, 1fr)`;

    for (let i = 0; i < config.pares * 2; i++) {
        const item = document.createElement('div');
        item.classList.add('memory-item');
        item.innerHTML = '?';
        grid.appendChild(item);
    }
}
function iniciarJogo() {
    const grid = document.getElementById('memory-grid');
    const btn = document.getElementById('btn-jogar');
    const config = configFases[nivelAtual];
    
    btn.disabled = true; 

    let selecionados = icones.slice(0, config.pares);
    let baralho = [...selecionados, ...selecionados].sort(() => Math.random() - 0.5);

    grid.innerHTML = ''; 

    baralho.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('memory-item', 'flipped');
        card.dataset.icon = icon;
        card.innerHTML = icon; 
        card.onclick = () => virarCarta(card);
        grid.appendChild(card);
    });

    let tempo = 10;
    btn.innerText = `Memorize: ${tempo}s`;

    const cronometro = setInterval(() => {
        tempo--;
        btn.innerText = `Memorize: ${tempo}s`;
        if (tempo <= 0) {
            clearInterval(cronometro);
            começarPartida();
        }
    }, 1000);
}

function começarPartida() {
    document.querySelectorAll('.memory-item').forEach(c => {
        c.classList.remove('flipped');
        c.innerHTML = '?';
    });
    document.getElementById('btn-jogar').innerText = "VALENDO!";
    bloqueado = false; 
}

function virarCarta(card) {
    if (bloqueado || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    card.innerHTML = card.dataset.icon;
    cartasViradas.push(card);

    if (cartasViradas.length === 2) {
        bloqueado = true;
        setTimeout(checarPar, 700);
    }
}

function checarPar() {
    const [c1, c2] = cartasViradas;
    if (c1.dataset.icon === c2.dataset.icon) {
        c1.classList.add('correct');
        c2.classList.add('correct');
        verificarVitoria();
    } else {
        c1.classList.remove('flipped'); c1.innerHTML = '?';
        c2.classList.remove('flipped'); c2.innerHTML = '?';
    }
    cartasViradas = [];
    bloqueado = false;
}

// Atualize a verificação de vitória para suportar o limite de 8
function verificarVitoria() {
    const acertos = document.querySelectorAll('.correct').length;
    if (acertos === configFases[nivelAtual].pares * 2) {
        bloqueado = true;
        setTimeout(exibirModalVitoria, 500);
    }
}

function exibirModalVitoria() {
    const modal = document.getElementById('modal-vitoria');
    const msg = document.getElementById('modal-msg');
    const btnProximo = document.getElementById('btn-proximo');
    const grid = document.getElementById('memory-grid');

    grid.style.opacity = "0.3"; // Escurece o fundo de leve
    modal.style.display = "block";

    if (nivelAtual < 8) {
        msg.innerText = "Mandou bem!";
        btnProximo.innerText = "PRÓXIMO NÍVEL";
    } else {
        msg.innerText = "🏆 VOCÊ É O MESTRE DOS VALORES!";
        btnProximo.innerText = "REINICIAR JOGO";
    }
}

function avançarNivel() {
    const modal = document.getElementById('modal-vitoria');
    const grid = document.getElementById('memory-grid');

    modal.style.display = "none";
    grid.style.opacity = "1";

    if (nivelAtual < 8) {
        nivelAtual++;
    } else {
        nivelAtual = 1; // Reinicia o jogo
    }
    
    prepararTabuleiro();
}

window.onload = prepararTabuleiro;