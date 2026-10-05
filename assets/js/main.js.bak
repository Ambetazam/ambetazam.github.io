const username = "Ambetazam";

const repositoryGrid =
    document.getElementById("repository-grid");


let repositories = [];


/*
 * Projects that deserve special categorization.
 *
 * Everything else will automatically
 * appear under "all".
 */

const categories = {

    security: [
        "AURA-Security-Labs",
        "Zone-Transfer-Analyzer"
    ],

    software: [
        "Audio-Transcriber",
        "cwt"
    ],

    ai: [
        "Audio-Transcriber"
    ],

    linux: [
        "cwt"
    ],

    academic: [
        "Sazón",
        "SCRUM_MethodologyReport"
    ]

};


/* =========================================
   LOAD REPOSITORIES
========================================= */

async function loadRepositories() {

    try {

        const response = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );


        if (!response.ok) {

            throw new Error(
                `GitHub API returned ${response.status}`
            );

        }


        repositories = await response.json();


        repositories =
            repositories.filter(
                repo => !repo.fork
            );


        renderRepositories(
            repositories
        );


    } catch (error) {

        console.error(error);


        repositoryGrid.innerHTML = `

            <div class="repo-card">

                <h3>
                    ERROR
                </h3>

                <p class="repo-description">

                    Unable to retrieve GitHub
                    repositories.

                </p>

                <p>

                    Check the GitHub API
                    connection.

                </p>

            </div>

        `;

    }

}


/* =========================================
   CHECK CATEGORY
========================================= */

function repositoryBelongsToCategory(
    repository,
    category
) {

    if (
        category === "all"
    ) {

        return true;

    }


    return categories[category]
        ?.includes(repository.name);

}


/* =========================================
   RENDER
========================================= */

function renderRepositories(
    repos
) {

    if (!repos.length) {

        repositoryGrid.innerHTML = `

            <div class="repo-card">

                <h3>
                    NO PROJECTS
                </h3>

                <p>
                    No public repositories found.
                </p>

            </div>

        `;

        return;

    }


    repositoryGrid.innerHTML = "";


    repos.forEach(repo => {

        const card =
            document.createElement("article");


        card.className =
            "repo-card";


        const description =
            repo.description ||
            "No description available.";


        card.innerHTML = `

            <h3>
                ${escapeHTML(repo.name)}
            </h3>

            <p class="repo-description">

                ${escapeHTML(description)}

            </p>


            <div class="repo-meta">

                <span>

                    ${escapeHTML(
                        repo.language ||
                        "Unknown"
                    )}

                </span>


                <span>

                    ★
                    ${repo.stargazers_count}

                </span>

            </div>


            <a

                class="repo-link"

                href="${repo.html_url}"

                target="_blank"

                rel="noopener noreferrer"

            >

                [ OPEN REPOSITORY ]

            </a>

        `;


        repositoryGrid.appendChild(card);

    });

}


/* =========================================
   FILTER BUTTONS
========================================= */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                const filtered =
                    repositories.filter(
                        repo =>
                            repositoryBelongsToCategory(
                                repo,
                                filter
                            )
                    );


                renderRepositories(
                    filtered
                );

            }
        );

    });


/* =========================================
   TERMINAL
========================================= */

const terminalInput =
    document.getElementById(
        "terminal-input"
    );


const terminalOutput =
    document.getElementById(
        "terminal-output"
    );


function terminalPrint(
    message
) {

    const line =
        document.createElement(
            "div"
        );


    line.innerHTML = message;


    terminalOutput.appendChild(
        line
    );


    terminalOutput.scrollTop =
        terminalOutput.scrollHeight;

}


terminalInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Enter"
        ) {

            return;

        }


        const command =
            terminalInput.value
                .trim()
                .toLowerCase();


        terminalInput.value = "";


        if (!command) {

            return;

        }


        terminalPrint(
            `<span>$ ${escapeHTML(command)}</span>`
        );


        switch (command) {


            case "help":

                terminalPrint(
                    "commands: about, projects, security, software, ai, linux, academic, github, contact, clear"
                );

                break;


            case "about":

                document
                    .getElementById("about")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                break;


            case "projects":

                document
                    .getElementById("projects")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                renderRepositories(
                    repositories
                );

                break;


            case "security":

            case "software":

            case "ai":

            case "linux":

            case "academic":

                document
                    .getElementById("projects")
                    .scrollIntoView({
                        behavior: "smooth"
                    });


                renderRepositories(
                    repositories.filter(
                        repo =>
                            repositoryBelongsToCategory(
                                repo,
                                command
                            )
                    )
                );

                break;


            case "github":

                window.open(
                    "https://github.com/Ambetazam",
                    "_blank"
                );

                break;


            case "contact":

                document
                    .getElementById("contact")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                break;


            case "clear":

                terminalOutput.innerHTML =
                    "";

                break;


            default:

                terminalPrint(
                    `command not found: ${escapeHTML(command)}`
                );

        }

    }
);


/* =========================================
   BASIC HTML ESCAPING
========================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   START
========================================= */

loadRepositories();
