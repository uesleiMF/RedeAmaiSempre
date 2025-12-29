import React from 'react';
import TypeWriterEffect from 'react-typewriter-effect';
import './Letras.css';

function Letras() {
  return (
    <div className="Letras">
      <TypeWriterEffect
        textStyle={{ fontFamily: 'Red Hat Display' }}
        startDelay={100}
        cursorColor="black"
        text="Text for typewriting effect here"
        typeSpeed={100}
        eraseSpeed={100}
      />
    </div>
  );
}

export default Letras;