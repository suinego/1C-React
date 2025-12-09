import React, { useEffect, useState } from "react";
import Card from "./components/Card/Card";
import { mockApi } from "./api/mockApi";

import styles from "./App.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    let mounted = true;
    mockApi.fetchArticles().then((data) => {
      if (!mounted) return;
      setArticles(data);
      setLoadingArticles(false);
    });
    return () => (mounted = false);
  }, []);

  const handleAddComment = (articleId) => {
    setArticles((prev) => prev.map((a) => (a.articleId === articleId ? { ...a, commentsCount: a.commentsCount + 1 } : a)));
  };

  const handleDeleteComment = (articleId) => {
    setArticles((prev) => prev.map((a) => (a.articleId === articleId ? { ...a, commentsCount: Math.max(0, a.commentsCount - 1) } : a)));
  };

  const [addingArticle, setAddingArticle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;
    setAddingArticle(true);
    const created = await mockApi.addArticle(newTitle.trim(), newText.trim());
    setArticles((prev) => [created, ...prev]);
    setNewTitle("");
    setNewText("");
    setAddingArticle(false);
  };

  return (
    <div className={cx("container")}>
      <h1 className={cx("title")}>Компании</h1>

      <section className={cx("addForm")}>
        <h3>Добавить карточку</h3>
        <form onSubmit={handleAddArticle} className={cx("formRow")}>
          <input className={cx("inputTitle")} placeholder="Заголовок" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <input className={cx("inputText")} placeholder="Текст карточки" value={newText} onChange={(e) => setNewText(e.target.value)} />
          <button className={cx("btn")} type="submit" disabled={addingArticle}>
            {addingArticle ? "Добавление..." : "Добавить карточку"}
          </button>
        </form>
      </section>

      <section className={cx("list")}>
        {loadingArticles ? (
          <div className={cx("loading")}>Загрузка карточек...</div>
        ) : (
          articles.map((article) => (
            <Card
              key={article.articleId}
              article={article}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ))
        )}
      </section>
    </div>
  );
}
