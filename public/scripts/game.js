let questions = [];
let token;



$(async function() {
    const tokenResult = await axios({
        method: 'get',
        url: 'https://opentdb.com/api_token.php?command=request',
      });

    token = tokenResult.data.token;

    const result = await axios({
        method: 'get',
        url: 'https://opentdb.com/api.php?amount=10',
        params: {
            token: token,
            type: "multiple",
        }
      });
    
      questions = result.data.results;
      console.log(questions);
    
      newQuestion();
      $('.buttons').on("click", ".question-button", answer);

    
});


const answer = function(b){
    if(b.target.innerText == questions[0].correct_answer){
        $("#result").text("Correct Answer").addClass("is-success");
        answeredCorrectly();
    } else {
        $("#result").text("Incorrect Answer").addClass("is-danger");
        answeredIncorrectly();
    }
    $("#result").removeClass("is-hidden");

    questions.splice(0, 1);
    newQuestion();
    setTimeout(function(){ 
        $("#result").addClass("is-hidden").removeClass("is-success").removeClass("is-danger")
    }, 2000);
};


const newQuestion = async function() {
    if(questions.length == 1){
        const result = await axios({
            method: 'get',
            url: 'https://opentdb.com/api.php?amount=10',
            params: {
                token: token,
                type: "multiple",
            }
          });
          questions = questions.concat(result.data.results);
    }
    $("#question-text").html(questions[0].question);
      let c = Math.floor((Math.random() * 4));
      let answers = [];
      let a = 0;
      for (let i = 0; i < 4; i++){
          if(i == c){
              answers[i] = questions[0].correct_answer;
          } else {
              answers[i] = questions[0].incorrect_answers[a];
              a++;
          }
      }
      //need to decode
      $("#a1").html(answers[0]);
      $("#a2").html(answers[1]);
      $("#a3").html(answers[2]);
      $("#a4").html(answers[3]);
}


const answeredIncorrectly = async function () {
    const uid = auth.currentUser.uid;
    const userRef = db.collection("users").doc(uid)
    let doc = await userRef.get()
    let userData = doc.data()
    let incorrect = userData.incorrect
    incorrect++
    const res = await userRef.update({incorrect: incorrect});
};

const answeredCorrectly = async function () {
    const uid = auth.currentUser.uid;
    const userRef = db.collection("users").doc(uid)
    let doc = await userRef.get()
    let userData = doc.data()
    let correct = userData.correct
    correct++
    const res = await userRef.update({correct: correct});
};