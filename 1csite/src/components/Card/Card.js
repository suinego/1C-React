import React, { useState } from "react";
import Comments from "../Comments/Comments";
import { mockApi } from "../../api/mockApi";
import styles from "./Card.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const Card = ({ article, onAddComment, onDeleteComment }) => {
  const [likes, setLikes] = useState(article.currentLikes);
  const [liked, setLiked] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState(null);

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

  return (
    <div className={cx("card", { liked: liked })}>
      <h2 className={cx("title")}>{article.title}</h2>
      <p className={cx("text")}>{article.text}</p>

      <div className={cx("meta")}>
        <div className={cx("counts")}>
          <span className={cx("likes")}>❤️ Лайков: {likes}</span>
          <span className={cx("commentsCount")}>💬 Комментариев: {article.commentsCount}</span>
        </div>

        <div className={cx("actions")}>
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
