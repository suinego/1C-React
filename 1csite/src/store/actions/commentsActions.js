export const Begin_comments = 'Begin_comments';
export const Comments_success = 'Comments_success';
export const Comments_fail = 'Comments_fail';
export const Comments_add = 'Comments_add';
export const Comments_add_success = 'Comments_add_success';
export const Comments_delete = 'Comments_delete';
export const Begin_del_comments = 'Begin_del_comments';
export const Update_comments_succ = 'Update_comments_succ';
export const Like_comment_succ = 'Like_comment_succ';
export const Sort_comm = 'Sort_comm';

export const fetchCommentsStart = (articleId) => ({
  type: Begin_comments,
  payload: articleId,
});

export const fetchCommentsSuccess = (articleId, comments) => ({
  type: Comments_success,
  payload: { articleId, comments },
});

export const fetchCommentsFailure = (articleId, error) => ({
  type: Comments_fail,
  payload: { articleId, error },
});

export const addCommentStart = () => ({
  type: Comments_add,
});

export const addCommentSuccess = (comment) => ({
  type: Comments_add_success,
  payload: comment,
});

export const deleteCommentStart = () => ({
  type: Begin_del_comments,
});

export const deleteCommentSuccess = (commentId, articleId) => ({
  type: Comments_delete,
  payload: { commentId, articleId },
});

export const updateCommentSuccess = (comment) => ({
  type: Update_comments_succ,
  payload: comment,
});

export const likeCommentSuccess = (comment) => ({
  type: Like_comment_succ,
  payload: comment,
});

export const setCommentsSortBy = (sortBy) => ({
  type: Sort_comm,
  payload: sortBy,
});

