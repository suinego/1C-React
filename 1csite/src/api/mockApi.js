
import articlesData from "../data/articles.json";
import commentsData from "../data/comments.json";

let mockArticles = [...articlesData];
let mockComments = [...commentsData];

const FAKE_DELAY = 500;
const ERROR_PROBABILITY = 0.05;

const withErrorHandling = (promise, requestName) => {
  return new Promise((res, rej) => {
    if (Math.random() < ERROR_PROBABILITY) {
      const timestamp = new Date().toISOString();
      const errorMsg = `Request failed: ${requestName}`;
      console.warn(`[${timestamp}] рандомная ошибка в ${requestName}:`, errorMsg);
      rej(new Error(errorMsg));
    } else {
      promise.then(res).catch((error) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ошибка ${requestName}:`, error.message);
        rej(error);
      });
    }
  });
};

export const mockApi = {
  fetchArticles() {
    return withErrorHandling(
      new Promise((res) =>
        setTimeout(() => res([...mockArticles]), FAKE_DELAY)
      ),
      "fetchArticles"
    );
  },

  fetchComments(articleId) {
    return withErrorHandling(
      new Promise((res) =>
        setTimeout(() =>
          res(mockComments.filter(c => c.articleId === articleId).map(c => ({ ...c }))),
          FAKE_DELAY
        )
      ),
      `fetchComments(articleId=${articleId})`
    );
  },

  addComment(articleId, author, text) {
    return withErrorHandling(
      new Promise((res) => {
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
      }),
      `addComment(articleId=${articleId})`
    );
  },

  deleteComment(commentId) {
    return withErrorHandling(
      new Promise((res) => {
        setTimeout(() => {
          mockComments = mockComments.filter(c => c.id !== commentId);
          res(true);
        }, FAKE_DELAY);
      }),
      `deleteComment(commentId=${commentId})`
    );
  },

  addArticle(title, text, author) {
    return withErrorHandling(
      new Promise((res) => {
        setTimeout(() => {
          const newArticle = {
            articleId: Date.now(),
            title,
            author: author || "Аноним",
            text,
            currentLikes: 0,
            commentsCount: 0,
            createdAt: new Date().toISOString(),
          };
          mockArticles.unshift(newArticle);
          res({ ...newArticle });
        }, FAKE_DELAY);
      }),
      "addArticle"
    );
  },

  updateComment(commentId, text) {
    return withErrorHandling(
      new Promise((res) => {
        setTimeout(() => {
          const comment = mockComments.find(c => c.id === commentId);
          if (comment) {
            comment.text = text;
            res({ ...comment });
          } else {
            res(null);
          }
        }, FAKE_DELAY);
      }),
      `updateComment(commentId=${commentId})`
    );
  },

  likeComment(commentId) {
    return withErrorHandling(
      new Promise((res) => {
        setTimeout(() => {
          const comment = mockComments.find(c => c.id === commentId);
          if (comment) {
            comment.likes = (comment.likes || 0) + 1;
            res({ ...comment });
          } else {
            res(null);
          }
        }, FAKE_DELAY);
      }),
      `likeComment(commentId=${commentId})`
    );
  },

  updateArticle(articleId, title, text) {
    return withErrorHandling(
      new Promise((res) => {
        setTimeout(() => {
          const articleIndex = mockArticles.findIndex(a => a.articleId === articleId);
          if (articleIndex !== -1) {
            const updatedArticle = {
              ...mockArticles[articleIndex],
              title: title !== undefined ? title : mockArticles[articleIndex].title,
              text: text !== undefined ? text : mockArticles[articleIndex].text,
            };
            mockArticles[articleIndex] = updatedArticle;
            res(updatedArticle);
          } else {
            res(null);
          }
        }, FAKE_DELAY);
      }),
      `updateArticle(articleId=${articleId})`
    );
  },
};
