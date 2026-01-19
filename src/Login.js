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

  onChange = (e) =>
    this.setState({ [e.target.name]: e.target.value });

  // ----------------------------------------
  // ACORDAR SERVIDOR (RENDER)
  // ----------------------------------------
  wakeServer = async () => {
    try {
      await axios.get(
        "alright-hetti-faculdade-49bca0ed.koyeb.app/health",
        { timeout: 5000 }
      );
    } catch {
      // ignora erro
    }
  };

  // ----------------------------------------
  // LOGIN
  // ----------------------------------------
  login = async () => {
    const { username, password, loading } = this.state;
    if (loading) return;

    if (!username || !password) {
      swal({ text: "Preencha usuário e senha", icon: "error" });
      return;
    }

    this.setState({ loading: true });

    try {
      // 1️⃣ Acorda o Render
      await this.wakeServer();

      // 2️⃣ Axios com timeout curto
      const api = axios.create({
        baseURL: "https://alright-hetti-faculdade-49bca0ed.koyeb.app/",
        timeout: 4000
      });

      // 3️⃣ Login
      let response;
      try {
        response = await api.post("/login", { username, password });
      } catch {
        response = await api.post("/login", { username, password });
      }

      // 4️⃣ Extrai dados
      const token = response?.data?.token;
      const user = response?.data?.user;

      const id = user?.id || response?.data?.id || response?.data?._id;
      const role = user?.role || "user"; // fallback seguro

      if (!token) {
        swal({ text: "Servidor respondeu sem token.", icon: "error" });
        this.setState({ loading: false });
        return;
      }

      // 5️⃣ Salva no localStorage
      localStorage.setItem("token", token);
      if (id) localStorage.setItem("user_id", id);
      localStorage.setItem("role", role);

      // 6️⃣ Feedback
      swal({ text: "Login realizado com sucesso!", icon: "success" });

      // 7️⃣ Redireciona
      this.props.history.push("/dashboard");

    } catch (err) {
      swal({
        text:
          err?.response?.data?.errorMessage ||
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
            type="text"
            autoComplete="off"
            name="username"
            value={username}
            onChange={this.onChange}
            placeholder="Usuário"
            margin="dense"
            disabled={loading}
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
            disabled={loading}
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
              Registro
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
