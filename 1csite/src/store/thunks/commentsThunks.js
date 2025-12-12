import { mockApi } from '../../api/mockApi';
import {
  startLoadingComments,
  setComments,
  setCommentsError,
  startAddingComment,
  addCommentLocal,
  removeCommentLocal,
  updateCommentLocal,
  likeCommentLocal,
} from '../commentsSlice';
import { incComments, decComments } from '../articlesSlice';

export const fetchComments = (articleId) => {
  return async (dispatch) => {
    dispatch(startLoadingComments(articleId));
    try {
      const comments = await mockApi.fetchComments(articleId);
      dispatch(setComments({ articleId, comments }));
      console.info(`[${new Date().toISOString()}] Загружен ${comments.length} коменты ${articleId}`);
    } catch (error) {
      const errorMsg = `Failed to fetch comments for article ${articleId}: ${error.message}`;
      console.error(`[${new Date().toISOString()}] ошибка ${errorMsg}`);
      dispatch(setCommentsError({ articleId, error: error.message }));
    }
  };
};

export const addComment = (articleId, author, text) => {
  return async (dispatch) => {
    dispatch(startAddingComment());
    try {
      const comment = await mockApi.addComment(articleId, author, text);
      dispatch(addCommentLocal(comment));
      dispatch(incComments(articleId));
      console.info(`[${new Date().toISOString()}] добавил коментарий ${author} для сттатииьи ${articleId}`);
    } catch (error) {
      const errorMsg = `не прокоментировано: ${error.message}`;
      console.error(`[${new Date().toISOString()}]  ${errorMsg}`);
    }
  };
};

export const deleteComment = (commentId, articleId) => {
  return async (dispatch) => {
    dispatch(startLoadingComments(articleId));
    try {
      await mockApi.deleteComment(commentId);
      dispatch(removeCommentLocal({ commentId, articleId }));
      dispatch(decComments(articleId));
      console.info(`[${new Date().toISOString()}] удален комментарий ${commentId}`);
    } catch (error) {
      const errorMsg = `ошибка удаления коментария ${commentId}: ${error.message}`;
      console.error(`[${new Date().toISOString()}] ${errorMsg}`);
    }
  };
};

export const updateComment = (commentId, text) => {
  return async (dispatch) => {
    try {
      const comment = await mockApi.updateComment(commentId, text);
      if (comment) {
        dispatch(updateCommentLocal(comment));
        console.info(`[${new Date().toISOString()}] комментарий обновлен ${commentId}`);
      }
    } catch (error) {
      const errorMsg = `Failed to update comment ${commentId}: ${error.message}`;
      console.error(`[${new Date().toISOString()}] ${errorMsg}`);
    }
  };
};

export const likeComment = (commentId) => {
  return async (dispatch) => {
    try {
      const comment = await mockApi.likeComment(commentId);
      if (comment) {
        dispatch(likeCommentLocal(comment));
        console.info(`[${new Date().toISOString()}]лайк на комментарий ${commentId}`);
      }
    } catch (error) {
      const errorMsg = `Failed to like comment ${commentId}: ${error.message}`;
      console.error(`[${new Date().toISOString()}] ${errorMsg}`);
    }
  };
};
