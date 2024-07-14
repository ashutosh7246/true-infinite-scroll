import React from "react";
import "./Card.css";

const Card = ({ item }) => {
    return (
        <div className="card">
            {item.title}
        </div>
    );
};

export default Card;
