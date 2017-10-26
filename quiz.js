function Quiz(data) {
  this.quizContainer = data.quizContainer;
  this.questionNumber = 0;
  this.questionDiv = this.quizContainer.find(data.questionDiv);
  this.timerpara = this.quizContainer.find(data.timerpara);
  this.score = 0;
  this.evaluateAnswer = this.quizContainer.find(data.evaluateAnswer);
  this.questionNoHeading = this.quizContainer.find(data.questionNoHeading);
  this.storeQuestion = {};
  this.scoreBoard = this.quizContainer.find(data.scoreBoard);
  this.solutionsHeading = this.quizContainer.find(data.solutionsHeading);
  this.questionDelayValue = data.questionDelayValue;
  this.numberOfQuestions = data.numberOfQuestions;
  this.operators = data.opertorArray;
  this.operandUpperLimit = data.operandUpperLimit;
  this.operandLowerLimit = data.operandLowerLimit;
  this.inputElement = this.quizContainer.find(data.inputElement);
  this.submitElement = this.quizContainer.find(data.submitElement);
  this.questionDisplay = this.quizContainer.find(data.questionDisplay);
}

Quiz.prototype.startQuiz = function() {
  var _this = this;
  this.timer = this.questionDelayValue;
  this.timerInterval = setInterval(function() {
    if(_this.questionNumber < _this.numberOfQuestions) {
      if(_this.timer <= 0) {
        _this.savequestion();
        _this.createQuestion();
        _this.timer = _this.questionDelayValue;
      } else {
        _this.timerpara.text('00:0' + _this.timer--);
      }
    } else {
      _this.showScore();
    }
  },1000);
  this.createQuestion();
};


Quiz.prototype.savequestion = function() {
  this.storeQuestion[this.questionNumber] = {
    number1: this.number1,
    operator: this.operators[this.randomOperatorIndex],
    number2: this.number2,
    answerGiven: this.inputElement.val(),
    correctAnswer: this.answer
  };
};

Quiz.prototype.checkanswer = function() {
  var _this = this;
  return function() {
    _this.inputElement.prop("disabled", true);
    if(_this.inputElement.val() == _this.answer) {
      _this.evaluateAnswer.text('correct answer');
      _this.score++;
      _this.isCorrect = true;
    } else {
      _this.isCorrect = false;
      _this.evaluateAnswer.text('incorrect answer');
      _this.savequestion();
    }
    _this.timer = 0;
    _this.startQuiz();
  };
};

Quiz.prototype.createQuestion = function() {
  this.number1 = Math.ceil(Math.random() * this.operandUpperLimit) + this.operandLowerLimit;
  this.number2 = Math.ceil(Math.random() * this.operandUpperLimit) + this.operandLowerLimit;
  this.randomOperatorIndex = Math.floor(Math.random() * this.operators.length);
  this.answer = Math.round(eval(this.number1 + this.operators[this.randomOperatorIndex] + this.number2) * 100) / 100;
  this.questionNoHeading.text("Question Number: " + ++this.questionNumber);
  this.question = this.number1 + ' ' + this.operators[this.randomOperatorIndex] + ' ' + this.number2 ;
  this.questionDisplay.text(this.question);
  this.evaluateAnswer.text('');
  this.scoreBoard.text('Score: ' + this.score);
  this.submitElement.show();
  this.inputElement.show();
  this.inputElement.prop("disabled", false);
  this.inputElement.val('');
};

Quiz.prototype.showScore = function() {
  console.log(this.storeQuestion);
  this.questionNoHeading.text('Your Score is : ' + this.score);
  this.timerpara.text('');
  this.evaluateAnswer.text('');
  this.questionDiv.text('');
  this.timerpara.text('');
  this.scoreBoard.text('');
  if(Object.keys(this.storeQuestion).length > 0) {
    this.solutionsHeading.text('Unanswered Questions or wrong answered');
    var table = $('<table>', { id: "solutionTable"} ),
        tableRow = $('<tr>'),
        questionColumnHeading = $('<th>').text('Question no'),
        number1ColumnHeading = $('<th>').text('First Number'),
        operatorColumnHeading = $('<th>').text('Operator'),
        number2ColumnHeading = $('<th>').text('Second Number'),
        givenAnswerHeading = $('<th>').text('Given Answer'),
        correctAnswerHeading = $('<th>').text('Correct Answer');
    tableRow.appendTo(table);
    tableRow.append(questionColumnHeading, number1ColumnHeading, operatorColumnHeading, number2ColumnHeading, givenAnswerHeading, correctAnswerHeading);
    for(var key in this.storeQuestion) {
      if(this.storeQuestion[key]['answerGiven'] != this.storeQuestion[key]['correctAnswer']) {
        var questionDataRow = $('<tr>'),
            questionNo = $('<td>').text(key);
        questionDataRow.appendTo(table);
        questionNo.appendTo(questionDataRow);
        for(var key2 in this.storeQuestion[key]) {
          var questionData = $('<td>').text(this.storeQuestion[key][key2]);
          questionData.appendTo(questionDataRow);
        }
      }
    }
    table.appendTo(this.evaluateAnswer);
  } else {
    this.solutionsHeading.text('Great. You answered all questions correctly');
  }
};

Quiz.prototype.enterSubmit = function() {
  var _this = this;
  this.inputElement.keyup(function(event) {
    if(event.keyCode == 13) {
      _this.submitElement.trigger('click');
    }
  });
};

Quiz.prototype.init = function() {
  this.submitElement.click(this.checkanswer());
  this.enterSubmit();
  this.startQuiz();
};

$(document).ready(function() {
  var data = {
    quizContainer: $('div[data-quiz="container"]'),
    questionDiv: 'div[data-div="question"]',
    timerpara: 'div[data-timer="questionTimer"] p',
    evaluateAnswer: 'div[data-evaluate="evaluateAnswer"]',
    questionNoHeading: 'h3[data-questionDetails="questionNumber"]',
    scoreBoard: 'h4[data-score="scoreBoard"]',
    solutionsHeading: 'h4[data-heading="solutions"]',
    questionDelayValue: 9,
    numberOfQuestions: 3,
    opertorArray: ['+'],
    operandUpperLimit: 20,
    operandLowerLimit: 0,
    inputElement: 'input[data-input="answer"]',
    submitElement: 'input[data-input="submitBtn"]',
    questionDisplay: 'h4[data-question="display"]'
  },
  quizObject = new Quiz(data);
  quizObject.init();

  var data2 = {
    quizContainer: $('div[data-quiz="container2"]'),
    questionDiv: 'div[data-div="question"]',
    timerpara: 'div[data-timer="questionTimer"] p',
    evaluateAnswer: 'div[data-evaluate="evaluateAnswer"]',
    questionNoHeading: 'h3[data-questionDetails="questionNumber"]',
    scoreBoard: 'h4[data-score="scoreBoard"]',
    solutionsHeading: 'h4[data-heading="solutions"]',
    questionDelayValue: 9,
    numberOfQuestions: 3,
    opertorArray: ['-'],
    operandUpperLimit: 20,
    operandLowerLimit: 0,
    inputElement: 'input[data-input="answer"]',
    submitElement: 'input[data-input="submitBtn"]',
    questionDisplay: 'h4[data-question="display"]'
  },
  quizObject2 = new Quiz(data2);
  quizObject2.init();
});
