// Abrir e chegar pop-up de importação
document.getElementById('openImportPopup').addEventListener('click', function () {
    document.getElementById('popupImportContainer').style.display = 'block';
});

document.getElementById('closeImportPopup').addEventListener('click', function () {
    document.getElementById('popupImportContainer').style.display = 'none';
});


//Abrir e fechar pop-up de Predict
document.getElementById('openPredictPopup').addEventListener('click', function () {
    document.getElementById('popupPredictContainer').style.display = 'block';
});

document.getElementById('closePredictPopup').addEventListener('click', function () {
    document.getElementById('popupPredictContainer').style.display = 'none';
});


//Abrir e fechar pop-up de Predict
document.getElementById('openDatabasePopup').addEventListener('click', function () {
    document.getElementById('popupDatabaseContainer').style.display = 'block';
});

document.getElementById('closeDatabasePopup').addEventListener('click', function () {
    document.getElementById('popupDatabaseContainer').style.display = 'none';
});


//Abrir e fechar pop-up de About
document.getElementById('openAboutPopup').addEventListener('click', function () {
    document.getElementById('popupAboutContainer').style.display = 'block';
});

document.getElementById('closeAboutPopup').addEventListener('click', function () {
    document.getElementById('popupAboutContainer').style.display = 'none';
});

// Carregando os gráficos 
plotsLinha = document.getElementById("canvasGraficoLinha");
plotsBarra = document.getElementById("canvasGraficoBarra");

var database = {}

// Função para ler o arquivo do excel
function readExcelFile(file) {

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });


            if (jsonData.length === 0) {
                reject('O arquivo está vazio.');
                return;
            }

            const headers = jsonData[0];
            const objects = [];

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                const object = {};

                for (let j = 0; j < headers.length; j++) {
                    const header = headers[j];
                    const value = row[j];
                    object[header] = value;
                }

                objects.push(object);
            }

            resolve(objects);
        };

        reader.onerror = function (e) {
            reject('Erro ao ler o arquivo.');
        };

        reader.readAsArrayBuffer(file);
    });
}

// Evento para o seletor de arquivo
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    readExcelFile(file)
        .then(function (objects) {
            database = objects;
            console.log(database);

            plotChartLine();
            createTable();

            document.getElementById("openImportPopup").style.display = "none";
            document.getElementById("openDatabasePopup").style.display = "Block";

            document.getElementById('popupImportContainer').style.display = 'none';
            document.getElementById('popupDatabaseContainer').style.display = 'Block';
        })
        .catch(function (error) {
            console.error(error);
        });
});

// Função para criar o grafico de linhas
function plotChartLine() {

    // Criando uma instância do objeto de gráfico:
    new Chart(plotsLinha, {
        type: 'line', // Declarando o tipo de gráfico
        data: {
            labels: database.map(database => database.Date), // Dados do Eixo X 
            datasets: [{
                data: database.map(database => database.Open), // Dados do Eixo Y
                backgroundColor: 'blue',
                borderColor: '#F7B801',
                fill: false,
                label: 'Open',
            }, {
                data: database.map(database => database.High), // Dados do Eixo Y
                backgroundColor: 'red',
                borderColor: '#F7B801',
                fill: false,
                label: 'High',
            }, {
                data: database.map(database => database.Low), // Dados do Eixo Y
                backgroundColor: 'yellow',
                borderColor: '#F7B801',
                fill: false,
                label: 'Low',
            }, {
                data: database.map(database => database.Close), // Dados do Eixo Y
                backgroundColor: 'green',
                borderColor: '#F7B801',
                fill: false,
                label: 'Close',
            }
            ]
        },
    });
}

// Função para criar o gráfico de barras
function plotChartBar(obj) {
    // Criando uma instância do objeto de gráfico:
    new Chart(plotsBarra, {
        type: 'bar', // Declarando o tipo de gráfico
        data: {
            labels: ["Open", "High", "Low", "Close"],
            datasets: [{
                data: obj, // Dados do eixo Y
                backgroundColor: '#F7B801',
            }]
        },
        options: {
            legend: { display: false },
        }
    });
}

