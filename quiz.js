function Quiz(data) {
  this.questionNumber = 0;
  this.questionDiv = data.questionDiv;
  this.timerpara = data.timerpara;
  this.score = 0;
  this.evaluateAnswer = data.evaluateAnswer;
  this.questionNoHeading = data.questionNoHeading;
  this.isCorrect = false;
  this.storeQuestion = {};
  this.scoreBoard = data.scoreBoard;
  this.solutionsHeading = data.solutionsHeading;
  this.questionDelayValue = data.questionDelayValue;
  this.numberOfQuestions = data.numberOfQuestions;
  this.timerDelayValue = data.timerDelayValue;
  this.timerCountValue = data.timerCountValue;
  this.operators = data.opertorArray;
  this.operandUpperLimit = data.operandUpperLimit;
  this.operandLowerLimit = data.operandLowerLimit;
  this.inputElement = data.inputElement;
  this.submitElement = data.submitElement;
  this.questionDisplay = data.questionDisplay;
}

Quiz.prototype.timer = function() {
  this.createQuestion();
  var _this = this;
  this.delay = this.timerDelayValue;
  this.timecount = this.timerCountValue;
  this.inputElement.prop("disabled", false);
  this.inputElement.val('');
  this.thirdInterval = setInterval(function() {
    _this.timerpara.text('00:0' + _this.timecount--);
    if(_this.timecount < 0) {
      _this.evaluateAnswer.text('time up');
      _this.timerpara.text('NextQuestion');
      if(!_this.isClicked) {
        _this.submitElement.trigger('click');
      } else if(!_this.inputElement.val()) {
        _this.savequestion();
      }
      clearInterval(_this.thirdInterval);
    }
  },this.delay);
};

Quiz.prototype.savequestion = function() {
  this.storeQuestion[this.questionNumber] = {
    number1: this.number1,
    operator: this.operators[this.randomOperatorIndex],
    number2: this.number2,
    answerGiven: this.inputElement.val(),
    correctAnswer: this.answer
  };
}

Quiz.prototype.checkanswer = function() {
  var _this = this;
  return function() {
    _this.isClicked = true;
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
  this.isClicked = false;
};

Quiz.prototype.showScore = function() {
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
    table.appendTo(this.evaluateAnswer);
    tableRow.appendTo(table);
    tableRow.append(questionColumnHeading, number1ColumnHeading, operatorColumnHeading, number2ColumnHeading, givenAnswerHeading, correctAnswerHeading);
    for(var key in this.storeQuestion) {
      var questionDataRow = $('<tr>'),
          questionNo = $('<td>').text(key);
      questionDataRow.appendTo(table);
      questionNo.appendTo(questionDataRow);
      for(var key2 in this.storeQuestion[key]) {
        var questionData = $('<td>').text(this.storeQuestion[key][key2]);
        questionData.appendTo(questionDataRow);
      }
    }
  } else {
    this.solutionsHeading.text('Great. You answered all questions correctly');
  }
};

Quiz.prototype.startQuiz = function() {
  var _this = this;
  this.questionDelay = this.questionDelayValue;
  this.secondInterval = setInterval(function() {
    if(_this.questionNumber > _this.numberOfQuestions - 1) {
      clearInterval(_this.secondInterval);
      clearInterval(_this.thirdInterval);
      _this.showScore();
    } else {
      _this.timer();
    }
  }, _this.questionDelay);
};

Quiz.prototype.startQuizInterval = function() {
  var startTime = 5,
      _this = this;
  this.firstInterval = setInterval(function() {
    _this.questionDisplay.text('Quiz about to start in ' + startTime-- + ' seconds');
    _this.timerpara.text('get ready');
    if (startTime < 0) {
      clearInterval(_this.firstInterval);
    }
  }, this.timerDelayValue);
};

Quiz.prototype.init = function() {
  this.startQuizInterval();
  this.submitElement.click(this.checkanswer());
  this.startQuiz();
};

$(document).ready(function() {
  var data = {
    questionDiv: $('#question'),
    timerpara: $('#timer p'),
    evaluateAnswer: $('#evaluate'),
    questionNoHeading: $('#questionNumber'),
    scoreBoard: $('#score'),
    solutionsHeading: $('#solutions'),
    questionDelayValue: 7000,
    numberOfQuestions: 2,
    timerDelayValue: 1000,
    timerCountValue: 5,
    opertorArray: ['+', '-', '*', '/'],
    operandUpperLimit: 20,
    operandLowerLimit: 0,
    inputElement: $('input[data-input="answer"]'),
    submitElement: $('input[data-input="submitBtn"]'),
    questionDisplay: $('h4[data-question="display"]')
  },
  quizObject = new Quiz(data);
  quizObject.init();
});
