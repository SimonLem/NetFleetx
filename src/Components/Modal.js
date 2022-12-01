import React from "react";
import { FaRegWindowClose, FaStar } from "react-icons/fa";

function Modal(props) {
  //Integration de la note du film avec des étoiles
  var tabGlobalRating = [];
  for (let i = 0; i < 10; i++) {
    let color = {};
    if (i < props.movieModal.vote) {
      color = { color: "#f1c40f" };
    }
    tabGlobalRating.push(<FaStar style={color} key={i}/>);

    //Handle pour la fermeture de la modal
    var handleClick = () => {
      props.handleClickParent();
    };
  }
  return (
    <div className="modal">
      <FaRegWindowClose className="closeIcon" onClick={() => handleClick()} />
      <h1 >{props.movieModal.name}</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "5%",
          }}
        >
          <p>
            {props.movieModal.releaseDate
              ? new Date(props.movieModal.releaseDate).getFullYear()
              : "Date de sortie inconnue"}
          </p>
          <p>{props.movieModal.genre}</p>
          <p>{tabGlobalRating}</p>
        </div>
        <img
          alt=""
          src={props.movieModal.img}
          className="movieImg"
          style={{ backgroundColor: "green" }}
        />
      </div>
      <div style={{ margin: "5%" }}>
        <p>{props.movieModal.desc}</p>
      </div>
    </div>
  );
}
export default Modal;
