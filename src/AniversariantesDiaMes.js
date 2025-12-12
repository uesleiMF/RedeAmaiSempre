import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AniversariantesDiaMes({ token, onListaAtualizada }) {
  const BASE_URL = "https://backtestmar.onrender.com";

  const [aniversariantesDia, setAniversariantesDia] = useState([]);
  const [aniversariantesMes, setAniversariantesMes] = useState([]);

  // Notificação ao carregar
  const notifyBirthday = (nome) => {
    if (Notification.permission === "granted") {
      new Notification("Aniversariante do Dia 🎉", { body: nome });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification("Aniversariante do Dia 🎉", { body: nome });
        }
      });
    }
  };

  const isBirthdayToday = (data) => {
    const hoje = new Date();
    const nascimento = new Date(data);
    return (
      nascimento.getDate() === hoje.getDate() &&
      nascimento.getMonth() === hoje.getMonth()
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/aniversariantes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const todos = res.data.aniversariantes;

        const dia = todos.filter((item) => isBirthdayToday(item.niverH || item.niverM));
        const mes = todos.filter((item) => {
          const dH = item.niverH ? new Date(item.niverH) : null;
          const dM = item.niverM ? new Date(item.niverM) : null;
          const hoje = new Date();
          return (
            (dH && dH.getMonth() === hoje.getMonth()) ||
            (dM && dM.getMonth() === hoje.getMonth())
          );
        });

        setAniversariantesDia(dia);
        setAniversariantesMes(mes);

        // Dispara notificação para cada aniversariante do dia
        dia.forEach((a) => notifyBirthday(a.name || a.nome));

        // Envia para componente de chamadas
        onListaAtualizada(todos);

      } catch (err) {
        console.error("Erro ao buscar aniversariantes:", err);
      }
    }

    fetchData();
  }, [token, onListaAtualizada]);

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Aniversariantes</h3>

      {/* 🎉 LISTA DO DIA */}
      <h4>Aniversariantes do Dia</h4>
      {aniversariantesDia.length === 0 && <p>Nenhum aniversariante hoje.</p>}

      {aniversariantesDia.map((item) => (
        <div
          key={item._id}
          style={{
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: "#FFF8A6", // fundo amarelo
            fontWeight: "bold",
            border: "2px solid #E8D98A",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            animation: "pulse 2s infinite",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          🎉 {item.name || item.nome}
          <span style={{ fontWeight: "normal", marginLeft: 10 }}>
            {new Date(item.niverH || item.niverM).toLocaleDateString("pt-BR")}
          </span>
        </div>
      ))}

      {/* 🎂 LISTA DO MÊS */}
      <h4>Aniversariantes do Mês</h4>
      {aniversariantesMes.length === 0 && <p>Nenhum aniversariante este mês.</p>}

      {aniversariantesMes.map((item) => (
        <div
          key={item._id}
          style={{
            padding: 10,
            marginBottom: 8,
            borderRadius: 6,
            backgroundColor: "#F3F3F3",
            border: "1px solid #D2D2D2",
          }}
        >
          {item.name || item.nome}
          <br />
          <span>{new Date(item.niverH || item.niverM).toLocaleDateString("pt-BR")}</span>
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 200, 0, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(255, 200, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 200, 0, 0); }
        }
      `}</style>
    </div>
  );
}
