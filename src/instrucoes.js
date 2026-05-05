document.addEventListener('DOMContentLoaded', () => {
    
    const btnJogo1 = document.getElementById('btn-jogo1');
    const btnJogo2 = document.getElementById('btn-jogo2');
    const btnVoltar = document.getElementById('btn-voltar-dinamico');


    const urlParams = new URLSearchParams(window.location.search);
    const jogoSelecionado = urlParams.get('jogo');

    if (jogoSelecionado === '1') {
        mostrarTab('inst-jogo1');
    } else if (jogoSelecionado === '2') {
        mostrarTab('inst-jogo2');
    }

    if (btnJogo1) btnJogo1.addEventListener('click', () => mostrarTab('inst-jogo1'));
    if (btnJogo2) btnJogo2.addEventListener('click', () => mostrarTab('inst-jogo2'));

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            if (jogoSelecionado === '1') {
                window.location.href = 'jogo1.html';
            } else if (jogoSelecionado === '2') {
                window.location.href = 'jogo2.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    function mostrarTab(id) {
        const abas = document.querySelectorAll('.tab-content');
        abas.forEach(tab => tab.style.display = 'none');

        const abaSelecionada = document.getElementById(id);
        if (abaSelecionada) {
            abaSelecionada.style.display = 'block';
            abaSelecionada.scrollIntoView({ behavior: 'smooth' });
        }
    }
});