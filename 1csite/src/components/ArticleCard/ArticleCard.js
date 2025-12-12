import React, { useState, useCallback } from "react";
import styles from "./ArticleCard.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ArticleCard = ({ article }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(article.currentLikes);

  const toggleLike = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setLikes((prevLikes) => liked ? prevLikes - 1 : prevLikes + 1);
    setLiked((prevLiked) => !prevLiked);
  }, [liked]);

  const truncateText = useCallback((text, maxLength = 100) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }, []);

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
    <div className={cx("card", { liked: liked })}>
      <h2 className={cx("title")}>{article.title}</h2>
      <p className={cx("text")}>{truncateText(article.text)}</p>
      <div className={cx("date")}>
        Создано: {article.createdAt ? formatDate(article.createdAt) : "Дата не указана"}
      </div>

      <div className={cx("meta")}>
        <div className={cx("counts")}>
          <span className={cx("likes")}>❤️ {likes}</span>
          <span className={cx("commentsCount")}>💬 {article.commentsCount}</span>
        </div>

        <button onClick={toggleLike} className={cx("btn", { primary: liked })}>
          {liked ? "Убрать лайк" : "Лайк"}
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
