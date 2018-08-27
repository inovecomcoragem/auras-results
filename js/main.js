var answers;
var filteredAnswers;
var myGraph;

var dataFilters = {
  "function": [
    "Desenvolvedora",
    "Arquiteta de Software",
    "Gerente de Projetos",
    "Analista de Qualidade",
    "Analista de Negócios",
    "Data Science & Engineering",
    "UI / UX Designer",
    "Desenvolvedora de Infraestrutura",
    "Estrategista de Produto",
    "Information Security Consultant",
    "Operações de Negócios",
    "Líder de Negócios",
    "Estudante",
    "Outra"
  ],
  "profile": [
    'Geradora de Interações',
    'Engenheira de Hábitos',
    'Formadora de Plataformas',
    'Criadora de Possibilidades',
    'Guardiã dos Dados',
    'Mestra dos Números',
    'Criadora do Novo',
    'Realizadora de Possibilidades',
    'Mestra de Robôs',
    'Líder das Máquinas'
  ]
};

var questionFilters = {
  'Com qual dessas macrotendências tecnológicas você mais se identifica?': [
    'Interações em evolução',
    'Crescimento das Plataformas',
    'Segurança, privacidade e transparência',
    'Físico. Agora digital.',
    'Humanidade aumentada'
  ],
  'Qual dessas tecnologias produzirá o maior impacto no ecosistema de TI?': [
    'Assistentes de Voz',
    'SAAS',
    'Blockchain',
    'Biohacking',
    'Machine Learning'
  ],
  'O que você sente diante das transformações tecnológicas atuais?': [
    'Curiosidade',
    'Impulso de aprender',
    'Inspiração',
    'Receio',
    'Oportunidades'
  ],
  'Diante dessas mudanças, qual o seu maior foco?': [
    'Criar coisas novas',
    'Desenvolver habilidades',
    'Impulsionar a mudança',
    'Aprender na prática',
    'Aproveitar possibilidades'
  ],
  'Qual a sua área de atuação?': [
    'Marketing',
    'Tecnologia',
    'Pessoas',
    'Produtos',
    'Compliance'
  ],
  'Quais são seus maiores desafios atualmente?': [
    'Responder com agilidade',
    'Implementar inovações',
    'Gerar valor ao negócio',
    'Entender a tecnologia',
    'Aprender as linguagens'
  ],
  'Como você se sente em relação ao futuro?': [
    'Otimista',
    'Apreensiva',
    'Curiosa',
    'Esperançosa',
    'Assustada'
  ],
  'Qual dessas características você considera mais relevante em uma líder?': [
    'Coragem',
    'Rebeldia',
    'Conhecimento técnico',
    'Adaptabilidade',
    'Empatia'
  ]
};

var allFilters = Object.assign({}, dataFilters, questionFilters);

var questionForms = ['question-0', 'question-1'];

var pieGraphData = {
  type: "pie",
  indexLabelFontFamily: "Garamond",
  indexLabelFontSize: 20,
  indexLabel: "#percent%",
  startAngle: 0,
  showInLegend: true,
  toolTipContent:"{label}: {y}"
};

var columnGraphData = {
  type: "stackedColumn",
  showInLegend: true,
  legendText: "{legendText}",
  toolTipContent:"{label} / {legendText}: {y}"
};

function initializeGraph(){
  CanvasJS.addColorSet("customColorSet", [
    "#4f81bc",
    "#c0504d",
    "#9abb58",
    "#24bfaa",
    "#7f63a1",
    "#3abeff",
    "#f79546",
    "#000000",
    "#006a32",
    "#ffd700",
    "#ea4492",
    "#ff9cda",
    "#d5d5d0",
    "#9c8069",
    "#bf5e81",
    "#7FFF00"
  ]);

  myGraph = new CanvasJS.Chart("chart-container", {
    title: {
      text: "",
      fontFamily: "Helvetica",
      fontSize: 32,
      fontWeight: "bolder"
    },
    legend: {
      verticalAlign: "center",
      horizontalAlign: "left",
      fontSize: 20,
      fontFamily: "Helvetica"
    },
    theme: "theme2",
    data: [pieGraphData],
    colorSet:  "customColorSet"
  });
  myGraph.render();
}

window.onload = function() {
  loadJSON("data/20180827.json", function(json) {
    answers = JSON.parse(json);
    createFilterForms(dataFilters);
    filteredAnswers = processFilter(answers, getActiveFilterOptions());

    for(var i in questionForms) {
      createQuestionForm(allFilters, questionForms[i]);
    }
    initializeGraph();
  });
}

function createQuestionForm(questions, questionNameId) {
  var questionContainer = document.getElementById('question-container');

  var selectElement = document.createElement('select');
  selectElement.setAttribute('name', questionNameId);
  selectElement.setAttribute('id', questionNameId);
  selectElement.setAttribute('onchange', 'drawGraph()');
  selectElement.innerHTML = '';

  var nullOption = document.createElement('option');
  nullOption.setAttribute('value', 'null');
  nullOption.innerHTML = 'Escolha a pergunta';
  selectElement.appendChild(nullOption);

  for(var q in questions) {
    var thisOption = document.createElement('option');
    thisOption.setAttribute('value', q);
    thisOption.innerHTML = q;
    selectElement.appendChild(thisOption);
  }
  questionContainer.appendChild(selectElement);
}

function orderKeys(obj) {
  var ordered = [];
  for(var k in obj) {
    ordered.push(k);
  }
  ordered.sort(function(a, b) {
    return (a > b) ? 1 : -1;
  });
  return ordered;
}

function isObject(obj) {
  return obj === Object(obj);
}

