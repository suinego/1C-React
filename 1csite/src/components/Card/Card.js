import React, { useState, useEffect } from "react";
import Comments from "../Comments/Comments";
import { mockApi } from "../../api/mockApi";
import styles from "./Card.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const Card = ({ article, onAddComment, onDeleteComment, onUpdate }) => {
  const [likes, setLikes] = useState(article.currentLikes);
  const [liked, setLiked] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState(null);

  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(article.title);
  const [editingText, setEditingText] = useState(article.text);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditingTitle(article.title);
    setEditingText(article.text);
    setLikes(article.currentLikes);
  }, [article]);

  const toggleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const openComments = async () => {
    if (!comments) {
      setLoadingComments(true);
      const fetched = await mockApi.fetchComments(article.articleId);
      setComments(fetched);
      setLoadingComments(false);
    }
    setCommentsOpen(true);
  };

  const closeComments = () => setCommentsOpen(false);

  const handleAddComment = (created) => {
    setComments((prev) => [created, ...(prev || [])]);
    onAddComment(article.articleId);
  };

  const handleDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    onDeleteComment(article.articleId);
  };

  const handleStartEdit = () => {
    setEditing(true);
    setEditingTitle(article.title);
    setEditingText(article.text);
  };

  const handleSaveEdit = async () => {
    if (!editingTitle.trim() || !editingText.trim()) return;
    setSaving(true);
    const updated = await mockApi.updateArticle(article.articleId, editingTitle.trim(), editingText.trim());
    if (updated) {
      setEditing(false);
      onUpdate(updated);
    }
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditingTitle(article.title);
    setEditingText(article.text);
  };

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
    <div className={cx("card", { liked: liked })}>
      {editing ? (
        <div className={cx("editForm")}>
          <input
            className={cx("editTitle")}
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            placeholder="Заголовок"
          />
          <textarea
            className={cx("editText")}
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            placeholder="Текст карточки"
            rows={4}
          />
          <div className={cx("editControls")}>
            <button
              className={cx("saveBtn")}
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              className={cx("cancelBtn")}
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className={cx("title")}>{article.title}</h2>
          <p className={cx("text")}>{article.text}</p>
          <div className={cx("date")}>
            Создано: {article.createdAt ? formatDate(article.createdAt) : "Дата не указана"}
          </div>
        </>
      )}

      <div className={cx("meta")}>
        <div className={cx("counts")}>
          <span className={cx("likes")}>❤️ Лайков: {likes}</span>
          <span className={cx("commentsCount")}>💬 Комментариев: {article.commentsCount}</span>
        </div>

        <div className={cx("actions")}>
          {!editing && (
            <button onClick={handleStartEdit} className={cx("btn", "editBtn")}>
              Изменить
            </button>
          )}
          <button onClick={toggleLike} className={cx("btn", { primary: liked })}>
            {liked ? "Убрать лайк" : "Лайк"}
          </button>

          {commentsOpen ? (
            <button onClick={closeComments} className={cx("btn")}>Скрыть комментарии</button>
          ) : (
            <button onClick={openComments} className={cx("btn")}>Открыть комментарии</button>
          )}
        </div>
      </div>

      {commentsOpen && (
        <div className={cx("commentsWrap")}>
          {loadingComments ? (
            <div className={cx("loading")}>Загрузка комментариев...</div>
          ) : (
            <Comments
              articleId={article.articleId}
              comments={comments || []}
              onAdd={(created) => handleAddComment(created)}
              onDelete={(id) => handleDelete(id)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
