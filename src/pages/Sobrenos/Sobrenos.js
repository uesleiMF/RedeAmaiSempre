import React from "react";
import { Social } from "./styles";
import { FaWhatsapp } from "react-icons/fa";
import c1 from "../../components/Img/uj.png";
import c2 from "../../components/Img/c2.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sobrenos.css";

export default function Sobrenos() {
  const linkZap =
    "https://api.whatsapp.com/send?phone=5591982390708";

  return (
    <div className="container">

      {/* TÍTULO PRINCIPAL */}
     
<div className="main-title-card">
  <h2>REDE DE CASAIS</h2>
  <h3>AMAI SEMPRE</h3>
  <h6>**INFORMAÇÕES-DA-LIDERANÇA**</h6>
</div>



      {/* BLOCO 1 */}
      <div className="card mt-4 bg-primary bg-opacity-75">
        <h3 className="text-center text-white mt-3">REDE AMAI</h3>
        <h4 className="text-center text-white mb-3">CASAIS LÍDERES</h4>

        <div className="d-flex flex-wrap justify-content-center gap-4 p-3">

          {/* Card 1 */}
          <div className="cardd">
            <img src={c1} alt="Casal Líder" className="card-img-top" />

            <h2 className="card-title">CASAL — LÍDER</h2>
            <h3 className="card-title">Pastores</h3>
            <h4 className="card-title">Marcos & Solange</h4>

            <Social>
              <a href={linkZap}>
                <FaWhatsapp />
              </a>
            </Social>
          </div>

          {/* Card 2 */}
          <div className="cardd">
            <a href="https://maps.app.goo.gl/e9p6hr2WNqNPU19V9">
              <img src={c1} alt="Localização" className="card-img-top" />
            </a>

            <h2 className="card-title">CASAL — LÍDER</h2>
            <h3 className="card-title">Pastores</h3>
            <h4 className="card-title">Pina & Carla</h4>

            <Social>
              <a href={linkZap}>
                <FaWhatsapp />
              </a>
            </Social>
          </div>

        </div>
      </div>

      {/* BLOCO 2 – CÉLULA DE CASAIS */}
      <div className="card mt-4 bg-success bg-opacity-75">
        <h3 className="text-center text-white mt-3">CÉLULA DE CASAIS</h3>
        <h4 className="text-center text-white">(UM SÓ PROPÓSITO)</h4>
        <h5 className="text-center text-white mb-3">CASAIS LÍDERES</h5>

        <div className="d-flex flex-wrap justify-content-center gap-4 p-3">

          {/* Card */}
          <div className="cardd">
            <img src={c1} alt="Casal" className="card-img" />
            <h2 className="card-title">CASAL</h2>
            <h3 className="card-title">LÍDER</h3>
            <h4 className="card-title">Altair & Ellen</h4>

            <Social>
              <a href={linkZap}>
                <FaWhatsapp />
              </a>
            </Social>
          </div>

          {/* Card */}
          <div className="cardd">
            <img src={c1} alt="Casal Vice-Líder" className="card-img-top" />

            <h2 className="card-title">CASAL</h2>
            <h3 className="card-title">VICE-LÍDER</h3>
            <h4 className="card-title">___________ & ___________</h4>

            <Social>
              <a href={linkZap}>
                <FaWhatsapp />
              </a>
            </Social>
          </div>

          {/* Card */}
          <div className="cardd">
            <img src={c1} alt="Secretário" className="card-img-top" />

            <h2 className="card-title">CASAL</h2>
            <h3 className="card-title">SECRETÁRIO</h3>
            <h4 className="card-title">Ueslei & Jessica</h4>

            <Social>
              <a href={linkZap}>
                <FaWhatsapp />
              </a>
            </Social>
          </div>

        </div>
      </div>
    </div>
  );
}
