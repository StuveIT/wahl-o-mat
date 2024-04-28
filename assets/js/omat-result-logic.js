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
            pointGrid[row][col] = valueGrid[userAnswer][partyAnswer] * appWeights[row];
        }

        // add the max value for the user
        pointGrid[row][parties.length] = 2 + 2 * appWeights[row];
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

        results[col] = {
            party: parties[col],
            percentage: sum / max
        }
    }

    // sort the parties by the percentage
    results.sort((a, b) => b.percentage - a.percentage);
    console.log(results);

    // render results
    const resultContainer = document.getElementById('output');
    results.forEach(result => {
        const party = result.party;
        const percentage = result.percentage;

        const partyContainer = document.createElement('div');
        partyContainer.classList.add('party');

        const partyName = document.createElement('h2');
        partyName.innerText = party.party;
        partyContainer.appendChild(partyName);

        const partyDescription = document.createElement('p');
        partyDescription.innerText = party.description;
        partyContainer.appendChild(partyDescription);

        const partyPercentage = document.createElement('span');
        partyPercentage.classList.add('percentage');
        partyPercentage.style.width = (percentage * 100) + '%';
        partyPercentage.innerText = 'Übereinstimmung: ' + (percentage * 100) + '%';
        partyContainer.appendChild(partyPercentage);

        resultContainer.appendChild(partyContainer);
    });
}

main();
