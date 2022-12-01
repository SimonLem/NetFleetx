import React, { useState } from "react";

function Movie(props) {
  const [onHover, setOnHover] = useState(false);

  //Handle click sur le movieCard (reverse data flow)
  var handleClick = () => {
    props.handleClickParent({
      name: props.movieName,
      desc: props.movieDesc,
      img: props.movieImg,
      releaseDate: props.movieDate,
      vote: props.movieVote,
      genre : props.movieGenre
    });
  };

  return (
    <div
      className="movieCard"
      onClick={handleClick}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      style={{ backgroundImage: "url(" + props.movieImg + ")" }}
    >
      <div className="movieTitle" style={{ height: onHover ? "90px" : "0px" }}>
        <h2>{props.movieName}</h2>
      </div>
      <div
        className="movieDescription"
        style={{ height: onHover ? "calc(100px + 4vh + 4vw)" : "0px" }}
      >
        {props.movieDesc.length > 120
          ? props.movieDesc.slice(0, 120) + " ..."
          : props.movieDesc}
      </div>
    </div>
  );
}
export default Movie;
