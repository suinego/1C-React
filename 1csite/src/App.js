import React from "react";
import data from "./assets/mock_data.json";
import Card from "./components/Card";

function App() {
  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", textAlign: "center" }}>
      <h1>Компании</h1>
      {data.map((article, index) => (
        <Card key={index} article={article} />
      ))}
    </div>
  );
}

export default App;
