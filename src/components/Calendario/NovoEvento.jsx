import React, { useState } from "react";
import axios from "axios";
import "./Calendario.css";

const API = "https://backtestmar.onrender.com";

const NovoEvento = ({ onEventoCriado }) => {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarEvento = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Você precisa estar logado");
      return;
    }

    try {
      await axios.post(
        `${API}/eventos`,
        {
          titulo: form.titulo,
          descricao: form.descricao,
          // 🔥 evita bug de fuso horário
          data: new Date(form.data + "T00:00:00").toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({ titulo: "", descricao: "", data: "" });

      if (onEventoCriado) {
        onEventoCriado();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.errorMessage || "Erro ao cadastrar evento");
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

      <button type="submit">Salvar</button>
    </form>
  );
};

export default NovoEvento;
