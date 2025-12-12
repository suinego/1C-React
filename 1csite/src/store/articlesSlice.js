import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  sortBy: 'date',
  adding: false,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setArticles(state, action) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    startAdding(state) {
      state.adding = true;
    },
    addArticleLocal(state, action) {
      state.items = [action.payload, ...state.items];
      state.adding = false;
    },
    updateArticleLocal(state, action) {
      state.items = state.items.map((article) =>
        article.articleId === action.payload.articleId ? action.payload : article
      );
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    incComments(state, action) {
      state.items = state.items.map((article) =>
        article.articleId === action.payload
          ? { ...article, commentsCount: article.commentsCount + 1 }
          : article
      );
    },
    decComments(state, action) {
      state.items = state.items.map((article) =>
        article.articleId === action.payload
          ? { ...article, commentsCount: Math.max(0, article.commentsCount - 1) }
          : article
      );
    },
  },
});

export const {
  startLoading,
  setArticles,
  setError,
  startAdding,
  addArticleLocal,
  updateArticleLocal,
  setSortBy,
  incComments,
  decComments,
} = articlesSlice.actions;

export default articlesSlice.reducer;

