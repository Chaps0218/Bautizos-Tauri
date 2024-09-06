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
