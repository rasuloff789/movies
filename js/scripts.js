var moviesList = $_(".js-movies-list") ; 
var movieTemplate = $_("#movie").content;

var createMovieElement = function(movie){
  var elNewMovie = movieTemplate.cloneNode(true);
  $_(".movie-id" , elNewMovie).textContent = movie.id;
  $_(".movie-title" , elNewMovie).textContent = movie.title;
  $_(".movie-title" , elNewMovie).title = movie.title;
  $_(".movie-year" , elNewMovie).textContent = movie.year;
  $_(".movie-tlink" , elNewMovie).href = movie.youtubeId;
  $_(".movie-imdb-id" , elNewMovie).textContent = movie.imdbId;
  $_(".movie-imdb-rating" , elNewMovie).textContent = movie.imdbRating;
  $_(".movie-description" , elNewMovie).textContent = `Brief description : ${movie.summary}`;
  $_(".movie-runtime" , elNewMovie).textContent = movie.runtime + " minut";
  $_(".movie-language" , elNewMovie).textContent = movie.language;
  $_(".movie-genre" , elNewMovie).textContent = movie.categories.join(" , ");
  $_(".movie-genre" , elNewMovie).title = movie.categories.join(" , ");
  
  return elNewMovie;
};

var normalizeMovies = movies.map(function(movie , i){
  return {
    
    id: i + 1,
    title: movie.Title,
    year: movie.movie_year,
    categories: movie.Categories.split('|'),
    summary: movie.summary,
    imdbId: movie.imdb_id,
    imdbRating: movie.imdb_rating,
    runtime: movie.runtime,
    language: movie.language,
    youtubeId: `https://youtube.com/watch?v=${movie.ytid}`
    
  };
});

var renderMovies = function (movies) {
  
  moviesList.innerHTML = '';
  
  var elMovieWrapperFragment = document.createDocumentFragment();
  
  movies.forEach(function (movie) {
    elMovieWrapperFragment.appendChild(createMovieElement(movie));
  });
  
  moviesList.appendChild(elMovieWrapperFragment);
};

renderMovies(normalizeMovies);