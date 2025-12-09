import React, { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";

const Comments = ({ articleId, onAddComment, onDeleteComment }) => {
  const [comments, setComments] = useState(null); 
  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    mockApi.fetchComments(articleId).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [articleId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setSending(true);

    const created = await mockApi.addComment(articleId, author.trim(), text.trim());
    setComments(prev => [created, ...prev]);
    onAddComment(articleId);

    setAuthor("");
    setText("");
    setSending(false);
  };

  const handleDelete = async (id) => {
    await mockApi.deleteComment(id);
    setComments(prev => prev.filter(c => c.id !== id));
    onDeleteComment(articleId);
  };

  if (loading) return <div>Загрузка комментариев...</div>;

  return (
    <div className="comments-box">
      <h4>Комментарии</h4>

      {comments.length === 0 && <p>Пока нет комментариев</p>}

      <ul className="comments-list">
        {comments.map(c => (
          <li key={c.id} className="comment-item">
            <div>
              <strong>{c.author}</strong>
              <p>{c.text}</p>
            </div>

            <button className="btn-delete" onClick={() => handleDelete(c.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="comment-form">
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Ваше имя"
        />
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Текст комментария"
        />

        <button className="btn" disabled={sending}>
          {sending ? "Добавление..." : "Добавить"}
        </button>
      </form>
    </div>
  );
};

export default Comments;
