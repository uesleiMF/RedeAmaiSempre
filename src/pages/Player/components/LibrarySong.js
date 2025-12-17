import React from "react";
import "./LibrarySong.css";
const LibrarySong = ({
  song,
  currentSong,
  setCurrentSong,
  audioRef,
  isPlaying,
  updateActive,
}) => {
  const songSelectHandler = () => {
    setCurrentSong(song);
    updateActive(song.id); // assumindo que updateActive recebe o id ou o song
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };

  const isActive = song.id === currentSong.id;

  return (
    <div
      onClick={songSelectHandler}
      className={`song-item ${isActive ? "active-song" : ""}`}
    >
      <img src={song.cover} alt={song.name} className="song-cover" />

      <div className="song-info">
        <h3 className="song-name">{song.name}</h3>
        <p className="song-artist">{song.artist}</p>
      </div>

      {/* Indicador de reprodução apenas na música atual e quando está tocando */}
      {isActive && isPlaying && (
        <div className="playing-indicator">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      )}
    </div>
  );
};

export default LibrarySong;