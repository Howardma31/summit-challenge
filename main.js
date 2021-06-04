const pagination_element = document.getElementById('pagination');
const list_element = document.getElementById('list');
const btn = document.getElementById("submitBtn");
let movieName = null;
let current_page = 1; 
let rows = 10;
let firstDetail = true;
let firstViewMore = true;

btn.addEventListener('click', (e) => {
  movieName = document.getElementById("movieName").value;
  if (inputValid(movieName)){
    let div = document.getElementById('searchResultContainer');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    if (!firstViewMore) {
      let div1 = document.getElementById('viewMoreBtn');
      div1.removeChild(div1.firstChild);
    }
    getMovies(movieName);
  }
});

async function getMovies(movieName, pageNumber = 1) {
  const movieStream = await fetch(`http://www.omdbapi.com/?s=${movieName}&type=movie&page=${pageNumber}&apikey=a173ef96`);
  const movies = await movieStream.json();
  //const poster = await movieStream.blob();
  console.log(movies);
  let mainContainer = document.getElementById("searchResultContainer");
  SetupPagination(movies.totalResults, pagination_element, rows);
  console.log(movies.Search);
  for (let i = 0; i < movies.Search.length; i++) {
    let div = document.createElement("div");
    //const postImage.src = URL.createObjectURL(poster);
    div.setAttribute("class", "movie");
    div.innerHTML = `${movies.Search[i].Title}`;
    div.addEventListener('click', function() {
      getMovieDetail(movies.Search[i].Title);
    })
    mainContainer.appendChild(div);
  }
  viewMoreButton(movies);
  firstDetail = true;
}

async function getMovieDetail(movieName) {
  const movieDetailStream = await fetch(`http://www.omdbapi.com/?t=${movieName}&type=movie&apikey=a173ef96`);
  const movie = await movieDetailStream.json();
  let mainContainer = document.getElementById("movieDetailContainer");
  
  if (mainContainer.firstChild) {
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
  if (page_count >= current_page + 2 && current_page >= 4) {
    for (let i = current_page - 2; i < current_page + 3; i++) {
      let btn = PaginationButton(i);
      wrapper.appendChild(btn);
    } 
  }
  else {
    for (let i = 1; i < page_count + 1 && i < 6; i++) {
      let btn = PaginationButton(i);
      wrapper.appendChild(btn);
    }
  }
  firstViewMore = true;
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
    let div1 = document.getElementById('viewMoreBtn');
    while (div1.firstChild) {
      div1.removeChild(div1.firstChild);
    }
  })

  return button;
}

function viewMoreButton(movies) {
  let mainContainer = document.getElementById("viewMoreBtn");
  let button = document.createElement('button');
  button.innerText = 'View More';

  button.addEventListener('click', function () {
    if (!firstViewMore) {
      let div1 = document.getElementById('viewMoreBtn');
      while (div1.firstChild) {
        div1.removeChild(div1.firstChild);
      }
    }
    firstViewMore = false;
    getMovies(movieName, ++current_page);
  })
  let div = button;
  if (firstViewMore && (movies.totalResults - current_page * 10) > 0) {
    mainContainer.appendChild(div);
  }
  firstViewMore = false;
}

const inputValid = movieName => {
  return movieName !== '';
}
