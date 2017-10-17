function Quiz() {
  this.questionNumber = 1;
  this.questionDiv = $('#question');
  this.timecount = 5;
  this.timerpara = $('#timer p');
  this.score = 0;
  this.evaluateAnswer = $('#evaluate');
  console.log(this.evaluateAnswer);
  this.questionNoHeading = $('h3');
}

Quiz.prototype.timer = function() {
  this.createQuestion();
  var _this = this;
  this.delay = 1000;
  this.timecount = 5;
  var x = setInterval(function() {
    _this.timerpara.text('00:0' + _this.timecount--);
    if(_this.timecount < 0) {
      _this.timerpara.text('time up');
      clearInterval(x);
    }
  },1000);
};

Quiz.prototype.checkanswer = function(answer) {
  var _this = this;
  return function() {
    if(_this.inputElement.val() == answer) {
      _this.evaluateAnswer.text('correct answer');
      _this.score++;
    } else {
      _this.evaluateAnswer.text('incorrect answer');
    }
  };
};


Quiz.prototype.createQuestion = function() {
  var number1 = Math.ceil(Math.random() * 20),
      number2 = Math.ceil(Math.random() * 20),
      operators = ['+', '-', '*', '/'],
      randomOperatorIndex = Math.floor(Math.random() * 4),
      answer = eval(number1 + operators[randomOperatorIndex] + number2);
  this.inputElement = $('<input>', { type: "text" });
  this.submitElement = $('<input>', { type: "submit", value: "submit" });
  this.questionNoHeading.text("Question Number: " + this.questionNumber++);
  this.questionDiv.text(number1 + ' ' + operators[randomOperatorIndex] + ' ' + number2 + ' = ');
  this.questionDiv.append(this.inputElement, '<br>', this.submitElement);
  this.evaluateAnswer.text('');
  this.submitElement.click(this.checkanswer(answer));
};

Quiz.prototype.showScore = function() {
  this.questionNoHeading.text('Your Score is : ' + this.score);
  this.timerpara.text('');
  this.evaluateAnswer.text('');
  this.questionDiv.text('');
}

Quiz.prototype.startQuiz = function() {
  var _this = this;
  this.questionDelay = 7000;

  var x = setInterval(function() {
    _this.timer();
    if(_this.questionNumber > 20) {
      _this.showScore();
      clearInterval(x);
    }
  },7000);
};
Quiz.prototype.startQuizInterval = function() {
  var startTime = 5,
      _this = this;
  var x = setInterval(function() {
    _this.questionDiv.text('Quiz about to start in ' + startTime-- + ' seconds');
    if (startTime < 0) {
      clearInterval(x);
    }
  }, 1000);
};

Quiz.prototype.init = function() {
  this.startQuizInterval();
  this.startQuiz();
};

$(document).ready(function() {
  var quizObject = new Quiz();
  quizObject.init();
});