// Função que cria a tabela exibindo o Dataset
function createTable() {
    // Obtém a referência do elemento onde a tabela será inserida
    var tabela = document.getElementById("tabela");

    // Cria o cabeçalho da tabela
    var cabecalho = tabela.createTHead();
    var cabecalhoLinha = cabecalho.insertRow();

    // Obtém as chaves do primeiro objeto para criar as colunas do cabeçalho
    var colunas = Object.keys(database[0]);
    colunas.forEach(function (coluna) {
        var th = document.createElement("th");
        th.textContent = coluna;
        cabecalhoLinha.appendChild(th);
    });

    // Cria as linhas da tabela com os dados dos objetos
    var corpo = tabela.createTBody();
    database.forEach(function (valores) {
        var linha = corpo.insertRow();
        colunas.forEach(function (coluna) {
            var celula = linha.insertCell();
            celula.textContent = valores[coluna];
        });
    });
}

// Prever Valores

// Constantes com coeficientes da Função Polinomial
const openCoeficients = [42.2213065613469,
    -0.316828085280122,
    0.00114113880502034,
    -0.00000206945008015759,
    0.00000000231995799380876,
    -0.00000000000167302374729919,
    0.000000000000000773035448382767,
    -0.000000000000000000224978701998228,
    0.0000000000000000000000396709600143736,
    -0.00000000000000000000000000386143874294994,
    0.000000000000000000000000000000159047326258748];

const highCoeficients = [42.3624829671171,
    -0.312416149234892,
    0.0011207819676466,
    -0.0000020298299007201,
    0.00000000228176194210888,
    -0.00000000000165309745257443,
    0.000000000000000767315955225676,
    -0.000000000000000000224151768648135,
    0.0000000000000000000000396382756937877,
    -0.00000000000000000000000000386641002833309,
    0.000000000000000000000000000000159495651258602];

const lowCoeficients = [42.0730071662983,
    -0.322088078801926,
    0.00116319518857266,
    -0.00000210658361580244,
    0.00000000234708804555224,
    -0.00000000000167942506094063,
    0.000000000000000770404306888234,
    -0.000000000000000000222868422325534,
    0.0000000000000000000000391070494378696,
    -0.00000000000000000000000000379125469173012,
    0.000000000000000000000000000000155627807044883];

const closeCoeficients = [42.3463150249445,
    -0.318991897234994,
    0.00114512058230214,
    -0.00000206655253675222,
    0.00000000230462384937608,
    -0.00000000000165493132541736,
    0.000000000000000762318654945793,
    -0.000000000000000000221354926425088,
    0.0000000000000000000000389615052123275,
    -0.00000000000000000000000000378649145380385,
    0.00000000000000000000000000000015573814412347];

    // Converter valores em data
function convertDate (dia, mes, ano) {
    return new Date(ano, mes, dia);
};

// Função que calcula o valor final
function PolynomialFunction(vector, x, i) {

    if (i == 0) {
        return vector[i];
    }
    else {
        return vector[i] * Math.pow(x, i) + PolynomialFunction(vector, x, i - 1);
    }
}

// Evento para capturar a data escolhida pelo usuário, e calcular o valor do ouro na data selecionada.
document.getElementById('predictButton').addEventListener('click', function () {

    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    const lastDate = convertDate(13, 04, 2023);
    const predictDate = convertDate(day, month, year);

    const differenceInDays = (predictDate - lastDate) / (1000 * 60 * 60 * 24);

    const x = differenceInDays + 4812;
    console.log("Difference in days: " + differenceInDays)

    const PredictOpen = PolynomialFunction(openCoeficients, x, openCoeficients.length - 1);
    const PredictHigh = PolynomialFunction(highCoeficients, x, highCoeficients.length - 1);
    const PredictLow = PolynomialFunction(lowCoeficients, x, lowCoeficients.length - 1);
    const PredictClose = PolynomialFunction(closeCoeficients, x, closeCoeficients.length - 1);

    console.log("Open: " + PredictOpen);
    console.log("High: " + PredictHigh);
    console.log("Low: " + PredictLow);
    console.log("Close: " + PredictClose);

    const predictedValues = [PredictOpen, PredictHigh, PredictLow, PredictClose]

    console.log(predictedValues);
    plotChartBar(predictedValues);

    result = document.getElementById("result").innerHTML = "Open: R$" + PredictOpen.toFixed(2) +
        "<br>High: R$" + PredictHigh.toFixed(2) +
        "<br>Low: R$" + PredictLow.toFixed(2) +
        "<br>Close: R$" + PredictClose.toFixed(2);
});

