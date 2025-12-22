import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Player.css";
import {
  faPlay,
  faPause,
  faAngleLeft,
  faAngleRight,
  faVolumeUp,
  faVolumeDown,
  faVolumeMute,
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
  // Estado local para controlar o volume atual (0 a 1)
  const [volume, setVolume] = useState(1);

  // Atualiza o volume do áudio sempre que o estado mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  // Play / Pause
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Pular faixa (próxima ou anterior)
  const skipTrackHandler = (direction) => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    let newIndex =
      direction === "forward" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex < 0) newIndex = songs.length - 1;
    if (newIndex >= songs.length) newIndex = 0;

    const newSong = songs[newIndex];
    setCurrentSong(newSong);
    updateActive(newSong.id);
    // O play automático será feito pelo useEffect no componente pai
  };

  // Arrastar barra de progresso
  const dragHandler = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setSongInfo({ ...songInfo, currentTime: newTime });
  };

  // Controle de volume
  const volumeHandler = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Ícone dinâmico de volume
  const getVolumeIcon = () => {
    if (volume === 0) return faVolumeMute;
    if (volume < 0.5) return faVolumeDown;
    return faVolumeUp;
  };

  // Formatar tempo
  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity || time === undefined) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const progressPercentage = songInfo.duration
    ? (songInfo.currentTime / songInfo.duration) * 100
    : 0;

  return (
    <div className="player-controls-container">
      {/* Controles principais */}
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

      {/* Barra de progresso da música */}
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
            step="0.1"
            value={songInfo.currentTime || 0}
            onChange={dragHandler}
          />
        </div>
        <span className="time-duration">{formatTime(songInfo.duration)}</span>
      </div>

      {/* Controle de volume com ícone dinâmico */}
      <div className="volume-container">
        <FontAwesomeIcon
          icon={getVolumeIcon()}
          className="volume-icon"
        />
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={volumeHandler}
        />
      </div>
    </div>
  );
};

export default Player;