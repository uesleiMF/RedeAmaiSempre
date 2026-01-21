import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./Calendario.css";

const API = "https://alright-hetti-faculdade-49bca0ed.koyeb.app";

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [eventosDoDia, setEventosDoDia] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editEvento, setEditEvento] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLogado = !!token;
  const isLeader = user?.role === "leader";

  // 🔥 NORMALIZA DATA (SEM FUSO)
  const normalizarData = (data) => {
    if (!data) return "";
    return data.split("T")[0]; // YYYY-MM-DD
  };

  // 🔄 CARREGAR EVENTOS
  const carregarEventos = async () => {
    try {
      const res = await axios.get(`${API}/eventos`);
      const lista = Array.isArray(res.data) ? res.data : [];

      const normalizados = lista.map((e) => ({
        ...e,
        dataNormalizada: normalizarData(e.data),
      }));

      setEventos(normalizados);

      if (dataSelecionada) {
        setEventosDoDia(
          normalizados.filter(
            (e) => e.dataNormalizada === dataSelecionada
          )
        );
      }
    } catch (err) {
      console.error("Erro ao carregar eventos", err);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  // 📅 CLIQUE NO DIA
  const onClickDay = (date) => {
    const data = date.toISOString().split("T")[0];
    setDataSelecionada(data);
    setEventosDoDia(eventos.filter((e) => e.dataNormalizada === data));
    setEditEvento(null);
  };

  // ➕ CRIAR EVENTO
  const criarEvento = async (e) => {
    e.preventDefault();

    const titulo = e.target.titulo.value;
    const descricao = e.target.descricao.value;
    const data = e.target.data.value; // STRING YYYY-MM-DD

    try {
      await axios.post(
        `${API}/eventos`,
        { titulo, descricao, data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      e.target.reset();
      setMostrarFormulario(false);
      carregarEventos();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar evento");
    }
  };

  // ✏️ SALVAR EDIÇÃO
  const salvarEdicao = async () => {
    try {
      await axios.put(
        `${API}/eventos/${editEvento._id}`,
        {
          titulo: editEvento.titulo,
          descricao: editEvento.descricao,
          data: editEvento.dataNormalizada,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditEvento(null);
      carregarEventos();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar evento");
    }
  };

  // 🗑️ DELETAR EVENTO
  const deletarEvento = async (id) => {
    if (!window.confirm("Deseja excluir este evento?")) return;

    try {
      await axios.delete(`${API}/eventos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataSelecionada(null);
      carregarEventos();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir evento");
    }
  };

  return (
    <div className="calendario-container">
      <h3>📅 Agenda</h3>

      {isLogado && (
        <button
          className="btn-novo-evento"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "❌ Cancelar" : "➕ Novo Evento"}
        </button>
      )}

      {/* FORM NOVO EVENTO */}
      {isLogado && mostrarFormulario && (
        <form className="form-evento" onSubmit={criarEvento}>
          <input name="titulo" placeholder="Título" required />
          <textarea name="descricao" placeholder="Descrição" />
          <input type="date" name="data" required />
          <button type="submit">Salvar</button>
        </form>
      )}

      {/* CALENDÁRIO */}
      <Calendar
        onClickDay={onClickDay}
        tileClassName={({ date }) => {
          const d = date.toISOString().split("T")[0];

          if (d === new Date().toISOString().split("T")[0]) {
            return "dia-hoje";
          }

          return eventos.some((e) => e.dataNormalizada === d)
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
            <h4>
              {new Date(dataSelecionada + "T00:00:00").toLocaleDateString(
                "pt-BR"
              )}
            </h4>

            {eventosDoDia.length === 0 && <p>Nenhum evento.</p>}

            {eventosDoDia.map((evento) => (
              <div key={evento._id} className="evento-item">
                {editEvento?._id === evento._id ? (
                  <>
                    <input
                      value={editEvento.titulo}
                      onChange={(e) =>
                        setEditEvento({
                          ...editEvento,
                          titulo: e.target.value,
                        })
                      }
                    />

                    <textarea
                      value={editEvento.descricao}
                      onChange={(e) =>
                        setEditEvento({
                          ...editEvento,
                          descricao: e.target.value,
                        })
                      }
                    />

                    <input
                      type="date"
                      value={editEvento.dataNormalizada}
                      onChange={(e) =>
                        setEditEvento({
                          ...editEvento,
                          dataNormalizada: e.target.value,
                        })
                      }
                    />

                    <button onClick={salvarEdicao}>💾 Salvar</button>
                    <button onClick={() => setEditEvento(null)}>
                      ❌ Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <strong>{evento.titulo}</strong>
                    <p>{evento.descricao}</p>

                    {isLeader && (
                      <div className="acoes-evento">
                        <button onClick={() => setEditEvento(evento)}>
                          ✏️ Editar
                        </button>
                        <button onClick={() => deletarEvento(evento._id)}>
                          🗑️ Excluir
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <button onClick={() => setDataSelecionada(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
