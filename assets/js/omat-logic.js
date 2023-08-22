let lastCursor = null;

function answer(answer) {
    updateAnswer(answer);
    nextThesis();
}

function updateAnswer(answer) {
    answers[thesisCursor] = answer;
}

function updateThesis() {
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
    /* const response = await fetch("/omat/overview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(answers)
    });
    const html = await response.text();
    document.body.innerHTML = html; */
    let answerString = "";
    answers.forEach((answer, index) => {
        if(answer !== null)
            answerString += (answer + 1).toString();
        else
            answerString += "-";
    });

    location.href = "/omat/overview/" + answerString;
}