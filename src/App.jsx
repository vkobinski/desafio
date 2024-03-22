import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { useCallback } from "react";
import { useSort } from "@table-library/react-table-library/sort";
import { useTheme } from '@table-library/react-table-library/theme';
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/material-ui';

import { CompactTable } from '@table-library/react-table-library/compact';

const COLUMNS = [
  { label: 'Nome', renderCell: (item) => item["nome"] },
  { label: 'Valor', renderCell: (item) => item["valor"], sort: { sortKey: "VALOR" } },
  { label: 'Descrição', renderCell: (item) => item["descricao"] },
  {
    label: 'Disponível',
    renderCell: (item) => item["disponivel"] == true ? "Sim" : "Não",
  },
];



function App() {
  const [resultMsg, setResultMsg] = useState("");
  const [produtos, setProdutos] = useState(
    [{ "nome": "oi", "descricao": "teste", "valor": 10, "disponivel": true }]
  );
  const [maior, setMaior] = useState(true);
  const [tabelaComponent, setTabelaComponent] = useState(null);

  async function get_produtos() {
    let response = await invoke("get_produtos", { maior: true });

    setProdutos(response);


  };

  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme(getTheme());

  useEffect(() => {
    get_produtos();

  }, []);

  const data = { nodes: produtos };

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {

      sortFns: {
        VALOR: () => null,
      },
    }
  );

  function onSortChange(action, state) {
    if(action.type == "TOGGLE_SORT") {
      setMaior(!maior);
    }
  }

  const Tabela = useCallback(() => {
    const data = { nodes: produtos };

    return <CompactTable columns={COLUMNS} data={data} sort={sort} theme={theme} />;
  }, [produtos]);

  useEffect(() => {
    const TabelaComponent = Tabela();
    setTabelaComponent(TabelaComponent);
  }, [produtos]);


  return (
    <div className="container">
      <h1>Lista de Produtos</h1>

      <div className="tabela">
        {tabelaComponent}
      </div>

      <p>{resultMsg}</p>
    </div>
  );

}

export default App;
