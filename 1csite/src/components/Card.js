import React, { useState } from "react";
import Comments from "./Comments";

const Card = ({ article, onAddComment, onDeleteComment }) => {
  const [likes, setLikes] = useState(article.currentLikes);
  const [liked, setLiked] = useState(false);

  const [open, setOpen] = useState(false);

  const toggleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  return (
    <div className="card">
      <h2>{article.title}</h2>
      <p>{article.text}</p>

      <div className="card-row">
        <div>
          <span className={liked ? "likes liked" : "likes"}>
            ❤️ Likes: {likes}
          </span>
          <span className="comments-count">
            💬 Комментариев: {article.commentsCount}
          </span>
        </div>

        <button className="btn" onClick={toggleLike}>
          {liked ? "Unlike" : "Like"}
        </button>
      </div>

      {!open ? (
        <button className="btn-comments" onClick={() => setOpen(true)}>
          Открыть комментарии
        </button>
      ) : (
        <>
          <button className="btn-secondary" onClick={() => setOpen(false)}>
            Скрыть комментарии
          </button>

          <Comments
            articleId={article.articleId}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
          />
        </>
      )}
    </div>
  );
};

export default Card;
