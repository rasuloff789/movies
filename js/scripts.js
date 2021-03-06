var moviesList = $_(".js-movies-list") ; 
var movieTemplate = $_("#movie").content;

var searchResult = [];

var createMovieElement = function(movie){
  var elNewMovie = movieTemplate.cloneNode(true);
  $_('.movie', elNewMovie).dataset.imdbId = movie.imdbId;
  $_(".movie-id" , elNewMovie).textContent = movie.id;
  $_(".movie-title" , elNewMovie).textContent = movie.title;
  $_(".movie-title" , elNewMovie).title = movie.title;
  $_(".movie-year" , elNewMovie).textContent = movie.year;
  $_(".movie-imdb-id" , elNewMovie).textContent = movie.imdbId;
  $_(".movie-imdb-rating" , elNewMovie).textContent = movie.imdbRating;
  $_(".movie-runtime" , elNewMovie).textContent = movie.runtime + " min";
  $_(".movie-genre" , elNewMovie).textContent = movie.categories.join(" , ");
  $_(".movie-genre" , elNewMovie).title = movie.categories.join(" , ");
  $_(".js-bookmark-btn" , elNewMovie).dataset.imdbId = movie.imdbId ;
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



var searchForm =  $_(".js-search-form");
var elSearchInput =  $_(".js-search-input" , searchForm);
var elMinimumRating = $_(".js-rating-input" , searchForm);

categoriesArray = [];
var elSelectCategorie = $_(".js-categorie-select" , searchForm);
normalizeMovies.forEach(function(movie){
  movie.categories.forEach(function(categorie){
    if(!(categoriesArray.includes(categorie))){
      categoriesArray.push(categorie);
    };
  });
});
categoriesArray.sort();
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
  }else{
    arrayForSort = searchResult.slice();
  };
  countPagination(arrayForSort);
});

var sortArray = [
  {
    name:"none",
    sort:"all"
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
  else if(elMoviesSortSelect.value === "all"){
    arrayForSort.sort(function(a , b){
      return a.id - b.id;
    });
  }
  countPagination(arrayForSort);
});

var setModalValues = function(array){
  $_("#movie-title").textContent = array.title ;
  $_(".movie-description").textContent = `Brief description : ${array.summary}`;
  $_(".movie-language").textContent = array.language ;
  $_(".movie-tlink").href = array.youtubeId;
};

var bookmarkMovies = $_(".js-bookmark-movies");
var bookmarkedMoviesArray = [];
var bookmarkTemplate = $_("#bookmark-element").content ;

var renderBookmarkedMovies = () =>{
  bookmarkMovies.innerHTML = "";
  
  var bookmarkedMoviesFragment = document.createDocumentFragment() ;
  
  bookmarkedMoviesStorage.forEach((movie)=>{
    var elBookmarkedMovie = bookmarkTemplate.cloneNode(true);
    
    $_(".js-bookmark-element" ,elBookmarkedMovie).textContent = movie.title ;
    $_(".js-bookmark-element" ,elBookmarkedMovie).title = movie.title ;
    $_(".btn-delete-bookmark" ,elBookmarkedMovie).dataset.imdbId = movie.imdbId ;
    
    bookmarkedMoviesFragment.appendChild(elBookmarkedMovie);
  });
  
  bookmarkMovies.appendChild(bookmarkedMoviesFragment);
};

var localRepeat = function(){
  var menu = JSON.stringify(bookmarkedMoviesStorage);
  localStorage.setItem("bookmarkedMoviesStorage" , menu);
};

if (!localStorage.getItem("bookmarkedMoviesStorage")){
  var bookmarkedMoviesStorage = [];
  localRepeat();
}else{
  var bookmarkedMoviesStorage = JSON.parse(localStorage.getItem("bookmarkedMoviesStorage"));
  renderBookmarkedMovies();
}


var checkAndAddBookmarkeds = (movie)=>{
  var isBookmarked = bookmarkedMoviesStorage.find(function(bookmark){
    return bookmark.imdbId === movie.imdbId ;
  });
  
  if(!isBookmarked){
    bookmarkedMoviesStorage.push(movie);
    renderBookmarkedMovies();
  }
};

moviesList.addEventListener("click",(evt)=>{
  if(evt.target.matches(".js-open-modal-btn")){
    var elParentli = evt.target.closest(".movie");
    var moreInfo = normalizeMovies.find(function(movie){
      return movie.imdbId === elParentli.dataset.imdbId;
    });
    setModalValues(moreInfo);
  } else if(evt.target.matches(".js-bookmark-btn")){
    var movieImdbId = evt.target.dataset.imdbId;
    let foundMovie = normalizeMovies.find(movie => movie.imdbId === movieImdbId);
    
    localStorage.removeItem("bookmarkedMoviesStorage");
    checkAndAddBookmarkeds(foundMovie);
    localRepeat();
  }
});

bookmarkMovies.addEventListener("click" , (evt)=>{
  if(evt.target.matches(".btn-delete-bookmark")){
    var btnImdbId = evt.target.dataset.imdbId ;
    var findBookmarkMovie = bookmarkedMoviesStorage.find((movie)=>{
      return movie.imdbId === btnImdbId;
    });
    var indexBookmark = bookmarkedMoviesStorage.indexOf(findBookmarkMovie);
    
    bookmarkedMoviesStorage.splice(indexBookmark , 1);
    localRepeat();
    renderBookmarkedMovies();
  };
});

var indexClick = 0;
var pageLength = 10;
var paginationNumber = 10;
var paginationList = $_(".js-pagination");
var itemTemplate = $_("#pagination-template").content ;

var countPagination = function(i){
  var paginationLengCount =   Math.ceil(i.length / pageLength);
  renderPagination(paginationLengCount);
  var paginationSlice = i.slice(0 , pageLength);
  renderMovies(paginationSlice)
}

var renderPagination = function(value){
  
  if(value < 2){
    return;
  };
  
  paginationList.innerHTML = "" ;
  
  var fragmentForItems = document.createDocumentFragment();
  
  for(var i = 1; i <= value; i++){
    var cloneTemplate = itemTemplate.cloneNode(true);
    
    $_(".page-link" , cloneTemplate).textContent = i ;
    $_(".page-link" , cloneTemplate).dataset.id = i;
    
    fragmentForItems.append(cloneTemplate);
  };
  
  $$_(".page-item" , fragmentForItems)[0].classList.add("active");
  
  paginationList.append(fragmentForItems);
  
};

paginationList.addEventListener('click', (evt)=>{
  if(evt.target.matches("a")){
    evt.preventDefault();
    $$_(".pagination-item").forEach((item)=>{
      item.classList.remove("active");
    });
    evt.target.closest(".pagination-item").classList.add("active");
    var targetValue = Number(evt.target.dataset.id) - 1;
    var slice = arrayForSort.slice(targetValue * pageLength  , targetValue * pageLength + pageLength);
    countPagination(slice);
  }
});

countPagination(twoHundredMovies);