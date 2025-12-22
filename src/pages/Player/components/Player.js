import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Player.css";
import {
  faPlay,
  faPause,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  songs,
  setCurrentSong,
  updateActive,
}) => {
  // Play/Pause
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Pular faixa
  const skipTrackHandler = (direction) => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    let newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = songs.length - 1;
    if (newIndex >= songs.length) newIndex = 0;
    const newSong = songs[newIndex];
    setCurrentSong(newSong);
    updateActive(newSong.id);
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  // Arrastar barra
  const dragHandler = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setSongInfo({ ...songInfo, currentTime: newTime });
  };

  // Formatar tempo
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const progressPercentage = songInfo.duration
    ? (songInfo.currentTime / songInfo.duration) * 100
    : 0;

  return (
    <div className="player-controls-container"> {/* Novo container mais leve */}
      {/* Controles centrais */}
      <div className="play-controls">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("back")}
          className="skip-btn"
          icon={faAngleLeft}
          size="2x"
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play-btn"
          icon={isPlaying ? faPause : faPlay}
          size="3x"
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("forward")}
          className="skip-btn"
          icon={faAngleRight}
          size="2x"
        />
      </div>

      {/* Barra de progresso */}
      <div className="progress-container">
        <span className="time-current">{formatTime(songInfo.currentTime)}</span>
        <div className="track-wrapper">
          <div className="track-background" />
          <div
            className="track-progress"
            style={{ width: `${progressPercentage}%` }}
          />
          <input
            type="range"
            className="progress-slider"
            min="0"
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
          />
        </div>
        <span className="time-duration">{formatTime(songInfo.duration)}</span>
      </div>
    </div>
  );
};

export default Player;