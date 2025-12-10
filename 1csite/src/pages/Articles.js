import React, { useEffect, useReducer, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import { fetchArticles, addArticle } from "../store/thunks/articlesThunks";
import { setSortBy as setArticlesSortBy } from "../store/articlesSlice";
import styles from "./Articles.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const formReducer = (state, action) => {
  switch (action.type) {
    case "NAZNACHIT_TITLE":
      return { ...state, newTitle: action.payload };
    case "NAZNACHIT_TEXT":
      return { ...state, newText: action.payload };
    case "RESET":
      return { newTitle: "", newText: "" };
    default:
      return state;
  }
};

export default function ArticlesPage() {
  const dispatch = useDispatch();
  const articlesState = useSelector((state) => state.articles);
  const { items: articles = [], loading: loadingArticles = false, sortBy = 'date', adding: addingArticle = false } = articlesState || {};

  const [formState, formDispatch] = useReducer(formReducer, {
    newTitle: "",
    newText: "",
  });

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleAddArticle = useCallback((e) => {
    e.preventDefault();
    if (!formState.newTitle.trim() || !formState.newText.trim()) return;
    dispatch(addArticle(formState.newTitle.trim(), formState.newText.trim()));
    formDispatch({ type: "RESET" });
  }, [formState.newTitle, formState.newText, dispatch]);

  const handleSortChange = useCallback((newSortBy) => {
    dispatch(setArticlesSortBy(newSortBy));
  }, [dispatch]);

  const handleTitleChange = useCallback((e) => {
    formDispatch({ type: "NAZNACHIT_TITLE", payload: e.target.value });
  }, []);

  const handleTextChange = useCallback((e) => {
    formDispatch({ type: "NAZNACHIT_TEXT", payload: e.target.value });
  }, []);

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
          <input
            className={cx("inputTitle")}
            placeholder="Заголовок"
            value={formState.newTitle}
            onChange={handleTitleChange}
          />
          <input
            className={cx("inputText")}
            placeholder="Текст карточки"
            value={formState.newText}
            onChange={handleTextChange}
          />
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
            <Link
              key={article.articleId}
              to={`/articles/${article.articleId}`}
              className={cx("cardLink")}
            >
              <ArticleCard article={article} />
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
