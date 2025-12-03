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
import ieq from "../../components/Img/ieq2.jpg";

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

      {/* Título */}
      <div className="card mt-4 bg-info home-card">
        <h3 className="text-center mt-3 title1">REDE DE CASAIS</h3>
        <h4 className="text-center title2">AMAI SEMPRE</h4>

        {/* Carrossel */}
       <CCarousel controls indicators interval={3000}>
  {carouselImages.map((img, index) => (
    <CCarouselItem key={index}>
      <CImage className="d-block carousel-img" src={img} />
    </CCarouselItem>
  ))}
</CCarousel>


      </div>

      {/* Visite-nos */}
      <div className="card mt-4 bg-warning bg-opacity-50 home-card">

        <p className="text-center fs-2 fw-bold">VISITE-NOS</p>
        <p className="text-center fs-4 fw-bold">CLIQUE NA IMAGEM ABAIXO:</p>

        <div className="ieq-container">
          <div className="ieq-hover">
            <img src={ieq} alt="IEQ" />
          </div>
        </div>

        <p className="text-center fs-3 fw-bold">IEQ - SEDE</p>
        <p className="text-center fs-4 fw-bold">Igreja do Evangelho Quadrangular</p>
        <p className="text-center fs-4 fw-bold">Marabá - PA</p>
      </div>

      {/* Celulas */}
      <div className="card mt-4 bg-success bg-opacity-50 home-card">

        <p className="text-center fs-2 fw-bold">VISITE UMA CÉLULA</p>
        <p className="text-center fs-4 fw-bold">
          CLIQUE NA IMAGEM PARA VER A LOCALIZAÇÃO
        </p>

        <div className="row g-3 p-3">
          {celulas.map((celula, i) => (
            <div className="col-12 col-md-4" key={i}>
              <div className="flip-card">
                <div className="flip-card-inner">

                  <div className="flip-card-front">
                    <img src={celula.img} alt="celula" height="200px" className="card-img-top" />
                  </div>

                  <div className="flip-card-back">
                    <h3>CÉLULA</h3>
                    <h5>UM SÓ PROPÓSITO</h5>
                    <p>{celula.endereco}</p>

                    <a className="icon-map" href="https://maps.app.goo.gl/e9p6hr2WNqNPU19V9">
                      <BsFillGeoAltFill />
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Redes sociais */}
      <div className="card mt-4 mb-3 bg-info home-card">
        <h5 className="text-center">CONHEÇAM NOSSAS MÍDIAS SOCIAIS</h5>

        <div className="social-area">
          <a href="https://www.facebook.com/ministerio.amai7">
            <FaFacebookSquare />
          </a>

          <a href="https://instagram.com">
            <GrInstagram />
          </a>
        </div>
      </div>

    </div>
  );
}
