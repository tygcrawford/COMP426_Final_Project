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
    
      newQuestion();
      $('.body').on("click", ".question-button", answer);

    
});


const answer = function(b){
    if(b.target.innerText == questions[0].correct_answer){
        $("#result").text("Correct Answer");
    } else {
        $("#result").text("Incorrect Answer");
    }
    $("#result").css("color", "black");

    questions.splice(0, 1);
    newQuestion();
    setTimeout(function(){ 
        $("#result").text(".");
        $("#result").css("color", "white");
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
    $("#question-text").text(questions[0].question);
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
      $("#a1").text(answers[0]);
      $("#a2").text(answers[1]);
      $("#a3").text(answers[2]);
      $("#a4").text(answers[3]);
}



