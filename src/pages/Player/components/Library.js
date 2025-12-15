import React from "react";
import LibrarySong from "./LibrarySong";

const Library = ({ songs, currentSong, setCurrentSong, audioRef, isPlaying, updateActive, libraryStatus }) => {
  return (
    <div className={`library ${libraryStatus ? "active" : ""}`}>
      <h2>Biblioteca</h2>
      <div className="library-songs">
        {songs.map((song) => (
          <LibrarySong
            key={song.id}
            song={song}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            audioRef={audioRef}
            isPlaying={isPlaying}
            updateActive={updateActive}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;