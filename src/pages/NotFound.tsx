import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Header />
      <div style={{ padding: "350px" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link
          to="/"
          style={{
            textDecoration: "underline",
            color: "blue",
            fontSize: "4em",
          }}
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
