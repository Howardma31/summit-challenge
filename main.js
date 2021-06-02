const pagination_element = document.getElementById('pagination');
const list_element = document.getElementById('list');
const btn = document.getElementById("submitBtn");
let movieName = null;
let current_page = 1; 
let rows = 10;
let firstDetail = true;

btn.addEventListener('click', (e) => {
  movieName = document.getElementById("movieName").value;
  if (inputValid(movieName)){
    getMovies(movieName);
  }
});

async function getMovies(movieName, pageNumber = 1) {
  const movieStream = await fetch(`http://www.omdbapi.com/?s=${movieName}&type=movie&page=${pageNumber}&apikey=4051dc2f`);
  const movies = await movieStream.json();
  let mainContainer = document.getElementById("searchResultContainer");
  SetupPagination(movies.totalResults, pagination_element, rows);

  console.log(movies);
  
  for (let i = 0; i < movies.Search.length; i++) {
    let div = document.createElement("div");
    div.setAttribute("class", "movie");
    div.innerHTML = `${movies.Search[i].Title}`;
    div.addEventListener('click', function() {
      getMovieDetail(movies.Search[i].Title);
    })
    mainContainer.appendChild(div);
  }

  firstDetail = true;
}

async function getMovieDetail(movieName) {
  const movieDetailStream = await fetch(`http://www.omdbapi.com/?t=${movieName}&type=movie&apikey=4051dc2f`);
  const movie = await movieDetailStream.json();
  let mainContainer = document.getElementById("searchResultContainer");
  
  if (!firstDetail) {
    let previousDetail = document.getElementById("movieDetail");
    previousDetail.parentNode.removeChild(previousDetail);
  }

  let div = document.createElement("div");
  div.setAttribute("id", "movieDetail");
  div.innerHTML = `Title: ${movie.Title} Release Data: ${movie.Released} <br /> Runtime: ${movie.Runtime} Genre: ${movie.Genre} <br /> Director: ${movie.Director}`;
  mainContainer.appendChild(div);
  firstDetail = false;
}

function SetupPagination(length, wrapper, rows_per_page) {
  wrapper.innerHTML = '';

  let page_count = Math.ceil(length / rows_per_page);
  for (let i = 1; i < page_count + 1 && i < 6; i++) {
    let btn = PaginationButton(i);
    wrapper.appendChild(btn);
  }
}

function PaginationButton(page) {
  let button = document.createElement('button');
  button.innerText = page;

  if (current_page == page) button.classList.add('active');

  button.addEventListener('click', function () {
    current_page = page;
    let div = document.getElementById('searchResultContainer');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    getMovies(movieName, current_page);
  })

  return button;
}

function ShowMoreButton() {
  let button = document.createElement('button');
  button.innerText = 'Show More';
  let nextPage = current_page++;

  button.addEventListener('click', function () {
    getMovies(movieName, nextPage);
  })

  return button;
}

const inputValid = movieName => {
  return movieName !== '';
}

