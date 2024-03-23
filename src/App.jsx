import { useEffect, useState } from "react";
import "./App.css";
import Tabela from "./components/tabela";
import Cadastro from "./components/cadastro";

function App() {
  const [showTabela, setShowTabela] = useState(true);

  return (
    <>
    {showTabela && <Tabela setShowTabela={setShowTabela}/>}
    {!showTabela && <Cadastro setShowTabela={setShowTabela} />}
    </>
  );

}

export default App;
