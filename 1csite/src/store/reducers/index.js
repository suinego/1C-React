import { combineReducers } from 'redux';
import articlesReducer from '../articlesSlice';
import commentsReducer from '../commentsSlice';

const rootReducer = combineReducers({
  articles: articlesReducer,
  comments: commentsReducer,
});

export default rootReducer;

