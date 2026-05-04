const fases = {
    1: [
        { id: 1, texto: 'AMOR', img: 'imgs/amor.png' },
        { id: 2, texto: 'PAZ', img: 'imgs/paz.png' },
        { id: 3, texto: 'RESPEITO', img: 'imgs/respeito.png' }
    ],
    2: [
        { id: 1, texto: 'AJUDA', img: 'imgs/ajuda.png' },
        { id: 2, texto: 'UNIÃO', img: 'imgs/uniao.png' },
        { id: 3, texto: 'GENTILEZA', img: 'imgs/gentileza.png' },
        { id: 4, texto: 'AMIZADE', img: 'imgs/amizade.png' }
    ],
    3: [
        { id: 1, texto: 'HONESTIDADE', img: 'imgs/honestidade.png' },
        { id: 2, texto: 'IGUALDADE', img: 'imgs/igualdade.png' },
        { id: 3, texto: 'GRATIDÃO', img: 'imgs/gratidao.png' },
        { id: 4, texto: 'ÉTICA', img: 'imgs/etica.png' },
        { id: 5, texto: 'JUSTIÇA', img: 'imgs/justica.png' }
    ]
};

let nivelAtual = 1;
let palavraSelecionada = null;
let imagemSelecionada = null;
let acertosFase = 0;

function carregarNivel() {
    const dados = fases[nivelAtual];
    const colPalavras = document.getElementById('coluna-palavras');
    const colImagens = document.getElementById('coluna-imagens');
    const btnProximo = document.getElementById('btn-proximo');
    
    document.getElementById('nivel-titulo').innerText = `Nível ${nivelAtual}`;
    btnProximo.style.display = 'none';
    colPalavras.innerHTML = '';
    colImagens.innerHTML = '';
    acertosFase = 0;

    // Criar e embaralhar palavras
    const palavras = [...dados].sort(() => Math.random() - 0.5);
    palavras.forEach(item => {
        const btn = document.createElement('button');
        btn.classList.add('word-btn');
        btn.innerText = item.texto;
        btn.dataset.id = item.id;
        btn.onclick = () => selecionarPalavra(btn);
        colPalavras.appendChild(btn);
    });

    // Criar e embaralhar imagens
    const imagens = [...dados].sort(() => Math.random() - 0.5);
    imagens.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('symbol-card');
        card.dataset.id = item.id;
        card.innerHTML = `<img src="${item.img}" alt="valor">`;
        card.onclick = () => selecionarImagem(card);
        colImagens.appendChild(card);
    });
}

function selecionarPalavra(el) {
    if (palavraSelecionada) palavraSelecionada.classList.remove('selected');
    palavraSelecionada = el;
    el.classList.add('selected');
    checarCombinacao();
}

function selecionarImagem(el) {
    if (imagemSelecionada) imagemSelecionada.classList.remove('selected');
    imagemSelecionada = el;
    el.classList.add('selected');
    checarCombinacao();
}

function checarCombinacao() {
    if (palavraSelecionada && imagemSelecionada) {
        if (palavraSelecionada.dataset.id === imagemSelecionada.dataset.id) {
            // ACERTOU!
            palavraSelecionada.classList.add('correct-match');
            imagemSelecionada.classList.add('correct-match');
            acertosFase++;
            
            if (acertosFase === fases[nivelAtual].length) {
                document.getElementById('btn-proximo').style.display = 'block';
            }
        } else {
            // ERROU (Dá um feedback visual rápido)
            const p = palavraSelecionada;
            const i = imagemSelecionada;
            setTimeout(() => {
                p.classList.remove('selected');
                i.classList.remove('selected');
            }, 300);
        }
        palavraSelecionada = null;
        imagemSelecionada = null;
    }
}

function proximoNivel() {
    if (nivelAtual < 3) {
        nivelAtual++;
        carregarNivel();
    } else {
        alert("Parabéns! Você completou todos os desafios de combinação! 🏆");
    }
}

window.onload = carregarNivel;