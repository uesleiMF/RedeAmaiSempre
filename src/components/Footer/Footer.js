import React from 'react';
import { Container, Social } from './FooterStyles';
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <Container>
      
      <Social>
        <a 
          href="https://api.whatsapp.com/send?phone=5591982390708"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp />
        </a>

        <a 
          href="https://pt-br.facebook.com/ieqsedemaraba/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook />
        </a>

        <a 
          href="https://www.instagram.com/ieqsedemaraba/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
      </Social>

      <span>IEQ</span>
      <span>Igreja do Evangelho Quadrangular</span>
      <span>Marabá - PA</span>

    </Container>
  );
}
