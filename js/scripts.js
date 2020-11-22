var moviesList = $_(".js-movies-list") ; 
var movieTemplate = $_("#movie").content;

var searchResult = [];

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
  $_(".movie-runtime" , elNewMovie).textContent = movie.runtime + " min";
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

var twoHundredMovies = normalizeMovies.slice(0 , 200);

var arrayForSort = twoHundredMovies.slice();

var renderMovies = function (movies) {
  
  moviesList.innerHTML = '';
  
  var elMovieWrapperFragment = document.createDocumentFragment();
  
  movies.forEach(function (movie) {
    elMovieWrapperFragment.appendChild(createMovieElement(movie));
  });
  
  moviesList.appendChild(elMovieWrapperFragment);
};
renderMovies(twoHundredMovies);

var btnShowMovies  = $_(".js-btn-show-movies");
btnShowMovies.addEventListener("click" , function(){
  renderMovies(normalizeMovies);
  arrayForSort = normalizeMovies.slice();
  btnShowMovies.classList.add("d-none");
  btnShowMovies.classList.remove("d-block");
});

var btnReloadMovies = $_(".js-btn-reload-movies");
btnReloadMovies.addEventListener("click" , function(){
  renderMovies(twoHundredMovies);
  arrayForSort = twoHundredMovies.slice();
  btnReloadMovies.classList.add("d-none");
  btnReloadMovies.classList.remove("d-block");
  btnShowMovies.classList.add("d-block");
  btnShowMovies.classList.remove("d-none");
});

var searchForm =  $_(".js-search-form");
var elSearchInput =  $_(".js-search-input" , searchForm);
var elMinimumRating = $_(".js-rating-input" , searchForm);

categoriesArray = ["All"];
var elSelectCategorie = $_(".js-categorie-select" , searchForm);
normalizeMovies.forEach(function(movie){
  movie.categories.forEach(function(categorie){
    if(!(categoriesArray.includes(categorie))){
      categoriesArray.push(categorie);
    };
  });
});

categoriesArray.forEach(function(categorie){
  var elNewOption = createElement("option" , "" , categorie);
  elNewOption.value = categorie ;
  elSelectCategorie.appendChild(elNewOption);
})

searchForm.addEventListener('submit' , function(evt){
  evt.preventDefault();
  var minimumRatingValue= parseFloat(elMinimumRating.value.trim() , 10);
  var categoriesValue = elSelectCategorie.value;
  
  if(elSearchInput.value.trim() === ""){
    elSearchInput.value = "";
    elSearchInput.focus();
    alert('Birodar biror nima yozing');
    return;
  };
  
  if(isNaN(elMinimumRating.value)){
    elMinimumRating.value = "";
    elMinimumRating.focus();
    alert('Birodar son yozing');
    return;
  }else if(minimumRatingValue < 0){
    elMinimumRating.value = "";
    elMinimumRating.focus();
    alert('Musbat son yozing');
    return;
  };
  
  var searchInputValue = elSearchInput.value.trim().split(" ");
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
  var searchQuery = new RegExp(searchInputValue , "gi");
  
  
  
  searchResult = normalizeMovies.filter(function(movie){
    var checkTitle = movie.title.toString().match(searchQuery);
    var checkCategorie = categoriesValue === "All" || movie.categories.includes(categoriesValue);
    var checkIMdBrating = movie.imdbRating >= (minimumRatingValue || 0) ;
    return (checkTitle && checkCategorie && checkIMdBrating);
  });
  
  if(searchResult.length === 0){
    alert('Hurmatli foydalanuvchi , afsuski bizda bunday kino yo`q ekan :(( ');
    renderMovies(twoHundredMovies);
    arrayForSort = twoHundredMovies.slice();
    elSearchInput.value = "";
    elSearchInput.focus();
    btnShowMovies.classList.add("d-block");
    btnShowMovies.classList.remove("d-none");
  }else{
    renderMovies(searchResult);
    arrayForSort = searchResult.slice();
    btnShowMovies.classList.add("d-none");
    btnShowMovies.classList.remove("d-block");
    btnReloadMovies.classList.remove("d-none");
    btnReloadMovies.classList.add("d-block");
  };
});

var sortArray = [
  {
    name:"none",
    sort:"all"
  },
  {
    name:"IMdB ID lower",
    sort:"IMdBIDl"
  },
  {
    name:"IMdB ID higher",
    sort:"IMdBIDh"
  },
  {
    name:"IMdB rating higher",
    sort:"IMdBRH"
  },
  {
    name:"IMdB rating lower",
    sort:"IMdBRL"
  },
  {
    name:"Time Up",
    sort:"timeup"
  },
  {
    name:"Time Down",
    sort:"timedown"
  },
  {
    name:"Year Down",
    sort:"yeardown"
  },
  {
    name:"Year up",
    sort:"yearup"
  }
]; 
var elMoviesSortForm = $_(".js-sort-form");
var elMoviesSortSelect = $_(".js-sort-movies");
sortArray.forEach(function(sort){
  var elNewSortOption = createElement("option");
  elNewSortOption.value = sort.sort;
  elNewSortOption.textContent = sort.name;
  elMoviesSortSelect.appendChild(elNewSortOption);
});

elMoviesSortForm.addEventListener('change', function(evt){
  evt.preventDefault();
  if(elMoviesSortSelect.value === "yeardown"){
    arrayForSort.sort(function(b , a){
      return a.year - b.year ;
    });
  }
  else if(elMoviesSortSelect.value === "yearup"){
    arrayForSort.sort(function(a , b){
      return a.year - b.year ;
    });
  }
  else if(elMoviesSortSelect.value === "timeup"){
    arrayForSort.sort(function(a , b){
      return a.runtime - b.runtime ;
    });
  }
  else if(elMoviesSortSelect.value === "timedown"){
    arrayForSort.sort(function(b , a){
      return a.runtime - b.runtime ;
    });
  }
  else if(elMoviesSortSelect.value === "IMdBRH"){
    arrayForSort.sort(function(a , b){
      return a.imdbRating - b.imdbRating ;
    });
  }
  else if(elMoviesSortSelect.value === "IMdBRL"){
    arrayForSort.sort(function(b , a){
      return a.imdbRating - b.imdbRating ;
    });
  }
  else if(elMoviesSortSelect.value === "IMdBIDl"){
    arrayForSort.sort(function(a , b){
      return ('' + a.imdbId).localeCompare(b.imdbId);
    });
  }
  else if(elMoviesSortSelect.value === "IMdBIDh"){
    arrayForSort.sort(function(b , a){
      return ('' + a.imdbId).localeCompare(b.imdbId);
    });
  }
  else if(elMoviesSortSelect.value === "all"){
    arrayForSort.sort(function(a , b){
      return a.id - b.id;
    });
  }
  renderMovies(arrayForSort);
});