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

  // 🔐 AUTH
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isLogado = !!token;
  const isLeader = user?.role === "leader";

  console.log("USER:", user);
  console.log("ROLE:", user?.role);
  console.log("IS LEADER:", isLeader);

  const normalizarData = (data) => data?.split("T")[0];

  const carregarEventos = async () => {
    const res = await axios.get(`${API}/eventos`);
    const lista = res.data || [];

    const normalizados = lista.map((e) => ({
      ...e,
      dataNormalizada: normalizarData(e.data)
    }));

    setEventos(normalizados);

    if (dataSelecionada) {
      setEventosDoDia(
        normalizados.filter(e => e.dataNormalizada === dataSelecionada)
      );
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const onClickDay = (date) => {
    const data = date.toISOString().split("T")[0];
    setDataSelecionada(data);
    setEventosDoDia(eventos.filter(e => e.dataNormalizada === data));
    setEditEvento(null);
  };

  const criarEvento = async (e) => {
    e.preventDefault();

    await axios.post(
      `${API}/eventos`,
      {
        titulo: e.target.titulo.value,
        descricao: e.target.descricao.value,
        data: e.target.data.value
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    e.target.reset();
    setMostrarFormulario(false);
    carregarEventos();
  };

  const salvarEdicao = async () => {
    await axios.put(
      `${API}/eventos/${editEvento._id}`,
      {
        titulo: editEvento.titulo,
        descricao: editEvento.descricao,
        data: editEvento.dataNormalizada
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditEvento(null);
    carregarEventos();
  };

  const deletarEvento = async (id) => {
    if (!window.confirm("Deseja excluir este evento?")) return;

    await axios.delete(
      `${API}/eventos/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setDataSelecionada(null);
    carregarEventos();
  };

  return (
    <div className="calendario-container">
      <h3>📅 Agenda</h3>

      {isLogado && (
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "Cancelar" : "Novo Evento"}
        </button>
      )}

      {isLogado && mostrarFormulario && (
        <form onSubmit={criarEvento}>
          <input name="titulo" required />
          <textarea name="descricao" />
          <input type="date" name="data" required />
          <button type="submit">Salvar</button>
        </form>
      )}

      <Calendar onClickDay={onClickDay} />

      {dataSelecionada && (
        <div className="calendario-modal-overlay">
          <div className="calendario-modal">
            <h4>{dataSelecionada}</h4>

            {eventosDoDia.map(evento => (
              <div key={evento._id}>
                {editEvento?._id === evento._id ? (
                  <>
                    <input
                      value={editEvento.titulo}
                      onChange={e =>
                        setEditEvento({ ...editEvento, titulo: e.target.value })
                      }
                    />
                    <textarea
                      value={editEvento.descricao}
                      onChange={e =>
                        setEditEvento({ ...editEvento, descricao: e.target.value })
                      }
                    />
                    <button onClick={salvarEdicao}>Salvar</button>
                    <button onClick={() => setEditEvento(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <strong>{evento.titulo}</strong>
                    <p>{evento.descricao}</p>

                    {isLeader && (
                      <>
                        <button onClick={() => setEditEvento(evento)}>
                          Editar
                        </button>
                        <button onClick={() => deletarEvento(evento._id)}>
                          Excluir
                        </button>
                      </>
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
