import expres from "express"
import mysql from "mysql2"
import fs from "fs"
import path from "path"
import process from "process"

console.log(process.env)
let actualDir = path.resolve(".")
let rutaCert = path.join(actualDir, "ca.pem")
let cert = fs.readFileSync(rutaCert)
let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: "utf8mb4",
    database: process.env.DB_NAME,
    ssl: {
        ca: cert
    }
})

// Conexión exitosa
conn.connect((err) => {
    if (err) {
        console.log("Error de conexión")
        throw err
    }else {
        console.log("Conexión exitosa")
    }
})

export default conn