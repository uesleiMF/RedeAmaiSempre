import React, { useState } from "react";
import "./Library.css"
const Library = ({
  songs,
  currentSong,
  setCurrentSong,
  audioRef,
  isPlaying,
  updateActive,
  libraryStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`library ${libraryStatus ? "active-library" : ""}`}>
      <div className="library-header">
        <h2>Biblioteca</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar música ou artista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="library-songs">
        {filteredSongs.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma música encontrada</p>
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div
              key={song.id}
              className={`song-item ${currentSong.id === song.id ? "active-song" : ""}`}
              onClick={() => {
                setCurrentSong(song);
                updateActive(song.id);
                if (isPlaying && audioRef.current) {
                  audioRef.current.play();
                }
              }}
            >
              <img src={song.cover} alt={song.name} className="song-cover" />
              <div className="song-info">
                <h3 className="song-name">{song.name}</h3>
                <p className="song-artist">{song.artist}</p>
              </div>
              {currentSong.id === song.id && isPlaying && (
                <div className="playing-indicator">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Library;