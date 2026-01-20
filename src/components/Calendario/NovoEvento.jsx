import React, { useState } from "react";
import axios from "axios";

const NovoEvento = ({ onEventoCriado }) => {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarEvento = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Você precisa estar logado como líder");

    try {
      await axios.post(
        "https://alright-hetti-faculdade-49bca0ed.koyeb.app/eventos",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Evento cadastrado com sucesso!");
      setForm({ titulo: "", descricao: "", data: "" });
      onEventoCriado();
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
