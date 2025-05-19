import z from "zebras"
import mysql from "mysql2/promise"
import path from "path"
import { readFileSync } from "fs"
import process from "process"

// Conexion a la base de datos
const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

// Crear la tabla de usuarios
const createUser = `Create table users (
    userId int auto_increment primary key,
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    email varchar(50) not null,
    hashedPassword varchar(255) not null,
    age int not null,
    gender enum('male, female, other') not null,
    address varchar(255) not null,
    city varchar(50) not null,
    country varchar(50) not null,
    signupDate datetime not null,
)`
await conn.query(createUser)
console.log("Tabla de usuarios creada")

