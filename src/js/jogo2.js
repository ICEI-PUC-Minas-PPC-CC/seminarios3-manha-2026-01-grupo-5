const grid = document.getElementById('memory-grid');
const btnJogar = document.getElementById('btn-jogar');

// Pares de emojis para o jogo
const icones = ['❤️', '🤝', '🫂', '⭐', '❤️', '🤝', '🫂', '⭐'];
let cartasSelecionadas = [];
let jogoIniciado = false;

// 1. Mostrar tabuleiro inicial (cartas viradas)
function carregarCartas() {
    grid.innerHTML = '';
    icones.forEach(icon => {
        const div = document.createElement('div');
        div.classList.add('memory-item', 'flipped'); // Começa visível
        div.innerHTML = icon;
        grid.appendChild(div);
    });
}

btnJogar.addEventListener('click', () => {
    if (jogoIniciado) return;

    jogoIniciado = true;
    btnJogar.disabled = true;

    // Embaralha
    icones.sort(() => Math.random() - 0.5);

    // Renderiza embaralhado e visível
    grid.innerHTML = '';
    icones.forEach((icon) => {
        const div = document.createElement('div');
        div.classList.add('memory-item', 'flipped');
        div.innerHTML = icon;
        div.dataset.valor = icon; // Guarda o valor para checar depois
        grid.appendChild(div);
    });

    // Cronômetro de 10 segundos
    let segundos = 10;
    btnJogar.innerText = `Memorize: ${segundos}s`;

    const timer = setInterval(() => {
        segundos--;
        btnJogar.innerText = `Memorize: ${segundos}s`;

        if (segundos <= 0) {
            clearInterval(timer);
            fecharCartas();
        }
    }, 1000);
});

function fecharCartas() {
    const todasCartas = document.querySelectorAll('.memory-item');
    todasCartas.forEach(carta => {
        carta.classList.remove('flipped');
        carta.innerHTML = '?';
        carta.addEventListener('click', () => virarCarta(carta));
    });
    btnJogar.innerText = "Ache os Pares!";
    btnJogar.disabled = false;
    jogoIniciado = false; // Permite reiniciar o processo se quiser
}

function virarCarta(carta) {
    if (cartasSelecionadas.length < 2 && !carta.classList.contains('flipped')) {
        carta.classList.add('flipped');
        carta.innerHTML = carta.dataset.valor;
        cartasSelecionadas.push(carta);

        if (cartasSelecionadas.length === 2) {
            checarPar();
        }
    }
}

function checarPar() {
    const [c1, c2] = cartasSelecionadas;

    if (c1.dataset.valor === c2.dataset.valor) {
        c1.classList.add('correct');
        c2.classList.add('correct');
        cartasSelecionadas = [];
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            c1.innerHTML = '?';
            c2.innerHTML = '?';
            cartasSelecionadas = [];
        }, 1000);
    }
}

// Executa ao carregar a página
carregarCartas();