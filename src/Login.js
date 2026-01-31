import React, { Component } from "react";
import swal from "sweetalert";
import {
  Button,
  TextField,
  Link,
  CircularProgress
} from "@material-ui/core";
import axios from "axios";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false
    };
  }

  // ----------------------------
  // HANDLE INPUT
  // ----------------------------
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // ----------------------------
  // ACORDAR SERVIDOR (KOYEB / RENDER)
  // ----------------------------
  wakeServer = async () => {
    try {
      await axios.get(
        "https://backtestmar.onrender.com/health",
        { timeout: 5000 }
      );
    } catch (err) {
      // ignora erro
    }
  };

  // ----------------------------
  // LOGIN
  // ----------------------------
  login = async () => {
    const { username, password, loading } = this.state;
    if (loading) return;

    if (!username || !password) {
      swal({
        text: "Preencha usuário e senha",
        icon: "error"
      });
      return;
    }

    this.setState({ loading: true });

    try {
      // 1️⃣ Acorda servidor
      await this.wakeServer();

      // 2️⃣ Axios configurado
      const api = axios.create({
        baseURL: "https://backtestmar.onrender.com",
        timeout: 6000
      });

      // 3️⃣ Login
      const response = await api.post("/login", {
        username,
        password
      });

      // 4️⃣ Extrai dados
      const token = response?.data?.token;
      const user = response?.data?.user || {};

      const id = user?.id || user?._id || response?.data?.id;
      const role = user?.role || "user";

      if (!token) {
        swal({
          text: "Servidor respondeu sem token.",
          icon: "error"
        });
        this.setState({ loading: false });
        return;
      }

      // 5️⃣ Salva dados
      localStorage.setItem("token", token);
      if (id) localStorage.setItem("user_id", id);
      localStorage.setItem("role", role);

      // 6️⃣ Sucesso
      swal({
        text: "Login realizado com sucesso!",
        icon: "success"
      });

      // 7️⃣ Redireciona
      this.props.history.push("/dashboard");

    } catch (err) {
      swal({
        text:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Erro ao logar. O servidor pode estar lento.",
        icon: "error"
      });
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
            name="username"
            value={username}
            onChange={this.onChange}
            placeholder="Usuário"
            margin="dense"
            disabled={loading}
            autoComplete="off"
          />

          <TextField
            fullWidth
            type="password"
            name="password"
            value={password}
            onChange={this.onChange}
            placeholder="Senha"
            margin="dense"
            disabled={loading}
            autoComplete="off"
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

            {loading && (
              <CircularProgress size={26} className="login-loading" />
            )}

            <Link href="/register" className="login-register-link">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
