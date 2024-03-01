document.addEventListener('DOMContentLoaded', async () => {
    const repoCard = document.querySelector('.repo-card');
    const repoName = repoCard.dataset.repo;
    const repoData = await fetchRepoData(`https://api.github.com/repos/${repoName}`);
    const colorsData = await fetchColorsData('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json');

    if (repoData && colorsData) {
        const languageColor = repoData.language ? getLanguageColor(repoData.language, colorsData) : '#ccc';

        repoCard.innerHTML = `
            <h2><a href="${repoData.html_url}" target="_blank">${repoData.full_name}</a></h2>
            <p class="description">${repoData.description || 'No description provided'}</p>
            <div>
                <span class="language-dot" style="background-color: ${languageColor}"></span>
                <span>${repoData.language || 'Unknown'}</span>
            </div>
            <p>${repoData.fork ? 'Forked from <a href="' + repoData.source.html_url + '" target="_blank">' + repoData.source.full_name + '</a>' : ''}</p>
            <p>Stars: ${repoData.stargazers_count} Forks: ${repoData.forks}</p>
        `;

    // Check if repository has a website and add a link to it
    if (repoData.homepage) {
        const websiteLink = document.createElement('a');
        websiteLink.href = repoData.homepage;
        websiteLink.textContent = 'View Website';
        repoCard.appendChild(websiteLink);
    }
    }
});

async function fetchRepoData(url) {
    try {
        const response = await fetch(url);
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('Error fetching repo data:', error);
        return null;
    }
}

async function fetchColorsData(url) {
    try {
        const response = await fetch(url);
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('Error fetching colors data:', error);
        return null;
    }
}

function getLanguageColor(language, colorsData) {
    const colors = colorsData[language];
    return colors ? colors.color : '#ccc';
}