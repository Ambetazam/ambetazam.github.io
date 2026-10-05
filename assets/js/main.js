const username = "Ambetazam";

/* =========================================
DOM ELEMENTS
========================================= */

const repositoryGrid =
document.getElementById(
"repository-grid"
);

const filterContainer =
document.getElementById(
"filters"
);

const terminalInput =
document.getElementById(
"terminal-input"
);

const terminalOutput =
document.getElementById(
"terminal-output"
);

/* =========================================
APPLICATION STATE
========================================= */

let repositories = [];

let currentFilter = "all";

/*

* These are the categories displayed
* by the portfolio.
*
* The actual repository classification
* comes from GitHub Topics.
  */

const portfolioCategories = [

```
"all",

"academic",

"security",

"software",

"ai",

"linux",

"web",

"tools"
```

];

/* =========================================
LOAD GITHUB REPOSITORIES
========================================= */

async function loadRepositories() {

```
try {

    repositoryGrid.innerHTML = `

        <div class="loading">

            <span>$</span>

            connecting to github...

        </div>

    `;


    const response = await fetch(

        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`

    );


    if (!response.ok) {

        throw new Error(

            `GitHub API returned ${response.status}`

        );

    }


    repositories =
        await response.json();


    /*
     * Don't display forked repositories.
     */

    repositories =
        repositories.filter(

            repo =>
                !repo.fork

        );


    /*
     * Sort newest updated repositories first.
     */

    repositories.sort(

        (a, b) =>

            new Date(b.updated_at) -
            new Date(a.updated_at)

    );


    renderFilters();

    renderRepositories(
        repositories
    );


} catch (error) {

    console.error(
        "GitHub API error:",
        error
    );


    repositoryGrid.innerHTML = `

        <div class="repo-card">

            <div class="repo-terminal">

                $ github --status

            </div>


            <h3>
                CONNECTION ERROR
            </h3>


            <p class="repo-description">

                Unable to retrieve repositories
                from GitHub.

            </p>


            <p>

                Please try again later.

            </p>

        </div>

    `;

}
```

}

/* =========================================
FILTER REPOSITORIES BY TOPIC
========================================= */

function repositoryBelongsToCategory(

```
repository,
category
```

) {

```
/*
 * ALL displays everything.
 */

if (
    category === "all"
) {

    return true;

}


/*
 * GitHub returns topics as:
 *
 * repository.topics
 *
 * Example:
 *
 * [
 *     "academic",
 *     "react",
 *     "spring-boot"
 * ]
 */

return (

    repository.topics &&
    repository.topics.includes(
        category
    )

);
```

}

/* =========================================
FILTER UI
========================================= */

function renderFilters() {

```
filterContainer.innerHTML = "";


portfolioCategories.forEach(

    category => {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "filter";


        if (
            category === currentFilter
        ) {

            button.classList.add(
                "active"
            );

        }


        button.dataset.filter =
            category;


        button.textContent =
            category.toUpperCase();


        button.addEventListener(

            "click",

            () => {

                currentFilter =
                    category;


                document
                    .querySelectorAll(
                        ".filter"
                    )
                    .forEach(

                        item =>
                            item.classList.remove(
                                "active"
                            )

                    );


                button.classList.add(
                    "active"
                );


                applyFilter();

            }

        );


        filterContainer.appendChild(
            button
        );

    }

);
```

}

/* =========================================
APPLY CURRENT FILTER
========================================= */

function applyFilter() {

```
const filteredRepositories =

    repositories.filter(

        repository =>

            repositoryBelongsToCategory(

                repository,
                currentFilter

            )

    );


renderRepositories(
    filteredRepositories
);
```

}

/* =========================================
RENDER REPOSITORY CARDS
========================================= */

function renderRepositories(
repos
) {

```
if (
    !repos.length
) {

    repositoryGrid.innerHTML = `

        <div class="repo-card empty">

            <div class="repo-terminal">

                $ find ./projects

            </div>


            <h3>

                NO PROJECTS FOUND

            </h3>


            <p class="repo-description">

                No repositories match
                this category.

            </p>

        </div>

    `;

    return;

}


