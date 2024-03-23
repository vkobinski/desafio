// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use serde::Serialize;
use serde_json::Value;

#[derive(Debug, Serialize)]
struct Produto {
    nome: String,
    descricao: String,
    valor: f64,
    disponivel: bool,
}

#[tauri::command]
fn greet(_state: tauri::State<'_, ProdutoState>, name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Default)]
struct ProdutoState {
    t: std::sync::Mutex<Vec<Produto>>,
}
#[tauri::command]
async fn create_produto(
    state: tauri::State<'_, ProdutoState>,
    nome: &str,
    descricao: &str,
    valor: &str,
    disponivel: bool,
) -> Result<String, String> {
    let novo_produto = Produto {
        nome: nome.into(),
        descricao: descricao.into(),
        valor: valor.parse().unwrap(),
        disponivel,
    };

    println!("Novo produto: {:?}", novo_produto);

    state.t.lock().unwrap().push(novo_produto);
    Ok(String::from("Produto criado com sucesso!"))
}

#[tauri::command]
async fn get_produtos(state: tauri::State<'_, ProdutoState>, maior: bool) -> Result<Value, String> {

    let mut produtos = state.t.lock().unwrap();

    match maior {
        true => produtos.sort_by(|a, b| a.valor.partial_cmp(&b.valor).unwrap()),
        false => produtos.sort_by(|a, b| b.valor.partial_cmp(&a.valor).unwrap())
    }

    Ok(serde_json::json!(*produtos))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            create_produto,
            get_produtos
        ])
        .manage(ProdutoState::default())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
