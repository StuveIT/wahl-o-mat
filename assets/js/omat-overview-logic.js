function edit(thesisNumber) {
    if(thesisNumber !== null && thesisNumber !== undefined)
        location.href = "/omat?edit=" + answersToString() + "&thesis=" + (thesisNumber + 1);
    else
        location.href = "/omat?edit=" + answersToString();
}

async function finish() {
    location.href = "/omat/result?answers=" + answersToString() + "&weights=" + weightsToString();
}

function answersToString() {
    let answerString = "";
    answers.forEach((answer, index) => {
        if(answer !== null)
            answerString += (answer + 1).toString();
        else
            answerString += "-";
    });

    return answerString;
}

function weightsToString() {
    const checkboxes = document.getElementsByClassName("qa-thesis-checkbox");
    let weightsString = "";

    for(let i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked)
            weightsString += "1";
        else
            weightsString += "0";
    }

    return weightsString;
}