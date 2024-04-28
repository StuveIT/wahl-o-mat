
// according to omat-overview.ejs
async function initTheses() {
    fetch('/api/theses')
        .then(response => response.json())
        .then(data => {
            theses = data;

            // Create Elements for theses in sidebar and in qa-checkboxes
            const sidebar = document.querySelector('.qa-theses');
            const checkboxes = document.querySelector('.qa-chekboxes');

            for (let i = 0; i < theses.length; i++) {
                const thesis = theses[i];
                const answer = answers[i];

                // Create sidebar link
                const thesisLink = document.createElement('button');
                thesisLink.id = `thesis-link-${i}`;

                // -- Add classes
                thesisLink.classList.add('qa-thesis');

                // -- Add text
                thesisLink.textContent = i + 1 + ' ' + thesis.title;

                // -- Add event listener
                thesisLink.onclick = () => edit(i);

                // -- Append to sidebar
                sidebar.appendChild(document.createElement('li')).appendChild(thesisLink);


                // Create checkbox
                const checkboxLabel = document.createElement('label');

                // -- Add class
                checkboxLabel.classList.add('checkbox');

                if(answer === null) {
                    checkboxLabel.classList.add('inactive');
                }

                if(answer === 0) {
                    checkboxLabel.classList.add('positive');
                } else if(answer === 1) {
                    checkboxLabel.classList.add('neutral');
                } else if(answer === 2) {
                    checkboxLabel.classList.add('negative');
                }

                // -- Add for attribute
                checkboxLabel.htmlFor = `thesis-checkbox-${i}`;

                // -- Add input
                const checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.id = `thesis-checkbox-${i}`;
                checkboxInput.classList.add('qa-thesis-checkbox');

                // -- Add checkmark
                const checkmark = document.createElement('span');
                checkmark.classList.add('checkmark');

                // -- Add thesis overview
                const thesisOverview = document.createElement('div');
                thesisOverview.classList.add('thesis-overview');

                // ---- Add content
                const checkboxTitle = document.createElement('h3');
                checkboxTitle.id = `thesis-title-${i}`;
                checkboxTitle.textContent = thesis.title;

                const checkboxAnswer = document.createElement('small');
                checkboxAnswer.id = `thesis-answer-${i}`;

                if (answer === 0) {
                    checkboxAnswer.textContent = 'Stimme zu';
                } else if (answer === 1) {
                    checkboxAnswer.textContent = 'Neutral';
                } else if (answer === 2) {
                    checkboxAnswer.textContent = 'Stimme nicht zu';
                } else {
                    checkboxAnswer.textContent = 'These übersprungen';
                }

                thesisOverview.appendChild(checkboxTitle);
                thesisOverview.appendChild(checkboxAnswer);

                // -- Append to checkbox label
                checkboxLabel.appendChild(checkboxInput);
                checkboxLabel.appendChild(checkmark);
                checkboxLabel.appendChild(thesisOverview);

                // -- Append to checkboxes
                checkboxes.appendChild(checkboxLabel);
            }
        });
}

function edit(thesisNumber) {
    if (thesisNumber !== null && thesisNumber !== undefined)
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
        if (answer !== null)
            answerString += answer.toString();
        else
            answerString += "-";
    });

    return answerString;
}

function weightsToString() {
    const checkboxes = document.getElementsByClassName("qa-thesis-checkbox");
    let weightsString = "";

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked)
            weightsString += "1";
        else
            weightsString += "0";
    }

    return weightsString;
}

initTheses();
