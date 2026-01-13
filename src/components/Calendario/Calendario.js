import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendario.css";

const eventosFixos = {
  "2026-01-15": {
    titulo: "Encontro de Casais",
    descricao: "Encontro especial da Rede Amai Sempre às 19h"
  },
  "2026-01-20": {
    titulo: "Célula de Oração",
    descricao: "Reunião de oração na casa do líder"
  },
  "2026-01-28": {
    titulo: "Culto Especial",
    descricao: "Culto com convidados"
  }
};

const Calendario = () => {
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const formatarData = (date) =>
    date.toISOString().split("T")[0];

  const onClickDay = (date) => {
    const data = formatarData(date);
    if (eventosFixos[data]) {
      setEventoSelecionado(eventosFixos[data]);
      setDataSelecionada(date);
    }
  };

  return (
    <div className="calendario-container">
      <h3>📅 Agenda da Igreja</h3>

      <Calendar
        onClickDay={onClickDay}
        tileClassName={({ date }) =>
          eventosFixos[formatarData(date)] ? "dia-com-evento" : null
        }
      />

      {eventoSelecionado && (
        <div
          className="calendario-modal-overlay"
          onClick={() => setEventoSelecionado(null)}
        >
          <div
            className="calendario-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>{eventoSelecionado.titulo}</h4>
            <p>{eventoSelecionado.descricao}</p>

            <p>
              📆{" "}
              {dataSelecionada.toLocaleDateString("pt-BR")}
            </p>

            <button onClick={() => setEventoSelecionado(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
