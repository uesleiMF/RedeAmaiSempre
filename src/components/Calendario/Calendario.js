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
  const [editEvento, setEditEvento] = useState(null);

  const token = localStorage.getItem("token");
  const isLogado = !!token;

  // 🔹 Normaliza data para yyyy-mm-dd
  const normalizarData = (data) => {
    if (!data) return "";
    return new Date(data).toISOString().slice(0, 10);
  };

  // 🔓 Carregar todos os eventos do backend
  const carregarEventos = async () => {
    try {
      const res = await axios.get(
        "https://alright-hetti-faculdade-49bca0ed.koyeb.app/eventos",
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );

      const lista = Array.isArray(res.data)
        ? res.data
        : res.data.eventos || [];

      const eventosNormalizados = lista.map((e) => ({
        ...e,
        dataNormalizada: normalizarData(e.data),
      }));

      setEventos(eventosNormalizados);
    } catch (err) {
      console.error("Erro ao carregar eventos", err);
      setEventos([]);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  // 📅 Ao clicar em um dia
  const onClickDay = (date) => {
    const data = normalizarData(date);
    const filtrados = eventos.filter((e) => e.dataNormalizada === data);
    setDataSelecionada(date);
    setEventosDoDia(filtrados);
    setEditEvento(null);
  };

  // ✏️ Editar evento
  const editarEvento = (evento) => {
    setEditEvento({ ...evento });
  };

  const salvarEdicao = async () => {
    try {
      await axios.put(
        `https://alright-hetti-faculdade-49bca0ed.koyeb.app/eventos/${editEvento._id}`,
        {
          titulo: editEvento.titulo,
          descricao: editEvento.descricao,
          data: editEvento.data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Evento atualizado!");
      setEditEvento(null);
      carregarEventos();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar evento");
    }
  };

  // 🗑️ Deletar evento
  const deletarEvento = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      await axios.delete(
        `https://alright-hetti-faculdade-49bca0ed.koyeb.app/eventos/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Evento deletado!");
      setDataSelecionada(null);
      carregarEventos();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar evento");
    }
  };

  // Verifica se usuário é líder (exemplo simples)
  const isLeader = true; // você pode integrar com role real do backend

  return (
    <div className="calendario-container">
      <h3>📅 Agenda da Igreja</h3>

      {/* BOTÃO NOVO EVENTO */}
      {isLogado && !editEvento && (
        <button
          className="btn-novo-evento"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "❌ Cancelar" : "➕ Novo Evento"}
        </button>
      )}

      {/* FORMULÁRIO NOVO EVENTO */}
      {isLogado && mostrarFormulario && !editEvento && (
        <NovoEvento
          onEventoCriado={() => {
            carregarEventos();
            setMostrarFormulario(false);
          }}
        />
      )}

      {/* CALENDÁRIO */}
      <Calendar
        onClickDay={onClickDay}
        tileClassName={({ date }) => {
          const data = normalizarData(date);
          if (normalizarData(new Date()) === data) return "dia-hoje";
          return eventos.some((e) => e.dataNormalizada === data)
            ? "dia-com-evento"
            : null;
        }}
      />

      {/* MODAL */}
      {dataSelecionada && (
        <div
          className="calendario-modal-overlay"
          onClick={() => setDataSelecionada(null)}
        >
          <div
            className="calendario-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>📆 {dataSelecionada.toLocaleDateString("pt-BR")}</h4>

            {eventosDoDia.length === 0 ? (
              <p>Nenhum evento neste dia.</p>
            ) : (
              eventosDoDia.map((evento) => (
                <div key={evento._id} className="evento-item">
                  {editEvento && editEvento._id === evento._id ? (
                    <>
                      <input
                        type="text"
                        value={editEvento.titulo}
                        onChange={(e) =>
                          setEditEvento({ ...editEvento, titulo: e.target.value })
                        }
                      />
                      <textarea
                        value={editEvento.descricao}
                        onChange={(e) =>
                          setEditEvento({ ...editEvento, descricao: e.target.value })
                        }
                      />
                      <input
                        type="date"
                        value={editEvento.data}
                        onChange={(e) =>
                          setEditEvento({ ...editEvento, data: e.target.value })
                        }
                      />
                      <div className="acoes-evento">
                        <button onClick={salvarEdicao}>💾 Salvar</button>
                        <button onClick={() => setEditEvento(null)}>❌ Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>{evento.titulo}</strong>
                      <p>{evento.descricao}</p>
                      {isLeader && (
                        <div className="acoes-evento">
                          <button onClick={() => editarEvento(evento)}>✏️ Editar</button>
                          <button onClick={() => deletarEvento(evento._id)}>🗑️ Excluir</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}

            <button onClick={() => setDataSelecionada(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
