function Quiz(data) {
  this.questionNumber = 0;
  this.questionDiv = data.questionDiv;
  this.timecount = 5;
  this.timerpara = data.timerpara;
  this.score = 0;
  this.evaluateAnswer = data.evaluateAnswer;
  this.questionNoHeading = data.questionNoHeading;
  this.isCorrect = false;
  this.storeQuestion = {};
  this.scoreBoard = data.scoreBoard;
}

Quiz.prototype.timer = function() {
  this.createQuestion();
  var _this = this;
  this.delay = 1000;
  this.timecount = 5;
  this.thirdInterval = setInterval(function() {
    _this.timerpara.text('00:0' + _this.timecount--);
    if(_this.timecount < 0) {
      if(_this.timecount == -3) {
        if(_this.isCorrect) {
          _this.timerpara.text('good');
        } else {
          _this.timerpara.text('bad');
        }
      } else {
         _this.evaluateAnswer.text('time up');
         _this.timerpara.text('be quick');
         _this.savequestion();
      }
      clearInterval(_this.thirdInterval);
    }
  },1000);
};

Quiz.prototype.savequestion = function() {
  this.storeQuestion[this.question] = this.answer;
}

Quiz.prototype.checkanswer = function(answer) {
  var _this = this;
  return function() {
    _this.timecount = -2;
    if(_this.inputElement.val() == answer) {
      _this.evaluateAnswer.text('correct answer');
      _this.score++;
      _this.isCorrect = true;
    } else {
      _this.evaluateAnswer.text('incorrect answer');
      _this.isCorrect = false;
      _this.savequestion();
    }
  };
};


Quiz.prototype.createQuestion = function() {
  this.number1 = Math.ceil(Math.random() * 20);
  this.number2 = Math.ceil(Math.random() * 20);
  this.operators = ['+', '-', '*', '/'];
  this.randomOperatorIndex = Math.floor(Math.random() * 4);
  this.answer = eval(this.number1 + this.operators[this.randomOperatorIndex] + this.number2);
  this.inputElement = $('<input>', { type: "text" });
  this.submitElement = $('<input>', { type: "submit", value: "submit" });
  this.questionNoHeading.text("Question Number: " + ++this.questionNumber);
  this.question = this.number1 + ' ' + this.operators[this.randomOperatorIndex] + ' ' + this.number2 + ' = ';
  this.questionDiv.text(this.question);
  this.questionDiv.append(this.inputElement, '<br>', this.submitElement);
  this.evaluateAnswer.text('');
  this.scoreBoard.text('Score: ' + this.score);
  this.submitElement.click(this.checkanswer(this.answer));
};

Quiz.prototype.showScore = function() {
  this.questionNoHeading.text('Your Score is : ' + this.score);
  this.timerpara.text('');
  this.evaluateAnswer.text('');
  this.questionDiv.text('');
  this.timerpara.text('');
  this.scoreBoard.text('');
  for(var key in this.storeQuestion) {
    var paraElement = $('<p>').text(key + this.storeQuestion[key]);
    paraElement.appendTo(this.evaluateAnswer);
  }
};

Quiz.prototype.startQuiz = function() {
  var _this = this;
  this.questionDelay = 7000;
  this.secondInterval = setInterval(function() {
    _this.timer();
    if(_this.questionNumber > 3) {
      clearInterval(_this.secondInterval);
      clearInterval(_this.thirdInterval);
      _this.showScore();
    }
  }, _this.questionDelay);
};

Quiz.prototype.startQuizInterval = function() {
  var startTime = 5,
      _this = this;
  this.firstInterval = setInterval(function() {
    _this.questionDiv.text('Quiz about to start in ' + startTime-- + ' seconds');
    if (startTime < 0) {
      clearInterval(_this.firstInterval);
    }
  }, 1000);
};

Quiz.prototype.init = function() {
  this.startQuizInterval();
  this.startQuiz();
};

$(document).ready(function() {
  var data = {
    questionDiv: $('#question'),
    timerpara: $('#timer p'),
    evaluateAnswer: $('#evaluate'),
    questionNoHeading: $('#questionNumber'),
    scoreBoard: $('#score')
  },
  quizObject = new Quiz(data);
  quizObject.init();
});
