import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./components/Card/Card";
import { fetchArticles, addArticle } from "./store/thunks/articlesThunks";
import { setSortBy as setArticlesSortBy } from "./store/articlesSlice";

import styles from "./App.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function App() {
  const dispatch = useDispatch();
  const articlesState = useSelector((state) => state.articles);
  const { items: articles = [], loading: loadingArticles = false, sortBy = 'date', adding: addingArticle = false } = articlesState || {};

  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;
    dispatch(addArticle(newTitle.trim(), newText.trim()));
    setNewTitle("");
    setNewText("");
  };

  const handleSortChange = (newSortBy) => {
    dispatch(setArticlesSortBy(newSortBy));
  };

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    } else if (sortBy === "likes") {
      return (b.currentLikes || 0) - (a.currentLikes || 0);
    }
    return 0;
  });

  return (
    <div className={cx("container")}>
      <h1 className={cx("title")}>Компании</h1>

      <section className={cx("addForm")}>
        <h3>Добавить карточку</h3>
        <form onSubmit={handleAddArticle} className={cx("formRow")}>
          <input className={cx("inputTitle")} placeholder="Заголовок" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <input className={cx("inputText")} placeholder="Текст карточки" value={newText} onChange={(e) => setNewText(e.target.value)} />
          <button className={cx("btn")} type="submit" disabled={addingArticle}>
            {addingArticle ? "Добавление..." : "Добавить карточку"}
          </button>
        </form>
      </section>

      {!loadingArticles && articles.length > 0 && (
        <section className={cx("sortSection")}>
          <h3>Сортировка карточек</h3>
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
        </section>
      )}

      <section className={cx("list")}>
        {loadingArticles ? (
          <div className={cx("loading")}>Загрузка карточек...</div>
        ) : (
          sortedArticles.map((article) => (
            <Card
              key={article.articleId}
              article={article}
            />
          ))
        )}
      </section>
    </div>
  );
}
