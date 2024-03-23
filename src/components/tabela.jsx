import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./tabela.css";
import { useCallback } from "react";
import { useSort } from "@table-library/react-table-library/sort";
import { useTheme } from '@table-library/react-table-library/theme';
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/chakra-ui';

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



function Tabela(props ) {

    const  setShowTabela  = props.setShowTabela;

    const [resultMsg, setResultMsg] = useState("");
    const [produtos, setProdutos] = useState(
        [{ "nome": "oi", "descricao": "teste", "valor": 10, "disponivel": true }]
    );
    const [maior, setMaior] = useState(true);
    const [tabelaComponent, setTabelaComponent] = useState(null);

    async function get_produtos() {
        let response = await invoke("get_produtos", { maior: maior });

        setProdutos(response);
    };

    const materialTheme = getTheme(DEFAULT_OPTIONS);
    const theme = useTheme(materialTheme);

    useEffect(() => {
        get_produtos();

    }, [maior]);

    const sort = useSort(
        {nodes: produtos},
        {
            onChange: onSortChange,
        },
        {

            sortFns: {
                VALOR: (array) => array.sort((a,b) => a.valor - b.valor),
            },
        }
    );

    function onSortChange(action, state) {

        console.log("sort");

        if (action.type == "TOGGLE_SORT") {
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

            <button className="botao"
             onClick={() => setShowTabela(false)}>
                Cadastrar Item
            </button>

            <div className="tabela">
                {tabelaComponent}
            </div>

            <p>{resultMsg}</p>
        </div>
    );

}

export default Tabela;
