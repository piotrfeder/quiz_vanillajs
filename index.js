let quizId = 9;
let urlCategories = 'https://opentdb.com/api_category.php',
    urlQuestions;
let index = 0;
let answer;
let quizQuestions = [];
let quizAnswers = 0;

class Quizes {

    showCategories(data) {

        let categories = data.trivia_categories,
            categoriesBox = document.querySelector('.categories'),
            categoryLink;

        categories.map((item, index) => {

            categoryLink = document.createElement('span');
            categoryLink.setAttribute('href', item.id);
            categoryLink.setAttribute('class', 'category-item');
            categoryLink.setAttribute('data-id', item.id);
            categoryLink.innerHTML = (item.name);
            categoriesBox.appendChild(categoryLink)

        })

        clickHandle();
    }

    showQuizes(data, ifChange) {




        if (quizQuestions.length == 0 || ifChange === true) {
            quizQuestions = data.results;
        }



        let prevQuizBox = document.querySelector('.quiz-box') || [];




        let delPrev = new Promise((resolve, reject) => {
            if (prevQuizBox.length != 0) {
                resolve(prevQuizBox.remove());
            } else {
                reject(createQuiz(quizQuestions), answerClick());
            }
        })




        delPrev.then((res) => {

            createQuiz(quizQuestions);
        }).then(() => {
            answerClick();
        })




    }



}


let quiz = new Quizes();




let grab = (url, quizAction = '', ifChange = false) => {
    fetch(url, {
        method: 'GET'
    }).then(response => {
        if (response.status != 200) {}
        response.json().then((data) => {
            quizAction(data, ifChange);

        })

    })
}



grab(urlCategories, quiz.showCategories);

let changeLink = () => {
    let quizId = history.state.id;

    return urlQuestions = `https://opentdb.com/api.php?amount=20&category=${quizId}&type=multiple`;

}


let browserLink = (id) => {

    let getPath = window.location.pathname.split('/');
    let quizId = {
        id: id
    };
    if (getPath[1] === 'quiz') {
        history.pushState(quizId, 'Quiz', id);
    } else {
        history.pushState(quizId, 'Quiz', 'quiz/' + id);
    }

}


let clickHandle = () => {
    let categoryItem = document.querySelectorAll('.category-item');
    let chooseCat = document.querySelector('.category-title');

    for (item of categoryItem) {

        item.addEventListener('click', (e) => {

            let itemAttr = e.target.getAttribute('data-id');
            chooseCat.innerHTML = e.target.innerHTML;
            browserLink(itemAttr);
            let link = changeLink();
            quizQuestions = [];
            quizAnswers = 0;
            let scoreQuizBox = document.querySelector('.score-box') || [];
            scoreQuizBox.length === 0 ? null : scoreQuizBox.remove();
            index = 0;



            grab(link, quiz.showQuizes, true);
        }, false)
    }




}

let answerClick = () => {
    let answers = document.querySelectorAll('.quiz-box p');

    for (let answer of answers) {

        answer.addEventListener('click', () => {

            index = index + 1;

            let link = changeLink();
            answerId = answer.getAttribute('data-id');
            let quizId = answer.parentNode.getAttribute('quiz-id');

            quizQuestions[quizId].userAnswer = answerId;

            quiz.showQuizes();



        })
    }
}

let createQuiz = (quiz) => {
    let quizesBox = document.querySelector('.quizes-box');
    quizBox = document.createElement('div');
    quizesBox.appendChild(quizBox);
    quizBox.setAttribute('class', 'quiz-box');


    if (index <= 19)

    {
        for (const item in quiz) {

            if (item == index) {
                quizBox.setAttribute('quiz-id', item);
                quizTitle = document.createElement('h1');
                quizTitle.innerHTML = (quiz[item].question);
                quizBox.appendChild(quizTitle);

                for (let i = 0; i < 4; i++) {


                    if (i == 3) {
                        answer = quiz[item].correct_answer;
                    } else {
                        answer = quiz[item].incorrect_answers[i];
                    }

                    quizQuestion = document.createElement('p');
                    quizQuestion.setAttribute('data-id', answer)
                    quizQuestion.innerHTML = (answer);
                    quizBox.appendChild(quizQuestion);
                }
            }





        }
    } else {
        showScores();
    }


}

let showScores = () => {
    let quizesBox = document.querySelector('.quizes-box');
    quizBox = document.createElement('div');
    quizesBox.appendChild(quizBox);
    quizBox.setAttribute('class', 'score-box');

    let questionBox;
    quizQuestions.map((item) => {

        questionBox = document.createElement('div');
        questionBox.setAttribute('class', 'question');
        quizBox.appendChild(questionBox);
        quizTitle = document.createElement('h1');
        quizTitle.innerHTML = (item.question);
        questionBox.appendChild(quizTitle);
        let correctClass = 'incorrect';
        for (let i = 0; i < 4; i++) {


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
            quizQuestion.setAttribute('data-id', i)
            quizQuestion.setAttribute('class', correctClass);
            quizQuestion.innerHTML = (answer);
            questionBox.appendChild(quizQuestion);
        }


    })


}