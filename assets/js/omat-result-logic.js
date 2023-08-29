class Vector {

    constructor(answers, weights) {
        this.answers = answers;
        this.weights = weights;

        this.vector = [];
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            
            if(answer != -1 && answer != 0 && answer != 1) {
                this.vector[i] = null;
                continue;
            }

            if(weights !== null && weights[i] == 1) {
                this.vector[i] = answer * 2;
                continue;
            }

            this.vector[i] = answer;
        }
    }
}

// fetch parties from database
async function fetchParties() {
    const response = await fetch('/api/parties');
    const data = await response.json();

    return data;
}

// compute distance between two vectors
function computeDistance(vector1, vector2) {
    let sum = 0;
    for(let i = 0; i < vector1.length; i++) {
        if(vector1[i] == null || vector2[i] == null)
            continue;

        sum += Math.abs(vector1[i] - vector2[i]);
    }

    return Math.sqrt(sum);
}


async function main() {
    const userVector = new Vector(appAnswers, appWeights);
    let parties = await fetchParties();

    // generate party vectors and compute distances
    parties.forEach(party => {
        party.vector = new Vector(party.answers, appWeights).vector;
        party.distance = computeDistance(userVector.vector, party.vector);
    });

    let virtualAnswerCount = appAnswers.length;
    appWeights.forEach((weight, index) => {
        if(weight == 1)
            virtualAnswerCount++;
    });

    // sort parties by distance
    const sortedParties = parties.sort((a, b) => {
        return a.distance - b.distance;
    });

    // render results
    const resultContainer = document.getElementById('output');
    sortedParties.forEach(party => {
        const partyContainer = document.createElement('div');
        partyContainer.classList.add('party');

        const partyName = document.createElement('h2');
        partyName.innerText = party.name;
        partyContainer.appendChild(partyName);

        const partyDescription = document.createElement('p');
        partyDescription.innerText = party.description;
        partyContainer.appendChild(partyDescription);

        let percentage = Math.round((1 - party.distance / virtualAnswerCount) * 100);

        const partyPercentage = document.createElement('span');
        partyPercentage.classList.add('percentage');
        partyPercentage.style.width = percentage + '%';
        partyPercentage.innerText = 'Übereinstimmung: ' + percentage + '%';
        partyContainer.appendChild(partyPercentage);

        resultContainer.appendChild(partyContainer);
    });
}

main();