import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import "./Register.css";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: '',
      loading: false
    };
  }

  onChange = (e) =>
    this.setState({ [e.target.name]: e.target.value });

  register = async () => {
    const { username, password, confirm_password } = this.state;

    if (!username || !password || !confirm_password) {
      swal({ text: "Preencha todos os campos!", icon: "error" });
      return;
    }

    if (password.length < 4) {
      swal({ text: "A senha deve ter pelo menos 4 caracteres!", icon: "error" });
      return;
    }

    if (password !== confirm_password) {
      swal({ text: "As senhas não coincidem!", icon: "error" });
      return;
    }

    this.setState({ loading: true });

    try {
      const res = await axios.post(
        "https://backtestmar.onrender.com/register",
        { username, password },
        { timeout: 25000 } // evita travar caso o Render demore a acordar
      );

      swal({ text: "Registrado com sucesso!", icon: "success" });
      this.props.history.push("/");

    } catch (err) {
      const msg =
        err?.response?.data?.errorMessage ||
        "Erro ao registrar usuário. O servidor pode estar lento.";

      swal({ text: msg, icon: "error" });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { username, password, confirm_password, loading } = this.state;

    return (
      <div className="register-container">
        
        {loading && (
          <div className="overlay-loading">
            <CircularProgress size={50} />
            <p>Conectando ao servidor...</p>
          </div>
        )}

        <div className="register-card">
          <h2>Registro</h2>

          <TextField
            fullWidth
            type="text"
            name="username"
            value={username}
            onChange={this.onChange}
            placeholder="Usuário"
            margin="dense"
            autoComplete="off"
            disabled={loading}
          />

          <TextField
            fullWidth
            type="password"
            name="password"
            value={password}
            onChange={this.onChange}
            placeholder="Senha"
            margin="dense"
            autoComplete="off"
            disabled={loading}
          />

          <TextField
            fullWidth
            type="password"
            name="confirm_password"
            value={confirm_password}
            onChange={this.onChange}
            placeholder="Confirmar senha"
            margin="dense"
            autoComplete="off"
            disabled={loading}
          />

          <div className="register-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={this.register}
              disabled={!username || !password || !confirm_password || loading}
              className="register-btn"
            >
              {loading ? "Registrando..." : "Registrar"}
            </Button>

            <Link href="/" className="register-login-link">
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
