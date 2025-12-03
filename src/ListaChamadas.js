import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function ListaChamadas() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const addStudent = () => {
    if (!name.trim()) return;
    setStudents([...students, { nome: name, presenca: false }]);
    setName("");
  };

  const togglePresenca = (index) => {
    const updated = [...students];
    updated[index].presenca = !updated[index].presenca;
    setStudents(updated);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Lista de Presença - ${selectedDate || "Sem data"}`, 10, 10);

    let y = 20;
    students.forEach((aluno, i) => {
      doc.text(`${i + 1}. ${aluno.nome} - ${aluno.presenca ? "Presente" : "Ausente"}`, 10, y);
      y += 8;
    });

    doc.save("lista-chamada.pdf");
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Lista de Chamada</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="p-2 border w-full rounded"
      />

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border flex-1 rounded"
          placeholder="Nome do aluno"
        />
        <button
          onClick={addStudent}
          className="p-2 bg-blue-600 text-white rounded"
        >
          Adicionar
        </button>
      </div>

      <ul className="space-y-2 mt-2">
        {students.map((aluno, index) => (
          <li
            key={index}
            className="p-2 border rounded flex justify-between items-center"
          >
            <span>{aluno.nome}</span>
            <button
              onClick={() => togglePresenca(index)}
              className={`px-3 py-1 rounded text-white ${
                aluno.presenca ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {aluno.presenca ? "Presente" : "Ausente"}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={exportPDF}
        className="p-3 bg-purple-600 text-white w-full rounded mt-2"
      >
        Exportar PDF
      </button>
    </div>
  );
}
