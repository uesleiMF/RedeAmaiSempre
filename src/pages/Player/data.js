// src/data.js
import { v4 as uuidv4 } from "uuid";

const data = () => [
  {
    name: "Deus de Detalhes",
    artist: "Aso, Middle School",
    cover: "/images/2.png",
    audio: "/music/a.mp3",
    color: ["#205950", "#2ab3bf"],
    id: uuidv4(),
    active: true,
  },
  {
    name: "Bondade de Deus",
    artist: "Isaías Saad",
    cover: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886e3c4d7e9923e",
    audio: "/music/bondade-de-deus.mp3",
    color: ["#EF8EA9", "#ab417f"],
    id: uuidv4(),
    active: false,
  },
  {
    name: "Oceans",
    artist: "Hillsong United",
    cover: "https://i.scdn.co/image/ab67616d0000b273e9a9a8e430d4570f6d37dc41",
    audio: "", // FUNCIONA 100%
    color: ["#84fab0", "#8fd3f4"],
    id: uuidv4(),
    active: false,
  },
];

export default data;