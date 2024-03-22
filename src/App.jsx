import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [disponivel, setDisponivel] = useState(true);

  async function create_produto() {

    console.log(nome, descricao, valor, disponivel);

    const response = await invoke("create_produto", { nome, descricao, valor, disponivel });
    console.log(response);

  };

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          create_produto();
        }}
      >
        <input
          id="nome-input"
          onChange={(e) => setNome(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <input
          id="descricao-input"
          onChange={(e) => setDescricao(e.currentTarget.value)}
          placeholder="Enter a description..."
        />
        <input
          id="valor-input"
          type="number"
          onChange={(e) => setValor(e.currentTarget.value)}
          placeholder="Enter a value..."
        />
        <input
          id="disponivel-input"
          type="checkbox"
          checked={disponivel}
          onChange={(e) => setDisponivel(e.currentTarget.checked)}
        />
        <button type="submit">Create Produto</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
