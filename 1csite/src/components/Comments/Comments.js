import React, { useState } from "react";
import { mockApi } from "../../api/mockApi";
import styles from "./Comments.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const Comments = ({ articleId, comments: initial = [], onAdd, onDelete }) => {
  const [items, setItems] = useState(initial);
  const [newAuthor, setNewAuthor] = useState("");
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;
    setAdding(true);
    const created = await mockApi.addComment(articleId, newAuthor.trim(), newText.trim()); // +1 балл
    setItems((prev) => [created, ...prev]);
    setNewAuthor("");
    setNewText("");
    setAdding(false);
    onAdd(created);
  };

  const handleDelete = async (id) => {
    await mockApi.deleteComment(id); // +1 балл (удаление)
    setItems((prev) => prev.filter((c) => c.id !== id));
    onDelete(id);
  };

  return (
    <div className={cx("root")}>
      <div className={cx("heading")}>Комментарии</div>

      {items.length === 0 && <div className={cx("empty")}>Пока нет комментариев</div>}

      <ul className={cx("list")}>
        {items.map((c) => (
          <li key={c.id} className={cx("item")}>
            <div className={cx("body")}>
              <div className={cx("author")}>{c.author}</div>
              <div className={cx("text")}>{c.text}</div>
            </div>
            <div className={cx("controls")}>
              <button className={cx("deleteBtn")} onClick={() => handleDelete(c.id)}>Удалить</button>
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
