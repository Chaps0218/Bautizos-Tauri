// src-tauri/src/models.rs
use mysql::prelude::FromRow;
use serde::{Deserialize, Serialize};
use std::fmt::Debug;

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct User {
    pub usu_id: i32,
    pub usu_nombre: String,
    pub usu_apellido: String,
    pub usu_rol: String,
    pub usu_username: String,
    pub usu_password: String,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct UserAdd {
    pub usu_nombre: String,
    pub usu_apellido: String,
    pub usu_rol: String,
    pub usu_username: String,
    pub usu_password: String,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct UserMod {
    pub usu_id: i32,
    pub usu_nombre: String,
    pub usu_apellido: String,
    pub usu_rol: String,
    pub usu_username: String,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct UserLista {
    pub usu_id: i32,
    pub usu_nombre: String,
    pub usu_apellido: String,
    pub usu_rol: String,
    pub usu_username: String,
}

#[derive(Serialize, Deserialize, FromRow, Debug)]
pub struct UserLogin {
    pub usu_username: String,
    pub usu_password: String,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct Ministro {
    pub min_id: i32,
    pub min_nombre: String,
    pub min_b_parroco: i32,
    pub min_parroco_actual: i32,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct MinistroAdd {
    pub min_nombre: String,
    pub min_b_parroco: i32,
    pub min_parroco_actual: i32,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct Bautizado {
    pub bau_id: i32,
    pub bau_nombres: String,
    pub bau_apellidos: String,
    pub bau_cedula: String,
    pub bau_fecha_nac: String,
    pub bau_lugar_nac: String,
    pub bau_min_bau: i32,
    pub bau_minbau_nombre: String,
    pub bau_padre: Option<String>,
    pub bau_madre: Option<String>,
    pub bau_padrinos: String,
    pub bau_min_cert: i32,
    pub bau_mincert_nombre: String,
    pub bau_fecha_bau: String,
    pub bau_tomo: Option<i32>,
    pub bau_pag: Option<i32>,
    pub bau_num: Option<i32>,
    pub bau_tomo_nac: Option<i32>,
    pub bau_pag_nac: Option<i32>,
    pub bau_acta_nac: Option<i32>,
    pub bau_nota: Option<String>,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct BautizadoAdd {
    pub bau_nombres: String,
    pub bau_apellidos: String,
    pub bau_cedula: String,
    pub bau_fecha_nac: String,
    pub bau_lugar_nac: String,
    pub bau_min_bau: i32,
    pub bau_padre: Option<String>,
    pub bau_madre: Option<String>,
    pub bau_padrinos: String,
    pub bau_min_cert: i32,
    pub bau_fecha_bau: String,
    pub bau_tomo: Option<i32>,
    pub bau_pag: Option<i32>,
    pub bau_num: Option<i32>,
    pub bau_tomo_nac: Option<i32>,
    pub bau_pag_nac: Option<i32>,
    pub bau_acta_nac: Option<i32>,
    pub bau_nota: Option<String>,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct BautizadoMod {
    pub bau_id: i32,
    pub bau_nombres: String,
    pub bau_apellidos: String,
    pub bau_cedula: String,
    pub bau_fecha_nac: String,
    pub bau_lugar_nac: String,
    pub bau_min_bau: i32,
    pub bau_padre: Option<String>,
    pub bau_madre: Option<String>,
    pub bau_padrinos: String,
    pub bau_min_cert: i32,
    pub bau_fecha_bau: String,
    pub bau_tomo: Option<i32>,
    pub bau_pag: Option<i32>,
    pub bau_num: Option<i32>,
    pub bau_tomo_nac: Option<i32>,
    pub bau_pag_nac: Option<i32>,
    pub bau_acta_nac: Option<i32>,
    pub bau_nota: Option<String>,
}
