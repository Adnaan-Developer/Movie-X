let moviePoster = document.querySelector(".img img");
let title = document.querySelector(".title");
let rating = document.querySelector(".rating");
let year = document.querySelector(".year");
let genre = document.querySelector(".genre");
let overview = document.querySelector(".overview");
let status = document.querySelector(".status");
let productionCompanies = document.querySelector(".production-companies");
let originCountry = document.querySelector(".origin-country");
let originalLanguage = document.querySelector(".original-language");
let hamburger = document.querySelector(".hamburger");
let hamburgerIcon = document.querySelector(".hamburger i");
let navItems = document.querySelector(".nav-items");
let shareBtn = document.querySelector('.share-btn');
let details = document.querySelector(".details");
let pageLoading = document.querySelector("#page-loading");
let trailerBtn = document.querySelector(".trailer-btn");

let apiKey = "a91a398701959efb03b5bfd2e1cfade0";

hamburger?.addEventListener("click", () => {
    hamburgerIcon.classList.toggle("fa-xmark");
    hamburgerIcon.classList.toggle("fa-bars");
    navItems.classList.toggle("active");
})

const shareMovie = async (movieTitle, movieUrl) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: movieTitle,
                text: `Check out ${movieTitle} on Movie X!`,
                url: movieUrl,
            });
        } catch (err) {
            console.log("Share canceled", err);
        }
    } else {
        navigator.clipboard.writeText(movieUrl);
        alert("Link copied to clipboard!");
    }
};

const getMovie = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const movieId = params.get("id");
        const movieDetailsURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos`;

        let response = await fetch(movieDetailsURL);
        let data = await response.json();
        console.log(data);

        if (title) {
            title.innerText = data.title;
        }

        if (moviePoster) {
            moviePoster.src = data.poster_path
                ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
                : `https://via.placeholder.com/500x750?text=No+Poster`;
            moviePoster.alt = data.title || "N/A";
        }

        if (rating) {
            rating.innerText = "⭐ " + data.vote_average;
        }

        if (year) {
            year.innerText = "Year: " + data.release_date;
        }

        if (genre) {
            const topGenres = data.genres.slice(0, 3);
            genre.innerText = topGenres.map(g => g.name).join(", ");
        }

        if (overview) {
            overview.innerText = "Overview: " + data.overview;
        }

        if (status) {
            status.innerText = "Status: " + data.status;
        }

        if (productionCompanies) {
            if (data.production_companies && data.production_companies.length > 0) {
                const totalCompanies = data.production_companies.map(c => c.name).join(", ");
                productionCompanies.innerText = "Production Companies: " + totalCompanies;
            } else {
                productionCompanies.innerText = "Production Companies: " + "N/A";
            }
        }

        if (originCountry) {
            originCountry.innerText = "Country: " + (data.origin_country?.[0] || "N/A");
        }

        if (originalLanguage) {
            originalLanguage.innerText = "Original Language: " + data.original_language;
        }

        shareBtn?.addEventListener("click", () => {
            const moviePageUrl = window.location.href;
            shareMovie(data.title, moviePageUrl);
        });

        let trailerYt = "";
        function getTrailer() {
            if (!data.videos?.results || data.videos.results.length === 0) {
                trailerBtn.style.display = "none";
                return;
            }
            data.videos.results.forEach(element => {
                if (element.type === "Trailer" && element.site === "YouTube") {
                    trailerYt = `https://www.youtube.com/watch?v=${element.key}`;
                }
            });

            if (!trailerYt) {
                trailerBtn.style.display = "none";
            }
        }

        getTrailer();

        trailerBtn?.addEventListener("click", () => {
            window.open(trailerYt, '_blank');    
        });

    } catch (e) { console.error(e); }
}

window.addEventListener("load", () => {
    getMovie()
        .finally(() => {
            if (pageLoading) pageLoading.style.display = "none";
        });
});