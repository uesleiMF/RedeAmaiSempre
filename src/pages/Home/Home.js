import React from "react";
import { CCarousel, CCarouselItem, CImage } from "@coreui/react";
import { BsFillGeoAltFill } from "react-icons/bs";
import { GrInstagram } from "react-icons/gr";
import { FaFacebookSquare } from "react-icons/fa";
import c0 from "../../components/Img/c0.jpg";
import c1 from "../../components/Img/c1.jpg";
import c2 from "../../components/Img/c2.jpg";
import c3 from "../../components/Img/c3.jpg";
import c4 from "../../components/Img/c4.jpg";
import c5 from "../../components/Img/c5.jpg";
import c6 from "../../components/Img/c6.jpg";
import c7 from "../../components/Img/c7.jpg";
import c8 from "../../components/Img/c8.jpg";
import c9 from "../../components/Img/c9.jpg";
import ieq from "../../components/Img/ieq2.jpg";  // sede
// import ieqKm07 from "../../components/Img/ieq-km07.jpg";  // descomente se tiver imagem diferente

import "./home.css";

export default function Home() {
  const carouselImages = [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9];

  const celulas = [
    { img: c1, endereco: "FOLHA 10 QUADRA 00 LOTE 00" },
    { img: c2, endereco: "FOLHA 11 QUADRA 02 LOTE 15" },
    { img: c3, endereco: "FOLHA 08 QUADRA 05 LOTE 25" },
    { img: c4, endereco: "FOLHA 20 QUADRA 03 LOTE 30" },
    { img: c5, endereco: "FOLHA 06 QUADRA 09 LOTE 12" },
    { img: c6, endereco: "FOLHA 15 QUADRA 07 LOTE 40" },
    { img: c7, endereco: "FOLHA 17 QUADRA 01 LOTE 50" },
    { img: c8, endereco: "FOLHA 22 QUADRA 03 LOTE 18" },
    { img: c9, endereco: "FOLHA 12 QUADRA 04 LOTE 22" },
  ];

  return (
    <div className="container home-wrapper">
      {/* Título + Carrossel */}
      <div className="card mt-4 home-card shadow-lg border-0">
        <div className="text-center py-4 bg-gradient-title">
          <h3 className="title1 mb-0">REDE DE CASAIS</h3>
          <h4 className="title2">AMAI SEMPRE</h4>
        </div>
        <CCarousel controls indicators interval={4000} className="carousel-custom">
          {carouselImages.map((img, index) => (
            <CCarouselItem key={index}>
              <div className="slide-wrapper">
                <CImage
                  className="carousel-img"
                  src={img}
                  alt={`Slide ${index + 1} - Rede de Casais`}
                  loading="lazy"
                />
              </div>
            </CCarouselItem>
          ))}
        </CCarousel>
      </div>

      {/* Visite-nos - IEQ (duplicado lado a lado) */}
      <div className="mt-5">
        <h2 className="text-center fw-bold mb-4">VISITE-NOS</h2>
        <div className="row g-4">
          
          {/* Card 1 - Sede */}
          <div className="col-12 col-md-6">
            <div className="card home-card shadow-lg border-0 text-center bg-warning bg-opacity-10 h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="fw-bold mt-3">IEQ - SEDE</h2>
                <p className="fs-4 fw-bold">CLIQUE NA IMAGEM ABAIXO:</p>
                <div className="ieq-container mt-auto mb-3 mx-auto">
                  <a
                    href="https://maps.app.goo.gl/e9p6hr2WNqNPU19V9"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={ieq}
                      alt="IEQ Sede - Marabá/PA"
                      className="ieq-img img-fluid rounded shadow-sm"
                      loading="lazy"
                    />
                  </a>
                </div>
                <h3 className="fw-bold">Igreja do Evangelho Quadrangular</h3>
                <p className="fs-4 fw-bold mb-3">Marabá - PA</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Exemplo: Km 07 (troque link/imagem se necessário) */}
          <div className="col-12 col-md-6">
            <div className="card home-card shadow-lg border-0 text-center bg-warning bg-opacity-10 h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="fw-bold mt-3">IEQ - KM 07</h2>
                <p className="fs-4 fw-bold">CLIQUE NA IMAGEM ABAIXO:</p>
                <div className="ieq-container mt-auto mb-3 mx-auto">
                  <a
                    href="https://www.facebook.com/QuadrangularKm07/"  // ← link real da página da IEQ Km 07 em Marabá
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={ieq}  // ← mesma imagem por enquanto; troque por outra se quiser
                      alt="IEQ Km 07 - Marabá/PA"
                      className="ieq-img img-fluid rounded shadow-sm"
                      loading="lazy"
                    />
                  </a>
                </div>
                <h3 className="fw-bold">Igreja do Evangelho Quadrangular</h3>
                <p className="fs-4 fw-bold mb-3">Marabá - PA</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Células */}
      <div className="card mt-5 home-card shadow-lg border-0 bg-success bg-opacity-10">
        <div className="text-center py-4">
          <h2 className="fw-bold">VISITE UMA CÉLULA</h2>
          <p className="fs-4 fw-bold">CLIQUE NA IMAGEM PARA VER A LOCALIZAÇÃO</p>
        </div>
        <div className="row g-4 p-4 justify-content-center">
          {celulas.map((celula, i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i}>
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img
                      src={celula.img}
                      alt={`Célula - ${celula.endereco}`}
                      className="celula-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="flip-card-back">
                    <h3>CÉLULA</h3>
                    <h5>UM SÓ PROPÓSITO</h5>
                    <p>{celula.endereco}</p>
                    <a
                      href="https://maps.app.goo.gl/e9p6hr2WNqNPU19V9"  // ← mude para link específico se tiver
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-map"
                    >
                      <BsFillGeoAltFill size={40} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="card mt-5 mb-5 home-card shadow-lg border-0 text-center">
        <h5 className="my-4">CONHEÇA NOSSAS MÍDIAS SOCIAIS</h5>
        <div className="social-area mb-4">
          <a
            href="https://www.facebook.com/ministerio.amai7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookSquare size={50} className="social-icon fb" />
          </a>
          <a
            href="https://instagram.com/SEU_INSTAGRAM"  // ← troque pelo @ real
            target="_blank"
            rel="noopener noreferrer"
          >
            <GrInstagram size={50} className="social-icon ig" />
          </a>
        </div>
      </div>
    </div>
  );
}