import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import GetAppIcon from "@material-ui/icons/GetApp";
import "./ListaChamadas.css";
import AniversariantesDiaMes from "./AniversariantesDiaMes";

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
  // Aniversariantes
  const [aniverDia, setAniverDia] = useState([]);
  const [aniverMes, setAniverMes] = useState([]);

  // ================= HELPERS ======================
  const authHeaders = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const ajustarDataInput = (dateStr) => {
    if (!dateStr) return "";
    const datePart = typeof dateStr === "string" ? dateStr.split("T")[0] : "";
    return datePart;
  };

  const formatDateBR = (birthDate) => {
    if (!birthDate) return "Sem data";
    const dateStr = typeof birthDate === "string" ? birthDate.split("T")[0] : "";
    if (!dateStr || dateStr.length !== 10) return "Data inválida";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
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
  }, [token, authHeaders]);

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
      .delete(`${BASE_URL}/history/delete/${encodeURIComponent(nome)}`, { headers: authHeaders() })
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
    if (!casal || !casal.nome) return;
    const trimmedName = casal.nome.trim();
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

  // ================= RECEBER ANIVERSÁRIOS ====================
  const receberAniversarios = ({ dia = [], mes = [] }) => {
    const mapear = (lista) =>
      lista.map((item) => ({
        nome: item.name || item.nome || "Sem nome",
        birthDate: item.birthDate || "",
      }));
    setAniverDia(mapear(dia));
    setAniverMes(mapear(mes));
  };

  // ================= EXPORTAR PDF ====================
  const exportPDF = () => {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    let startY = 20;
    const marginLeft = 14;
    const labelWidth = 48;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`CELULA DE CASAIS - ${formatDateBR(selectedDate)}`, width / 2, startY, { align: "center" });
    startY += 12;

    const addLabel = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, marginLeft, startY);
      doc.setFont("helvetica", "normal");
      doc.text(value || "Não informado", marginLeft + labelWidth, startY);
      startY += 7;
    };

    addLabel("CÉLULA:", nomeCelula);
    addLabel("HORÁRIO:", `${horaInicio || ""}${horaInicio && horaFim ? " - " : ""}${horaFim || ""}`);
    addLabel("TEMA:", tema);
    addLabel("DINÂMICA:", dinamica);
    addLabel("LOUVOR:", louvor);
    startY += 10;

    // ===== Lista de casais =====
    if (students.length > 0) {
      if (startY > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        startY = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("CASAIS PRESENTES", width / 2, startY, { align: "center" });
      startY += 8;

      autoTable(doc, {
        head: [["#", "Casal", "Presença"]],
        body: students.map((s, i) => [i + 1, s.nome, s.presenca ? "Presente" : "Ausente"]),
        startY,
        didParseCell: (data) => {
          if (data.column.index === 2) {
            data.cell.styles.fillColor = data.cell.raw === "Presente" ? [144, 238, 144] : [255, 182, 193];
          }
        },
        margin: { left: marginLeft, right: marginLeft },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // ===== Aniversariantes do dia e do mês =====
    const gerarTabelaAniversariantes = (titulo, lista) => {
      if (lista.length === 0) return;
      if (startY > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        startY = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(titulo, width / 2, startY, { align: "center" });
      startY += 6;
      autoTable(doc, {
        head: [["#", "Nome", "Data de Aniversário"]],
        body: lista.map((a, i) => [i + 1, a.nome, formatDateBR(a.birthDate)]),
        startY,
        margin: { left: marginLeft, right: marginLeft },
      });
      startY = doc.lastAutoTable.finalY + 10;
    };

    gerarTabelaAniversariantes("ANIVERSARIANTES DO DIA", aniverDia);
    gerarTabelaAniversariantes("ANIVERSARIANTES DO MÊS", aniverMes);

    // ===== Ofertas =====
    if (ofertas.length > 0) {
      if (startY > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        startY = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("OFERTAS-CONTRIBUIÇÕES", width / 2, startY, { align: "center" });
      startY += 8;
      autoTable(doc, {
        head: [["#", "Descrição", "Valor"]],
        body: ofertas.map((o, i) => [
          i + 1,
          o.descricao,
          new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(o.valor),
        ]),
        startY,
        margin: { left: marginLeft, right: marginLeft },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // ===== Observações =====
    if (observacoes.trim() !== "") {
      if (startY > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        startY = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("OBSERVAÇÕES:", width / 2, startY, { align: "center" });
      doc.setFont("helvetica", "normal");
      const obs = doc.splitTextToSize(observacoes, width - 28);
      doc.text(obs, marginLeft, startY + 8);
    }

    doc.save("lista-casais.pdf");
  };

  return (
    <div className="lista-chamadas-container">
      <AniversariantesDiaMes token={token} onLoad={receberAniversarios} />

      

      <h2>CELULA DE CASAIS</h2>
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

      <h2 style={{ marginTop: 24 }}>HISTÓRICO</h2>
      <input
        type="text"
        placeholder="Pesquisar histórico..."
        value={searchHistorico}
        onChange={(e) => setSearchHistorico(e.target.value)}
      />

      <div className="historico-box">
        {historicoFiltrado.map((nome) => (
          <div key={nome} className="historico-item" onClick={() => setName(nome)}>
            <span>{nome}</span>
            <Tooltip title="Excluir do histórico">
              <IconButton size="small" onClick={(e) => deleteNameFromHistory(nome, e)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        ))}
        {nameHistory.length > 0 && (
          <Tooltip title="Limpar todo o histórico">
            <IconButton onClick={clearHistory} color="secondary">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>

      <h2 style={{ marginTop: 24 }}>CASAIS PRESENTES</h2>
      <div className="input-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="text"
          value={name}
          placeholder="Nome dos casais"
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1 }}
        />
        <Tooltip title="Adicionar casal">
          <IconButton onClick={addStudent} color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>

      {students.length > 0 && (
        <>
          <div className="presenca-contagem" style={{ marginTop: 12 }}>
            <span>Presentes: {students.filter((s) => s.presenca).length}</span>
            <span style={{ marginLeft: 16 }}>Ausentes: {students.filter((s) => !s.presenca).length}</span>
          </div>

          <ul className="lista-alunos" style={{ marginTop: 8 }}>
            {students.map((s, index) => (
              <li key={index}>
                <span>{s.nome}</span>
                <div className="aluno-buttons">
                  <Tooltip title={s.presenca ? "Marcar como Ausente" : "Marcar como Presente"}>
                    <IconButton
                      size="small"
                      color={s.presenca ? "primary" : "default"}
                      onClick={() => togglePresenca(index)}
                    >
                      {s.presenca ? <CheckCircleIcon /> : <CancelIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remover da lista">
                    <IconButton size="small" color="secondary" onClick={() => removeStudent(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </li>
            ))}
          </ul>

          <Box textAlign="center" my={2}>
            <Tooltip title="Limpar toda a lista">
              <IconButton onClick={clearList} color="secondary" size="medium">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      <div className="box-aniversarios" style={{ marginTop: 24 }}>
        <h3>ANIVERSARIANTES DO DIA 🎉</h3>
        {aniverDia.length === 0 ? (
          <p>Nenhum aniversariante hoje.</p>
        ) : (
          aniverDia.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 8,
                backgroundColor: "#ffff8a",
                borderRadius: 6,
                marginBottom: 6,
              }}
            >
              <div>
                <strong>{a.nome}</strong> — {formatDateBR(a.birthDate)}
              </div>
              <Tooltip title="Adicionar à lista">
                <IconButton size="small" color="primary" onClick={() => addCasalToList({ nome: a.nome })}>
                  <PersonAddIcon />
                </IconButton>
              </Tooltip>
            </div>
          ))
        )}

        <h3 style={{ marginTop: 16 }}>ANIVERSARIANTES DO MÊS</h3>
        {aniverMes.length === 0 ? (
          <p>Nenhum outro aniversariante este mês.</p>
        ) : (
          aniverMes.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 6,
                marginBottom: 4,
              }}
            >
              <div>
                <strong>{a.nome}</strong> — {formatDateBR(a.birthDate)}
              </div>
              <Tooltip title="Adicionar à lista">
                <IconButton size="small" color="primary" onClick={() => addCasalToList({ nome: a.nome })}>
                  <PersonAddIcon />
                </IconButton>
              </Tooltip>
            </div>
          ))
        )}
      </div>

      <h2 style={{ marginTop: 24 }}>DATA</h2>
      <input type="date" value={ajustarDataInput(selectedDate)} onChange={(e) => setSelectedDate(e.target.value)} />

      <h2 style={{ marginTop: 24 }}>OFERTAS-CONTRIBUIÇÕES</h2>
      <div className="input-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="text"
          placeholder="Descrição"
          value={descricaoOferta}
          onChange={(e) => setDescricaoOferta(e.target.value)}
          style={{ flex: 1 }}
        />
        <input
          type="number"
          placeholder="Valor"
          value={valorOferta}
          onChange={(e) => setValorOferta(e.target.value)}
          style={{ width: 120 }}
        />
        <Tooltip title="Adicionar oferta">
          <IconButton onClick={addOferta} color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>

      {ofertas.length > 0 && (
        <>
          <ul className="lista-ofertas" style={{ marginTop: 12 }}>
            {ofertas.map((o, i) => (
              <li key={i}>
                {o.descricao} — {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(o.valor)}
                <Tooltip title="Remover oferta">
                  <IconButton size="small" color="secondary" onClick={() => removeOferta(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </li>
            ))}
          </ul>
          <Box textAlign="center" my={2}>
            <Tooltip title="Limpar todas as ofertas">
              <IconButton onClick={limparOfertas} color="secondary" size="medium">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      <h2 style={{ marginTop: 24 }}>OBSERVAÇÕES</h2>
      <textarea
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />

      <Box mt={4} textAlign="center">
        <Tooltip title="Exportar como PDF">
          <IconButton
            onClick={exportPDF}
            color="primary"
            size="large"
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: 15,
              boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
            }}
          >
            <GetAppIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
          PDF
        </Typography>
      </Box>
    </div>
  );
}