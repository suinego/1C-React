import { mockApi } from '../../api/mockApi';
import {
  startLoading,
  setArticles,
  setError,
  startAdding,
  addArticleLocal,
  updateArticleLocal,
} from '../articlesSlice';

export const fetchArticles = () => {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const articles = await mockApi.fetchArticles();
      dispatch(setArticles(articles));
    } catch (error) {
      const errorMsg = `ошибка загрузки статьей: ${error.message}`;
      console.error(`[${new Date().toISOString()}] ${errorMsg}`);
      dispatch(setError(error.message));
    }
  };
};

export const addArticle = (title, text) => {
  return async (dispatch) => {
    dispatch(startAdding());
    try {
      const article = await mockApi.addArticle(title, text);
      dispatch(addArticleLocal(article));
      console.info(`[${new Date().toISOString()}] Статья добавлена`);
    } catch (error) {
      const errorMsg = `Не добавили статью: ${error.message}`;
      console.error(`[${new Date().toISOString()}] ${errorMsg}`);
      dispatch(setError(error.message));
    }
  };
};

export const updateArticle = (articleId, title, text) => {
  return async (dispatch) => {
    try {
      const article = await mockApi.updateArticle(articleId, title, text);
      if (article) {
        dispatch(updateArticleLocal(article));
        console.info(`[${new Date().toISOString()}] Статья ${articleId} обновлена`);
        return article;
      }
    } catch (error) {
      const errorMsg = `Failed to update article ${articleId}: ${error.message}`;
      console.error(`[${new Date().toISOString()}] ${errorMsg}`);
      dispatch(setError(error.message));
    }
  };
};

