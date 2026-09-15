let heroMName = document.querySelector(".hero-section .movie-name");
let heroYear = document.querySelector(".hero-section .year");
let heroGenre = document.querySelector(".hero-section .genre");
let heroPlot = document.querySelector(".hero-section .plot");
let heroImdb = document.querySelector(".hero-section .imdb");

let movieContainer = document.querySelector(".movie-container");
let movieContainer2 = document.querySelector(".movie-container2");
let leftBtn = document.querySelector("#left-btn");
let rightBtn = document.querySelector("#right-btn");
let leftBtn2 = document.querySelector("#left-btn2");
let rightBtn2 = document.querySelector("#right-btn2");

let searchInput = document.querySelector(".search-btn #input");
let searchResults = document.querySelector(".search-results");
let hamburger = document.querySelector(".hamburger");

let hamburgerIcon = document.querySelector(".hamburger i");
let navItems = document.querySelector(".nav-items");
let pageLoading = document.querySelector("#page-loading");

hamburger?.addEventListener("click", () => {
    hamburgerIcon.classList.toggle("fa-xmark");
    hamburgerIcon.classList.toggle("fa-bars");
    navItems.classList.toggle("active");
});

let movieName = "Avengers-Endgame";
let apiKey = "a91a398701959efb03b5bfd2e1cfade0";

const URL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}`;
const Genre = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const URL2 = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const URL3 = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

function getId(movieId) {
    window.location.href = `movie_open.html?id=${movieId}`;
}

function renderMovies(movieList, container, showTitle = false) {
    const limit = Math.min(movieList.length, 20);
    for (let i = 0; i < limit; i++) {
        let movieData = movieList[i];
        let movie = document.createElement('div');
        let poster = document.createElement('img');

        poster.src = movieData.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : `https://placehold.co/500x750?text=No+Poster`;
        poster.alt = movieData.title || "Poster";

        movie.append(poster);

        if (showTitle) {
            let title = document.createElement('p');
            title.innerText = movieData.title;
            movie.append(title);
        }

        movie.classList.add('movie');
        container.append(movie);

        movie.addEventListener("click", () => {
            getId(movieData.id)
        });
    }
}

const getGenre = async () => {
    try {
        let response = await fetch(Genre);
        let data = await response.json();
        heroGenre.innerText = "Genres: " + data.genres[0].name + ", " + data.genres[1].name;
    } catch (e) { console.error(e); }
}

const getHero = async () => {
    try {
        let response = await fetch(URL);
        let data = await response.json();
        heroMName.innerText = data.results[0].title;
        heroYear.innerText = "Year: " + data.results[0].release_date.split("-")[0];
        heroPlot.innerText = "Overview: " + data.results[0].overview;
        heroImdb.innerText = "⭐ " + data.results[0].vote_average;
    } catch (e) { console.error(e); }
}

const getPoster = async () => {
    try {
        let response = await fetch(URL2);
        let data = await response.json();
        renderMovies(data.results, movieContainer);
    } catch (e) { console.error(e); }
}

const getPoster2 = async () => {
    try {
        let response = await fetch(URL3);
        let data = await response.json();
        renderMovies(data.results, movieContainer2);
    } catch (e) { console.error(e); }
}

let searchTimeout = null;

searchInput?.addEventListener("input", () => {
    const searchName = searchInput.value.trim();

    clearTimeout(searchTimeout);

    if (searchName === "") {
        searchResults.innerHTML = "";
        return;
    }

    searchTimeout = setTimeout(() => {
        const searchMovie = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchName)}`;

        fetch(searchMovie)
            .then(response => response.json())
            .then(data => {
                searchResults.innerHTML = "";

                if (!data.results || data.results.length === 0) {
                    let searchNotFound = document.createElement('p');
                    searchNotFound.innerText = "Movie Not Found";
                    searchResults.append(searchNotFound);
                    return;
                }

                let div = document.createElement('div');
                let SearchText = document.createElement('p');
                SearchText.classList.add("search-head");
                SearchText.innerText = `Search Results of "${searchName}"`;
                div.append(SearchText);
                searchResults.append(div);

                let results = data.results
                    .filter(movie => movie.release_date && movie.release_date >= "1990-01-01")
                    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

                let cardsWrapper = document.createElement("div");
                cardsWrapper.classList.add("search-cards-wrapper");
                searchResults.append(cardsWrapper);

                renderMovies(results, cardsWrapper, true);
            })
            .catch(err => console.error("Search failed:", err));
    }, 300);
});

window.addEventListener("load", () => {
    Promise.all([
        getHero(),
        getGenre(),
        getPoster(),
        getPoster2()
    ])
        .finally(() => {
            if (pageLoading) pageLoading.style.display = "none";
        });
});

rightBtn?.addEventListener("click", () => movieContainer.scrollBy({ left: 500, behavior: "smooth" }));
leftBtn?.addEventListener("click", () => movieContainer.scrollBy({ left: -500, behavior: "smooth" }));
rightBtn2?.addEventListener("click", () => movieContainer2.scrollBy({ left: 500, behavior: "smooth" }));
leftBtn2?.addEventListener("click", () => movieContainer2.scrollBy({ left: -500, behavior: "smooth" }));

