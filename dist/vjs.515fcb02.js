// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var quizId = 9;
var urlCategories = 'https://opentdb.com/api_category.php',
    urlQuestions = void 0;
var index = 0;
var answer = void 0;
var quizQuestions = [];
var quizAnswers = 0;

var Quizes = function () {
    function Quizes() {
        _classCallCheck(this, Quizes);
    }

    _createClass(Quizes, [{
        key: 'showCategories',
        value: function showCategories(data) {

            var categories = data.trivia_categories,
                categoriesBox = document.querySelector('.categories'),
                categoryLink = void 0;

            categories.map(function (item, index) {

                categoryLink = document.createElement('span');
                categoryLink.setAttribute('href', item.id);
                categoryLink.setAttribute('class', 'category-item');
                categoryLink.setAttribute('data-id', item.id);
                categoryLink.innerHTML = item.name;
                categoriesBox.appendChild(categoryLink);
            });

            clickHandle();
        }
    }, {
        key: 'showQuizes',
        value: function showQuizes(data, ifChange) {

            if (quizQuestions.length == 0 || ifChange === true) {
                quizQuestions = data.results;
            }

            var prevQuizBox = document.querySelector('.quiz-box') || [];

            var delPrev = new Promise(function (resolve, reject) {
                if (prevQuizBox.length != 0) {
                    resolve(prevQuizBox.remove());
                } else {
                    reject(createQuiz(quizQuestions), answerClick());
                }
            });

            delPrev.then(function (res) {

                createQuiz(quizQuestions);
            }).then(function () {
                answerClick();
            });
        }
    }]);

    return Quizes;
}();

var quiz = new Quizes();

var grab = function grab(url) {
    var quizAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var ifChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    fetch(url, {
        method: 'GET'
    }).then(function (response) {
        if (response.status != 200) {}
        response.json().then(function (data) {
            quizAction(data, ifChange);
        });
    });
};

grab(urlCategories, quiz.showCategories);

var changeLink = function changeLink() {
    var quizId = history.state.id;

    return urlQuestions = 'https://opentdb.com/api.php?amount=20&category=' + quizId + '&type=multiple';
};

var browserLink = function browserLink(id) {

    var getPath = window.location.pathname.split('/');
    var quizId = {
        id: id
    };
    if (getPath[1] === 'quiz') {
        history.pushState(quizId, 'Quiz', id);
    } else {
        history.pushState(quizId, 'Quiz', 'quiz/' + id);
    }
};

var clickHandle = function clickHandle() {
    var categoryItem = document.querySelectorAll('.category-item');
    var chooseCat = document.querySelector('.category-title');

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = categoryItem[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            item = _step.value;


            item.addEventListener('click', function (e) {

                var itemAttr = e.target.getAttribute('data-id');
                chooseCat.innerHTML = e.target.innerHTML;
                browserLink(itemAttr);
                var link = changeLink();
                quizQuestions = [];
                quizAnswers = 0;
                var scoreQuizBox = document.querySelector('.score-box') || [];
                scoreQuizBox.length === 0 ? null : scoreQuizBox.remove();
                index = 0;

                grab(link, quiz.showQuizes, true);
            }, false);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

var answerClick = function answerClick() {
    var answers = document.querySelectorAll('.quiz-box p');

    var _loop = function _loop(_answer) {

        _answer.addEventListener('click', function () {

            index = index + 1;

            var link = changeLink();
            answerId = _answer.getAttribute('data-id');
            var quizId = _answer.parentNode.getAttribute('quiz-id');

            quizQuestions[quizId].userAnswer = answerId;

            quiz.showQuizes();
        });
    };

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = answers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _answer = _step2.value;

            _loop(_answer);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
};

var createQuiz = function createQuiz(quiz) {
    var quizesBox = document.querySelector('.quizes-box');
    quizBox = document.createElement('div');
    quizesBox.appendChild(quizBox);
    quizBox.setAttribute('class', 'quiz-box');

    if (index <= 19) {
        for (var _item in quiz) {

            if (_item == index) {
                quizBox.setAttribute('quiz-id', _item);
                quizTitle = document.createElement('h1');
                quizTitle.innerHTML = quiz[_item].question;
                quizBox.appendChild(quizTitle);

                for (var i = 0; i < 4; i++) {

                    if (i == 3) {
                        answer = quiz[_item].correct_answer;
                    } else {
                        answer = quiz[_item].incorrect_answers[i];
                    }

                    quizQuestion = document.createElement('p');
                    quizQuestion.setAttribute('data-id', answer);
                    quizQuestion.innerHTML = answer;
                    quizBox.appendChild(quizQuestion);
                }
            }
        }
    } else {
        showScores();
    }
};

var showScores = function showScores() {
    var quizesBox = document.querySelector('.quizes-box');
    quizBox = document.createElement('div');
    quizesBox.appendChild(quizBox);
    quizBox.setAttribute('class', 'score-box');

    var questionBox = void 0;
    quizQuestions.map(function (item) {

        questionBox = document.createElement('div');
        questionBox.setAttribute('class', 'question');
        quizBox.appendChild(questionBox);
        quizTitle = document.createElement('h1');
        quizTitle.innerHTML = item.question;
        questionBox.appendChild(quizTitle);
        var correctClass = 'incorrect';
        for (var i = 0; i < 4; i++) {

            if (i == 3) {
                answer = item.correct_answer;
            } else {
                answer = item.incorrect_answers[i];
            }

            if (item.userAnswer === answer && item.userAnswer === item.correct_answer) {
                correctClass = 'correct';
                quizAnswers++;
            } else if (item.userAnswer === answer && item.userAnswer != item.correct_answer) {
                correctClass = 'incorrect';
            } else {
                correctClass = '';
            }

            quizQuestion = document.createElement('p');
            quizQuestion.setAttribute('data-id', i);
            quizQuestion.setAttribute('class', correctClass);
            quizQuestion.innerHTML = answer;
            questionBox.appendChild(quizQuestion);
        }
    });
};
},{}],9:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55875' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[9,3])
//# sourceMappingURL=/vjs.515fcb02.map