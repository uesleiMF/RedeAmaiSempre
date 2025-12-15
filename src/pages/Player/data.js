import { v4 as uuidv4 } from "uuid";

const data = () => [
  {
    name: "Deus de Detalhes",
    artist: "Aso, Middle School",
    cover: "https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg",
    audio: "https://mp3.chillhop.com/serve.php/?mp3=9248",
    color: ["#205950", "#2ab3bf"],
    id: uuidv4(),
    active: true,
  },
  {
    name: "Bondade de Deus",
    artist: "Isaías Saad",
    cover: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886e3c4d7e9923e",
    audio: "https://mp3.chillhop.com/serve.php/?mp3=10075",
    color: ["#EF8EA9", "#ab417f"],
    id: uuidv4(),
    active: false,
  },
  {
    name: "Oceans (Where Feet May Fail)",
    artist: "Hillsong United",
    cover: "https://i.scdn.co/image/ab67616d0000b273e9a9a8e430d4570f6d37dc41",
    audio: "https://mp3.chillhop.com/serve.php/?mp3=10074",
    color: ["#84fab0", "#8fd3f4"],
    id: uuidv4(),
    active: false,
  },
  // Adicione mais músicas aqui
];

export default data;