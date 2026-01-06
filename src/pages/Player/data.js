// src/data.js
import { v4 as uuidv4 } from "uuid";

const data = () => [
  {
    name: "O Tempo Não Pode Apagar",
    artist: "Cassiane e Jairinho",
    cover: "/images/2.png",
    audio: "/music/a.mp3",
    color: ["#205950", "#2ab3bf"],
    id: uuidv4(),
    active: true,
  },
  {
    name: "Bondade de Deus",
    artist: "Isaías Saad",
    cover: "/images/img.png",
    audio: "/music/bondade-de-deus.mp3",
    color: ["#EF8EA9", "#ab417f"],
    id: uuidv4(),
    active: false,
  },
  {
    name: "Quem_E_Esse",
    artist: "Julliany_Souza",
    cover: "/images/2.gif",
    audio: "/music/Quem_E_Esse.mp3", // FUNCIONA 100%
    color: ["#84fab0", "#8fd3f4"],
    id: uuidv4(),
    active: false,
  },
  {
    name: "Deus_de_Obras_Completas",
    artist: "Kemilly_Santos",
    cover: "/images/1.gif",
    audio: "/music/Deus_de_Obras_Completas.mp3", // FUNCIONA 100%
    color: ["#84fab0", "#8fd3f4"],
    id: uuidv4(),
    active: false,
  },
];

export default data;