const weather_url = 'https://api.openweathermap.org/data/2.5/weather?lat=50.25&lon=8.64&units=metric&appid=c36b40efb25b0bb8ec9bd299a5d070d6';
const forecast_url = 'https://api.openweathermap.org/data/2.5/forecast?lat=50.25&lon=8.64&units=metric&appid=c36b40efb25b0bb8ec9bd299a5d070d6';

const companies = document.querySelector('#company-selection');

async function getCompanyData() {
    const response = await fetch('data/members.json');
    return await response.json();
}

function getRandomMembers(members, count) {
    const goldSilverMembers = members.filter(member => member.membershipLevel === 2 || member.membershipLevel === 3);
    const shuffled = [...goldSilverMembers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function initMembers() {
    const allMembers = await getCompanyData();
    const randomMembers = getRandomMembers(allMembers, 3);
    console.log(randomMembers);

    companies.innerHTML = '';
    randomMembers.forEach((member) => {
        // card build code goes here

        let company = document.createElement('section');
        company.className = 'company-card';

        let companyHeader = document.createElement('div');
        companyHeader.className = 'company-header';

        let compName = document.createElement('h2');
        compName.textContent = `${member.name}`;
        companyHeader.appendChild(compName);

        company.appendChild(companyHeader);

        let companyBody = document.createElement('div');
        companyBody.className = 'company-body';

        let companyImage = document.createElement('img');
        companyImage.className = 'company-logo';
        companyImage.setAttribute('src', member.logo);
        companyImage.setAttribute('alt', `${member.name} logo`);
        companyImage.setAttribute('width', 200);
        companyImage.setAttribute('height', 200);
        companyImage.setAttribute('loading', 'lazy');
        companyBody.appendChild(companyImage);

        companyInfo = document.createElement('div');

        let companyAddress = document.createElement('p');
        companyAddress.textContent = member.address;
        companyInfo.appendChild(companyAddress);

        let companyEmail = document.createElement('p');
        let emailLabel = document.createElement('span');
        emailLabel.className = 'label';
        emailLabel.textContent = 'EMAIL: ';
        let emailValue = document.createElement('span');
        emailValue.className = 'value';
        emailValue.textContent = member.email;
        companyEmail.appendChild(emailLabel);
        companyEmail.appendChild(emailValue);
        companyInfo.appendChild(companyEmail);

        let companyPhone = document.createElement('p');
        let phoneLabel = document.createElement('span');
        phoneLabel.className = 'label';
        phoneLabel.textContent = 'PHONE: ';
        let phoneValue = document.createElement('span');
        phoneValue.className = 'value';
        phoneValue.textContent = member.phone;
        companyPhone.appendChild(phoneLabel);
        companyPhone.appendChild(phoneValue);
        companyInfo.appendChild(companyPhone);

        let companyURL = document.createElement('p');
        let urlLabel = document.createElement('span');
        urlLabel.className = 'label';
        urlLabel.textContent = 'URL: ';
        let urlValue = document.createElement('span');
        urlValue.className = 'value';
        urlValue.textContent = member.website;
        companyURL.appendChild(urlLabel);
        companyURL.appendChild(urlValue);
        companyInfo.appendChild(companyURL);

        let membershipLevel = document.createElement('p');
        let levelLabel = document.createElement('span');
        levelLabel.className = 'label';
        levelLabel.textContent = 'Level: ';
        let levelValue = document.createElement('span');
        levelValue.className = 'value';
        const levelNames = { 1: 'Bronze', 2: 'Silver', 3: 'Gold' };
        levelValue.textContent = levelNames[member.membershipLevel] || member.membershipLevel;
        membershipLevel.appendChild(levelLabel);
        membershipLevel.appendChild(levelValue);
        companyInfo.appendChild(membershipLevel);

        companyBody.appendChild(companyInfo);

        company.appendChild(companyBody);

        companies.appendChild(company);
    });

}

async function apiFetch(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return (data)
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

async function initWeather() {
    const data = await apiFetch(weather_url);
    console.log("Data:", data);

    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const weatherIcon = document.querySelector('#weather-icon');
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', data.weather[0].description);
    weatherIcon.setAttribute('width', 50);
    weatherIcon.setAttribute('height', 50);

    document.querySelector('#weather-temp').textContent = `${Math.round(data.main.temp)}°C`;
    const description = data.weather[0].description;
    const capitalizedDescription = description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    document.querySelector('#weather-clouds').textContent = capitalizedDescription;
    document.querySelector('#weather-high').textContent = `${Math.round(data.main.temp_max)}°C`;
    document.querySelector('#weather-low').textContent = `${Math.round(data.main.temp_min)}°C`;
    document.querySelector('#weather-humidity').textContent = `${data.main.humidity}%`;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    document.querySelector('#weather-sunrise').textContent = sunrise;
    document.querySelector('#weather-sunset').textContent = sunset;
}

async function initForecast() {
    const data = await apiFetch(forecast_url);
    console.log("Forecast Data:", data);

    const forecastSection = document.querySelector('#weather-forecast');
    forecastSection.innerHTML = '<h2>Weather Forecast</h2>';

    // Gruppiere die Daten nach Tagen
    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = [];
        }
        dailyForecasts[dateKey].push(item.main.temp_max);
    });

    // Hole die ersten 3 Tage
    const days = Object.keys(dailyForecasts).slice(0, 3);

    days.forEach((day, index) => {
        const maxTemp = Math.max(...dailyForecasts[day]);

        const dayDiv = document.createElement('div');
        dayDiv.className = 'forecast-day';

        const forecastLine = document.createElement('p');
        const dayText = index === 0 ? 'Today:' : `${day}:`;
        forecastLine.innerHTML = `${dayText} <span class="temp-value">${Math.round(maxTemp)}°C</span>`;
        dayDiv.appendChild(forecastLine);

        forecastSection.appendChild(dayDiv);
    });
}

async function getEventsData() {
    const response = await fetch('data/events.json');
    return await response.json();
}

function getNextTwoEvents(events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
    });
    
    upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcomingEvents.slice(0, 2);
}

async function initEvents() {
    const data = await getEventsData();
    const nextEvents = getNextTwoEvents(data.events);
    
    const eventsSection = document.querySelector('#Events');
    eventsSection.innerHTML = '<h2>Events</h2>';
    
    nextEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const eventTitle = document.createElement('h3');
        eventTitle.textContent = event.name;
        eventCard.appendChild(eventTitle);
        
        const eventDateTime = document.createElement('p');
        eventDateTime.className = 'event-datetime';
        eventDateTime.innerHTML = `<strong>${formattedDate}</strong> um ${event.time} Uhr`;
        eventCard.appendChild(eventDateTime);
        
        const eventLocation = document.createElement('p');
        eventLocation.className = 'event-location';
        eventLocation.innerHTML = `📍 ${event.location}`;
        eventCard.appendChild(eventLocation);
        
        const eventDescription = document.createElement('p');
        eventDescription.className = 'event-description';
        eventDescription.textContent = event.description;
        eventCard.appendChild(eventDescription);
        
        eventsSection.appendChild(eventCard);
    });
}

initMembers();
initWeather();
initForecast();
initEvents();
