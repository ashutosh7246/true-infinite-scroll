import React from "react";
import "./Card.css";

const Card = ({ item }) => {
  return (
    <div className="card">
      {item.id !== undefined ? <div>Item {item.id}</div> : null}
      {/* {item.title} */}
    </div>
  );
};

export default Card;
