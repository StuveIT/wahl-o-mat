async function fetchParties() {
    const response = await fetch('/api/parties');
    const data = await response.json();

    return data;
}

async function fetchTheses() {
    const response = await fetch('/api/theses');
    const data = await response.json();

    return data;
}

const valueGrid = [
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2]
]

async function main() {
    const resultContainer = document.getElementById('result');
    resultContainer.classList.toggle('loading', true);

    let parties = await fetchParties();
    let theses = await fetchTheses();

    let pointGrid = [];

    // appAnswers is given by the ejs: holds the answers of the user
    // appWeights is given by the ejs: holds the weights of the answers

    // make a point grid of size: thesis_count x (party_count + 1 (for the max value))
    for (let row = 0; row < theses.length; row++) {
        pointGrid[row] = [];
        userAnswer = appAnswers[row];

        // if the user skipped the question, the row should be 0
        if (userAnswer == null) {
            for(let col = 0; col < parties.length; col++) {
                pointGrid[row][col] = 0;
            }

            // add the max value for the user
            pointGrid[row][parties.length] = 0;

            continue; // skip the rest of the loop
        }

        // otherwise calculate the points for the user and party combination
        for (let col = 0; col < parties.length; col++) {
            party = parties[col];
            partyAnswer = theses[row][party.pid];

            // calculate the points for the user and party combination
            pointGrid[row][col] = valueGrid[userAnswer][partyAnswer] * (appWeights[row] + 1);
        }

        // add the max value for the user
        pointGrid[row][parties.length] = 2 * (appWeights[row] + 1);
    }

    let lastRow = pointGrid.length - 1;

    // calculate column sums
    pointGrid[lastRow + 1] = [];
    for(let col = 0; col < parties.length + 1; col++) { // + 1 for the max value
        let sum = 0;
        for(let row = 0; row < theses.length; row++) {
            sum += pointGrid[row][col];
        }

        pointGrid[lastRow + 1][col] = sum;
    }

    // calculate the percentage of the user and party combination
    let results = [];
    for(let col = 0; col < parties.length; col++) {
        let sum = pointGrid[lastRow + 1][col];
        let max = pointGrid[lastRow + 1][parties.length];

        // if user skipped all questions, the percentage should be 0
        if (max === 0) {
            sum = 0;
            max = 1;
        }

        results[col] = {
            party: parties[col],
            percentage: sum / max
        }
    }

    // if the user skipped all questions, let's certify their indecisiveness
    if (pointGrid[lastRow + 1][parties.length] === 0) {
        resultContainer.innerHTML = '<h2><center>Diagnose: meinungsfrei</center></h2>';
        return;
    }

    // sort the parties by the percentage
    results.sort((a, b) => b.percentage - a.percentage);

    // render results
    results.forEach(result => {
        const party = result.party;
        const percentage = result.percentage;
        const percentageText = isNaN(percentage) ? 'Diagnose: meinungsfrei' : `${Math.round(percentage * 100)}%`;

        const votes = theses.map(thesis => {
            return {
                answer: thesis[party.pid],
                reason: thesis[party.pid + '_text']
            };
        });

        const partyContainer = document.createElement('details');
        partyContainer.classList.add('party');

        const partySummary = document.createElement('summary');
        partySummary.innerText = party.party;

        const percentageContainer = document.createElement('div');
        percentageContainer.classList.add('percentage-container');

        const percentageBar = document.createElement('span');
        percentageBar.classList.add('percentage');
        percentageBar.style.width = 0; // start with 0%
        percentageContainer.appendChild(percentageBar);

        const percentagePara = document.createElement('p');
        percentagePara.classList.add('percentage-text');
        percentagePara.innerText = percentageText;
        percentageContainer.appendChild(percentagePara);
        
        partySummary.appendChild(percentageContainer);

        partyContainer.appendChild(partySummary);

        votes.forEach((vote, index) => {
            const voteContainer = document.createElement('div');
            voteContainer.classList.add('vote');

            const voteAnswer = document.createElement('div');
            voteAnswer.classList.add('vote-answer');

            const voteThesisTitle = document.createElement('h4');
            voteThesisTitle.innerText = theses[index].title;
            voteAnswer.appendChild(voteThesisTitle);
            switch(Number(vote.answer)) {
                case 0:
                    voteAnswer.classList.add('positive');
                    break;
                case 1:
                    voteAnswer.classList.add('neutral');
                    break;
                case 2:
                    voteAnswer.classList.add('negative');
                    break;
            }

            voteContainer.appendChild(voteAnswer);

            const voteText = document.createElement('p');
            voteText.classList.add('vote-reason');
            voteText.innerText = vote.reason;
            voteContainer.appendChild(voteText);

            partyContainer.appendChild(voteContainer);
        });

        resultContainer.appendChild(partyContainer);

        // animate the percentage bar
        setTimeout(() => {
            percentageBar.style.width = `${percentage * 100}%`;
        }, 200);
    });

    resultContainer.classList.toggle('loading', false);
}

main();
