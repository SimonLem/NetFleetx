import "./App.css";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import MovieCard from "./Components/MovieCard";
import Modal from "./Components/Modal";

function App() {
  const [searchValue, setSearchValue] = useState(""); //Valeur du champs de saisi de la search bar
  const [listMovie, setListMovie] = useState([]); //Liste des films récupérés auprès de l'API
  const [listGenre, setListGenre] = useState([]); //Liste des genre récupérés auprès de l'API
  const [movieModal, setMovieModal] = useState(""); //Film selectionné par l'utilisateur à afficher à l'ecran
  const [openModal, setOpenModal] = useState(false); //Toggle d'ouverture de la modal du film selectionné
  const [hasAlreadySearched, setHasAlreadySearched] = useState(false); //True si la barre de recherche a été utilisée au moins une fois

  //Requête API : Liste des genres
  async function fetchDataGenre() {
    var rawResponse = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_KEY}&language=fr`
    );
    var response = await rawResponse.json();
    setListGenre(response.genres);
  }
  //Requête API : Films les plus populaires
  async function fetchDataNoSearch() {
    var rawResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_KEY}&language=fr`
    );
    var response = await rawResponse.json();
    setListMovie(response.results);
  }
  //Lance la première requête API et recupère les genres au lancement du site
  useEffect(() => {
    fetchDataGenre();
    fetchDataNoSearch();
  }, []);

  //Lance la deuxième requête API lorsque le champs de recherche est mis à jour et qu'il n'est pas vide
  useEffect(() => {
    //Requête API : Resultats de la recherche
    async function fetchDataSearch() {
      var rawResponse = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_KEY}&language=fr-FR&query=${searchValue}&page=1`
      );
      var response = await rawResponse.json();
      setListMovie(response.results);
    }
    if (searchValue !== "") {
      fetchDataSearch();
      setHasAlreadySearched(true);
    } else {
      fetchDataNoSearch();
    }
  }, [searchValue]);

  //Fermeture modal après click sur l'îcone de croix (reverse dataflow avec le component Modal)
  var clickModal = () => {
    setOpenModal(!openModal);
  };

  //Ouverture modal après click sur une MovieCard (reverse dataflow avec le component MovieCard)
  var clickMovie = (movie) => {
    setMovieModal(movie);
    setOpenModal(!openModal);
  };

  //Convertit les ID de genre de film en string (prend un array d'ID en entrée)
  var genreIDtoString = (id) => {
    let genre = "";
    for (let i = 0; i < id.length; i++) {
      genre += listGenre.find((e) => e.id === id[i]).name + " ";
    }
    return genre;
  };

  //Map des components Movie à partir de la liste de films récupérés par l'API
  var listMovieMap = listMovie.map((movie, i) => {
    var img =
      movie.backdrop_path == null
        ? "/noImageAvailable.jpg"
        : "https://image.tmdb.org/t/p/w500/" + movie.backdrop_path;
    var desc =
      movie.overview.length === 0 ? "Description indisponible" : movie.overview;

    return (
      <MovieCard
        key={i}
        movieName={movie.title}
        movieDesc={desc}
        movieImg={img}
        movieDate={movie.release_date}
        movieVote={movie.vote_average}
        movieGenre={genreIDtoString(movie.genre_ids)}
        handleClickParent={clickMovie}
      />
    );
  });

  //Map des premiers resultats pour les afficher en dessous de la barre de recherche
  var bestResultsMap = listMovie.map((movie, i) => {
    var img = "";
    //Garde les  8 premiers resultats et verifie que le champs de saisie n'est pas vide
    if (i < 8 && searchValue !== "") {
      var title = movie.title;
      //Verifie que le titre n'est pas trop long
      if (movie.title.length > 45) {
        title = movie.title.slice(0, 45) + " ...";
      }
      //Verifie que l'image existe dans la DB
      if (movie.backdrop_path !== null) {
        img = "https://image.tmdb.org/t/p/w500/" + movie.backdrop_path;
      } else {
        img = "/noImageAvailable.jpg";
      }
      //Renvoie les resultats de la recherche et affiche les details du film via la modal si le film est cliqué
      return (
        <div
          key={i}
          className="searchMovie"
          onClick={() => {
            setMovieModal({
              name: movie.title,
              desc: movie.overview,
              img: img,
              vote: movie.vote_average,
              releaseDate: movie.release_date,
              genre: genreIDtoString(movie.genre_ids),
            });
            setOpenModal(true);
          }}
        >
          {title}
        </div>
      );
    } else return null;
  });

  return (
    <div className="App">
      <div
        className="Menu"
        style={{ width: hasAlreadySearched ? "25vw" : "100vw" }}
      >
        <a href="http://localhost:3000/">
          <img
            alt="logo"
            src="../logoNetfleetx.jpg"
            style={{
              width: hasAlreadySearched ? "100%" : "50%",
              marginTop: "2%",
              cursor: "pointer",
            }}
          />
        </a>
        <div
          className="searchBar"
          style={{
            marginTop: !hasAlreadySearched ? "0" : searchValue ? "5vh" : "30vh",
          }}
        >
          <FaSearch
            style={{ color: "black", marginRight: "4%", marginLeft: "4%" }}
          />
          <input
            id="input"
            type="text"
            value={searchValue}
            placeholder="Find a movie"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
        <div className="searchList">{bestResultsMap}</div>
      </div>
      <div className="Movies">
        {openModal ? (
          <Modal movieModal={movieModal} handleClickParent={clickModal} />
        ) : null}
        {listMovie.length !== 0 ? (
          listMovieMap
        ) : (
          <p style={{ color: "white", marginTop: "40vh" }}>Aucun résultat</p>
        )}
      </div>
    </div>
  );
}

export default App;
