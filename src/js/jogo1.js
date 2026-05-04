const btnPlay = document.getElementById('btn-play-game');
const wordButtons = document.querySelectorAll('.word-btn');
const symbolCards = document.querySelectorAll('.symbol-card');

let gameStarted = false;
let selectedWordElement = null;

btnPlay.addEventListener('click', () => {
    gameStarted = true;
    btnPlay.innerText = "Reiniciar Jogo";
    resetBoard();
    shuffleElements();
});

// Lógica de seleção da Palavra
wordButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!gameStarted) return;
        
        // Remove destaque de qualquer palavra selecionada anteriormente
        wordButtons.forEach(b => b.classList.remove('selected'));
        
        // Adiciona destaque à palavra atual
        btn.classList.add('selected');
        selectedWordElement = btn;
    });
});

// Lógica de seleção da Imagem
symbolCards.forEach(card => {
    card.addEventListener('click', () => {
        if (!gameStarted || !selectedWordElement) {
            if (!selectedWordElement && gameStarted) alert("Selecione uma palavra primeiro!");
            return;
        }

        // Destaca a imagem clicada
        card.classList.add('selected');

        const wordText = selectedWordElement.getAttribute('data-value');
        const imageMatch = card.getAttribute('data-match');

        if (wordText === imageMatch) {
            // ACERTOU: Mantém verde e desabilita o par
            card.style.border = "5px solid #84cc16";
            selectedWordElement.style.background = "#84cc16";
            selectedWordElement.style.boxShadow = "0 5px 0 #65a30d";
            selectedWordElement.disabled = true; 
            card.style.pointerEvents = "none"; // Impede clicar de novo no que já acertou
        } else {
            // ERROU: Pisca em vermelho e limpa seleção
            card.style.border = "5px solid #f87171";
            setTimeout(() => {
                card.style.border = "2px solid #bae6fd";
                card.classList.remove('selected');
            }, 500);
        }
        
        // Limpa as seleções visuais para a próxima tentativa
        setTimeout(() => {
            if (wordText !== imageMatch) {
                selectedWordElement.classList.remove('selected');
            }
            card.classList.remove('selected');
            selectedWordElement = null;
        }, 600);
    });
});

function resetBoard() {
    // Reinicia as Palavras
    wordButtons.forEach(btn => {
        btn.style.background = ""; // Remove o verde de acerto e volta ao CSS original (laranja)
        btn.style.boxShadow = "";  // Remove a sombra de acerto
        btn.classList.remove('selected');
        btn.disabled = false;      // Reabilita o botão para o novo jogo
    });

    // Reinicia as Imagens
    symbolCards.forEach(card => {
        card.style.border = "";    // Remove bordas verdes ou vermelhas
        card.classList.remove('selected');
        card.style.pointerEvents = "auto"; // Reabilita o clique nas imagens
    });

    // Reseta o estado de seleção lógica
    selectedWordElement = null;
}

function shuffleElements() {
    const columns = document.querySelectorAll('.column');
    const words = Array.from(wordButtons);
    const symbols = Array.from(symbolCards);

    words.sort(() => Math.random() - 0.5).forEach(el => columns[0].appendChild(el));
    symbols.sort(() => Math.random() - 0.5).forEach(el => columns[1].appendChild(el));
}