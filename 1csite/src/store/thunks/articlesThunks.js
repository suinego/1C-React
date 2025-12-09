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
      dispatch(setError(error.message));
    }
  };
};

export const addArticle = (title, text) => {
  return async (dispatch) => {
    dispatch(startAdding());
    const article = await mockApi.addArticle(title, text);
    dispatch(addArticleLocal(article));
  };
};

export const updateArticle = (articleId, title, text) => {
  return async (dispatch) => {
    const article = await mockApi.updateArticle(articleId, title, text);
    if (article) {
      dispatch(updateArticleLocal(article));
      return article;
    }
  };
};

