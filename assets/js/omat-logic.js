let lastCursor = null;

function answer(answer) {
    updateAnswer(answer);
    nextThesis();
}

function updateAnswer(answer) {
    // answers is given by the ejs: holds the answers of the user
    answers[thesisCursor] = answer;
}

function initTheses() {
    fetch("/api/theses").then(res => res.json()).then(data => {
        // Check if theses are available
        if (data.length === 0) {
            console.error("No theses found!");
            location.href = "/";
        }

        // Set theses
        const sidebar = document.querySelector(".qa-theses");
        const grid = document.querySelector(".qa-grid");

        for (let i = 0; i < data.length; i++) {
            const thesis = data[i];

            // Create sidebar link
            const thesisLink = document.createElement("button");
            thesisLink.id = "thesis-link-" + i;

            // -- Add classes
            thesisLink.classList.add("qa-thesis");
            if (i === thesisCursor) {
                thesisLink.classList.add("inactive");
            } else {
                thesisLink.classList.remove("inactive");
            }

            thesisLink.innerText = "These " + (i + 1);  // Set text
            thesisLink.onclick = () => setThesisCursor(i); // Set click event

            // -- Append to sidebar
            sidebar.appendChild(document.createElement("li").appendChild(thesisLink));

            // Create grid card
            const card = document.createElement("div");
            card.id = "qa-thesis-" + i;

            // -- Add classes
            card.classList.add("qa-card-thesis");
            if (i !== thesisCursor) {
                card.classList.add("inactive");
            } else {
                card.classList.remove("inactive");
            }

            // -- Create Header and Description
            const cardTitle = document.createElement("h2");
            cardTitle.id = "thesis-title-" + i;
            cardTitle.innerText = (i + 1) + "/" + data.length + " - " + thesis.title;

            const cardDescription = document.createElement("p");
            cardDescription.id = "thesis-description-" + i;
            cardDescription.innerText = thesis.description;

            card.appendChild(cardTitle);
            card.appendChild(cardDescription);

            // -- append to grid
            grid.appendChild(card);
        }

        // Set theses
        theses = data;
    });
}

function updateThesis() {
    // thesis title and description
    if (lastCursor !== null) {
        const oldThesis = document.getElementById("qa-thesis-" + lastCursor);

        oldThesis.classList.add("inactive");
    }

    const newThesis = document.getElementById("qa-thesis-" + thesisCursor);

    newThesis.classList.remove("inactive");

    // thesis buttons
    const positiveButton = document.getElementById("positive");
    const neutralButton = document.getElementById("neutral");
    const negativeButton = document.getElementById("negative");

    if (answers[thesisCursor] == 2) { // negative
        positiveButton.classList.remove("selected");
        neutralButton.classList.remove("selected");
        negativeButton.classList.add("selected");
    } else if (answers[thesisCursor] == 1) { // neutral
        positiveButton.classList.remove("selected");
        neutralButton.classList.add("selected");
        negativeButton.classList.remove("selected");
    } else if (answers[thesisCursor] == 0) { // positive
        positiveButton.classList.add("selected");
        neutralButton.classList.remove("selected");
        negativeButton.classList.remove("selected");
    } else { // skipped / not answered
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
    if (lastCursor !== null) {
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
        if (answer !== null)
            answerString += answer.toString();
        else
            answerString += "-";
    });

    location.href = "/omat/overview?edit=" + answerString;
}

initTheses();
