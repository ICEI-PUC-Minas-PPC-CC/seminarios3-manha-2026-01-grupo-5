const configFases = {
    1: { pares: 4, colunas: 4 }, // 8 cartas
    2: { pares: 5, colunas: 5 }, // 10 cartas
    3: { pares: 8, colunas: 4 }, // 16 cartas (Compacto)
    4: { pares: 10, colunas: 5 } // 20 cartas (Compacto)
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

    // Ajusta o tamanho das cartas se for nível difícil
    if (nivelAtual >= 3) {
        grid.classList.add('grid-compacto');
    } else {
        grid.classList.remove('grid-compacto');
    }

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${config.colunas}, 1fr)`;

    // Placeholders iniciais
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

function verificarVitoria() {
    const acertos = document.querySelectorAll('.correct').length;
    if (acertos === configFases[nivelAtual].pares * 2) {
        setTimeout(() => {
            if (nivelAtual < 4) {
                alert("Mandou bem!");
                nivelAtual++;
                prepararTabuleiro();
            } else {
                alert("🏆 VOCÊ É O MESTRE DOS VALORES!");
            }
        }, 500);
    }
}

window.onload = prepararTabuleiro;