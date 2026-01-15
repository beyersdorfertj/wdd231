const view_btn = document.querySelector('#toggle-view-btn');
const cards = document.querySelector('#companies');


view_btn.addEventListener('click', () => {
    toggleView();
})

const toggleView = () => {
    if (view_btn.classList.contains('view-list')) {
        document.querySelectorAll('.view-list').forEach(element => {
            element.classList.replace('view-list', 'view-table');
        });
        view_btn.title = 'Switch to list view';
    } else {
        document.querySelectorAll('.view-table').forEach(element => {
            element.classList.replace('view-table', 'view-list');
        });
        view_btn.title = 'Switch to table view';
    }
}

toggleView();

async function getCompanyData() {
    const response = await fetch('data/members.json');
    const data = await response.json();
    displayCompanies(data);
}

const displayCompanies = (companies) => {
    cards.innerHTML = '';
    companies.forEach((company) => {
        // card build code goes here
        let card = document.createElement('section');
        card.classList.add(view_btn.classList.contains('view-list') ? 'view-list' : 'view-table');

        let image = document.createElement('img');
        image.src = company.imageUrl;
        image.alt = `Image of ${company.name}`;
        image.loading = 'lazy';
        image.setAttribute('width', 200);
        image.setAttribute('height', 150);
        card.appendChild(image);

        let compName = document.createElement('h2');
        compName.textContent = `${company.name}`;
        card.appendChild(compName);

        let compAddress = document.createElement('p');
        compAddress.textContent = `${company.address}`;
        card.appendChild(compAddress);

        let compPhone = document.createElement('p');
        compPhone.textContent = `${company.phone}`;
        card.appendChild(compPhone);

        let compUrl = document.createElement('a');
        compUrl.href = company.website;
        compUrl.textContent = company.website;
        compUrl.target = '_blank';
        card.appendChild(compUrl);

        cards.appendChild(card);
    });
}

getCompanyData();