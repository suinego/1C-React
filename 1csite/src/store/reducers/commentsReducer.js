import {
  Begin_comments,
  Comments_success,
  Comments_fail,
  Comments_add,
  Comments_add_success,
  Begin_del_comments,
  Comments_delete,
  Update_comments_succ,
  Like_comment_succ,
  Sort_comm,
} from '../actions/commentsActions';

const initialState = {
  byArticleId: {},
  sortBy: 'date',
  adding: false,
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Begin_comments: {
      const { articleId } = action.payload;
      return {
        ...state,
        byArticleId: {
          ...state.byArticleId,
          [articleId]: {
            ...state.byArticleId[articleId],
            loading: true,
            error: null,
          },
        },
      };
    }

    case Comments_success: {
      const { articleId, comments } = action.payload;
      return {
        ...state,
        byArticleId: {
          ...state.byArticleId,
          [articleId]: {
            items: comments,
            loading: false,
            error: null,
          },
        },
      };
    }

    case Comments_fail: {
      const { articleId, error } = action.payload;
      return {
        ...state,
        byArticleId: {
          ...state.byArticleId,
          [articleId]: {
            ...state.byArticleId[articleId],
            loading: false,
            error,
          },
        },
      };
    }

    case Comments_add:
      return {
        ...state,
        adding: true,
      };

    case Comments_add_success: {
      const { articleId } = action.payload;
      const articleComments = state.byArticleId[articleId] || { items: [] };
      return {
        ...state,
        byArticleId: {
          ...state.byArticleId,
          [articleId]: {
            ...articleComments,
            items: [action.payload, ...articleComments.items],
          },
        },
        adding: false,
      };
    }

    case Begin_del_comments:
      return {
        ...state,
      };

    case Comments_delete: {
      const { commentId, articleId } = action.payload;
      const articleComments = state.byArticleId[articleId] || { items: [] };
      return {
        ...state,
        byArticleId: {
          ...state.byArticleId,
          [articleId]: {
            ...articleComments,
            items: articleComments.items.filter((c) => c.id !== commentId),
          },
        },
      };
    }

    case Update_comments_succ: {
      const { articleId } = action.payload;
      const articleComments = state.byArticleId[articleId] || { items: [] };
      return {
        ...state,
        byArticleId: {
          ...state.byArticleId,
          [articleId]: {
            ...articleComments,
            items: articleComments.items.map((c) =>
              c.id === action.payload.id ? action.payload : c
            ),
          },
        },
      };
    }

    case Like_comment_succ: {
      const { articleId } = action.payload;
      const articleComments = state.byArticleId[articleId] || { items: [] };
      return {
        ...state,
        byArticleId: {
          ...state.byArticleId,
          [articleId]: {
            ...articleComments,
            items: articleComments.items.map((c) =>
              c.id === action.payload.id ? action.payload : c
            ),
          },
        },
      };
    }

    case Sort_comm:
      return {
        ...state,
        sortBy: action.payload,
      };

    default:
      return state;
  }
};

export default commentsReducer;

