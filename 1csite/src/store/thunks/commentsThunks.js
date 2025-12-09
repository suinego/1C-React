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
    } catch (error) {
      dispatch(setCommentsError({ articleId, error: error.message }));
    }
  };
};
export const addComment = (articleId, author, text) => {
  return async (dispatch) => {
    dispatch(startAddingComment());
    const comment = await mockApi.addComment(articleId, author, text);
    dispatch(addCommentLocal(comment));
    dispatch(incComments(articleId));
  };
};

export const deleteComment = (commentId, articleId) => {
  return async (dispatch) => {
    dispatch(startLoadingComments(articleId));
    await mockApi.deleteComment(commentId);
    dispatch(removeCommentLocal({ commentId, articleId }));
    dispatch(decComments(articleId));
  };
};

export const updateComment = (commentId, text) => {
  return async (dispatch) => {
    const comment = await mockApi.updateComment(commentId, text);
    if (comment) {
      dispatch(updateCommentLocal(comment));
    }
  };
};

export const likeComment = (commentId) => {
  return async (dispatch) => {
    const comment = await mockApi.likeComment(commentId);
    if (comment) {
      dispatch(likeCommentLocal(comment));
    }
  };
};
