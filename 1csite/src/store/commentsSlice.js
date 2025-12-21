import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byArticleId: {},
  sortBy: 'date',
  adding: false,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    startLoadingComments(state, action) {
      const articleId = action.payload;
      const current = state.byArticleId[articleId] || {};
      state.byArticleId[articleId] = {
        ...current,
        loading: true,
        error: null,
      };
    },
    setComments(state, action) {
      const { articleId, comments } = action.payload;
      state.byArticleId[articleId] = {
        items: comments,
        loading: false,
        error: null,
      };
    },
    setCommentsError(state, action) {
      const { articleId, error } = action.payload;
      const current = state.byArticleId[articleId] || {};
      state.byArticleId[articleId] = {
        ...current,
        loading: false,
        error,
      };
    },
    startAddingComment(state) {
      state.adding = true;
    },
    addCommentLocal(state, action) {
      const comment = action.payload;
      const articleId = comment.articleId;
      const current = state.byArticleId[articleId] || { items: [] };
      state.byArticleId[articleId] = {
        ...current,
        items: [comment, ...(current.items || [])],
        loading: false,
        error: null,
      };
      state.adding = false;
    },
    removeCommentLocal(state, action) {
      const { commentId, articleId } = action.payload;
      const current = state.byArticleId[articleId] || { items: [] };
      state.byArticleId[articleId] = {
        ...current,
        items: (current.items || []).filter((c) => c.id !== commentId),
      };
    },
    updateCommentLocal(state, action) {
      const comment = action.payload;
      const articleId = comment.articleId;
      const current = state.byArticleId[articleId] || { items: [] };
      state.byArticleId[articleId] = {
        ...current,
        items: (current.items || []).map((c) => (c.id === comment.id ? comment : c)),
      };
    },
    likeCommentLocal(state, action) {
      const comment = action.payload;
      const articleId = comment.articleId;
      const current = state.byArticleId[articleId] || { items: [] };
      state.byArticleId[articleId] = {
        ...current,
        items: (current.items || []).map((c) => (c.id === comment.id ? comment : c)),
      };
    },
    setCommentsSortBy(state, action) {
      state.sortBy = action.payload;
    },
  },
});

export const {
  startLoadingComments,
  setComments,
  setCommentsError,
  startAddingComment,
  addCommentLocal,
  removeCommentLocal,
  updateCommentLocal,
  likeCommentLocal,
  setCommentsSortBy,
} = commentsSlice.actions;

export default commentsSlice.reducer;

