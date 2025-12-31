import React, { useState } from "react";
import { CCarousel, CCarouselItem, CImage } from "@coreui/react";
import { BsFillGeoAltFill } from "react-icons/bs";
import { GrInstagram } from "react-icons/gr";
import { FaFacebookSquare } from "react-icons/fa";
import Typewriter from "typewriter-effect";


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
import ieq from "../../components/Img/ieq2.jpg"; // usada para sede e km07
import bi from "../bib.gif";
import c00 from "../../components/Img/c00.jpg";
import "./home.css";

// Frases bíblicas para a "Frase do Dia"
const frasesBiblicas = [
  {
    versiculo: "Efésios 5:25",
    texto: "Maridos, amem suas mulheres, assim como Cristo amou a igreja e entregou-se a si mesmo por ela.",
  },
  {
    versiculo: "Gênesis 2:24",
    texto: "Por isso o homem deixa seu pai e sua mãe para se unir à sua mulher, e os dois se tornam uma só carne.",
  },
  {
    versiculo: "Provérbios 18:22",
    texto: "Quem acha uma esposa acha algo excelente; recebeu uma bênção do Senhor.",
  },
  {
    versiculo: "1 Coríntios 13:4-7",
    texto: "O amor é paciente, é bondoso. O amor não inveja, não se vangloria, não se orgulha. Tudo sofre, tudo crê, tudo espera, tudo suporta.",
  },
  {
    versiculo: "Eclesiastes 4:9-10",
    texto: "Melhor é serem dois do que um... Porque se caírem, um levanta o companheiro.",
  },
  {
    versiculo: "Colossenses 3:14",
    texto: "Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.",
  },
];

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

  // Estado para o modal da Frase do Dia
  const [showModal, setShowModal] = useState(false);
  const [fraseSelecionada, setFraseSelecionada] = useState(null);

  const handleFraseClick = () => {
    const randomIndex = Math.floor(Math.random() * frasesBiblicas.length);
    setFraseSelecionada(frasesBiblicas[randomIndex]);
    setShowModal(true);
  };

  return (
    <div className="home-wrapper">
      {/* HEADER / ÍNDICE */}
<section className="home-header home-card">
  <div className="bg-gradient-title header-flex">
    <div className="header-text">
      <h3 className="title1">𝑹𝑬𝑫𝑬 𝑫𝑬 𝑪𝑨𝑺𝑨𝑰𝑺</h3>
      <h4 className="title2">𝓐𝓜𝓐𝓘--𝓢𝓔𝓜𝓟𝓡𝓔</h4>
    </div>

    <img src={c00} alt="logo" className="header-logo" />
  </div>
</section>


{/* CARROSSEL */}
<section className="home-carousel home-card">
  <CCarousel controls indicators interval={4000} className="carousel-custom">
    {carouselImages.map((img, index) => (
      <CCarouselItem key={index}>
        <div className="slide-wrapper">
          <CImage
            className="carousel-img"
            src={img}
            alt={`Slide ${index + 1}`}
            loading="lazy"
          />
        </div>
      </CCarouselItem>
    ))}
  </CCarousel>
</section>

      {/* VISITE-NOS */}
      <section className="mt-5">
        <h2 className="text-center fw-bold mb-4">VISITEM-NÓS</h2>
        <div className="row g-4">
          {/* Card 1 - Sede */}
          <div className="col-12 col-md-6">
            <div className="card home-card shadow-lg border-0 text-center bg-warning bg-opacity-10 h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="fw-bold mt-3">IEQ - SEDE</h2>
                <p className="fs-4 fw-bold">CLIQUE NA IMAGEM:</p>
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

          {/* Card 2 - IEQ KM 07 (com Frase do Dia integrada) */}
          <div className="col-12 col-md-6">
            <div className="card home-card shadow-lg border-5 text-center bg-warning bg-opacity-10 h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="fw-bold mt-3">VERSÍCULOS BÍBLICOS</h2>
                <p className="fs-4 fw-bold">CLIQUE NA IMAGEM:</p>

                {/* Frase do Dia */}
                <div className="frase-do-dia mt-3 mb-4">
                   <Typewriter
                onInit={(typewriter) => {
                  typewriter

                    .typeString ("𝑪𝑳𝑰𝑸𝑼𝑬 𝑵𝑨 𝑰𝑴𝑨𝑮𝑬M")
                    .pauseFor(700)
                    
                  
                    .typeString("  𝑬 𝑻𝑬𝑵𝑯𝑨 𝑼𝑴𝑨 ")
                    .pauseFor(700)

                    .typeString(
                      " PALAVRA 𝑩𝑰𝑩𝑳𝑰𝑪𝑨 𝑷𝑨𝑹𝑨 𝑶 𝑺𝑬𝑼 Ⓒ𝑨ⓈⒶⓂⒺⓃⓉⓄ "
                    )
                    .pauseFor(700)

                    .typeString(" 𝑱𝑬𝑺𝑼𝑺 𝑫𝑬𝑼𝑺 𝑫𝑨 𝑭𝑨𝑴𝑰𝑳𝑰𝑨.")
                    .start();
                }}
              />
                  <img
                    src={bi}
                    alt="Frase do Dia - Rede Amai Sempre"
                    className="frase-img shadow rounded-circle"
                    onClick={handleFraseClick}
                  />
                </div>

                   </div>
            </div>
          </div>
        </div>
      </section>

      {/* Células */}
      <section className="card mt-5 home-card shadow-lg border-0 bg-success bg-opacity-10">
        <div className="text-center py-4">
          <h2 className="fw-bold">VISITEM UMA DE NOSSAS CÉLULAS</h2>
          <p className="fs-4 fw-bold">CLIQUEM NAS IMAGENS PARA VEREM AS LOCALIZAÇÕES</p>
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
                      href="https://maps.app.goo.gl/e9p6hr2WNqNPU19V9"
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
      </section>

      {/* Redes Sociais */}
      <section className="card mt-5 mb-5 home-card shadow-lg border-0 text-center">
        <h5 className="my-4">CONHEÇAM NOSSAS MÍDIAS SOCIAIS</h5>
        <div className="social-area mb-4">
          <a
            href="https://www.facebook.com/ministerio.amai7"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <FaFacebookSquare size={50} className="social-icon fb" />
          </a>
          <a
            href="https://www.instagram.com/redecasaisamaisempre/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <GrInstagram size={50} className="social-icon ig" />
          </a>
        </div>
      </section>

      {/* Modal da Frase do Dia */}
      {showModal && (
        <div className="frase-modal" onClick={() => setShowModal(false)}>
          <div className="frase-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h4 className="fw-bold text-primary mb-3">FRASES DO DIA</h4>
            <p className="fs-5 fst-italic">"{fraseSelecionada.texto}"</p>
            <p className="fw-bold text-secondary">{fraseSelecionada.versiculo}</p>
            <small className="text-muted">Rede de Casais Amai Sempre ❤️</small>
          </div>
        </div>
      )}
    </div>
  );
}