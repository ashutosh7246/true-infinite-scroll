import React from "react";
import "./Card.css";

interface CardProps {
  item: any;
}

const Card1: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="card">
      {item.id !== undefined ? <div>Item {item.id}</div> : null}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div style={styles.card}>
      {/* Thumbnail Image */}
      <img src={item.thumbnail} alt={item.title} style={styles.thumbnail} />
      <div style={styles.content}>
        {/* Product Title */}
        <h2 style={styles.title}>{item.title}</h2>
        {/* Product Description */}
        <p style={styles.description}>{item.description}</p>
        {/* Price and Discount */}
        <p style={styles.price}>Price: ${item.price.toFixed(2)}</p>
        <p style={styles.discount}>
          Discount: {(item.discountPercentage * 100).toFixed(0)}%
        </p>
        {/* Product Brand and Availability */}
        <p style={styles.brand}>Brand: {item.brand}</p>
        <p style={styles.availability}>
          Availability: {item.availabilityStatus}
        </p>
        {/* Product Rating */}
        <p style={styles.rating}>Rating: {item.rating}</p>
      </div>
    </div>
  );
};

// Inline styles for the card component
const styles = {
  card: {
    border: "1px solid rgb(204, 204, 204)",
    borderRadius: "8px",
    height: "100%",
    fontFamily: "Arial, sans-serif",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 8px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  content: {
    width: "75%",
  },
  thumbnail: {
    width: "25%",
    height: "auto",
    maxHeight: "60px", // Limit the thumbnail height
    borderRadius: "8px",
  },
  title: {
    fontSize: "1.25rem",
    margin: "5px 0",
    whiteSpace: "nowrap", // Prevent text from wrapping
    overflow: "hidden", // Hide overflowed text
    textOverflow: "ellipsis", // Add ellipsis for overflowed text
  },
  description: {
    fontSize: "0.8rem",
    color: "#555",
    overflow: "hidden", // Hide content if it overflows
    textOverflow: "ellipsis", // Add ellipsis for overflowed text
    whiteSpace: "nowrap",
  },
  price: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#2a9d8f",
    margin: "5px 0",
  },
  discount: {
    fontSize: "0.9rem",
    color: "#e76f51",
  },
  brand: {
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  availability: {
    fontSize: "0.8rem",
    color: "#2a9d8f",
  },
  rating: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: "5px 0",
  },
  reviews: {
    textAlign: "left",
    overflowY: "auto", // Enable vertical scrolling for reviews
    maxHeight: "50px", // Restrict height of reviews section
  },
  review: {
    borderTop: "1px solid #ddd",
    padding: "2px 0",
  },
};

export default Card1;
