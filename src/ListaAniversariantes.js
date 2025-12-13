import React, { Component } from "react";
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
  Tooltip
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import swal from "sweetalert";
import axios from "axios";

export default class ListaAniversariantes extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      token: props.token || null,
      loading: false,
      search: "",
      aniversariantes: [],
      openModal: false,
      isEdit: false,
      current: { id: "", name: "", birthDate: "" }
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAniversariantes();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getHeaders = () => {
    const t = this.state.token || localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}`, token: t } : {};
  };

  formatDateToInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };

  formatBR = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toLocaleDateString("pt-BR");
  };

  getAniversariantes = async () => {
    this._isMounted && this.setState({ loading: true });
    try {
      const res = await axios.get("https://backtestmar.onrender.com/get-casal-simple", { headers: this.getHeaders() });
      const aniversariantes = res.data?.casal || [];
      this._isMounted && this.setState({ aniversariantes, loading: false });
    } catch (err) {
      swal({ text: err?.response?.data?.errorMessage || err.message, icon: "error" });
      this._isMounted && this.setState({ aniversariantes: [], loading: false });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ current: { ...this.state.current, [name]: value } });
  };

  openModal = (aniversariante = null) => {
    this.setState({
      openModal: true,
      isEdit: !!aniversariante,
      current: aniversariante
        ? {
            id: aniversariante._id,
            name: aniversariante.name,
            birthDate: this.formatDateToInput(aniversariante.birthDate)
          }
        : { id: "", name: "", birthDate: "" }
    });
  };

  closeModal = () => this.setState({ openModal: false });

  saveAniversariante = async () => {
    const { current, isEdit } = this.state;
    if (!current.name || !current.birthDate)
      return swal({ text: "Preencha todos os campos", icon: "error" });

    try {
      const url = isEdit
        ? `https://backtestmar.onrender.com/update-casal-simple/${current.id}`
        : `https://backtestmar.onrender.com/add-casal-simple`;
      const method = isEdit ? axios.put : axios.post;

      await method(url, { name: current.name, birthDate: current.birthDate }, { headers: this.getHeaders() });
      swal({ text: isEdit ? "Atualizado!" : "Aniversariante adicionado!", icon: "success" });
      this.closeModal();
      this.getAniversariantes();
    } catch (err) {
      swal({ text: err?.response?.data?.errorMessage || err.message, icon: "error" });
    }
  };

  deleteAniversariante = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;
    try {
      await axios.delete(`https://backtestmar.onrender.com/delete-casal-simple/${id}`, { headers: this.getHeaders() });
      swal({ text: "Deletado!", icon: "success" });
      this.getAniversariantes();
    } catch (err) {
      swal({ text: err?.response?.data?.errorMessage || err.message, icon: "error" });
    }
  };

  render() {
    const { aniversariantes, loading, openModal, current } = this.state;

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Aniversariantes</h2>
          <Tooltip title="Adicionar Aniversariante">
            <IconButton color="primary" onClick={() => this.openModal()}><AddCircleIcon /></IconButton>
          </Tooltip>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', marginTop:20 }}><CircularProgress /></div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Data de Nascimento</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aniversariantes.map(a => (
                  <TableRow key={a._id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{this.formatBR(a.birthDate)}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => this.openModal(a)}><EditIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton onClick={() => this.deleteAniversariante(a._id)}><DeleteIcon /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* MODAL */}
        <Dialog open={openModal} onClose={this.closeModal} maxWidth="sm" fullWidth>
          <DialogTitle>{this.state.isEdit ? "Editar Aniversariante" : "Adicionar Aniversariante"}</DialogTitle>
          <DialogContent>
            <TextField label="Nome" fullWidth margin="normal" name="name" value={current.name} onChange={this.handleInputChange} />
            <TextField
              label="Data de Nascimento"
              type="date"
              fullWidth
              margin="normal"
              name="birthDate"
              value={current.birthDate}
              onChange={this.handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={this.closeModal}>Cancelar</button>
            <button onClick={this.saveAniversariante}>{this.state.isEdit ? "Atualizar" : "Adicionar"}</button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
