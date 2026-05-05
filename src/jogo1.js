const fases = {
    1: [
        { id: 1, texto: 'AMOR', img: 'imgs/amor.png' }, 
        { id: 2, texto: 'PAZ', img: 'imgs/paz.png' }, 
        { id: 3, texto: 'RESPEITO', img: 'imgs/respeito.png' }
    ],
    2: [
        { id: 4, texto: 'AJUDA', img: 'imgs/ajuda.png' }, 
        { id: 5, texto: 'UNIÃO', img: 'imgs/uniao.png' }, 
        { id: 6, texto: 'GENTILEZA', img: 'imgs/gentileza.png' }, 
        { id: 7, texto: 'AMIZADE', img: 'imgs/amizade.png' }
    ],
    3: [
        { id: 8, texto: 'HONESTIDADE', img: 'imgs/honestidade.png' }, 
        { id: 9, texto: 'IGUALDADE', img: 'imgs/igualdade.png' }, 
        { id: 10, texto: 'GRATIDÃO', img: 'imgs/gratidao.png' }, 
        { id: 11, texto: 'ÉTICA', img: 'imgs/etica.png' }, 
        { id: 12, texto: 'JUSTIÇA', img: 'imgs/justica.png' }
    ]
};

let nivelAtual = 1;
let palavraSelecionada = null;
let imagemSelecionada = null;
let acertosFase = 0;
let indiceEscrita = 0;
const todosOsValores = [...fases[1], ...fases[2], ...fases[3]];

// Bloqueio do Enter
window.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); }, true);

function gerenciarBotaoPrincipal() {
    const btn = document.getElementById('btn-acao');
    const gameBox = document.getElementById('game-box');
    
    if (btn.innerText === "JOGAR") { 
        btn.style.display = "none"; 
        gameBox.style.justifyContent = "flex-start"; 
        iniciarEtapaCombinacao(); 
    }
    else if (btn.innerText === "PRÓXIMO NÍVEL") { btn.style.display = "none"; nivelAtual++; carregarNivel(); }
    else if (btn.innerText === "INICIAR ESCRITA") { btn.style.display = "none"; iniciarEtapaEscrita(); }
    else if (btn.innerText === "VERIFICAR") { checarEscrita(); }
}

function iniciarEtapaCombinacao() {
    document.getElementById('match-area').style.display = 'flex';
    document.getElementById('instrucao').innerText = "Combine a palavra com a imagem correta!";
    carregarNivel();
}

function carregarNivel() {
    const dados = fases[nivelAtual];
    const colP = document.getElementById('coluna-palavras');
    const colI = document.getElementById('coluna-imagens');
    document.getElementById('nivel-titulo').innerText = `Nível ${nivelAtual}`;
    colP.innerHTML = ''; colI.innerHTML = ''; acertosFase = 0;

    [...dados].sort(() => Math.random() - 0.5).forEach(item => {
        const btn = document.createElement('button'); btn.className = 'word-btn';
        btn.innerText = item.texto; btn.dataset.id = item.id;
        btn.onclick = () => { if(palavraSelecionada) palavraSelecionada.classList.remove('selected'); palavraSelecionada = btn; btn.classList.add('selected'); checarCombinacao(); };
        colP.appendChild(btn);
    });

    [...dados].sort(() => Math.random() - 0.5).forEach(item => {
        const card = document.createElement('div'); card.className = 'symbol-card';
        card.dataset.id = item.id; card.innerHTML = `<img src="${item.img}">`;
        card.onclick = () => { if(imagemSelecionada) imagemSelecionada.classList.remove('selected'); imagemSelecionada = card; card.classList.add('selected'); checarCombinacao(); };
        colI.appendChild(card);
    });
}

function checarCombinacao() {
    if (palavraSelecionada && imagemSelecionada) {
        if (palavraSelecionada.dataset.id === imagemSelecionada.dataset.id) {
            palavraSelecionada.style.visibility = 'hidden'; imagemSelecionada.style.visibility = 'hidden';
            acertosFase++;
            if (acertosFase === fases[nivelAtual].length) {
                const btn = document.getElementById('btn-acao'); btn.style.display = 'block';
                btn.innerText = (nivelAtual < 3) ? "PRÓXIMO NÍVEL" : "INICIAR ESCRITA";
            }
        } else {
            const p = palavraSelecionada, i = imagemSelecionada;
            setTimeout(() => { p.classList.remove('selected'); i.classList.remove('selected'); }, 300);
        }
        palavraSelecionada = null; imagemSelecionada = null;
    }
}

function iniciarEtapaEscrita() {
    document.getElementById('match-area').style.display = 'none';
    document.getElementById('escrita-container').style.display = 'flex';
    document.getElementById('game-box').style.justifyContent = "center";
    document.getElementById('nivel-titulo').innerText = "Etapa de Escrita";
    document.getElementById('instrucao').innerText = "Escreva o valor correspondente à imagem.";
    const btn = document.getElementById('btn-acao'); btn.style.display = "block"; btn.innerText = "VERIFICAR";
    carregarDesafioEscrita();
}

function carregarDesafioEscrita() {
    const dados = todosOsValores[indiceEscrita];
    document.getElementById('imagem-pergunta').innerHTML = `<img src="${dados.img}">`;
    const input = document.getElementById('input-palavra');
    input.value = ""; input.disabled = false; setTimeout(() => input.focus(), 200);
}

function checarEscrita() {
    const field = document.getElementById('input-palavra');
    const val = field.value.toUpperCase().trim();
    if (val === todosOsValores[indiceEscrita].texto) {
        field.disabled = true; indiceEscrita++;
        if (indiceEscrita < todosOsValores.length) mostrarFeedback("Correto!", "Muito bem! Vamos para o próximo.", () => carregarDesafioEscrita());
        else finalizarJogo();
    } else {
        field.disabled = true;
        mostrarFeedback("Ops!", "Tente escrever novamente.", () => { field.disabled = false; field.focus(); });
    }
}

function mostrarFeedback(titulo, msg, cb) {
    const modal = document.getElementById('modal-feedback');
    document.getElementById('modal-titulo').innerText = titulo;
    document.getElementById('modal-mensagem').innerText = msg;
    modal.style.display = 'flex'; modal.callbackAction = cb;
}

function fecharModal() {
    const modal = document.getElementById('modal-feedback');
    modal.style.display = 'none';
    if (modal.callbackAction) modal.callbackAction();
}

function finalizarJogo() {
    document.getElementById('escrita-container').innerHTML = "<h1>🏆 Parabéns!</h1><p>Você é um mestre dos valores!</p>";
    const btn = document.getElementById('btn-acao'); btn.innerText = "RECOMEÇAR";
    btn.onclick = () => location.reload();
}