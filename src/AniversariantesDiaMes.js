import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://backtestmar.onrender.com";

export default function AniversariantesDiaMes({ token, onLoad }) {
  const [aniversariantesDia, setAniversariantesDia] = useState([]);
  const [aniversariantesMes, setAniversariantesMes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extrai dia e mês de uma data (string ISO ou yyyy-mm-dd) de forma segura
  const getDayMonth = (birthDate) => {
    if (!birthDate) return null;

    let dateStr;
    if (typeof birthDate === "string") {
      // Se for ISO completa (com T e Z), pega só a parte da data
      dateStr = birthDate.split("T")[0]; // "2025-12-13"
    } else {
      return null;
    }

    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null;

    return { day, month };
  };

  // Verifica aniversário hoje (usa comparação local do navegador)
  const isBirthdayToday = (birthDate) => {
    const dm = getDayMonth(birthDate);
    if (!dm) return false;

    const hoje = new Date();
    return hoje.getDate() === dm.day && hoje.getMonth() + 1 === dm.month;
  };

  // Verifica aniversário neste mês (exceto hoje)
  const isBirthdayThisMonth = (birthDate) => {
    const dm = getDayMonth(birthDate);
    if (!dm) return false;

    const hoje = new Date();
    return hoje.getMonth() + 1 === dm.month;
  };

  // Formata data para exibição em pt-BR (agora 100% segura)
  const formatDateBR = (birthDate) => {
    if (!birthDate) return "-";

    let dateStr = typeof birthDate === "string" ? birthDate.split("T")[0] : "";
    if (!dateStr) return "Data inválida";

    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return "Data inválida";

    return `${day}/${month}/${year}`;
  };

  // Notificação
  const notifyBirthday = (nome) => {
    if (typeof Notification === "undefined") return;

    if (Notification.permission === "granted") {
      new Notification("Aniversariante do Dia 🎉", { body: nome });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification("Aniversariante do Dia 🎉", { body: nome });
        }
      });
    }
  };

  const sendNotificationsOncePerDay = (dia) => {
    const todayKey = `birthday_notified_${new Date().toISOString().slice(0, 10)}`;
    if (localStorage.getItem(todayKey)) return;

    dia.forEach((a) => notifyBirthday(a.name || "Alguém"));
    localStorage.setItem(todayKey, "true");
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Token não fornecido");
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/get-casal-simple`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const todos = res.data?.casal || [];

        const dia = todos.filter((item) => isBirthdayToday(item.birthDate));
        const mes = todos.filter(
          (item) => isBirthdayThisMonth(item.birthDate) && !isBirthdayToday(item.birthDate)
        );

        setAniversariantesDia(dia);
        setAniversariantesMes(mes);

        if (dia.length > 0) sendNotificationsOncePerDay(dia);
        if (onLoad) onLoad({ dia, mes });
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Requisição cancelada");
          return;
        }
        console.error("Erro:", err);
        setError("Erro na conexão");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [token, onLoad]);

  // Componente invisível
  if (loading || error) return null;

  return <div style={{ display: "none" }}></div>;
}