import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import ArticlesPage from "./pages/Articles";
import ArticleDetailPage from "./pages/ArticleDetail";
import AuthPage from "./pages/Auth";
import NotFoundPage from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./store/store";
import "./styles/global.scss";

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticlesPage/>} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

