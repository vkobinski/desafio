// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::sync::Mutex;

use serde::Serialize;
use serde_json::Value;
use sqlx::{migrate::MigrateDatabase, query, query_as, Sqlite, SqlitePool};

#[derive(Debug, Serialize)]
struct Produto {
    nome: String,
    descricao: String,
    valor: f64,
    disponivel: bool,
}

async fn get_pool() -> Result<SqlitePool, sqlx::Error> {
    const DB_URL: &str = "sqlite://../sqlite.db";

    if !Sqlite::database_exists(DB_URL).await.unwrap_or(false) {
        println!("Database does not exist, creating...");
        match Sqlite::create_database(DB_URL).await {
            Ok(_) => println!("Created database!"),
            Err(e) => panic!("Error: {}", e),
        }
    }

    let db = SqlitePool::connect(DB_URL).await.unwrap();
    let result = sqlx::query(
        "CREATE TABLE IF NOT EXISTS produtos 
        (id INTEGER PRIMARY KEY NOT NULL, nome VARCHAR(50) NOT NULL, descricao VARCHAR(100) NOT NULL, valor REAL NOT NULL, disponivel INTEGER NOT NULL);"
    ).execute(&db).await;

    match result {
        Ok(q) => {
            println!("Connected to DB! {:?}", q);
            Ok(db)
        }
        Err(e) => Err(e),
    }
}

async fn create_produto_db(state: tauri::State<'_, ProdutoState>, produto: Produto) -> Result<(), sqlx::Error> {
    let pool = state.pool.lock().unwrap().clone();

    let mut disponivel: i16;

    if produto.disponivel {
        disponivel = 1;
    } else {
        disponivel = 0;
    }

    let result = query!(
        "INSERT INTO produtos (nome, descricao, valor, disponivel) VALUES (?, ?, ?, ?)",
        produto.nome,
        produto.descricao,
        produto.valor,
        disponivel
    )
    .execute(&pool)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            println!("Error: {}", e);
            Err(e)
        }
    }
}

async fn get_produtos_db(state: tauri::State<'_, ProdutoState>) -> Result<Vec<Produto>, sqlx::Error> {
    let pool = state.pool.lock().unwrap().clone();
    let produtos = query!("SELECT * FROM produtos")
        .fetch_all(&pool)
        .await
        .unwrap();

    let mut produtos_vec = Vec::new();
    for produto in produtos {
        produtos_vec.push(Produto {
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.valor,
            disponivel: produto.disponivel == 1,
        });
    }

    Ok(produtos_vec)
}

struct ProdutoState {
    t: std::sync::Mutex<Vec<Produto>>,
    pool: Mutex<SqlitePool>,
}

impl ProdutoState {
    fn new() -> Self {
        Self {
            t: std::sync::Mutex::new(Vec::new()),
            pool: Mutex::new(tauri::async_runtime::block_on(get_pool()).unwrap()),
        }
    }
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

    match create_produto_db(state, novo_produto).await {
        Ok(_) => Ok(String::from("Produto criado com sucesso!")),
        Err(e) => return Err(format!("Erro ao criar produto: {}", e)),
    }
}

#[tauri::command]
async fn get_produtos(
    state: tauri::State<'_, ProdutoState>,
    _maior: bool,
) -> Result<Value, String> {
    let produtos = get_produtos_db(state).await.unwrap();

    Ok(serde_json::json!(*produtos))
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_produto,
            get_produtos
        ])
        .manage(ProdutoState::new())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