function createAnswersCounter(tree, possibleAnswers) {
  var theseAnswers = possibleAnswers[0];

  for(var i in theseAnswers) {
    var thisAnswer = theseAnswers[i];
    if(possibleAnswers.length == 1) {
      tree[thisAnswer] = 0;
    } else {
      tree[thisAnswer] = createAnswersCounter({}, possibleAnswers.slice(1));
    }
  }

  return tree;
}

function getPossibleAnswers(selectedQuestions) {
  var possibleAnswers = [];
  selectedQuestions.slice().reverse().forEach(function(q) {
    possibleAnswers.push(allFilters[q]);
  });
  return possibleAnswers;
}

function countAnswers(selectedQuestions, answers) {
  var dataCounter = createAnswersCounter({}, getPossibleAnswers(selectedQuestions));

  for(var p in answers) {
    var thisDataSet = dataCounter;
    var person = answers[p];

    selectedQuestions.slice().reverse().forEach(function(thisQuestion) {
      var thisAnswer = person[thisQuestion];

      for(var a in person['answers']) {
        if(person['answers'][a]['question'] === thisQuestion) {
          thisAnswer = person['answers'][a]['option'];
        }
      }

      if(thisDataSet) {
        if(Number.isInteger(thisDataSet[thisAnswer])) {
          thisDataSet[thisAnswer] += 1;
        }

        thisDataSet = thisDataSet[thisAnswer];
      }
    });
  }

  return dataCounter;
}

function create2dDataSets(dataCounter) {
  var data = [];
  var answers = Object.keys(dataCounter);

  for(var i in answers) {
    var yAxis = answers[i];

    if(isObject(dataCounter[yAxis])) {
      var thisDataSet = [];
      for(var xAxis in dataCounter[yAxis]) {
        thisDataSet.push({ y: dataCounter[yAxis][xAxis], legendText: yAxis, label: xAxis });
      }
      data.push(thisDataSet);
    } else {
      data[0] = data[0] || [];
      data[0].push({ y: dataCounter[yAxis], legendText: yAxis, label: yAxis });
    }
  }
  return data;
}

function processQuestions(selectedQuestions, answers) {
  var dataCounter = countAnswers(selectedQuestions, answers);
  var data = create2dDataSets(dataCounter);
  return data;
}

function createFilterForms(filterOptions) {
  var filterContainer = document.getElementById('filter-form-container');
  filterContainer.innerHTML = '';

  for(var i in filterOptions) {
    var selectElement = document.createElement('select');
    selectElement.setAttribute('name', i);
    selectElement.setAttribute('onchange', 'updateFilter()');

    var nullOption = document.createElement('option');
    nullOption.setAttribute('value', "null");
    nullOption.innerHTML = i.replace(/^[0-9]+ ?\- /g,'');
    selectElement.appendChild(nullOption);

    for(var j in filterOptions[i]) {
      var thisOption = document.createElement('option');
      thisOption.setAttribute('value', filterOptions[i][j]);
      thisOption.innerHTML = filterOptions[i][j];
      selectElement.appendChild(thisOption);
    }

    filterContainer.appendChild(selectElement);
  }
}

function getActiveFilterOptions() {
  var filterContainer = document.getElementById('filter-form-container');
  var filterForms = filterContainer.getElementsByTagName('select');

  var activeFilters = {};

  for(var f = 0; f < filterForms.length; f++) {
    if(filterForms[f].value != "null") {
      activeFilters[filterForms[f].getAttribute('name')] = filterForms[f].value;
    }
  }
  return activeFilters;
}

function processFilter(data, filterOptions) {
  var filteredData = [];

  for(var p in data) {
    var person = data[p];
    var pushPerson = true;
    for(var question in filterOptions) {
      var activeOption = filterOptions[question];
      var personsAnswer = person[question];

      for(var q in person['answers']) {
        if(person['answers'][q]['question'] === question) {
          personsAnswer = person['answers'][q]['option'];
        }
      }

      pushPerson = pushPerson && (activeOption === personsAnswer);
    }

    if(pushPerson) {
      filteredData.push(person);
    }
  }

  document.getElementById('record-counter').innerHTML = "Número de respostas: "+filteredData.length;
  return filteredData;
}

function updateFilter() {
  filteredAnswers = processFilter(answers, getActiveFilterOptions());
  drawGraph();
}

function getSelectedQuestions() {
  var selectedQuestions = [];
  for(var i in questionForms) {
    var thisQuestion = document.getElementById(questionForms[i]).value;
    if(thisQuestion != "null"){
      selectedQuestions.push(thisQuestion);
    }
  }
  return selectedQuestions;
}

function drawGraph() {
  var selectedQuestions = getSelectedQuestions();
  var chartTitle = "";
  var dataSets = [[]];

  var relativeCheckbox = document.getElementById('relative-comparison');

  if(selectedQuestions.length > 0) {
    dataSets = processQuestions(selectedQuestions, filteredAnswers);
  }

  for(var i in selectedQuestions) {
    chartTitle += " ✕ "+selectedQuestions[i];
  }
  myGraph.title.set('text', chartTitle.substr(3), false);

  if(selectedQuestions.length > 1) {
    myGraph.set('axisX', {interval: 1, labelFontSize: 16});
    myGraph.set('data', []);
    for(var i in dataSets) {
      myGraph.addTo('data', JSON.parse(JSON.stringify(columnGraphData)));
      myGraph.data[i].set('dataPoints', dataSets[i]);
      if(relativeCheckbox.checked) {
        myGraph.data[i].set('type', 'stackedColumn100');
      }
    }
  } else {
    myGraph.set('data', [pieGraphData]);
    myGraph.data[0].set('dataPoints', dataSets[0]);
  }
}
