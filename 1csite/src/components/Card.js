import React, { useState } from "react";

const Card = ({ article }) => {
  const [likes, setLikes] = useState(article.currentLikes);
  const [liked, setLiked] = useState(false);

  const likeHandler = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  return (
    <div
      style={{
        backgroundColor: liked ? "#f0f2fd" : "#fff",
        border: liked ? "1px solid #6762e8" : "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "14px",
        transition: "0.2s ease-in-out",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "18px", color: "#161722" }}>
        {article.title}
      </h2>

      <p style={{ margin: "8px 0 12px", fontSize: "14px", color: "#444" }}>
        {article.text}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "14px",
            color: liked ? "#4a3ff0" : "#666",
          }}
        >
          ❤️ Likes: {likes}
        </span>

        <button
          onClick={likeHandler}
          style={{
            backgroundColor: liked ? "#4a3ff0" : "#eee",
            color: liked ? "#fff" : "#222",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          {liked ? "Unlike" : "Like"}
        </button>
      </div>
    </div>
  );
};

export default Card;
