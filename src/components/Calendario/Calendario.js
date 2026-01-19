import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import NovoEvento from "./NovoEvento";
import "./Calendario.css";

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [eventosDoDia, setEventosDoDia] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const formatarData = (date) =>
    new Date(date).toISOString().split("T")[0];

  // 🔹 Buscar eventos do backend
  const carregarEventos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://alright-hetti-faculdade-49bca0ed.koyeb.app/eventos",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const lista = Array.isArray(res.data)
        ? res.data
        : res.data.eventos || [];

      setEventos(lista);
    } catch (err) {
      console.error("Erro ao carregar eventos", err);
      setEventos([]);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  // 🔹 Clique no dia
  const onClickDay = (date) => {
    const data = formatarData(date);

    const filtrados = eventos.filter(
      (e) => e.data?.split("T")[0] === data
    );

    setDataSelecionada(date);
    setEventosDoDia(filtrados);
  };

  return (
    <div className="calendario-container">
      <h3>📅 Agenda da Igreja</h3>

      {/* BOTÃO NOVO EVENTO */}
      <button
        className="btn-novo-evento"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "❌ Cancelar" : "➕ Novo Evento"}
      </button>

      {/* FORMULÁRIO */}
      {mostrarFormulario && (
        <NovoEvento onEventoCriado={carregarEventos} />
      )}

      {/* CALENDÁRIO */}
      <Calendar
        onClickDay={onClickDay}
        tileClassName={({ date }) => {
          const data = formatarData(date);
          return eventos.some(
            (e) => e.data?.split("T")[0] === data
          )
            ? "dia-com-evento"
            : null;
        }}
      />

      {/* MODAL DE EVENTOS */}
      {dataSelecionada && (
        <div
          className="calendario-modal-overlay"
          onClick={() => setDataSelecionada(null)}
        >
          <div
            className="calendario-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>
              📆{" "}
              {dataSelecionada.toLocaleDateString("pt-BR")}
            </h4>

            {eventosDoDia.length === 0 ? (
              <p>Nenhum evento neste dia.</p>
            ) : (
              eventosDoDia.map((evento) => (
                <div key={evento._id}>
                  <strong>{evento.titulo}</strong>
                  <p>{evento.descricao}</p>
                </div>
              ))
            )}

            <button onClick={() => setDataSelecionada(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
