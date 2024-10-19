// Função para renderizar o gráfico
const renderizarGrafico = (tipoGrafico) => {
    const ativos = getAtivos(); // Supõe que getAtivos já está definida em outro lugar
    const labels = ativos.map(ativo => ativo.ativo);

    const data = tipoGrafico === 'quantidade'
        ? ativos.map(ativo => ativo.quantidade)
        : ativos.map(ativo => (ativo.totalValor / ativo.quantidade).toFixed(2));

    const titleText = tipoGrafico === 'quantidade'
        ? "Distribuição por Quantidade Total"
        : "Distribuição por Valor Médio";

    // Altera o texto do título do gráfico
    document.getElementById('portifolioTitulo').textContent = titleText;

    const ctx = document.getElementById('pieChart').getContext('2d');

    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();  // Destroi o gráfico anterior para evitar sobreposição
    }

    // Renderiza o novo gráfico
    window.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
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

// Função para inicializar o gráfico com o valor padrão
const inicializarGrafico = () => {
    const tipoGraficoSelect = document.getElementById('tipoGrafico');
    renderizarGrafico(tipoGraficoSelect.value);

    // Alterar o gráfico ao mudar a seleção
    tipoGraficoSelect.addEventListener('change', (event) => renderizarGrafico(event.target.value));
};

// Inicializa o gráfico ao carregar a página
document.addEventListener('DOMContentLoaded', inicializarGrafico);
