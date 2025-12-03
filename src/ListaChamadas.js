import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./ListaChamadas.css";

// ... (imports continuam iguais)
export default function ListaChamadas() {
  // Estado para alunos
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Estado para ofertas
  const [ofertas, setOfertas] = useState([]);
  const [descricaoOferta, setDescricaoOferta] = useState("");
  const [valorOferta, setValorOferta] = useState("");

  // Função para formatar data em DD/MM/YYYY
  const formatDateBR = (dateString) => {
    if (!dateString) return "Sem data";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  // Adicionar aluno
  const addStudent = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (students.some((s) => s.nome.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Casais já estão na lista!");
      return;
    }
    setStudents([...students, { nome: trimmedName, presenca: false }]);
    setName("");
  };

  // Alternar presença
  const togglePresenca = (index) => {
    const updated = [...students];
    updated[index].presenca = !updated[index].presenca;
    setStudents(updated);
  };

  // Remover casal
  const removeStudent = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  // Limpar lista de Casais
  const clearList = () => {
    if (window.confirm("Deseja realmente limpar toda a lista de Casais?")) {
      setStudents([]);
    }
  };

  // Adicionar oferta
  const addOferta = () => {
    const desc = descricaoOferta.trim();
    const val = parseFloat(valorOferta);
    if (!desc || isNaN(val) || val <= 0) return;
    setOfertas([...ofertas, { descricao: desc, valor: val }]);
    setDescricaoOferta("");
    setValorOferta("");
  };

  // Remover oferta
  const removeOferta = (index) => {
    setOfertas(ofertas.filter((_, i) => i !== index));
  };

  // Limpar ofertas
  const limparOfertas = () => {
    if (window.confirm("Deseja realmente limpar todas as ofertas?")) {
      setOfertas([]);
    }
  };

  // Exportar PDF
  const exportPDF = () => {
    if (students.length === 0 && ofertas.length === 0) {
      alert("Não há dados para exportar!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Lista de Casais - ${formatDateBR(selectedDate)}`, 14, 20);

    // Tabela de presença
    if (students.length > 0) {
      autoTable(doc, {
        head: [["#", "Nome de Casais", "Presença"]],
        body: students.map((s, i) => [i + 1, s.nome, s.presenca ? "Presente" : "Ausente"]),
        startY: 30,
        didParseCell: (data) => {
          if (data.column.index === 2) {
            if (data.cell.raw === "Presente") {
              data.cell.styles.fillColor = [144, 238, 144];
            } else if (data.cell.raw === "Ausente") {
              data.cell.styles.fillColor = [255, 182, 193];
            }
          }
        },
      });
    }

    // Tabela de ofertas
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

  return (
    <div className="lista-chamadas-container">
      <h2>Lista-Chamada-De-Casais</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Mostrar data formatada na tela */}
      {selectedDate && (
        <p style={{ textAlign: "center", marginBottom: "1rem" }}>
          Data: {formatDateBR(selectedDate)}
        </p>
      )}

      {/* Adicionar aluno */}
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

      {/* Lista de alunos */}
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
                  <button
                    onClick={() => removeStudent(index)}
                    className="btn-remover"
                  >
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
                  {o.descricao} -{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(o.valor)}
                </span>
                <div className="aluno-buttons">
                  <button
                    onClick={() => removeOferta(index)}
                    className="btn-remover"
                  >
                    Remover
                  </button>
                </div>
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
