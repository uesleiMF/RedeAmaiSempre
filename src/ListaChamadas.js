import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import "./ListaChamadas.css";

export default function ListaChamadas({ token }) {
  // --------------------------
  // ESTADOS
  // --------------------------
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [ofertas, setOfertas] = useState([]);
  const [descricaoOferta, setDescricaoOferta] = useState("");
  const [valorOferta, setValorOferta] = useState("");

  const [nameHistory, setNameHistory] = useState([]);
  const [searchHistorico, setSearchHistorico] = useState("");

  // --------------------------
  // EFEITO INICIAL – Buscar histórico do backend
  // --------------------------
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://backtestmar.onrender.com/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) setNameHistory(res.data.history);
      })
      .catch((err) => console.log(err));
  }, [token]);

  // --------------------------
  // HISTÓRICO DE NOMES
  // --------------------------
  const saveNameToHistory = (nome) => {
    if (!nome) return;

    axios
      .post(
        "https://backtestmar.onrender.com/history/add",
        { name: nome },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.status) setNameHistory(res.data.history);
      })
      .catch((err) => console.log(err));
  };

  const deleteNameFromHistory = (nome, e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    axios
      .delete(`https://backtestmar.onrender.com/history/delete/${encodeURIComponent(nome)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) setNameHistory(res.data.history);
      })
      .catch((err) => console.log(err));
  };

  const clearHistory = () => {
    if (!window.confirm("Limpar todo o histórico de nomes?")) return;

    axios
      .delete("https://backtestmar.onrender.com/history/clear", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) setNameHistory([]);
      })
      .catch((err) => console.log(err));
  };

  const historicoFiltrado = nameHistory.filter((n) =>
    n.toLowerCase().includes(searchHistorico.toLowerCase())
  );

  // --------------------------
  // FUNÇÕES DE DATA
  // --------------------------
  const ajustarDataInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  };

  const ajustarDataSalvar = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  };

  const formatDateBR = (dateStr) => {
    if (!dateStr) return "Sem data";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  };

  // --------------------------
  // FUNÇÕES DE CASAIS
  // --------------------------
  const addStudent = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (students.some((s) => s.nome.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Casal já cadastrado!");
      return;
    }
    setStudents([...students, { nome: trimmedName, presenca: false }]);
    saveNameToHistory(trimmedName);
    setName("");
  };

  const togglePresenca = (index) => {
    const updated = [...students];
    updated[index].presenca = !updated[index].presenca;
    setStudents(updated);
  };

  const removeStudent = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const clearList = () => {
    if (window.confirm("Deseja realmente limpar toda a lista de Casais?")) {
      setStudents([]);
    }
  };

  // --------------------------
  // FUNÇÕES DE OFERTAS
  // --------------------------
  const addOferta = () => {
    const desc = descricaoOferta.trim();
    const val = parseFloat(valorOferta);
    if (!desc || isNaN(val) || val <= 0) return;
    setOfertas([...ofertas, { descricao: desc, valor: val }]);
    setDescricaoOferta("");
    setValorOferta("");
  };

  const removeOferta = (index) => {
    setOfertas(ofertas.filter((_, i) => i !== index));
  };

  const limparOfertas = () => {
    if (window.confirm("Deseja realmente limpar todas as ofertas?")) {
      setOfertas([]);
    }
  };

  // --------------------------
  // EXPORTAR PDF
  // --------------------------
  const exportPDF = () => {
    if (students.length === 0 && ofertas.length === 0) {
      alert("Não há dados para exportar!");
      return;
    }

    const doc = new jsPDF();
    const dataFormatada = formatDateBR(selectedDate);

    doc.setFontSize(16);
    doc.text(`Lista de Casais - ${dataFormatada}`, 14, 20);

    if (students.length > 0) {
      autoTable(doc, {
        head: [["#", "Nome de Casais", "Presença"]],
        body: students.map((s, i) => [i + 1, s.nome, s.presenca ? "Presente" : "Ausente"]),
        startY: 30,
        didParseCell: (data) => {
          if (data.column.index === 2) {
            if (data.cell.raw === "Presente") data.cell.styles.fillColor = [144, 238, 144];
            else if (data.cell.raw === "Ausente") data.cell.styles.fillColor = [255, 182, 193];
          }
        },
      });
    }

    if (ofertas.length > 0) {
      const startY = doc.lastAutoTable?.finalY + 10 || 50;
      doc.text("Contribuições/Ofertas", 14, startY);
      autoTable(doc, {
        head: [["#", "Descrição", "Valor"]],
        body: ofertas.map((o, i) => [
          i + 1,
          o.descricao,
          new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(o.valor),
        ]),
        startY: startY + 5,
      });
    }

    doc.save("lista-chamada-ofertas.pdf");
  };

  // --------------------------
  // JSX
  // --------------------------
  return (
    <div className="lista-chamadas-container">
      <h2>Lista-Chamada-De-Casais</h2>

      {/* Histórico de nomes */}
      <h4>Histórico de nomes</h4>
      <input
        type="text"
        placeholder="Pesquisar histórico..."
        value={searchHistorico}
        onChange={(e) => setSearchHistorico(e.target.value)}
      />
      <div style={{ maxHeight: 150, overflow: "auto", border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
        {historicoFiltrado.length === 0 && <p>Nenhum nome encontrado.</p>}
        {historicoFiltrado.map((nome) => (
          <div
            key={nome}
            style={{ display: "flex", justifyContent: "space-between", background: "#f5f5f5", padding: 6, marginBottom: 6, borderRadius: 4, cursor: "pointer" }}
            onClick={() => setName(nome)}
          >
            <span>{nome}</span>
            <IconButton size="small" onClick={(e) => deleteNameFromHistory(nome, e)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
        {nameHistory.length > 0 && (
          <button style={{ marginTop: 10, padding: 5, cursor: "pointer", borderRadius: 4 }} onClick={clearHistory}>
            Limpar histórico
          </button>
        )}
      </div>

      {/* Input de adicionar casal */}
      <div className="input-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome dos Casais"
        />
        <button onClick={addStudent} className="btn-adicionar">
          Adicionar
        </button>
      </div>

      {/* Lista de casais */}
      {students.length > 0 && (
        <>
          <div className="presenca-contagem">
            <span>Presentes: {students.filter((s) => s.presenca).length}</span>
            <span>Ausentes: {students.filter((s) => !s.presenca).length}</span>
          </div>

          <ul className="lista-alunos">
            {students.map((aluno, index) => (
              <li key={index}>
                <span>{aluno.nome}</span>
                <div className="aluno-buttons">
                  <button
                    onClick={() => togglePresenca(index)}
                    className={aluno.presenca ? "btn-presente" : "btn-ausente"}
                  >
                    {aluno.presenca ? "Presente" : "Ausente"}
                  </button>
                  <button onClick={() => removeStudent(index)} className="btn-remover">
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="bottom-buttons">
            <button onClick={clearList} className="btn-limpar">
              Limpar Lista
            </button>
          </div>
        </>
      )}

      {/* Input de data */}
      <input
        type="date"
        value={ajustarDataInput(selectedDate)}
        onChange={(e) => setSelectedDate(ajustarDataSalvar(e.target.value))}
      />
      {selectedDate && <p style={{ textAlign: "center" }}>Data: {formatDateBR(selectedDate)}</p>}

      {/* Ofertas */}
      <h2>Contribuições/Ofertas</h2>
      <div className="input-group">
        <input
          type="text"
          value={descricaoOferta}
          onChange={(e) => setDescricaoOferta(e.target.value)}
          placeholder="Descrição da oferta"
        />
        <input
          type="number"
          value={valorOferta}
          onChange={(e) => setValorOferta(e.target.value)}
          placeholder="Valor (R$)"
          min="0.01"
          step="0.01"
        />
        <button onClick={addOferta} className="btn-adicionar">
          Adicionar
        </button>
      </div>

      {ofertas.length > 0 && (
        <>
          <ul className="lista-alunos">
            {ofertas.map((o, index) => (
              <li key={index}>
                <span>
                  {o.descricao} –{" "}
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(o.valor)}
                </span>
                <button onClick={() => removeOferta(index)} className="btn-remover">
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="presenca-contagem">
            Total arrecadado:{" "}
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
              ofertas.reduce((acc, o) => acc + o.valor, 0)
            )}
          </div>

          <div className="bottom-buttons">
            <button onClick={limparOfertas} className="btn-limpar">
              Limpar Ofertas
            </button>
          </div>
        </>
      )}

      {/* Exportar PDF */}
      <button onClick={exportPDF} className="btn-exportar">
        Exportar PDF
      </button>
    </div>
  );
}
