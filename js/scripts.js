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

var twoHundredVideos = normalizeMovies.slice(0 , 200);

var renderMovies = function (movies) {
  
  moviesList.innerHTML = '';
  
  var elMovieWrapperFragment = document.createDocumentFragment();
  
  movies.forEach(function (movie) {
    elMovieWrapperFragment.appendChild(createMovieElement(movie));
  });
  
  moviesList.appendChild(elMovieWrapperFragment);
};
renderMovies(twoHundredVideos);

var btnAddMovies  = $_(".js-btn-add-movies");

btnAddMovies.addEventListener("click" , function(){
  renderMovies(normalizeMovies);
  searchInput.value = "";
  btnAddMovies.classList.add("d-none");
  btnAddMovies.classList.remove("d-block");
});

var btnReloadMovies = $_(".js-btn-reload-movies");

btnReloadMovies.addEventListener("click" , function(){
  renderMovies(twoHundredVideos);
  searchInput.value = "";
  btnReloadMovies.classList.add("d-none");
  btnReloadMovies.classList.remove("d-block");
  btnAddMovies.classList.add("d-block");
  btnAddMovies.classList.remove("d-none");
});

var searchForm =  $_(".js-search-form");
var searchInput =  $_(".js-search-input" , searchForm);

searchForm.addEventListener('submit' , function(evt){
  evt.preventDefault();
  
  if(searchInput.value.trim() === ""){
    searchInput.value = "";
    searchInput.focus();
    alert('Birodar biror so`z yozing');
    return;
  }
  
  var searchInputValue = searchInput.value.trim().split(" ");
  var removeNull = function (array) {
    if (array.includes("")){
      array.splice(array.indexOf("") , 1);
      removeNull(array);
    }else{
      return;
    };
  };
  removeNull(searchInputValue);
  
  searchInputValue = searchInputValue.join("|").toString();
  
  var searchResult = [];
  var searchQuery = new RegExp(searchInputValue , "gi");
  
  normalizeMovies.forEach(function(movie){
    if(movie.title.toString().match(searchQuery)){
      searchResult.push(movie);
    };
  });
  
  if(searchResult.length === 0){
    alert('Hurmatli foydalanuvchi , afsuski bizda bunday kino yo`q ekan :(( ');
    renderMovies(twoHundredVideos);
    searchInput.value = "";
    searchInput.focus();
    btnAddMovies.classList.add("d-block");
    btnAddMovies.classList.remove("d-none");
  }else{
    renderMovies(searchResult);
    
    btnAddMovies.classList.add("d-none");
    btnAddMovies.classList.remove("d-block");
    btnReloadMovies.classList.remove("d-none");
    btnReloadMovies.classList.add("d-block");
  }
  
  
  
});
