#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;

use models::{
    Ministro, MinistroAdd, 
    UserAdd, UserLista, UserLogin, UserMod,
};

use bcrypt::{hash, verify, DEFAULT_COST};
use mysql::prelude::*;
use mysql::*;
use opener::open;
use tauri::Manager;

async fn get_db_connection() -> Result<PooledConn, mysql::Error> {
    let url = "mysql://root:password@localhost:3306/bautizos_arcadia";
    let pool = Pool::new(url)?;
    pool.get_conn()
}

#[tauri::command]
async fn login(user: UserLogin) -> Result<UserLista, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    //println!("{:#?}", user);
    let stored_hash: Option<String> = conn
        .exec_first(
            "SELECT usu_password FROM usuario WHERE usu_username = :usu_username",
            params! {
                "usu_username" => &user.usu_username,
            },
        )
        .map_err(|e| e.to_string())?;

    match stored_hash {
        Some(hash) => {
            if verify(&user.usu_password, &hash).map_err(|e| e.to_string())? {
                let authenticated_user: Option<UserLista> = conn
                    .exec_first(
                        "select usu.usu_id, usu.usu_nombre, usu.usu_apellido, usu.usu_rol, usu.usu_username from usuario as usu where usu.usu_username = :usu_username",
                        params! {
                            "usu_username" => &user.usu_username,
                        },
                    )
                    .map_err(|e| e.to_string())?;
                
                match authenticated_user {
                    Some(user) => Ok(user),
                    None => Err("User not found after password verification".to_string()),
                }
            } else {
                Err("Invalid credentials".to_string())
            }
        }
        None => Err("Invalid credentials".to_string()),
    }
}

#[tauri::command]
fn open_file(filepath: String) {
    if let Err(e) = open(filepath) {
        eprintln!("Error opening file: {}", e);
    }
}

#[tauri::command]
async fn get_all_users() -> Result<Vec<UserLista>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let users: Vec<UserLista> = conn
        .query("select * from usuario order by usu_id asc")
        .map_err(|e| e.to_string())?;

    Ok(users)
}

#[tauri::command]
async fn handle_add_usuario(input: UserAdd) -> Result<String, String> {
    let hashed_password = hash(&input.usu_password, DEFAULT_COST).map_err(|e| e.to_string())?;
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO usuario (usu_nombre, usu_apellido, usu_rol, usu_username, usu_password)
        VALUES (:usu_nombre, :usu_apellido, :usu_rol, :usu_username, :usu_password)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "usu_nombre" => &input.usu_nombre,
            "usu_apellido" => &input.usu_apellido,
            "usu_rol" => &input.usu_rol,
            "usu_username" => &input.usu_username,
            "usu_password" => &hashed_password,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Usuario añadido".to_string())
}

#[tauri::command]
async fn check_username(input: String) -> Result<u64, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let query = r#"
        SELECT COUNT(*) as count FROM usuario WHERE usu_username LIKE :usu_username
    "#;

    let params = params! {
        "usu_username" => format!("{}%", input),
    };

    let result: Option<u64> = tokio::task::block_in_place(|| conn.exec_first(query, params))
        .map_err(|e| e.to_string())?;

    match result {
        Some(count) => Ok(count),
        None => Ok(0),
    }
}

#[tauri::command]
async fn handle_modify_usuario(input: UserMod) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE usuario SET usu_nombre = :usu_nombre, usu_apellido = :usu_apellido, usu_rol = :usu_rol, usu_username = :usu_username WHERE usu_id = :usu_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "usu_id" => &input.usu_id,
            "usu_nombre" => &input.usu_nombre,
            "usu_apellido" => &input.usu_apellido,
            "usu_rol" => &input.usu_rol,
            "usu_username" => &input.usu_username,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Usuario modificado".to_string())
}

#[tauri::command]
async fn handle_save_password(input: String, input2: u32) -> Result<bool, String> {
    let hashed_password = hash(&input, DEFAULT_COST).map_err(|e| e.to_string())?;

    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE usuario SET usu_password = :usu_password WHERE usu_id = :usu_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "usu_id" => input2,
            "usu_password" => &hashed_password,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok(true)
}

#[tauri::command]
async fn check_password(input: String, input2: u32) -> Result<bool, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let stored_hash: Option<String> = conn
        .exec_first(
            "SELECT usu_password FROM usuario WHERE usu_id = :usu_id",
            params! {
                "usu_id" => input2,
            },
        )
        .map_err(|e| e.to_string())?;

    match stored_hash {
        Some(hash) => {
            if verify(&input, &hash).map_err(|e| e.to_string())? {
                Ok(true)
            } else {
                Ok(false)
            }
        }
        None => Ok(false),
    }
}

#[tauri::command]
async fn get_all_ministros() -> Result<Vec<Ministro>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let ministros: Vec<Ministro> = conn
        .query("select * from ministro")
        .map_err(|e| e.to_string())?;

    Ok(ministros)
}

#[tauri::command]
async fn handle_add_ministro(input: MinistroAdd) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO ministro (min_nombre, min_b_parroco, min_parroco_actual)
        VALUES (:min_nombre, :min_b_parroco, :min_parroco_actual)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "min_nombre" => &input.min_nombre,
            "min_b_parroco" => &input.min_b_parroco,
            "min_parroco_actual" => &input.min_parroco_actual,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Ministro añadido".to_string())
}

#[tauri::command]
async fn handle_modify_ministro(input: Ministro) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE ministro SET min_nombre = :min_nombre, min_b_parroco = :min_b_parroco, min_parroco_actual = :min_parroco_actual  WHERE min_id = :min_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "min_id" => &input.min_id,
            "min_nombre" => &input.min_nombre,
            "min_b_parroco" => &input.min_b_parroco,
            "min_parroco_actual" => &input.min_parroco_actual,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Ministro modificado".to_string())
}

#[tauri::command]
async fn flush_min_actual() -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    
    let select_query = r#"
        SELECT min_id FROM ministro WHERE min_parroco_actual = 1 LIMIT 1
    "#;
    
    let result: Option<i32> = conn.query_first(select_query).map_err(|e| e.to_string())?;
    
    match result {
        Some(min_id) => {
            let update_query = r#"
                UPDATE ministro
                SET min_parroco_actual = 0
                WHERE min_id = ?
            "#;
            
            conn.exec_drop(update_query, (min_id,)).map_err(|e| e.to_string())?;
            
            Ok("Ministro actualizado exitosamente".to_string())
        },
        None => Ok("No se encontró ningún ministro para actualizar".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.maximize().unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            login,
            get_all_users,
            handle_add_usuario,
            check_username,
            handle_modify_usuario,
            handle_save_password,
            check_password,
            get_all_ministros,
            handle_add_ministro,
            handle_modify_ministro,
            flush_min_actual,
            open_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}