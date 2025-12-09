import React, { useState, useEffect } from "react";
import { mockApi } from "../../api/mockApi";
import styles from "./Comments.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const Comments = ({ articleId, comments: initial = [], onAdd, onDelete }) => {
  const [items, setItems] = useState(initial);
  const [newAuthor, setNewAuthor] = useState("");
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;
    setAdding(true);
    const created = await mockApi.addComment(articleId, newAuthor.trim(), newText.trim());
    setItems((prev) => [created, ...prev]);
    setNewAuthor("");
    setNewText("");
    setAdding(false);
    onAdd(created);
  };

  const handleDelete = async (id) => {
    await mockApi.deleteComment(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
    onDelete(id);
  };

  const handleLike = async (id) => {
    const updated = await mockApi.likeComment(id);
    if (updated) {
      setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) return;
    const updated = await mockApi.updateComment(id, editingText.trim());
    if (updated) {
      setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    } else if (sortBy === "likes") {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className={cx("root")}>
      <div className={cx("heading")}>Комментарии</div>

      {items.length > 0 && (
        <div className={cx("sortControls")}>
          <button
            className={cx("sortBtn", { active: sortBy === "date" })}
            onClick={() => setSortBy("date")}
          >
            По дате
          </button>
          <button
            className={cx("sortBtn", { active: sortBy === "likes" })}
            onClick={() => setSortBy("likes")}
          >
            По лайкам
          </button>
        </div>
      )}

      {items.length === 0 && <div className={cx("empty")}>Пока нет комментариев</div>}

      <ul className={cx("list")}>
        {sortedItems.map((c) => (
          <li key={c.id} className={cx("item")}>
            <div className={cx("body")}>
              <div className={cx("author")}>{c.author}</div>
              <div className={cx("date")}>
                {c.createdAt ? formatDate(c.createdAt) : "Дата не указана"}
              </div>
              {editingId === c.id ? (
                <div className={cx("editForm")}>
                  <input
                    className={cx("editInput")}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(c.id);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <div className={cx("editControls")}>
                    <button
                      className={cx("saveBtn")}
                      onClick={() => handleSaveEdit(c.id)}
                    >
                      Сохранить
                    </button>
                    <button
                      className={cx("cancelBtn")}
                      onClick={handleCancelEdit}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className={cx("text")}>{c.text}</div>
              )}
              <div className={cx("likes")}>
                <button
                  className={cx("likeBtn")}
                  onClick={() => handleLike(c.id)}
                >
                  ❤️ {c.likes || 0}
                </button>
              </div>
            </div>
            <div className={cx("controls")}>
              {editingId !== c.id && (
                <button
                  className={cx("editBtn")}
                  onClick={() => handleEdit(c)}
                >
                  Изменить
                </button>
              )}
              <button className={cx("deleteBtn")} onClick={() => handleDelete(c.id)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className={cx("form")}>
        <div className={cx("row")}>
          <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Ваше имя" className={cx("input", "author")} />
          <input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Текст комментария" className={cx("input", "textInput")} />
        </div>
        <div className={cx("row", "bottom")}>
          <button className={cx("btn")} type="submit" disabled={adding}>
            {adding ? "Добавление..." : "Добавить комментарий"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Comments;
