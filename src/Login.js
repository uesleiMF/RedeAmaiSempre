import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // ----------------------------------------
  // FUNÇÃO PARA ACORDAR O RENDER (PING)
  // ----------------------------------------
  wakeServer = async () => {
    try {
      await axios.get("https://backtestmar.onrender.com/health", { timeout: 5000 });
    } catch (e) {
      // ignora erro — a ideia é só "acordar"
    }
  };

  // ----------------------------------------
  // LOGIN OTIMIZADO
  // ----------------------------------------
  login = async () => {
    const { username, password, loading } = this.state;

    if (loading) return;

    if (!username || !password) {
      swal({ text: 'Preencha usuário e senha', icon: 'error' });
      return;
    }

    this.setState({ loading: true });

    try {
      // 👉 Primeiro passo: acorda o servidor
      await this.wakeServer();

      // 👉 Define um timeout curto (evita travar por 20s)
      const api = axios.create({
        baseURL: "https://backtestmar.onrender.com",
        timeout: 6000
      });

      // 👉 Tenta fazer login (2 tentativas)
      let response;
      try {
        response = await api.post("/login", { username, password });
      } catch {
        response = await api.post("/login", { username, password });
      }

      const token = response?.data?.token;
      const id = response?.data?.id || response?.data?._id;

      if (!token) {
        swal({ text: 'O servidor respondeu sem token.', icon: 'error' });
        this.setState({ loading: false });
        return;
      }

      // 👉 Salva token + ID corretamente
      localStorage.setItem("token", token);
      if (id) localStorage.setItem("user_id", id);

      swal({ text: "Login realizado com sucesso!", icon: "success" });

      this.props.history.push("/dashboard");

    } catch (err) {

      if (err?.code === "ECONNABORTED") {
        swal({
          text: "Servidor demorou para responder (timeout). Tente novamente.",
          icon: "error"
        });
      } else {
        swal({
          text: err?.response?.data?.errorMessage || "Erro ao logar",
          icon: "error"
        });
      }

    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { username, password, loading } = this.state;

    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>

          <TextField
            fullWidth
            type="text"
            autoComplete="off"
            name="username"
            value={username}
            onChange={this.onChange}
            placeholder="Usuário"
            margin="dense"
          />

          <TextField
            fullWidth
            type="password"
            autoComplete="off"
            name="password"
            value={password}
            onChange={this.onChange}
            placeholder="Senha"
            margin="dense"
          />

          <div className="login-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={this.login}
              disabled={!username || !password || loading}
              className="login-btn"
            >
              {loading ? "Entrando..." : "Login"}
            </Button>

            {loading && <CircularProgress size={26} className="login-loading" />}

            <Link href="/register" className="login-register-link">
              Registro
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
