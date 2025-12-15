import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Player = ({ currentSong, isPlaying, setIsPlaying, audioRef, songInfo, songs, setCurrentSong, updateActive }) => {
  const playSongHandler = () => setIsPlaying(!isPlaying);

  const skipTrackHandler = (direction) => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    let newIndex = direction === "skip-forward" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = songs.length - 1;
    if (newIndex >= songs.length) newIndex = 0;
    const newSong = songs[newIndex];
    setCurrentSong(newSong);
    updateActive(newSong);
    if (isPlaying) audioRef.current.play();
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
  };

  const formatTime = (time) => {
    return time ? `${Math.floor(time / 60)}:${("0" + Math.floor(time % 60)).slice(-2)}` : "0:00";
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{formatTime(songInfo.currentTime)}</p>
        <input
          min={0}
          max={songInfo.duration || 0}
          value={songInfo.currentTime}
          type="range"
          onChange={dragHandler}
        />
        <p>{formatTime(songInfo.duration)}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon onClick={() => skipTrackHandler("skip-back")} className="skip-back" size="2x" icon={faAngleLeft} />
        <FontAwesomeIcon onClick={playSongHandler} className="play" size="3x" icon={isPlaying ? faPause : faPlay} />
        <FontAwesomeIcon onClick={() => skipTrackHandler("skip-forward")} className="skip-forward" size="2x" icon={faAngleRight} />
      </div>
    </div>
  );
};

export default Player;