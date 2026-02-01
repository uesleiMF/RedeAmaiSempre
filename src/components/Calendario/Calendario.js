import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../api/api";
import apiPublica from "../../api/apiPublica";
import "./Calendario.css";

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
  let token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    token = null;
  }

  const isLogado = !!token;
  const user = isLogado ? JSON.parse(localStorage.getItem("user") || "{}") : null;

  const normalizarData = (data) => data?.split("T")[0];

  // 🚪 LOGOUT
  const handleLogout = () => {
    if (!window.confirm("Deseja realmente sair?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // 🔄 CARREGAR EVENTOS (funciona logado e deslogado)
  const carregarEventos = async () => {
    try {
      let res;

      // Se estiver logado → tenta API autenticada primeiro
      if (isLogado) {
        try {
          res = await api.get("/eventos");
        } catch (err) {
          if (err.response?.status === 401) {
            // Token inválido → limpa sessão
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // não muda isLogado aqui, vai recarregar na próxima renderização
          } else {
            console.error("Erro na API autenticada:", err);
            // continua e tenta a pública
          }
        }
      }

      // Se não conseguiu autenticado OU não está logado → usa API pública
      if (!res) {
        res = await apiPublica.get("/eventos");
      }

      const lista = Array.isArray(res.data) ? res.data : res.data.eventos || [];

      const normalizados = lista.map((e) => ({
        ...e,
        dataNormalizada: normalizarData(e.data),
      }));

      setEventos(normalizados);

      // Atualiza eventos do dia selecionado, se aplicável
      if (dataSelecionada) {
        setEventosDoDia(normalizados.filter((e) => e.dataNormalizada === dataSelecionada));
      }
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
      setEventos([]);
    }
  };

  useEffect(() => {
    carregarEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📌 MARCAR DIAS COM EVENTOS
  const marcarDiasComEvento = ({ date, view }) => {
    if (view !== "month") return null;

    const data = date.toISOString().split("T")[0];
    const hoje = new Date().toISOString().split("T")[0];

    const temEvento = eventos.some((e) => e.dataNormalizada === data);

    if (temEvento && data === hoje) return "dia-com-evento dia-hoje";
    if (temEvento) return "dia-com-evento";
    if (data === hoje) return "dia-hoje";

    return null;
  };

  // 📅 CLICK NO DIA
  const onClickDay = (date) => {
    const data = date.toISOString().split("T")[0];
    setDataSelecionada(data);
    setEventosDoDia(eventos.filter((e) => e.dataNormalizada === data));
    setEditEvento(null);
  };

  // ➕ CRIAR EVENTO (apenas logado)
  const criarEvento = async (e) => {
    e.preventDefault();
    try {
      await api.post("/eventos", {
        titulo: e.target.titulo.value,
        descricao: e.target.descricao.value,
        data: new Date(e.target.data.value + "T00:00:00").toISOString(),
      });

      e.target.reset();
      setMostrarFormulario(false);
      carregarEventos();
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      alert("Erro ao criar evento!");
    }
  };

  // ✏️ SALVAR EDIÇÃO (apenas logado)
  const salvarEdicao = async () => {
    if (!editEvento) return;
    try {
      await api.put(`/eventos/${editEvento._id}`, {
        titulo: editEvento.titulo,
        descricao: editEvento.descricao,
        data: new Date(editEvento.dataNormalizada + "T00:00:00").toISOString(),
      });

      setEditEvento(null);
      carregarEventos();
    } catch (err) {
      console.error("Erro ao editar evento:", err);
      alert("Erro ao salvar edição!");
    }
  };

  // ❌ DELETAR EVENTO (apenas logado)
  const deletarEvento = async (id) => {
    if (!window.confirm("Deseja excluir este evento?")) return;
    try {
      await api.delete(`/eventos/${id}`);
      setDataSelecionada(null);
      setEditEvento(null);
      carregarEventos();
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
      alert("Erro ao excluir evento!");
    }
  };

  return (
    <div className="calendario-container">
      <h3>📅 Agenda</h3>

      {/* Área do usuário logado */}
      {isLogado && (
        <div className="area-logado">
          <p className="usuario-logado">👤 {user?.nome || "Usuário logado"}</p>

          <button
            className="btn-novo-evento"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? "Cancelar" : "Novo Evento"}
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      )}

      {/* Formulário de criação (só logado) */}
      {isLogado && mostrarFormulario && (
        <form onSubmit={criarEvento} className="novo-evento-form">
          <input name="titulo" placeholder="Título" required />
          <textarea name="descricao" placeholder="Descrição" />
          <input type="date" name="data" required />
          <button type="submit">Salvar Evento</button>
        </form>
      )}

      {/* Calendário */}
      <Calendar onClickDay={onClickDay} tileClassName={marcarDiasComEvento} />

      {/* Eventos do dia selecionado */}
      {dataSelecionada && (
        <div className="calendario-modal-overlay">
          <div className="calendario-modal">
            <h4>{formatarData(dataSelecionada)}</h4>

            <p className="contador-eventos">
              {eventosDoDia.length} evento(s) neste dia
            </p>

            {eventosDoDia.length === 0 && (
              <p style={{ color: "#aaa", fontStyle: "italic", margin: "20px 0" }}>
                Nenhum evento marcado para este dia.
              </p>
            )}

            {eventosDoDia.map((evento) => (
              <div key={evento._id} className="evento-item">
                {editEvento?._id === evento._id ? (
                  <div className="edit-form">
                    <input
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
                    <div className="botoes-edicao">
                      <button onClick={salvarEdicao}>Salvar</button>
                      <button onClick={() => setEditEvento(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>{evento.titulo}</strong>
                    <p>{evento.descricao}</p>

                    {isLogado && (
                      <div className="acoes-evento">
                        <button onClick={() => setEditEvento(evento)}>✏️ Editar</button>
                        <button onClick={() => deletarEvento(evento._id)}>🗑️ Excluir</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <button className="btn-fechar" onClick={() => setDataSelecionada(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;