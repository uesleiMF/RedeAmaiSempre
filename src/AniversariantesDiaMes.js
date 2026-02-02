import { useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://backtestmar.onrender.com";

export default function AniversariantesDiaMes({ token, onLoad }) {

  // Extrai dia e mês de uma data de forma segura
  const getDayMonth = useCallback((birthDate) => {
    if (!birthDate) return null;
    const dateStr = typeof birthDate === "string" ? birthDate.split("T")[0] : null;
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null;
    return { day, month };
  }, []);

  // Verifica aniversário hoje (considerando UTC)
  const isBirthdayToday = useCallback((birthDate) => {
    const dm = getDayMonth(birthDate);
    if (!dm) return false;
    const today = new Date();
    return today.getUTCDate() === dm.day && today.getUTCMonth() + 1 === dm.month;
  }, [getDayMonth]);

  // Verifica aniversário neste mês (exceto hoje)
  const isBirthdayThisMonth = useCallback((birthDate) => {
    const dm = getDayMonth(birthDate);
    if (!dm) return false;
    const today = new Date();
    return today.getUTCMonth() + 1 === dm.month && !isBirthdayToday(birthDate);
  }, [getDayMonth, isBirthdayToday]);

  // Notificação segura (desktop ou celular)
  const notifyBirthday = useCallback((nome) => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      new Notification("Aniversariante do Dia 🎉", { body: nome });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") new Notification("Aniversariante do Dia 🎉", { body: nome });
      });
    }
  }, []);

  // Notifica apenas uma vez por dia
  const sendNotificationsOncePerDay = useCallback((dia) => {
    const todayKey = `birthday_notified_${new Date().toISOString().slice(0, 10)}`;
    if (localStorage.getItem(todayKey)) return;
    dia.forEach((a) => notifyBirthday(a.name || "Alguém"));
    localStorage.setItem(todayKey, "true");
  }, [notifyBirthday]);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get-casal-simple`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const todos = res.data?.casal || [];
        const dia = todos.filter((item) => isBirthdayToday(item.birthDate));
        const mes = todos.filter((item) => isBirthdayThisMonth(item.birthDate));

        if (dia.length > 0) sendNotificationsOncePerDay(dia);
        if (onLoad) onLoad({ dia, mes });
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Erro ao buscar aniversariantes:", err);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [token, onLoad, isBirthdayToday, isBirthdayThisMonth, sendNotificationsOncePerDay]);

  // Invisível no DOM
  return null;
}
