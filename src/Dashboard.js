import React, { Component } from 'react';
import {
  Dialog, DialogActions, DialogTitle, DialogContent,
  TableBody, Table, TableContainer, TableHead, TableRow,
  TableCell, CircularProgress, IconButton, TextField
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import axios from 'axios';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { CSVLink } from "react-csv";

// Ícones Material-UI v4
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';

import "./Dashboard.css";

// Configura pdfMake corretamente
pdfMake.vfs = pdfFonts.vfs;

export default class Dashboard extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      token: null,
      openCasalModal: false,
      openCasalEditModal: false,
      id: '',
      name: '',
      desc: '',
      tel: '',
      niverH: '',
      niverM: '',
      fileName: '',
      filePreview: '',
      page: 1,
      search: '',
      casais: [],
      pages: 0,
      loading: false
    };

    this.fileInputAddRef = React.createRef();
    this.fileInputEditRef = React.createRef();
  }

  componentDidMount = () => {
    this._isMounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      if (this._isMounted) this.setState({ token }, () => this.getCasal());
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAuthHeaders = () => {
    const t = this.state.token || localStorage.getItem('token');
    if (!t) return {};
    return { Authorization: `Bearer ${t}`, token: t };
  }

  getCasal = async () => {
    if (this._isMounted) this.setState({ loading: true });
    try {
      let data = `?page=${this.state.page}`;
      if (this.state.search) data += `&search=${encodeURIComponent(this.state.search)}`;
      const res = await axios.get(`https://backtestmar.onrender.com/get-casal${data}`, {
        headers: this.getAuthHeaders()
      });

      const casais = res.data?.casais ?? res.data?.casal ?? [];
      const pages = res.data?.pages ?? res.data?.totalPages ?? 1;

      if (this._isMounted) this.setState({ loading: false, casais, pages });
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || err.message || 'Erro ao buscar casais';
      swal({ text: msg, icon: "error" });
      if (this._isMounted) this.setState({ loading: false, casais: [], pages: 0 });
    }
  }

  deleteCasal = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este casal?')) return;
    try {
      const headers = { 'Content-Type': 'application/json', ...this.getAuthHeaders() };
      let res;
      try {
        res = await axios.delete(`https://backtestmar.onrender.com/delete-casal/${id}`, { headers });
      } catch (e) {
        res = await axios.post('https://backtestmar.onrender.com/delete-casal', { id }, { headers });
      }
      swal({ text: res.data?.title || 'Deletado com sucesso!', icon: "success" });
      if (this._isMounted) this.setState({ page: 1 }, () => this.getCasal());
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || err.message || 'Erro ao deletar';
      swal({ text: msg, icon: 'error' });
    }
  }

  pageChange = (e, page) => {
    if (this._isMounted) this.setState({ page }, () => this.getCasal());
  }

  logOut = () => {
    localStorage.removeItem('token');
    this.props.history.push('/');
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (this._isMounted) this.setState({
        fileName: file.name,
        filePreview: URL.createObjectURL(file)
      });
      return;
    }

    const { name, value } = e.target;
    if (this._isMounted) {
      this.setState({ [name]: value }, () => {
        if (name === 'search') {
          this.setState({ page: 1 }, () => this.getCasal());
        }
      });
    }
  };

  addCasal = async () => {
    const fileInput = this.fileInputAddRef.current;
    if (!fileInput || !fileInput.files[0]) return swal({ text: 'Selecione uma imagem', icon: 'error' });
    if (!this.state.name || !this.state.desc || !this.state.tel || !this.state.niverH || !this.state.niverM) return swal({ text: 'Preencha todos os campos', icon: 'error' });

    const fd = new FormData();
    fd.append('file', fileInput.files[0]);
    fd.append('name', this.state.name);
    fd.append('desc', this.state.desc);
    fd.append('tel', this.state.tel);
    fd.append('niverH', this.state.niverH);
    fd.append('niverM', this.state.niverM);

    try {
      const res = await axios.post('https://backtestmar.onrender.com/add-casal', fd, {
        headers: { 'content-type': 'multipart/form-data', ...this.getAuthHeaders() }
      });

      swal({ text: res.data?.message || 'Casal adicionado!', icon: "success" });
      if (this._isMounted) {
        this.handleCasalClose();
        this.setState({
          name: '', desc: '', tel: '', niverH: '', niverM: '',
          fileName: '', filePreview: '', page: 1
        }, () => this.getCasal());
      }
      if (fileInput) fileInput.value = null;
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || err.message || 'Erro ao adicionar';
      swal({ text: msg, icon: "error" });
      this.handleCasalClose();
    }
  };

  updateCasal = async () => {
    const fileInput = this.fileInputEditRef.current;
    const id = this.state.id;
    if (!id) return swal({ text: 'ID ausente', icon: 'error' });
    if (!this.state.name || !this.state.desc || !this.state.tel || !this.state.niverH || !this.state.niverM) return swal({ text: 'Preencha os campos', icon: 'error' });

    const fd = new FormData();
    fd.append('name', this.state.name);
    fd.append('desc', this.state.desc);
    fd.append('tel', this.state.tel);
    fd.append('niverH', this.state.niverH);
    fd.append('niverM', this.state.niverM);

    if (fileInput && fileInput.files[0]) fd.append('file', fileInput.files[0]);

    try {
      const res = await axios.put(`https://backtestmar.onrender.com/update-casal/${id}`, fd, {
        headers: { 'content-type': 'multipart/form-data', ...this.getAuthHeaders() }
      });
      swal({ text: res.data?.message || 'Atualizado!', icon: 'success' });
      if (this._isMounted) {
        this.handleCasaltEditClose();
        this.setState({ name: '', desc: '', tel: '', niverH: '', niverM: '', fileName: '' }, () => this.getCasal());
      }
      if (fileInput) fileInput.value = null;
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || err.message || 'Erro';
      swal({ text: msg, icon: 'error' });
      this.handleCasaltEditClose();
    }
  };

  handleCasalOpen = () => {
    this.setState({
      openCasalModal: true,
      id: '', name: '', desc: '', tel: '', niverH: '', niverM: '',
      fileName: '', filePreview: ''
    });
    if (this.fileInputAddRef.current) this.fileInputAddRef.current.value = null;
  };

  handleCasalClose = () => this.setState({ openCasalModal: false });
  handleCasalEditOpen = (data) => {
    this.setState({
      openCasalEditModal: true,
      id: data._id,
      name: data.name,
      desc: data.desc,
      tel: data.tel,
      niverH: data.niverH?.substring(0, 10),
      niverM: data.niverM?.substring(0, 10),
      fileName: data.image,
      filePreview: data.image
    });
    if (this.fileInputEditRef.current) this.fileInputEditRef.current.value = null;
  };
  handleCasaltEditClose = () => this.setState({ openCasalEditModal: false });

  // ---------- FUNÇÃO GERAR PDF ATUALIZADA ----------
  generatePDF = async () => {
    const { casais } = this.state;

    const toBase64 = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = 50 / img.height;
          canvas.width = img.width * scale;
          canvas.height = 50;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = () => resolve(null);
      });
    };

    const casaisComImg = await Promise.all(casais.map(async c => {
      let imgBase64 = null;
      if (c.image) imgBase64 = await toBase64(c.image);
      return { ...c, imgBase64 };
    }));

    const body = [
      ['Imagem', 'Nome Casal', 'Descrição', 'Contato', 'Aniversário Homem', 'Aniversário Mulher']
    ];

    casaisComImg.forEach(c => {
      body.push([
        c.imgBase64 ? { image: c.imgBase64, width: 50, alignment: 'center' } : '—',
        c.name,
        c.desc,
        c.tel,
        c.niverH?.substring(0, 10) || '',
        c.niverM?.substring(0, 10) || ''
      ]);
    });

    const columnWidths = [
      50,
      'auto',
      '*',
      'auto',
      'auto',
      'auto'
    ];

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      content: [
        { text: 'Lista de Casais', style: 'header', margin: [0, 0, 0, 15] },
        {
          table: {
            headerRows: 1,
            widths: columnWidths,
            body: body.map((row, i) =>
              row.map((cell) => {
                if (typeof cell === 'string' || typeof cell === 'number') {
                  return {
                    text: cell,
                    margin: [3, 3, 3, 3],
                    alignment: 'center',
                    fillColor: i === 0 ? '#faaeae' : (i % 2 === 0 ? '#f9f9f9' : null),
                    bold: i === 0,
                    fontSize: 10
                  };
                } else {
                  return { ...cell, margin: [3, 3, 3, 3] };
                }
              })
            )
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#ccc',
            vLineColor: () => '#ccc',
          }
        }
      ],
      styles: {
        header: { fontSize: 16, bold: true, alignment: 'center' }
      },
      defaultStyle: { fontSize: 10 }
    };

    pdfMake.createPdf(docDefinition).download('casais.pdf');
  };

  render() {
    const { casais, loading, page, pages, filePreview } = this.state;

    return (
      <div className="dashboard-container">
        {loading && <div className="loading-container"><CircularProgress color="inherit" /></div>}

        <div className="top-bar">
          <h2>CELULAS DE CASAIS</h2>
          <div className="top-bar-icons">
            <Tooltip title="Adicionar Casal">
              <IconButton color="primary" onClick={this.handleCasalOpen}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Exportar PDF">
              <IconButton color="default" onClick={this.generatePDF}>
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Exportar CSV">
              <CSVLink
                data={casais.map(c => ({
                  Nome: c.name,
                  Descrição: c.desc,
                  Contato: c.tel,
                  "Aniversário Homem": c.niverH?.substring(0,10),
                  "Aniversário Mulher": c.niverM?.substring(0,10)
                }))}
                filename={"casais.csv"}
                style={{ textDecoration: 'none' }}
              >
                <IconButton color="default">
                  <GetAppIcon />
                </IconButton>
              </CSVLink>
            </Tooltip>

            <Tooltip title="Sair">
              <IconButton color="secondary" onClick={this.logOut}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Modal Adicionar Casal */}
        <Dialog open={this.state.openCasalModal} onClose={this.handleCasalClose}>
          <DialogTitle>Adicionar Casal</DialogTitle>
          <DialogContent>
            <TextField type="text" name="name" value={this.state.name} onChange={this.onChange} placeholder="Nome Casal" fullWidth margin="dense" />
            <TextField type="text" name="desc" value={this.state.desc} onChange={this.onChange} placeholder="Descrição" fullWidth margin="dense" />
            <TextField type="text" name="tel" value={this.state.tel} onChange={this.onChange} placeholder="Contato" fullWidth margin="dense" />
            <TextField type="date" name="niverH" value={this.state.niverH} onChange={this.onChange} fullWidth margin="dense" />
            <TextField type="date" name="niverM" value={this.state.niverM} onChange={this.onChange} fullWidth margin="dense" />
            <div className="file-input-row">
              <input ref={this.fileInputAddRef} type="file" accept="image/*" onChange={this.onChange} />
              <span>{this.state.fileName}</span>
            </div>
            {filePreview && <div className="preview-img-container"><img src={filePreview} alt="Preview" className="preview-img" /></div>}
          </DialogContent>
          <DialogActions>
            <IconButton onClick={this.handleCasalClose} color="primary"><DeleteIcon /></IconButton>
            <IconButton onClick={this.addCasal} color="primary"><AddCircleIcon /></IconButton>
          </DialogActions>
        </Dialog>

        {/* Modal Editar Casal */}
        <Dialog open={this.state.openCasalEditModal} onClose={this.handleCasaltEditClose}>
          <DialogTitle>Editar Casal</DialogTitle>
          <DialogContent>
            <TextField type="text" name="name" value={this.state.name} onChange={this.onChange} placeholder="Nome Casal" fullWidth margin="dense" />
            <TextField type="text" name="desc" value={this.state.desc} onChange={this.onChange} placeholder="Descrição" fullWidth margin="dense" />
            <TextField type="text" name="tel" value={this.state.tel} onChange={this.onChange} placeholder="Contato" fullWidth margin="dense" />
            <TextField type="date" name="niverH" value={this.state.niverH} onChange={this.onChange} fullWidth margin="dense" />
            <TextField type="date" name="niverM" value={this.state.niverM} onChange={this.onChange} fullWidth margin="dense" />
            <div className="file-input-row">
              <input ref={this.fileInputEditRef} type="file" accept="image/*" onChange={this.onChange} />
              <span>{this.state.fileName}</span>
            </div>
            {filePreview && <div className="preview-img-container"><img src={filePreview} alt="Preview" className="preview-img" /></div>}
          </DialogContent>
          <DialogActions>
            <IconButton onClick={this.handleCasaltEditClose} color="primary"><DeleteIcon /></IconButton>
            <IconButton onClick={this.updateCasal} color="primary"><EditIcon /></IconButton>
          </DialogActions>
        </Dialog>

        {/* Tabela */}
        <TableContainer>
          <div className="search-box">
            <TextField type="search" name="search" value={this.state.search} onChange={this.onChange} placeholder="Procurar Casais" variant="outlined" size="small" />
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Imagem</TableCell>
                <TableCell align="center">Nome Casal</TableCell>
                <TableCell align="center">Descrição</TableCell>
                <TableCell align="center">Contato</TableCell>
                <TableCell align="center">Aniversário Homem</TableCell>
                <TableCell align="center">Aniversário Mulher</TableCell>
                <TableCell align="center">Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {casais.map(row => (
                <TableRow key={row._id || row.name}>
                  <TableCell align="center">{row.image ? <img src={row.image} alt={row.name} className="table-img" /> : '—'}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.desc}</TableCell>
                  <TableCell align="center">{row.tel}</TableCell>
                  <TableCell align="center">{row.niverH?.substring(0, 10)}</TableCell>
                  <TableCell align="center">{row.niverM?.substring(0, 10)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => this.handleCasalEditOpen(row)} color="primary"><EditIcon /></IconButton>
                    <IconButton onClick={() => this.deleteCasal(row._id)} color="secondary"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="pagination-area">
            <Pagination count={pages} page={page} onChange={this.pageChange} color="primary" />
          </div>
        </TableContainer>
      </div>
    );
  }
}
