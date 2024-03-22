import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";

function Tabela(produtos) {

  const data = { nodes: produtos };

  const sort = useSort(
    data,
    {
      onChange: null,
    },
    {
      sortFns: {
        VALOR: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
      },
    }
  );

  return (
    <Table data={data} sort={sort}>
      {(tableList) => (
        <>
          <Header>
            <HeaderRow>
              <HeaderCell>Nome</HeaderCell>
              <HeaderCellSort sortKey="Valor">Valor</HeaderCellSort>
              <HeaderCell>Descrição</HeaderCell>
              <HeaderCell>Disponível</HeaderCell>
            </HeaderRow>
          </Header>

          <Body>
            {tableList.map((item) => (
              <Row item={item} key={item.id}>
                <Cell>{item.nome}</Cell>
                <Cell>{item.valor}</Cell>
                <Cell>{item.descricao}</Cell>
                <Cell>{item.disponivel == true ? "Sim" : "Não"}</Cell>
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
  );

}


//const COLUMNS = [
//{ label: 'Nome', renderCell: (item) => item["nome"] },
//{ label: 'Valor', renderCell: (item) => item["valor"], sort: {sortKey: "VALOR"} },
//{ label: 'Descrição', renderCell: (item) => item["descricao"] },
//{
//label: 'Disponível',
//renderCell: (item) => item["disponivel"] == true ? "Sim" : "Não",
//},
//];



function App() {
  const [resultMsg, setResultMsg] = useState("");
  const [produtos, setProdutos] = useState(
    [{ "nome": "oi", "descricao": "teste", "valor": 10, "disponivel": true }]
  );
  const [tabelaComponent, setTabelaComponent] = useState(null);

  async function get_produtos() {
    let response = await invoke("get_produtos", { maior: true });

    setProdutos(response);

  };

  useEffect(() => {
    get_produtos();

  }, []);

  // const Tabela = useCallback(() => {
  //   const data = { nodes: produtos };

  //   return <CompactTable columns={COLUMNS} data={data} />;
  // }, [produtos]);

  useEffect(() => {
    const TabelaComponent = Tabela(produtos);
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
