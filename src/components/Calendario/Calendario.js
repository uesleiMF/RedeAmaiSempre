import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./Calendario.css";

const API = "https://alright-hetti-faculdade-49bca0ed.koyeb.app";

// 📅 FORMATA DATA PARA DD/MM/AAAA
const formatarData = (dataISO) => {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
};

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

  const normalizarData = (data) => data?.split("T")[0];

  // 🚪 LOGOUT
  const handleLogout = () => {
    if (!window.confirm("Deseja realmente sair?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  // 🔄 CARREGAR EVENTOS
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
        normalizados.filter(
          (e) => e.dataNormalizada === dataSelecionada
        )
      );
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  // 📌 MARCAR DIAS
  const marcarDiasComEvento = ({ date, view }) => {
    if (view !== "month") return null;

    const data = date.toISOString().split("T")[0];
    const hoje = new Date().toISOString().split("T")[0];

    const temEvento = eventos.some(
      (e) => e.dataNormalizada === data
    );

    if (temEvento && data === hoje) return "dia-com-evento dia-hoje";
    if (temEvento) return "dia-com-evento";
    if (data === hoje) return "dia-hoje";

    return null;
  };

  // 📅 CLICK NO DIA
  const onClickDay = (date) => {
    const data = date.toISOString().split("T")[0];
    setDataSelecionada(data);
    setEventosDoDia(
      eventos.filter((e) => e.dataNormalizada === data)
    );
    setEditEvento(null);
  };

  // ➕ CRIAR EVENTO
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

  // ✏️ SALVAR EDIÇÃO
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

  // ❌ DELETAR EVENTO
  const deletarEvento = async (id) => {
    if (!window.confirm("Deseja excluir este evento?")) return;

    await axios.delete(`${API}/eventos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setDataSelecionada(null);
    carregarEventos();
  };

  return (
    <div className="calendario-container">
      <h3>📅 Agenda</h3>

      {/* 🔐 USUÁRIO LOGADO */}
      {isLogado && (
        <>
          <p className="usuario-logado">
            👤 {user?.nome || "Usuário logado"}
          </p>

          <button
            className="btn-novo-evento"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? "Cancelar" : "Novo Evento"}
          </button>

          <button
            className="btn-logout"
            onClick={handleLogout}
          >
            🚪 Sair
          </button>
        </>
      )}

      {isLogado && mostrarFormulario && (
        <form onSubmit={criarEvento}>
          <input name="titulo" placeholder="Título" required />
          <textarea name="descricao" placeholder="Descrição" />
          <input type="date" name="data" required />
          <button type="submit">Salvar</button>
        </form>
      )}

      <Calendar
        onClickDay={onClickDay}
        tileClassName={marcarDiasComEvento}
      />

      {dataSelecionada && (
        <div className="calendario-modal-overlay">
          <div className="calendario-modal">
            <h4>{formatarData(dataSelecionada)}</h4>

            <p className="contador-eventos">
              {eventosDoDia.length} evento(s) neste dia
            </p>

            {eventosDoDia.map((evento) => (
              <div key={evento._id} className="evento-item">
                {editEvento?._id === evento._id ? (
                  <>
                    <input
                      value={editEvento.titulo}
                      onChange={(e) =>
                        setEditEvento({
                          ...editEvento,
                          titulo: e.target.value
                        })
                      }
                    />
                    <textarea
                      value={editEvento.descricao}
                      onChange={(e) =>
                        setEditEvento({
                          ...editEvento,
                          descricao: e.target.value
                        })
                      }
                    />
                    <button onClick={salvarEdicao}>Salvar</button>
                    <button onClick={() => setEditEvento(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <strong>{evento.titulo}</strong>
                    <p>{evento.descricao}</p>

                    {isLogado && (
                      <div className="acoes-evento">
                        <button onClick={() => setEditEvento(evento)}>
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => deletarEvento(evento._id)}
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

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
