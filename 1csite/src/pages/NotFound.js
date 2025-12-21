import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function NotFoundPage() {
  return (
    <div className={cx("container")}>
      <h1 className={cx("code")}>404</h1>
      <h2 className={cx("title")}>Страница не найдена</h2>
      <p className={cx("description")}>
       Извините, но нет...
      </p>
      <Link to="/" className={cx("homeLink")}>
        Вернуться на главную страницу
      </Link>
    </div>
  );
}
