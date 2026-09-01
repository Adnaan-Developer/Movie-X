let hamburger = document.querySelector(".hamburger");
let hamburgerIcon = document.querySelector(".hamburger i");
let navItems = document.querySelector(".nav-items");
let genres = document.querySelector(".genres");
let movie = document.querySelector(".filter-movie");
let loadMore = document.querySelector(".btn");
let loading = document.querySelector(".loading");

let apiKey = "a91a398701959efb03b5bfd2e1cfade0";
let selectedGenreId = null;
let currentPage = 1;

hamburger?.addEventListener("click", () => {
    hamburgerIcon.classList.toggle("fa-xmark");
    hamburgerIcon.classList.toggle("fa-bars");
    navItems.classList.toggle("active");
});

const renderMovies = (movieList) => {
    movieList.forEach(item => {
        let poster = document.createElement('img');
        let posterContainer = document.createElement('div');
        let title = document.createElement('p');

        poster.src = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : `https://via.placeholder.com/500x750?text=No+Poster`;
        poster.alt = item.title || "Poster";

        title.innerText = item.title;
        title.classList.add("genres-title");

        posterContainer.append(poster, title);
        movie?.append(posterContainer);

        posterContainer.addEventListener("click", () => {
            window.location.href = `movie_open.html?id=${item.id}`;
        });
    });
}

const fetchMovieByGenre = async (genreId, page = 1) => {
    if (loading) loading.style.display = "block";

    const fetchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=${page}`;

    try {
        let response = await fetch(fetchUrl);
        let data = await response.json();

        if (page === 1 && movie) {
            movie.innerHTML = "";
        }

        if (data.results && data.results.length > 0) {
            renderMovies(data.results);
            loadMore?.classList.add("btn-show");
        }
    } catch (e) {
        console.error("Failed to load movies:", e);
    } finally {
        if (loading) loading.style.display = "none";
    }
}

const getGenres = async () => {
    const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    try {
        let response = await fetch(URL);
        let data = await response.json();
        console.log(data);

        data.genres.forEach(genreItem =>  {
            let genreContainer = document.createElement('div');
            genreContainer.innerText = genreItem.name;
            genres?.append(genreContainer);

            genreContainer.addEventListener("click", () => {
                document.querySelectorAll(".genres div").forEach(el => el.classList.remove("active"));

                genreContainer.classList.add("active");

                selectedGenreId = genreItem.id;
                currentPage = 1;
                fetchMovieByGenre(selectedGenreId, currentPage);
            });
        });
    } catch (e) {
        console.error("Failed to load genres:", e); 
    }
}

loadMore?.addEventListener("click", () => {
    if (selectedGenreId) {
        currentPage++;
        fetchMovieByGenre(selectedGenreId, currentPage);
    }
});

window.addEventListener("load", getGenres);