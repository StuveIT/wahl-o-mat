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
        const oldTitle = document.getElementById("thesis-title-" + lastCursor);
        const oldDescription = document.getElementById("thesis-description-" + lastCursor);

        oldTitle.classList.add("inactive");
        oldDescription.classList.add("inactive");
    }

    const newTitle = document.getElementById("thesis-title-" + thesisCursor);
    const newDescription = document.getElementById("thesis-description-" + thesisCursor);

    newTitle.classList.remove("inactive");
    newDescription.classList.remove("inactive");

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

    location.href = "/omat/overview/" + answerString;
    /* fetch('/omat/overview/', { method: 'POST', redirect: 'follow', data: { answers: answers } })
    .then(response => {
        // HTTP 301 response
    })
    .catch(function(err) {
        console.info(err + " url: " + url);
    }); */

}