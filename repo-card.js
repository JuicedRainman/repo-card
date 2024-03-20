document.addEventListener('DOMContentLoaded', async () => {
    const repoCard = document.querySelector('.repo-card');
    const repoName = repoCard.dataset.repo;
    const repoData = await fetchRepoData(`https://api.github.com/repos/${repoName}`);
    const colorsData = await fetchColorsData('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json');

    if (repoData && colorsData) {
        const languageColor = repoData.language ? getLanguageColor(repoData.language, colorsData) : '#ccc';

        repoCard.innerHTML = `
            <style>
            .repo-card {
                font-family: Arial, sans-serif;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #0E0F1F;
                color: white;
                padding: 16px;
                margin: 20px;
                max-width: 400px;
            }
            .repo-card a {
                text-decoration: none;
                color: #0366d6;
            }
            .language-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 6px;
            }
            .description {
                font-style: italic;
                color: white;
            }
            </style>
            <h2><a href="${repoData.html_url}" target="_blank">${repoData.full_name}</a></h2>
            ${repoData.homepage ? `<p><a href="${repoData.homepage}" target="_blank">View Website</a></p>` : ''}
            <div>
                <span class="language-dot" style="background-color: ${languageColor}"></span>
                <span>${repoData.language || 'Unknown'}</span>
            </div>
            <p class="description">${repoData.description || 'No description provided'}</p>
            <p>${repoData.fork ? 'Forked from <a href="' + repoData.source.html_url + '" target="_blank">' + repoData.source.full_name + '</a>' : ''}</p>
            <p>Stars: ${repoData.stargazers_count} Forks: ${repoData.forks}</p>
        `;
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