repositoryGrid.innerHTML = "";


repos.forEach(

    repo => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "repo-card";


        const description =

            repo.description ||

            "No description available.";


        const topics =

            repo.topics || [];


        const topicHTML =

            topics

                .map(

                    topic => `

                        <span class="repo-topic">

                            ${escapeHTML(
                                topic
                            )}

                        </span>

                    `

                )

                .join("");


        card.innerHTML = `

            <div class="repo-header">


                <span class="repo-index">

                    ./projects/

                </span>


                <span class="repo-language">

                    ${escapeHTML(

                        repo.language ||

                        "UNKNOWN"

                    )}

                </span>


            </div>


            <h3>

                ${escapeHTML(
                    repo.name
                )}

            </h3>


            <p class="repo-description">

                ${escapeHTML(
                    description
                )}

            </p>


            <div class="repo-topics">

                ${topicHTML}

            </div>


            <div class="repo-meta">


                <span>

                    ★
                    ${repo.stargazers_count}

                </span>


                <span>

                    FORKS
                    ${repo.forks_count}

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


        repositoryGrid.appendChild(
            card
        );

    }

);
```

}

/* =========================================
TERMINAL OUTPUT
========================================= */

function terminalPrint(
message
) {

```
const line =
    document.createElement(
        "div"
    );


line.innerHTML =
    message;


terminalOutput.appendChild(
    line
);


terminalOutput.scrollTop =

    terminalOutput.scrollHeight;
```

}

/* =========================================
TERMINAL FILTER
========================================= */

function terminalFilter(
category
) {

```
currentFilter =
    category;


renderFilters();


applyFilter();


document
    .getElementById(
        "projects"
    )
    .scrollIntoView({

        behavior: "smooth"

    });
```

}

/* =========================================
TERMINAL COMMANDS
========================================= */

terminalInput.addEventListener(

```
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

        `<span>$ ${escapeHTML(
            command
        )}</span>`

    );


    switch (command) {


        case "help":

            terminalPrint(`

                Available commands:

                <br><br>

                <strong>about</strong>
                — about me

                <br>

                <strong>projects</strong>
                — all projects

                <br>

                <strong>academic</strong>
                — academic projects

                <br>

                <strong>security</strong>
                — security projects

                <br>

                <strong>software</strong>
                — software projects

                <br>

                <strong>ai</strong>
                — artificial intelligence

                <br>

                <strong>linux</strong>
                — Linux and systems

                <br>

                <strong>web</strong>
                — web projects

                <br>

                <strong>tools</strong>
                — developer/system tools

                <br>

                <strong>github</strong>
                — open GitHub

                <br>

                <strong>contact</strong>
                — contact information

                <br>

                <strong>clear</strong>
                — clear terminal

            `);

            break;


        case "about":

            document
                .getElementById(
                    "about"
                )
                .scrollIntoView({

                    behavior: "smooth"

                });

            break;


        case "projects":

            terminalFilter(
                "all"
            );

            break;


        case "academic":

            terminalFilter(
                "academic"
            );

            break;


        case "security":

            terminalFilter(
                "security"
            );

            break;


        case "software":

            terminalFilter(
                "software"
            );

            break;


        case "ai":

            terminalFilter(
                "ai"
            );

            break;


        case "linux":

            terminalFilter(
                "linux"
            );

            break;


        case "web":

            terminalFilter(
                "web"
            );

            break;


        case "tools":

            terminalFilter(
                "tools"
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
                .getElementById(
                    "contact"
                )
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

                `command not found: ${escapeHTML(
                    command
                )}`

            );

    }

}
```

);

/* =========================================
SECURITY
========================================= */

function escapeHTML(
value
) {

```
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
```

}

/* =========================================
START APPLICATION
========================================= */

loadRepositories();
