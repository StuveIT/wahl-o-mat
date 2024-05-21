const fetchTheses  = require('./theses');
const fetchParties = require('./parties');

function convertAnswerString(answerString) {
    if (answerString == null)
        return []

    const string = answerString.split('');
    const answers = []

    for (let i = 0; i < string.length; i++) {
        switch (string[i]) {
            case '0': // positive
                answers[i] = 0;
                break;
            case '1': // neutral
                answers[i] = 1;
                break;
            case '2': // negative
                answers[i] = 2;
                break;
            default: // skipped
                answers[i] = null;
                break;
        }
    }

    return answers;
}

function convertWeights(weightsString) {
    if (weightsString == null)
        return [];

    const string = weightsString.split('');
    const weigths = []

    for (let i = 0; i < string.length; i++) {
        switch (string[i]) {
            case '1':
                weigths[i] = 1;
                break;
            default:
                weigths[i] = 0;
                break;
        }
    }

    return weigths;
}

const valueGrid = [
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2]
];

function computeResult(answers, weights) {
    let parties = fetchParties();
    let theses = fetchTheses();

    let pointGrid = [];

    // make a point grid of size: thesis_count x (party_count + 1 (for the max value))
    for (let row = 0; row < theses.length; row++) {
        pointGrid[row] = [];
        userAnswer = answers[row];

        // if the user skipped the question, the row should be 0
        if (userAnswer == null) {
            for (let col = 0; col < parties.length; col++) {
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
            pointGrid[row][col] = valueGrid[userAnswer][partyAnswer] * (weights[row] + 1);
        }

        // add the max value for the user
        pointGrid[row][parties.length] = 2 * (weights[row] + 1);
    }

    let lastRow = pointGrid.length - 1;

    // calculate column sums
    pointGrid[lastRow + 1] = [];
    for (let col = 0; col < parties.length + 1; col++) { // + 1 for the max value
        let sum = 0;
        for (let row = 0; row < theses.length; row++) {
            sum += pointGrid[row][col];
        }

        pointGrid[lastRow + 1][col] = sum;
    }

    // calculate the percentage of the user and party combination
    let results = [];
    for (let col = 0; col < parties.length; col++) {
        let sum = pointGrid[lastRow + 1][col];
        let max = pointGrid[lastRow + 1][parties.length];

        // if user skipped all questions, the percentage should be 0
        if (max === 0) {
            sum = 0;
            max = 1;
        }

        results[col] = {
            party: parties[col],
            percentage: sum / max,
            votes: theses.map(thesis => {
                return {
                    answer: thesis[parties[col].pid],
                    reason: thesis[parties[col].pid + '_text']
                };
            })
        }
    }

    // TODO: if the user skipped all questions, let's certify their indecisiveness

    // sort the parties by the percentage
    results.sort((a, b) => b.percentage - a.percentage);

    return results;
}

module.exports = {
    convertAnswerString,
    convertWeights,
    computeResult
}
