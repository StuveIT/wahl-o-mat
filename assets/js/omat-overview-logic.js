async function finish() {
    let answerString = "";
    answers.forEach((answer, index) => {
        if(answer !== null)
            answerString += (answer + 1).toString();
        else
            answerString += "-";
    });

    location.href = "/omat/result/" + answerString;
}