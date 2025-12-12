import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import "./ListaChamadas.css";
import AniversariantesDiaMes from "./AniversariantesDiaMes"; // ajuste o caminho se necessário

export default function ListaChamadas({ token }) {
  const BASE_URL = "https://backtestmar.onrender.com";

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [nomeCelula, setNomeCelula] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const [tema, setTema] = useState("");
  const [dinamica, setDinamica] = useState("");
  const [louvor, setLouvor] = useState("");

  const [ofertas, setOfertas] = useState([]);
  const [descricaoOferta, setDescricaoOferta] = useState("");
  const [valorOferta, setValorOferta] = useState("");

  const [observacoes, setObservacoes] = useState("");

  const [nameHistory, setNameHistory] = useState([]);
  const [searchHistorico, setSearchHistorico] = useState("");

  // estados para aniversariantes recebidos do componente separado
  const [aniverDia, setAniverDia] = useState([]);
  const [aniverMes, setAniverMes] = useState([]);

  // ================= HELPERS ======================
  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

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

  // formata várias possíveis strings de data para DD/MM/YYYY ou DD/MM
  const formatarDataDMA = (raw) => {
    if (!raw) return "";
    // já no formato dd/mm/yyyy
    if (raw.includes("/")) return raw;
    // caso seja 'YYYY-MM-DD' ou 'DD-MM-YYYY' ou 'DD-MM'
    const parts = raw.split("-");
    if (parts.length === 3) {
      // detectar se é YYYY-MM-DD
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD/MM/YYYY
        return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
      } else {
        // DD-MM-YYYY -> DD/MM/YYYY
        return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
      }
    }
    if (parts.length === 2) {
      // DD-MM -> DD/MM
      return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}`;
    }
    // fallback: try Date parse
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("pt-BR");
    }
    return raw;
  };

  // ================= HISTÓRICO ====================
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${BASE_URL}/history`, { headers: authHeaders() })
      .then((res) => {
        if (res.data.status) setNameHistory(res.data.history || []);
      })
      .catch((err) => console.log("Erro buscar histórico:", err));
  }, [token]);

  const saveNameToHistory = (nome) => {
    if (!nome || !token) return;
    axios
      .post(`${BASE_URL}/history/add`, { name: nome }, { headers: authHeaders() })
      .then((res) => {
        if (res.data.status) setNameHistory(res.data.history || []);
      })
      .catch((err) => console.log("Erro salvar histórico:", err));
  };

  const deleteNameFromHistory = (nome, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!token) return;
    axios
      .delete(`${BASE_URL}/history/delete/${encodeURIComponent(nome)}`, {
        headers: authHeaders(),
      })
      .then((res) => {
        if (res.data.status) setNameHistory(res.data.history || []);
      })
      .catch((err) => console.log("Erro deletar histórico:", err));
  };

  const clearHistory = () => {
    if (!token) return;
    if (!window.confirm("Limpar todo o histórico?")) return;
    axios
      .delete(`${BASE_URL}/history/clear`, { headers: authHeaders() })
      .then(() => setNameHistory([]))
      .catch((err) => console.log("Erro limpar histórico:", err));
  };

  const historicoFiltrado = nameHistory.filter((n) =>
    n.toLowerCase().includes(searchHistorico.toLowerCase())
  );

  // ================= LISTA DE CASAIS ====================
  const addStudent = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (students.some((s) => s.nome.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Casal já cadastrado!");
      return;
    }

    setStudents((prev) => [...prev, { nome: trimmedName, presenca: false }]);
    saveNameToHistory(trimmedName);
    setName("");
  };

  const addCasalToList = (casal) => {
    if (!casal || !casal.name) return;

    const trimmedName = casal.name.trim();

    if (students.some((s) => s.nome.toLowerCase() === trimmedName.toLowerCase())) {
      alert("Casal já cadastrado!");
      return;
    }

    setStudents((prev) => [...prev, { nome: trimmedName, presenca: false }]);
    saveNameToHistory(trimmedName);
  };

  const togglePresenca = (index) => {
    setStudents((prev) => {
      const updated = [...prev];
      updated[index].presenca = !updated[index].presenca;
      return updated;
    });
  };

  const removeStudent = (index) => {
    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  const clearList = () => {
    if (window.confirm("Deseja realmente limpar toda a lista?"))
      setStudents([]);
  };

  // ================= OFERTAS ====================
  const addOferta = () => {
    const desc = descricaoOferta.trim();
    const val = parseFloat(valorOferta);
    if (!desc || isNaN(val) || val <= 0) return;

    setOfertas((prev) => [...prev, { descricao: desc, valor: val }]);
    setDescricaoOferta("");
    setValorOferta("");
  };

  const removeOferta = (index) => {
    setOfertas((prev) => prev.filter((_, i) => i !== index));
  };

  const limparOfertas = () => {
    if (window.confirm("Deseja realmente limpar todas as ofertas?"))
      setOfertas([]);
  };

  // ================= RECEBER ANIVERSÁRIOS (do componente filho) ====================
  function receberAniversarios({ dia = [], mes = [] }) {
    // Espera que o componente filho já envie datas em formatos que possamos exibir.
    // Aplicamos formatarDataDMA para garantir padronização.
    const mappedDia = dia.map((c) => ({
      nome: c.nome || c.name || "",
      niverH: formatarDataDMA(c.niverH || c.niverH),
      niverM: formatarDataDMA(c.niverM || c.niverM),
      _id: c._id || c.id || undefined,
      tel: c.tel || "",
    }));
    const mappedMes = mes.map((c) => ({
      nome: c.nome || c.name || "",
      niverH: formatarDataDMA(c.niverH || c.niverH),
      niverM: formatarDataDMA(c.niverM || c.niverM),
      _id: c._id || c.id || undefined,
      tel: c.tel || "",
    }));
    setAniverDia(mappedDia);
    setAniverMes(mappedMes);
  }

  // ================= EXPORTAR PDF =====================
  const exportPDF = () => {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    let startY = 20;

    // Cabeçalho principal
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      `LISTA DE CASAIS - ${formatDateBR(selectedDate)}`,
      width / 2,
      startY,
      { align: "center" }
    );

    startY += 12;

    const marginLeft = 14;
    const labelWidth = 40;

    const addLabel = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, marginLeft, startY);
      doc.setFont("helvetica", "normal");
      doc.text(value || "Não informado", marginLeft + labelWidth, startY);
      startY += 7;
    };

    addLabel("NOME CÉLULA:", nomeCelula);
    addLabel("HORÁRIO:", `${horaInicio || ""}${horaInicio && horaFim ? " - " : ""}${horaFim || ""}`);
    addLabel("TEMA:", tema);
    addLabel("DINÂMICA:", dinamica);
    addLabel("LOUVOR:", louvor);

    startY += 8;

    // ANIVERSARIANTES DO DIA (se houver) - adiciona tabela no topo do PDF
    if (aniverDia.length > 0) {
      autoTable(doc, {
        head: [["#", "Nome", "Aniversário (H)", "Aniversário (M)", "Telefone"]],
        body: aniverDia.map((a, i) => [
          i + 1,
          a.nome,
          a.niverH || "",
          a.niverM || "",
          a.tel || ""
        ]),
        startY,
      });
      startY = doc.lastAutoTable.finalY + 8;
    }

    // ANIVERSARIANTES DO MÊS
    if (aniverMes.length > 0) {
      autoTable(doc, {
        head: [["#", "Nome", "Aniversário (H)", "Aniversário (M)", "Telefone"]],
        body: aniverMes.map((a, i) => [
          i + 1,
          a.nome,
          a.niverH || "",
          a.niverM || "",
          a.tel || ""
        ]),
        startY,
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // Lista de casais (presenças)
    if (students.length > 0) {
      autoTable(doc, {
        head: [["#", "Casal", "Presença"]],
        body: students.map((s, i) => [
          i + 1,
          s.nome,
          s.presenca ? "Presente" : "Ausente",
        ]),
        startY,
        didParseCell: (data) => {
          if (data.column.index === 2) {
            data.cell.styles.fillColor =
              data.cell.raw === "Presente"
                ? [144, 238, 144]
                : [255, 182, 193];
          }
        },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // Ofertas
    if (ofertas.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("OFERTAS / CONTRIBUIÇÕES", width / 2, startY, {
        align: "center",
      });

      autoTable(doc, {
        head: [["#", "Descrição", "Valor"]],
        body: ofertas.map((o, i) => [
          i + 1,
          o.descricao,
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(o.valor),
        ]),
        startY: startY + 6,
      });

      startY = doc.lastAutoTable.finalY + 10;
    }

    // Observações
    if (observacoes.trim() !== "") {
      doc.setFont("helvetica", "bold");
      doc.text("OBSERVAÇÕES:", marginLeft, startY);
      doc.setFont("helvetica", "normal");
      const obs = doc.splitTextToSize(observacoes, width - 28);
      doc.text(obs, marginLeft, startY + 6);
    }

    doc.save("lista-casais.pdf");
  };

  // ================= RENDER =====================
  return (
    <div className="lista-chamadas-container">
      {/* componente que busca aniversariantes e envia por onLoad */}
      <AniversariantesDiaMes token={token} onLoad={receberAniversarios} />

      <h2>LISTA-DE-CASAIS</h2>

      <input
        type="text"
        placeholder="Nome da Célula"
        value={nomeCelula}
        onChange={(e) => setNomeCelula(e.target.value)}
      />

      <div className="input-group">
        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
        <input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
      </div>

      <input type="text" placeholder="Tema" value={tema} onChange={(e) => setTema(e.target.value)} />
      <input type="text" placeholder="Dinâmica" value={dinamica} onChange={(e) => setDinamica(e.target.value)} />
      <input type="text" placeholder="Louvor" value={louvor} onChange={(e) => setLouvor(e.target.value)} />

      <h2>HISTÓRICO</h2>
      <input
        type="text"
        placeholder="Pesquisar histórico..."
        value={searchHistorico}
        onChange={(e) => setSearchHistorico(e.target.value)}
      />

      <div className="historico-box">
        {historicoFiltrado.map((nome) => (
          <div
            key={nome}
            className="historico-item"
            onClick={() => setName(nome)}
          >
            <span>{nome}</span>
            <IconButton size="small" onClick={(e) => deleteNameFromHistory(nome, e)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
        {nameHistory.length > 0 && (
          <button onClick={clearHistory}>Limpar Histórico</button>
        )}
      </div>

      {/* BOX DE ANIVERSARIANTES (VISUALIZAÇÃO) */}
      <div className="box-aniversarios" style={{ marginTop: 16 }}>
        <h3>Aniversariantes do Dia</h3>
        {aniverDia.length === 0 ? (
          <p>Nenhum aniversariante hoje.</p>
        ) : (
          aniverDia.map((a, i) => (
            <div key={a._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 6 }}>
              <div>
                <strong>{a.nome}</strong> — H: {a.niverH || "-"} / M: {a.niverM || "-"}
                {a.tel ? <div><small>{a.tel}</small></div> : null}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-adicionar" onClick={() => addCasalToList({ name: a.nome })}>Adicionar à lista</button>
              </div>
            </div>
          ))
        )}

        <h3 style={{ marginTop: 12 }}>Aniversariantes do Mês</h3>
        {aniverMes.length === 0 ? (
          <p>Nenhum aniversariante este mês.</p>
        ) : (
          aniverMes.map((a, i) => (
            <div key={a._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 6 }}>
              <div>
                <strong>{a.nome}</strong> — H: {a.niverH || "-"} / M: {a.niverM || "-"}
                {a.tel ? <div><small>{a.tel}</small></div> : null}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-adicionar" onClick={() => addCasalToList({ name: a.nome })}>Adicionar à lista</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="input-group" style={{ marginTop: 12 }}>
        <input
          type="text"
          value={name}
          placeholder="Nome dos casais"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addStudent} className="btn-adicionar">Adicionar</button>
      </div>

      {students.length > 0 && (
        <>
          <div className="presenca-contagem">
            <span>Presentes: {students.filter((s) => s.presenca).length}</span>
            <span>Ausentes: {students.filter((s) => !s.presenca).length}</span>
          </div>

          <ul className="lista-alunos">
            {students.map((s, index) => (
              <li key={index}>
                <span>{s.nome}</span>
                <div className="aluno-buttons">
                  <button
                    onClick={() => togglePresenca(index)}
                    className={s.presenca ? "btn-presente" : "btn-ausente"}
                  >
                    {s.presenca ? "Presente" : "Ausente"}
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

          <button onClick={clearList} className="btn-limpar">Limpar Lista</button>
        </>
      )}

      <h2 style={{ marginTop: 16 }}>Data</h2>
      <input
        type="date"
        value={ajustarDataInput(selectedDate)}
        onChange={(e) => setSelectedDate(ajustarDataSalvar(e.target.value))}
      />

      <p>Data selecionada: {formatDateBR(selectedDate)}</p>

      <h2 style={{ marginTop: 16 }}>OFERTAS / CONTRIBUIÇÕES</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Descrição"
          value={descricaoOferta}
          onChange={(e) => setDescricaoOferta(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          value={valorOferta}
          onChange={(e) => setValorOferta(e.target.value)}
        />
        <button onClick={addOferta} className="btn-adicionar">Adicionar</button>
      </div>

      {ofertas.length > 0 && (
        <>
          <ul className="lista-alunos">
            {ofertas.map((o, i) => (
              <li key={i}>
                <span>
                  {o.descricao} –{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(o.valor)}
                </span>
                <button onClick={() => removeOferta(i)} className="btn-remover">
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="presenca-contagem">
            Total:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(ofertas.reduce((acc, o) => acc + o.valor, 0))}
          </div>

          <button onClick={limparOfertas} className="btn-limpar">
            Limpar Ofertas
          </button>
        </>
      )}

      <h2 style={{ marginTop: 16 }}>Observações</h2>
      <textarea
        rows="4"
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        placeholder="Anotações..."
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={exportPDF} className="btn-exportar">
          Exportar PDF Completo
        </button>
      </div>
    </div>
  );
}
