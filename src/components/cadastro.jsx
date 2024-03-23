import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./cadastro.css";

function Cadastro(props) {

  const  setShowTabela  = props.setShowTabela;

  const [resultMsg, setResultMsg] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [disponivel, setDisponivel] = useState(true);

  async function create_produto() {

    const response = await invoke("create_produto", { nome: nome, descricao: descricao, valor: valor, disponivel });

    setResultMsg(response);

    setTimeout(() => {
      setShowTabela(true);
      
    }, 3000);

  };

  return (
    <div className="container">
      <h1>Cadastro de Produtos</h1>

      <form
        className="column form"
        onSubmit={(e) => {
          e.preventDefault();
          create_produto();
        }}
      >
        <div className="produto">
          <label htmlFor="nome-input">Nome:</label>
          <input
            id="nome-input"
            onChange={(e) => setNome(e.currentTarget.value)}
          />
        </div>
        <div className="produto">
          <label htmlFor="descricao-input">Descrição:</label>
          <input
            id="descricao-input"
            onChange={(e) => setDescricao(e.currentTarget.value)}
          />
        </div>
        <div className="produto">
          <label htmlFor="valor-input">Valor:</label>
          <input
            id="valor-input"
            type="number"
            onChange={(e) => setValor(e.currentTarget.value)}
          />
        </div>
        <div className="produto">
          <label htmlFor="disponivel-input">Disponível:</label>
          <input
            className="checkbox"
            id="disponivel-input"
            type="checkbox"
            checked={disponivel}
            onChange={(e) => setDisponivel(e.currentTarget.checked)}
          />
        </div>
        <button type="submit">Salvar Produto</button>
      </form>

      <p>{resultMsg}</p>
    </div>
  );
}

export default Cadastro;
