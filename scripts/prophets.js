const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const cards = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    console.table(data.prophets); // temp output test of data response
    // console.log(data);

    displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
    cards.innerHTML = '';
    prophets.forEach((prophet) => {
        // card build code goes here
        let card = document.createElement('section');

        let fullName = document.createElement('h2');
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        card.appendChild(fullName);

        let birthDate = document.createElement('p');
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        card.appendChild(birthDate);

        let birthPlace = document.createElement('p');
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;
        card.appendChild(birthPlace);

        let portrait = document.createElement('img');
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', 340);
        portrait.setAttribute('height', 440);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}

getProphetData();