import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, deleteComment, updateComment, likeComment } from "../../store/thunks/commentsThunks";
import { setCommentsSortBy } from "../../store/commentsSlice";
import styles from "./Comments.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const Comments = ({ articleId }) => {
  const dispatch = useDispatch();
  const commentsData = useSelector((state) => state.comments.byArticleId[articleId] || { items: [] });
  const { sortBy, adding } = useSelector((state) => state.comments);
  const items = commentsData.items || [];

  const [newAuthor, setNewAuthor] = useState("");
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleAdd = useCallback((e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;
    dispatch(addComment(articleId, newAuthor.trim(), newText.trim()));
    setNewAuthor("");
    setNewText("");
  }, [newAuthor, newText, articleId, dispatch]);

  const handleDelete = useCallback((id) => {
    dispatch(deleteComment(id, articleId));
  }, [articleId, dispatch]);

  const handleLike = useCallback((id) => {
    dispatch(likeComment(id));
  }, [dispatch]);

  const handleEdit = useCallback((comment) => {
    setEditingId(comment.id);
    setEditingText(comment.text);
  }, []);

  const handleSaveEdit = useCallback((id) => {
    if (!editingText.trim()) return;
    dispatch(updateComment(id, editingText.trim()));
    setEditingId(null);
    setEditingText("");
  }, [editingText, dispatch]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    dispatch(setCommentsSortBy(newSortBy));
  }, [dispatch]);

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

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, []);

  return (
    <div className={cx("root")}>
      <div className={cx("heading")}>Комментарии</div>

      {items.length > 0 && (
        <div className={cx("sortControls")}>
          <button
            className={cx("sortBtn", { active: sortBy === "date" })}
            onClick={() => handleSortChange("date")}
          >
            По дате
          </button>
          <button
            className={cx("sortBtn", { active: sortBy === "likes" })}
            onClick={() => handleSortChange("likes")}
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
