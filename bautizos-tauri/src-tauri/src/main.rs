#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;

use models::{
    Ministro, MinistroAdd, 
    UserAdd, UserLista, UserLogin, UserMod,
    Bautizado, BautizadoAdd, BautizadoMod
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

#[tauri::command]
async fn get_all_bautizados() -> Result<Vec<Bautizado>, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let bautizados: Vec<Bautizado> = conn
        .query("select bau.*, ma.min_nombre as bau_minbau_nombre, mb.min_nombre as bau_mincert_nombre from bautizado as bau inner join ministro as ma on bau.bau_min_bau = ma.min_id inner join ministro as mb on bau.bau_min_cert = mb.min_id")
        .map_err(|e| e.to_string())?;

    Ok(bautizados)
}

#[tauri::command]
async fn handle_add_bautizado(input: BautizadoAdd) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let insert_query = r#"
        INSERT INTO bautizado (bau_nombres, bau_apellidos, bau_cedula, bau_fecha_nac, bau_lugar_nac, bau_min_bau, bau_padre, bau_madre, bau_padrinos, bau_min_cert, bau_fecha_bau, bau_tomo, bau_pag, bau_num, bau_tomo_nac, bau_pag_nac, bau_acta_nac, bau_nota)
        VALUES (:bau_nombres, :bau_apellidos, :bau_cedula, :bau_fecha_nac, :bau_lugar_nac, :bau_min_bau, :bau_padre, :bau_madre, :bau_padrinos, :bau_min_cert, :bau_fecha_bau, :bau_tomo, :bau_pag, :bau_num, :bau_tomo_nac, :bau_pag_nac, :bau_acta_nac, :bau_nota)
    "#;

    conn.exec_drop(
        insert_query,
        params! {
            "bau_nombres" => &input.bau_nombres,
            "bau_apellidos" => &input.bau_apellidos,
            "bau_cedula" => &input.bau_cedula,
            "bau_fecha_nac" => &input.bau_fecha_nac,
            "bau_lugar_nac" => &input.bau_lugar_nac,
            "bau_min_bau" => &input.bau_min_bau,
            "bau_padre" => &input.bau_padre,
            "bau_madre" => &input.bau_madre,
            "bau_padrinos" => &input.bau_padrinos,
            "bau_min_cert" => &input.bau_min_cert,
            "bau_fecha_bau" => &input.bau_fecha_bau,
            "bau_tomo" => &input.bau_tomo,
            "bau_pag" => &input.bau_pag,
            "bau_num" => &input.bau_num,
            "bau_tomo_nac" => &input.bau_tomo_nac,
            "bau_pag_nac" => &input.bau_pag_nac,
            "bau_acta_nac" => &input.bau_acta_nac,
            "bau_nota" => &input.bau_nota,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Bautizado añadido".to_string())
}

#[tauri::command]
async fn handle_modify_bautizado(input: BautizadoMod) -> Result<String, String> {
    let mut conn = get_db_connection().await.map_err(|e| e.to_string())?;
    let modify_query = r#"
        UPDATE bautizado SET bau_nombres = :bau_nombres, bau_apellidos = :bau_apellidos, bau_cedula = :bau_cedula, bau_fecha_nac = :bau_fecha_nac, bau_lugar_nac = :bau_lugar_nac, bau_min_bau = :bau_min_bau, bau_padre = :bau_padre, bau_madre = :bau_madre, bau_padrinos = :bau_padrinos, bau_min_cert = :bau_min_cert, bau_fecha_bau = :bau_fecha_bau, bau_tomo = :bau_tomo, bau_pag = :bau_pag, bau_num = :bau_num, bau_tomo_nac = :bau_tomo_nac, bau_pag_nac = :bau_pag_nac, bau_acta_nac = :bau_acta_nac, bau_nota = :bau_nota WHERE bau_id = :bau_id
    "#;

    conn.exec_drop(
        modify_query,
        params! {
            "bau_id" => &input.bau_id,
            "bau_nombres" => &input.bau_nombres,
            "bau_apellidos" => &input.bau_apellidos,
            "bau_cedula" => &input.bau_cedula,
            "bau_fecha_nac" => &input.bau_fecha_nac,
            "bau_lugar_nac" => &input.bau_lugar_nac,
            "bau_min_bau" => &input.bau_min_bau,
            "bau_padre" => &input.bau_padre,
            "bau_madre" => &input.bau_madre,
            "bau_padrinos" => &input.bau_padrinos,
            "bau_min_cert" => &input.bau_min_cert,
            "bau_fecha_bau" => &input.bau_fecha_bau,
            "bau_tomo" => &input.bau_tomo,
            "bau_pag" => &input.bau_pag,
            "bau_num" => &input.bau_num,
            "bau_tomo_nac" => &input.bau_tomo_nac,
            "bau_pag_nac" => &input.bau_pag_nac,
            "bau_acta_nac" => &input.bau_acta_nac,
            "bau_nota" => &input.bau_nota,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok("Bautizado modificado".to_string())
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
            open_file,
            get_all_bautizados,
            handle_add_bautizado,
            handle_modify_bautizado
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}