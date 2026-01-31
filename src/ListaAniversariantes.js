import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress,
  Tooltip,
  Button,
  Typography,
  Box,
  Paper,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CakeIcon from "@material-ui/icons/Cake";
import swal from "sweetalert";
import axios from "axios";
import "./ListaAniversariantes.css";

const BASE_URL = "https://backtestmar.onrender.com";

export default function ListaAniversariantes({ token: propToken }) {
  const [loading, setLoading] = useState(false);
  const [aniversariantes, setAniversariantes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState({ id: "", name: "", birthDate: "" });

  const token = propToken || localStorage.getItem("token");

  // ✅ UseMemo para headers para não recriar a cada render
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const formatDateToInput = (dateStr) => {
    if (!dateStr) return "";
    const datePart = typeof dateStr === "string" ? dateStr.split("T")[0] : "";
    return datePart;
  };

  const formatDateBR = (birthDate) => {
    if (!birthDate) return "-";
    const dateStr = typeof birthDate === "string" ? birthDate.split("T")[0] : "";
    if (!dateStr || dateStr.length !== 10) return "Data inválida";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchAniversariantes = useCallback(async () => {
    if (!token) {
      setAniversariantes([]);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    try {
      const res = await axios.get(`${BASE_URL}/get-casal-simple`, {
        headers,
        signal: controller.signal,
      });

      const todos = res.data?.casal || [];
      setAniversariantes(todos);
    } catch (err) {
      if (axios.isCancel(err)) return;
      swal({
        text: err?.response?.data?.errorMessage || "Erro ao carregar a lista",
        icon: "error",
      });
      setAniversariantes([]);
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [token, headers]);

  useEffect(() => {
    fetchAniversariantes();
  }, [fetchAniversariantes]);

  const handleOpenModal = (aniversariante = null) => {
    setIsEdit(!!aniversariante);
    setCurrent(
      aniversariante
        ? {
            id: aniversariante._id,
            name: aniversariante.name || "",
            birthDate: formatDateToInput(aniversariante.birthDate),
          }
        : { id: "", name: "", birthDate: "" }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrent({ id: "", name: "", birthDate: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!current.name.trim() || !current.birthDate) {
      return swal({ text: "Preencha nome e data de nascimento", icon: "warning" });
    }

    try {
      if (isEdit) {
        await axios.put(
          `${BASE_URL}/update-casal-simple/${current.id}`,
          { name: current.name.trim(), birthDate: current.birthDate },
          { headers }
        );
        swal({ text: "Aniversariante atualizado!", icon: "success" });
      } else {
        await axios.post(
          `${BASE_URL}/add-casal-simple`,
          { name: current.name.trim(), birthDate: current.birthDate },
          { headers }
        );
        swal({ text: "Aniversariante adicionado!", icon: "success" });
      }

      handleCloseModal();
      fetchAniversariantes();
    } catch (err) {
      swal({
        text: err?.response?.data?.errorMessage || "Erro ao salvar",
        icon: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este aniversariante?")) return;

    try {
      await axios.delete(`${BASE_URL}/delete-casal-simple/${id}`, { headers });
      swal({ text: "Excluído com sucesso!", icon: "success" });
      fetchAniversariantes();
    } catch (err) {
      swal({
        text: err?.response?.data?.errorMessage || "Erro ao excluir",
        icon: "error",
      });
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CakeIcon fontSize="large" color="primary" />
          Aniversariantes
        </Typography>
        <Tooltip title="Adicionar novo">
          <IconButton color="primary" onClick={() => handleOpenModal()}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : aniversariantes.length === 0 ? (
        <Paper elevation={3} style={{ padding: 40, textAlign: "center" }}>
          <CakeIcon style={{ fontSize: 80, color: "#ddd", marginBottom: 20 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Nenhum aniversariante cadastrado ainda
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Clique no botão + para adicionar o primeiro! 🎉
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Data de Nascimento</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aniversariantes.map((a) => (
                <TableRow key={a._id} hover>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{formatDateBR(a.birthDate)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenModal(a)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="secondary" onClick={() => handleDelete(a._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEdit ? "Editar Aniversariante" : "Adicionar Novo Aniversariante"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome"
            fullWidth
            value={current.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="birthDate"
            label="Data de Nascimento"
            type="date"
            fullWidth
            value={current.birthDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {isEdit ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
