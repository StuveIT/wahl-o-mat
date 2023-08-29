let lastCursor = null;

function answer(answer) {
    updateAnswer(answer);
    nextThesis();
}

function updateAnswer(answer) {
    answers[thesisCursor] = answer;
}

function updateThesis() {
    // thesis title and description
    if(lastCursor !== null) {
        const oldThesis = document.getElementById("qa-thesis-" + lastCursor);

        oldThesis.classList.add("inactive");
    }

    const newThesis = document.getElementById("qa-thesis-" + thesisCursor);

    newThesis.classList.remove("inactive");

    // thesis buttons
    const positiveButton = document.getElementById("positive");
    const neutralButton = document.getElementById("neutral");
    const negativeButton = document.getElementById("negative");

    if (answers[thesisCursor] == -1) {
        positiveButton.classList.remove("selected");
        neutralButton.classList.remove("selected");
        negativeButton.classList.add("selected");
    } else if (answers[thesisCursor] == 0) {
        positiveButton.classList.remove("selected");
        neutralButton.classList.add("selected");
        negativeButton.classList.remove("selected");
    } else if (answers[thesisCursor] == 1) {
        positiveButton.classList.add("selected");
        neutralButton.classList.remove("selected");
        negativeButton.classList.remove("selected");
    } else {
        positiveButton.classList.remove("selected");
        neutralButton.classList.remove("selected");
        negativeButton.classList.remove("selected");
    }
}

function nextThesis() {
    setThesisCursor(thesisCursor + 1);
}

function setThesisCursor(cursor) {
    lastCursor = thesisCursor;
    if(lastCursor !== null) {
        const oldLink = document.getElementById("thesis-link-" + thesisCursor);
        oldLink.classList.remove("inactive");
    }

    thesisCursor = cursor;

    if (thesisCursor < 0) {
        thesisCursor = 0;
    } else if (thesisCursor >= theses.length) {
        loadOverview();
    }
    const newLink = document.getElementById("thesis-link-" + thesisCursor);

    newLink.classList.add("inactive");

    updateThesis();
}

async function loadOverview() {
    let answerString = "";
    answers.forEach((answer, index) => {
        if(answer !== null)
            answerString += (answer + 1).toString();
        else
            answerString += "-";
    });

    location.href = "/omat/overview?edit=" + answerString;
}