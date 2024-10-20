//aqui são as funções pra manter os dados guardado localmente
//getFromLocalStorage: recebe uma key e um valor padrão, se não achar o valor da key ela retorna o valor padrão 
//setInLocalStorage: é para armazenar o valor e converter em JSON
const getFromLocalStorage = (key, defaultValue) => JSON.parse(localStorage.getItem(key)) || defaultValue;
const setInLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// MANIPULA OS ATIVOS (PORTIFÓLIO)
//getAtivos: busca a lista de ativos no LocalStorage
//setAtivos: salva a lista no LocalStorage
const getAtivos = () => getFromLocalStorage('ativos', []);
const setAtivos = (ativos) => setInLocalStorage('ativos', ativos);

// MANIPULA O HISTÓRICO DE COMPRAS
//é a mesma coisa dos ativos no portifólio, só muda o contexto
const getHistorico = () => getFromLocalStorage('historico', []);   
const setHistorico = (historico) => setInLocalStorage('historico', historico);  

const adicionarAtivo = () => {
    //aqui nessa primeira parte é pra capturar os valores preenchidos no formulario de adicionar ativos e tal
    //pega os valores pela Id do html e quando precisa converte pro tipo que precisa ser usado
    const ativo = document.getElementById('ativo').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const data = document.getElementById('data').value;

    //if pra verificar se os valores cumprem o padrão que é necessário pra funcionar 
    //se não for ele vai retornar a frase do alert
    if (!ativo || isNaN(preco) || preco <= 0 || isNaN(quantidade) || quantidade <= 0 || !data || ativo=="Selecione") {
        alert("Por favor, insira dados válidos.");
        return;
    }

    //"ativos" vai usar a função que tem a lista dos ativos
    //"existente" é pra ver se o ativo já existe na lista 
    const ativos = getAtivos();
    const existente = ativos.find(a => a.ativo === ativo);

    //aqui é pra fazer os ativos iguais irem somando
    //se for igual ele vai somar ao valor que já tinha antes
    //se for diferente ele vai criar um novo campo no portifólio
    if (existente) {
        existente.quantidade += quantidade; 
        existente.totalValor += preco * quantidade; 
    } else {
        ativos.push({ ativo, preco, quantidade, totalValor: preco * quantidade });
    }
    setAtivos(ativos);
    

     //parece com o anterior mas aqui é pra adicionar ao histórico
     //não tem a parte de somar com algo que já existe pq a intenção é deixar compra por compra separada
     const historico = getHistorico();   
     historico.push({ ativo, preco, quantidade, data });   
     setHistorico(historico); 
    
    
    
    atualizarResultado();
    renderizarHistorico();
    renderizarPortfolio();
    limparCampos();
    renderizarGrafico();

    
};


// função para limpar os campos do formulário
//depois que é salvo um novo ativo essa função é executada
const limparCampos = () => {
    document.getElementById('ativo').value = 'Selecione';
    document.getElementById('preco').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('data').value = '';
};

// Renderiza o histórico de compras na tela
const renderizarHistorico = () => {
    //primeiro ele limpa o histórico
    //e na const historico ele atualiza o histórico com a nova compra
    const historicoBody = document.getElementById('historico-body');
    historicoBody.innerHTML = '';  
    const historico = getHistorico();


   //o forEach age separadamente em cada um dos itens do histórico
   //a const row é pra criar um nova linha(tr) na tabela  
   //row.innnerHTML vai inserir o conteúdo do html dentro das linhas
   //historicoBody.appendChild(row) é para anexar cada linha ao corpo da tabela do histórico 
   historico.forEach(({ ativo, preco, quantidade, data }) => {
   
        // Formata a data no formato dd/mm/yyyy
        const dataObj = new Date(data);
        const dataFormatada = `${String(dataObj.getDate()).padStart(2, '0')}/${String(dataObj.getMonth() + 1).padStart(2, '0')}/${dataObj.getFullYear()}`;

        const totalAtivo = (preco * quantidade).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ativo}</td>
            <td>${quantidade}</td>
            <td>R$ ${preco.toFixed(2)}</td>
            <td>R$ ${totalAtivo}</td>
            <td>${dataFormatada}</td>
        `;
        historicoBody.appendChild(row);
    });
};


const renderizarPortfolio = () => {
    //ele vai seguindo praticamente a mesma ideia do histórico
    //as mudanças que tem é devido ao contexto, tipo o valor médio que tem nesse caso
    const portfolioBody = document.getElementById('portfolio-body');
    portfolioBody.innerHTML = ''; 
    const ativos = getAtivos();

    ativos.forEach(({ ativo, quantidade, totalValor }) => {
        const valorMedio = (totalValor / quantidade).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ativo}</td>
            <td>${quantidade}</td>
            <td>R$ ${valorMedio}</td>
        `;
        portfolioBody.appendChild(row);
    });
};

