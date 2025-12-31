import React from "react";
import { Social } from "./styles";
import { FaWhatsapp } from "react-icons/fa";
import c1 from "../../components/Img/uj.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sobrenos.css";

import g1 from "../../components/Img/c1.jpg";
import g2 from "../../components/Img/c2.jpg";
import g3 from "../../components/Img/c3.jpg";
import g4 from "../../components/Img/c4.jpg";


export default function Sobrenos() {
  const linkZap = "https://api.whatsapp.com/send?phone=5591982390708";

  return (
    <div className="container">

      {/* ================= TÍTULO ================= */}
      <div className="main-title-card">
        <h2>REDE DE CASAIS</h2>
        <h3>AMAI SEMPRE</h3>
        <h6>INFORMAÇÕES DA LIDERANÇA</h6>
      </div>

      {/* ================= SOBRE A CÉLULA ================= */}
      <div className="card mt-4 bg-light">
        <div className="card-body">

          <h3 className="text-center mb-3">
            O que é a Célula de Casais?
          </h3>

      <p className="texto-justificado">
  Na <strong>Igreja do Evangelho Quadrangular</strong>, as células de casais são
  pequenos grupos formados por casais que se reúnem regularmente, geralmente em
  lares, com o propósito de fortalecer a fé, o casamento e a comunhão cristã,
  fundamentados na Palavra de Deus.
  <br /><br />
  Trata-se de um encontro cristão realizado fora do culto tradicional, voltado
  para o crescimento da vida espiritual do casal, o fortalecimento do
  relacionamento conjugal, a valorização da família e dos princípios cristãos,
  promovendo discipulado, cuidado mútuo e comunhão.
</p>



          {/* ================= CARDS INFORMATIVOS ================= */}
          <div className="row mt-4 g-4">

            {/* OBJETIVOS */}
            <div className="col-md-6 col-lg-3">
              <div className="info-card h-100">
                <h5>🎯 Objetivos Principais</h5>
                <ul>
                  <li>Fortalecer o casamento à luz da Bíblia</li>
                  <li>Promover comunhão entre os casais</li>
                  <li>Ajudar na resolução de conflitos familiares</li>
                  <li>Estimular a oração e o apoio mútuo</li>
                  <li>Evangelizar outros casais</li>
                </ul>
              </div>
            </div>

            {/* COMO FUNCIONA */}
            <div className="col-md-6 col-lg-3">
              <div className="info-card h-100">
                <h5>🏠 Como Funciona</h5>
                <ul>
               <li>Encontros semanais (às quintas-feiras ou aos sábados)</li>
<li>Realizados na casa de um dos casais participantes</li>
<li>Duração média de 1h a 1h30</li>
<li>Momento de louvor simples</li>
<li>Leitura e reflexão da Palavra de Deus</li>
<li>Dinâmica ou atividade voltada ao fortalecimento do casamento</li>
<li>Momento de oração e comunhão</li>
<li>Confraternização com lanche e tempo de interação</li>

                </ul>
              </div>
            </div>

            {/* QUEM PODE PARTICIPAR */}
            <div className="col-md-6 col-lg-3">
              <div className="info-card h-100">
                <h5>👩‍❤️‍👨 Quem Pode Participar</h5>
                <ul>
                  <li>Casais membros da igreja</li>
                  <li>Casais novos convertidos</li>
                  <li>Casais afastados da fé</li>
                  <li>Casais </li>
                </ul>
              </div>
            </div>

            {/* IMPORTÂNCIA */}
            <div className="col-md-6 col-lg-3">
              <div className="info-card h-100">
                <h5>🙏 Importância na Igreja</h5>
                <ul>
                  <li>Cuidado com as famílias</li>
                  <li>Fortalecimento dos lares cristãos</li>
                  <li>Formação de líderes</li>
                  <li>Prevenção de crises conjugais</li>
                  <li>Integração de novos membros</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
{/* ================= GALERIA ================= */}
<div className="galeria-casais">
  <h3 className="text-center mb-4">Momentos da Célula de Casais</h3>

  <div className="galeria-grid">
    {[g1, g2, g3, g4].map((img, index) => (
      <div key={index} className="galeria-item">
        <img src={img} alt={`Encontro ${index + 1}`} />
      </div>
    ))}
  </div>
</div>

{/* ================= GALERIA DE VÍDEOS ================= */}
<div className="card mt-4 bg-light">
  <div className="card-body">
    <h3 className="text-center mb-4">🎥 Momentos da Célula de Casais</h3>

    <div className="videos-grid">

      {/* Vídeo 1 */}
      <div className="video-card">
       <iframe width="640" height="360" frameborder="0" src="https://mega.nz/embed/TUAzSIJB#Fsru5i0KYkcPGD5x4Jey0-QdE-ERFcB8NQbIUoN04RQ" allowfullscreen ></iframe>

        <p>Encontro de Casais – Palavra e Comunhão</p>
      </div>

      {/* Vídeo 2 */}
      <div className="video-card">
        <iframe
          src="https://www.youtube.com/embed/SEU_VIDEO_2"
          title="Célula de Casais"
          frameBorder="0"
          allowFullScreen
        />
        <p>Momento de Oração e Louvor</p>
      </div>

      {/* Vídeo 3 */}
      <div className="video-card">
        <iframe
          src="https://www.youtube.com/embed/SEU_VIDEO_3"
          title="Célula de Casais"
          frameBorder="0"
          allowFullScreen
        />
        <p>Confraternização dos Casais</p>
      </div>

    </div>
  </div>
</div>


      {/* ================= BLOCO REDE AMAI ================= */}
      <div className="card mt-4 bg-primary bg-opacity-75">
        <h3 className="text-center text-white mt-3">REDE AMAI</h3>
        <h4 className="text-center text-white mb-3">CASAIS LÍDERES</h4>

        <div className="d-flex flex-wrap justify-content-center gap-4 p-3">

          <div className="cardd">
            <img src={c1} alt="Casal Líder" />
            <h2 className="card-title">CASAL — LÍDER</h2>
            <h3 className="card-title">Pastores</h3>
            <h4 className="card-title">Marcos & Solange</h4>
            <Social>
              <a href={linkZap} target="_blank" rel="noreferrer">
                <FaWhatsapp />
              </a>
            </Social>
          </div>

          <div className="cardd">
            <img src={c1} alt="Casal Líder" />
            <h2 className="card-title">CASAL — LÍDER</h2>
            <h3 className="card-title">Pastores</h3>
            <h4 className="card-title">Pina & Carla</h4>
            <Social>
              <a href={linkZap} target="_blank" rel="noreferrer">
                <FaWhatsapp />
              </a>
            </Social>
          </div>

        </div>
      </div>

      {/* ================= BLOCO CÉLULA ================= */}
      <div className="card mt-4 bg-success bg-opacity-75">
        <h3 className="text-center text-white mt-3">CÉLULA DE CASAIS</h3>
        <h4 className="text-center text-white">(UM SÓ PROPÓSITO)</h4>
        <h5 className="text-center text-white mb-3">CASAIS LÍDERES</h5>

        <div className="d-flex flex-wrap justify-content-center gap-4 p-3">

          <div className="cardd">
            <img src={c1} alt="Casal Líder" />
            <h2 className="card-title">CASAL</h2>
            <h3 className="card-title">LÍDER</h3>
            <h4 className="card-title">Altair & Ellen</h4>
            <Social>
              <a href={linkZap} target="_blank" rel="noreferrer">
                <FaWhatsapp />
              </a>
            </Social>
          </div>

          <div className="cardd">
            <img src={c1} alt="Vice Líder" />
            <h2 className="card-title">CASAL</h2>
            <h3 className="card-title">VICE-LÍDER</h3>
            <h4 className="card-title">________ & ________</h4>
            <Social>
              <a href={linkZap} target="_blank" rel="noreferrer">
                <FaWhatsapp />
              </a>
            </Social>
          </div>

          <div className="cardd">
            <img src={c1} alt="Secretário" />
            <h2 className="card-title">CASAL</h2>
            <h3 className="card-title">SECRETÁRIO</h3>
            <h4 className="card-title">Ueslei & Jessica</h4>
            <Social>
              <a href={linkZap} target="_blank" rel="noreferrer">
                <FaWhatsapp />
              </a>
            </Social>
          </div>

        </div>
      </div>

    </div>
  );
}
