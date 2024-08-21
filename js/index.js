let searchType = 'users';

document.getElementById('github-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search').value;
    search(query);
});

document.getElementById('toggle-search').addEventListener('click', function() {
    searchType = searchType === 'users' ? 'repos' : 'users';
    this.textContent = `Search ${searchType === 'users' ? 'Repositories' : 'Users'}`;
    document.getElementById('search').placeholder = `Search GitHub ${searchType === 'users' ? 'users' : 'repositories'}...`;
});

function search(query) {
    const url = searchType === 'users' ? `https://api.github.com/search/users?q=${query}`
        : `https://api.github.com/search/repositories?q=${query}`;

    fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => searchType === 'users' ? displayUsers(data.items) : displayRepos(data.items))
    .catch(error => console.error('Error:', error));
}

function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    document.getElementById('repos-list').innerHTML = '';

    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="50">
            <p>${user.login}</p>
            <a href="${user.html_url}" target="_blank">Profile</a>
            <button onclick="fetchUserRepos('${user.login}')">Show Repos</button>
        `;
        userList.appendChild(userItem);
    });
}

function displayRepos(repos) {
    const reposList = document.getElementById('repos-list');
    reposList.innerHTML = '<h2>Repositories</h2>';
    document.getElementById('user-list').innerHTML = '';

    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
            <p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>
        `;
        reposList.appendChild(repoItem);
    });
}

function fetchUserRepos(username) {
    const url = `https://api.github.com/users/${username}/repos`;

    fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => displayRepos(data))
    .catch(error => console.error('Error:', error));
}