//essa função vai buscar a lista de ativos e apartir dela fzr um reduce somando o valor total de todos os ativos 
const atualizarResultado = () => {
    const ativos = getAtivos();
    const totalGasto = ativos.reduce((acc, { totalValor }) => acc + totalValor, 0);

    document.getElementById('resultado').innerText = `Total Investido: R$ ${totalGasto.toFixed(2)}`;
};

// aqui é pra limpar todos os dados do sistema, vai apagar histórico, compras, etc
// já que tudo é apagado e não tem volta, é necessário um botão de confirmação pra evitar erros e tal
const limparTudo = () => {
    if (confirm("Você tem certeza que deseja limpar todos os dados?")) {
        localStorage.clear();  
        atualizarResultado();  
        renderizarHistorico();  
        renderizarPortfolio();  
        renderizarGrafico();
    }
};


//const ativada na hora da inicialização, ela apresenta os dados que estão armazenados
//se for o primeiro acesso vai apresentar os valores padrão
const inicializarPagina = () => {
    atualizarResultado();  
    renderizarHistorico(); 
    renderizarPortfolio();  
};

//duas funçoes para alterar visibilidade
//quando o display tá "none" fica invisível, quando tá "block" fica visível
const toggleNovoAtivo = () => {
    const novoAtivoDiv = document.getElementById('novoAtivo');
    novoAtivoDiv.style.display = (novoAtivoDiv.style.display === 'none') ? 'block' : 'none';
};

const toggleHistorico = () => {
    const historicoContainer = document.getElementById('historicoContainer');
    const toggleBtn = document.getElementById('toggleHistorico');
    
    //se tiver "none" o botão vai fazer virar block e mudar o botão para opção de esconder
    //se tiver "block" faz o inverso
    if (historicoContainer.style.display === 'none') {
        historicoContainer.style.display = 'block';
        toggleBtn.innerText = 'Esconder Histórico';
    } else {
        historicoContainer.style.display = 'none';
        toggleBtn.innerText = 'Mostrar Histórico';
    }
};

const togglePortifolio = () => {
    const portifolioContainer = document.getElementById('portifolioContainer');
    const toggleBtn = document.getElementById('togglePortifolio');
    
    //se tiver "none" o botão vai fazer virar block e mudar o botão para opção de esconder
    //se tiver "block" faz o inverso
    if (portifolioContainer.style.display === 'none') {
        portifolioContainer.style.display = 'block';
        toggleBtn.innerText = 'Esconder Portifólio';
    } else {
        portifolioContainer.style.display = 'none';
        toggleBtn.innerText = 'Mostrar Portifólio';
    }
};


// aqui é pra adicionar as funcionalidades aos botões
//puxa pelo ID do html adiciona um evento e que recebe o parametro de click
//dps de clicar ele roda a função 
document.getElementById('adicionarAtivoBtn').addEventListener('click', adicionarAtivo);
document.getElementById('limparTudo').addEventListener('click', limparTudo);
document.getElementById('toggleNovoAtivo').addEventListener('click', toggleNovoAtivo);
document.getElementById('toggleHistorico').addEventListener('click', toggleHistorico);
document.getElementById('togglePortifolio').addEventListener('click', togglePortifolio);

// quando a pagina carrega ele roda a função de inicializar que foi definida antes 
window.onload = inicializarPagina;
