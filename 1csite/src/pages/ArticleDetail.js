import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Comments from "../components/Comments/Comments";
import { updateArticle, fetchArticles } from "../store/thunks/articlesThunks";
import { fetchComments } from "../store/thunks/commentsThunks";
import styles from "./ArticleDetail.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const numArticleId = parseInt(articleId);
  const articles = useSelector((state) => state.articles.items || []);
  const commentsData = useSelector(
    (state) => state.comments.byArticleId[numArticleId] || { items: [], loading: false }
  );

  const article = articles.find((a) => a.articleId === numArticleId);

  const [likes, setLikes] = useState(article?.currentLikes || 0);
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(article?.title || "");
  const [editingText, setEditingText] = useState(article?.text || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (articles.length === 0) {
      dispatch(fetchArticles());
    }
  }, [dispatch, articles.length]);

  useEffect(() => {
    if (article) {
      setEditingTitle(article.title);
      setEditingText(article.text);
      setLikes(article.currentLikes);
    }
  }, [article]);

  const toggleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const openComments = () => {
    if (!commentsData.items || commentsData.items.length === 0) {
      dispatch(fetchComments(numArticleId));
    }
    setCommentsOpen(true);
  };

  const closeComments = () => setCommentsOpen(false);

  const handleStartEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTitle.trim() || !editingText.trim()) return;
    setSaving(true);

    await dispatch(
      updateArticle(numArticleId, editingTitle.trim(), editingText.trim())
    );
    setEditing(false);
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditingTitle(article?.title || "");
    setEditingText(article?.text || "");
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

  if (!article) {
    return (
      <div className={cx("notFound")}>
        <h1>Статья не найдена</h1>
        <p>Статья с ID {articleId} не существует.</p>
        <Link to="/articles" className={cx("backLink")}>
          ← Вернуться к списку статей
        </Link>
      </div>
    );
  }

  return (
    <div className={cx("container")}>
      <Link to="/articles" className={cx("backLink")}>
        ← Вернуться к списку статей
      </Link>

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
              rows={8}
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
            <h1 className={cx("title")}>{article.title}</h1>
            <p className={cx("text")}>{article.text}</p>
            <div className={cx("date")}>
              Создано:{" "}
              {article.createdAt ? formatDate(article.createdAt) : "Дата не указана"}
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
              <button onClick={closeComments} className={cx("btn")}>
                Скрыть комментарии
              </button>
            ) : (
              <button onClick={openComments} className={cx("btn")}>
                Открыть комментарии
              </button>
            )}
          </div>
        </div>

        {commentsOpen && (
          <div className={cx("commentsWrap")}>
            {commentsData.loading ? (
              <div className={cx("loading")}>Загрузка комментариев...</div>
            ) : (
              <Comments articleId={numArticleId} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
