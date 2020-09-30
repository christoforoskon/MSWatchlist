$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  })
});

function getMovies(searchText) {
  axios.get('https://api.themoviedb.org/3/search/multi?api_key=0d4ae1177a07410d53db70ff834d35ca&language=en-US&page=1&include_adult=false&query=' + searchText)
    .then((response) => {
      console.log(response);
      let movies = response.data.results;
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}">
              <h5>${movie.original_title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
              ${movie.id}
            </div>
          </div>
        `;
      });
      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = '/movies';
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem('movieId');

  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'?api_key=0d4ae1177a07410d53db70ff834d35ca&language=en-US')
    .then((response) => {
      console.log(response);
      console.log(movieId);
    })
    .catch((err) => {
      console.log(err);
    });
}