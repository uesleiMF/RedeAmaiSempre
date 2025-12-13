import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AniversariantesDiaMes({ token, onLoad }) {
  const BASE_URL = "https://backtestmar.onrender.com";

  const [aniversariantesDia, setAniversariantesDia] = useState([]);
  const [aniversariantesMes, setAniversariantesMes] = useState([]);

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

  const isBirthdayToday = (birthDate) => {
    if (!birthDate) return false;
    const nascimento = new Date(birthDate + "T00:00:00");
    if (isNaN(nascimento.getTime())) return false;

    const hoje = new Date();
    return nascimento.getDate() === hoje.getDate() && nascimento.getMonth() === hoje.getMonth();
  };

  useEffect(() => {
    async function fetchData() {
      if (!token) return;

      try {
        const res = await axios.get(`${BASE_URL}/aniversariantes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const todos = res.data.aniversariantes || [];
        const hoje = new Date();
        const mesAtual = hoje.getMonth();

        // Filtra aniversariantes do dia
        const dia = todos.filter((item) => isBirthdayToday(item.birthDate));

        // Filtra aniversariantes do mês, excluindo os de hoje
        const mes = todos.filter((item) => {
          if (!item.birthDate) return false;
          const data = new Date(item.birthDate + "T00:00:00");
          return data.getMonth() === mesAtual && !isBirthdayToday(item.birthDate);
        });

        setAniversariantesDia(dia);
        setAniversariantesMes(mes);

        // Notificação para aniversariantes do dia
        dia.forEach((a) => notifyBirthday(a.name || a.nome));

        if (onLoad) onLoad({ dia, mes });
      } catch (err) {
        console.error("Erro ao buscar aniversariantes:", err);
      }
    }

    fetchData();
  }, [token, onLoad]);

  const formatDateBR = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Aniversariantes</h3>

      <h4>Aniversariantes do Dia</h4>
      {aniversariantesDia.length === 0 && <p>Nenhum aniversariante hoje.</p>}
      {aniversariantesDia.map((item) => (
        <div
          key={item._id || item.nome}
          style={{
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: "#FFF8A6",
            fontWeight: "bold",
            border: "2px solid #E8D98A",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            animation: "pulse 2s infinite",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          🎉 {item.name || item.nome}
          <span style={{ fontWeight: "normal", marginLeft: 10 }}>
            {formatDateBR(item.birthDate)}
          </span>
        </div>
      ))}

      <h4>Aniversariantes do Mês</h4>
      {aniversariantesMes.length === 0 && <p>Nenhum aniversariante este mês.</p>}
      {aniversariantesMes.map((item) => (
        <div
          key={item._id || item.nome}
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
          <span>{formatDateBR(item.birthDate)}</span>
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
