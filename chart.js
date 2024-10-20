// Função para renderizar o gráfico
const renderizarGrafico = (tipoGrafico) => {
    const ativos = getAtivos();  
    const labels = ativos.map(ativo => ativo.ativo);//aqui é só p puxar os nomes de cada ativos pra dps trackear no grafico

    //essa aq é pra definir qual tipo de dado o grafico vai tratar
    const data = tipoGrafico === 'quantidade'
        ? ativos.map(ativo => ativo.quantidade)
        : ativos.map(ativo => (ativo.totalValor / ativo.quantidade).toFixed(2));

        //se selecionar quantidade a frase no topo aparece sobre quantidade, se não, aparece sobre valor médio
    const tituloGrafico = tipoGrafico === 'quantidade'
        ? "Distribuição por Quantidade Total"
        : "Distribuição por Valor Médio";

    // atualiza o titulo do grafico 
    document.getElementById('portifolioTitulo').textContent = tituloGrafico;

    //essa linha é diretamente ligada com o canvas do html
    //ela determina o contexto que vai ser usado para a criação do grafico 
    //dps de definir com contexto como '2d' uma API é utilizada para dar forma ao grafico
    const ctx = document.getElementById('pieChart').getContext('2d');

    //um if para evitar que os graficos se sobreponham
    //quando um novo grafico é criado, o anterior automaticamente se destroi
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();  
    }

    // Renderiza o novo gráfico
    window.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#4169E1', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6347', '#48D1CC', '#8A2BE2', '#00CED1'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

// inicializa o gráfico com o valor padrão
const inicializarGrafico = () => {
    const tipoGraficoSelect = document.getElementById('tipoGrafico');
    renderizarGrafico(tipoGraficoSelect.value);

    // é um evento que faz com que sempre que o usuário mude o grafico ele seja renderizado dnv
    tipoGraficoSelect.addEventListener('change', (event) => renderizarGrafico(event.target.value));
};

// faz a função de inicializar o grafico rodar quando a pagina é atualizada 
document.addEventListener('DOMContentLoaded', inicializarGrafico);
