import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import { mockApi } from "./api/mockApi";
import "./App.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    mockApi.fetchArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const addArticle = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    setAdding(true);

    const created = await mockApi.addArticle(newTitle.trim(), newText.trim());
    setArticles(prev => [created, ...prev]);

    setNewTitle("");
    setNewText("");
    setAdding(false);
  };

  const handleAddComment = (id) => {
    setArticles(prev =>
      prev.map(a =>
        a.articleId === id ? { ...a, commentsCount: a.commentsCount + 1 } : a
      )
    );
  };

  const handleDeleteComment = (id) => {
    setArticles(prev =>
      prev.map(a =>
        a.articleId === id
          ? { ...a, commentsCount: Math.max(0, a.commentsCount - 1) }
          : a
      )
    );
  };

  return (
    <div className="container">
      <h1>Компании</h1>

      <form className="add-form" onSubmit={addArticle}>
        <input
          placeholder="Заголовок"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          placeholder="Текст"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />

        <button className="btn" disabled={adding}>
          {adding ? "Добавление..." : "Добавить карточку"}
        </button>
      </form>

      {loading ? (
        <div>Загрузка карточек...</div>
      ) : (
        articles.map(a => (
          <Card
            key={a.articleId}
            article={a}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        ))
      )}
    </div>
  );
}

export default App;
