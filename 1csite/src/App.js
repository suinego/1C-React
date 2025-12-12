import React from "react";
import styles from "./App.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
export default function App() {
  return (
    <div className={cx("app")}>
    </div>
  );
}
