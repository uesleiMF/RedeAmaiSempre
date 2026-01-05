import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import "./Nav.css";


const Nav = ({ libraryStatus, setLibraryStatus }) => {
  return (
    <nav className="nav-container">
      <h1 className="nav-title">Louvor</h1>

      <button
        className={`library-toggle-btn ${libraryStatus ? "active" : ""}`}
        onClick={() => setLibraryStatus(!libraryStatus)}
      >
        <FontAwesomeIcon icon={faMusic} className="music-icon" />
        
        <div className="indicator" />
      </button>
    </nav>
  );
};

export default Nav;