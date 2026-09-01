let hamburger = document.querySelector(".hamburger");
let hamburgerIcon = document.querySelector(".hamburger i");
let navItems = document.querySelector(".nav-items");
let latestResults = document.querySelector(".results");
let loadMoreBtn = document.querySelector(".load-more");
let pageLoading = document.querySelector("#page-loading");

let currentPage = 2;
let apiKey = "a91a398701959efb03b5bfd2e1cfade0";

hamburger?.addEventListener("click", () => {
    hamburgerIcon.classList.toggle("fa-xmark");
    hamburgerIcon.classList.toggle("fa-bars");
    navItems.classList.toggle("active");
});

function movieDetails(movieId) {
    window.location.href = `movie_open.html?id=${movieId}`;
}

const getLatest = async () => {
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage}`;

    try {
        let response = await fetch(URL);
        let data = await response.json();

        if (!data.results || !latestResults) return;

        data.results.forEach((movie) =>  {
            let latestMovie = document.createElement('div');
            let poster = document.createElement('img');
            let title = document.createElement('p');
            title.innerText = movie.title;
            poster.src = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : `https://via.placeholder.com/500x750?text=No+Poster`;
            poster.alt = movie.title || "Movie Poster";
            latestMovie.append(poster, title);
            latestResults.append(latestMovie);
            
            latestMovie.addEventListener("click", () => {
                movieDetails(movie.id)
            });
        });
    } catch (error) {
        console.error("Failed to load movies:", error);
    }
};

loadMoreBtn?.addEventListener("click", () => {
    currentPage++;
    getLatest();
});

window.addEventListener("load", () => {
    getLatest()
        .finally(() => {
            if (pageLoading) pageLoading.style.display = "none";
        });
})