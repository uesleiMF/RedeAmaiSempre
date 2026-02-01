import React, { useState } from "react";
import api from "../../api/api";
import "./Calendario.css";

const NovoEvento = ({ onEventoCriado }) => {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const salvarEvento = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await api.post("/eventos", {
        titulo: form.titulo,
        descricao: form.descricao,
        // ✅ ENVIA YYYY-MM-DD (SEM FUSO)
        data: form.data,
      });

      setForm({ titulo: "", descricao: "", data: "" });

      if (onEventoCriado) {
        onEventoCriado(); // 🔄 força recarregar eventos no calendário
      }
    } catch (err) {
      console.error("Erro ao criar evento:", err);

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erro ao cadastrar evento"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={salvarEvento} className="novo-evento-form">
      <h4>➕ Novo Evento</h4>

      <input
        type="text"
        name="titulo"
        placeholder="Título"
        value={form.titulo}
        onChange={handleChange}
        required
      />

      <textarea
        name="descricao"
        placeholder="Descrição"
        value={form.descricao}
        onChange={handleChange}
      />

      <input
        type="date"
        name="data"
        value={form.data}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
};

export default NovoEvento;
