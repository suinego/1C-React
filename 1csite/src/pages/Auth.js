import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import styles from "./Articles.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        await authApi.login(username.trim(), password);
        navigate("/articles");
      } catch (err) {
        setError(err.message || "Ошибка авторизации");
      } finally {
        setLoading(false);
      }
    },
    [username, password, navigate]
  );

  return (
    <div className={cx("container")}>
      <h1 className={cx("title")}>Вход</h1>
      <form onSubmit={submit} className={cx("addForm")}> 
        <input
          placeholder="Логин"
          className={cx("inputTitle")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Пароль"
          className={cx("inputText")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div style={{ color: "#ff4444", marginBottom: 10 }}>{error}</div>}
        <button className={cx("btn")} type="submit" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
