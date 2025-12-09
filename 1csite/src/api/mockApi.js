
import articlesData from "../data/articles.json";
import commentsData from "../data/comments.json";

let mockArticles = [...articlesData];
let mockComments = [...commentsData];

const FAKE_DELAY = 500;

export const mockApi = {
  fetchArticles() {
    return new Promise((res) =>
      setTimeout(() => res([...mockArticles]), FAKE_DELAY)
    );
  },

  fetchComments(articleId) {
    return new Promise((res) =>
      setTimeout(() =>
        res(mockComments.filter(c => c.articleId === articleId).map(c => ({ ...c }))),
        FAKE_DELAY
      )
    );
  },

  addComment(articleId, author, text) {
    return new Promise((res) => {
      setTimeout(() => {
        const newComment = {
          id: Date.now(),
          articleId,
          author,
          text,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        mockComments = [newComment, ...mockComments];
        res({ ...newComment });
      }, FAKE_DELAY);
    });
  },

  deleteComment(commentId) {
    return new Promise((res) => {
      setTimeout(() => {
        mockComments = mockComments.filter(c => c.id !== commentId);
        res(true);
      }, FAKE_DELAY);
    });
  },

  addArticle(title, text) {
    return new Promise((res) => {
      setTimeout(() => {
        const newArticle = {
          articleId: Date.now(),
          title,
          text,
          currentLikes: 0,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
        };
        mockArticles.unshift(newArticle);
        res({ ...newArticle });
      }, FAKE_DELAY);
    });
  },

  updateComment(commentId, text) {
    return new Promise((res) => {
      setTimeout(() => {
        const comment = mockComments.find(c => c.id === commentId);
        if (comment) {
          comment.text = text;
          res({ ...comment });
        } else {
          res(null);
        }
      }, FAKE_DELAY);
    });
  },

  likeComment(commentId) {
    return new Promise((res) => {
      setTimeout(() => {
        const comment = mockComments.find(c => c.id === commentId);
        if (comment) {
          comment.likes = (comment.likes || 0) + 1;
          res({ ...comment });
        } else {
          res(null);
        }
      }, FAKE_DELAY);
    });
  },

  updateArticle(articleId, title, text) {
    return new Promise((res) => {
      setTimeout(() => {
        const article = mockArticles.find(a => a.articleId === articleId);
        if (article) {
          if (title !== undefined) article.title = title;
          if (text !== undefined) article.text = text;
          res({ ...article });
        } else {
          res(null);
        }
      }, FAKE_DELAY);
    });
  },
};