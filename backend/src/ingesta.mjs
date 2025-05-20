import z from "zebras"
import mysql from "mysql2/promise"
import path from "path"
import { readFileSync } from "fs"
import process from "process"

// Comando para ejecutar la ingesta.mjs desde la terminal del backend: node --env-file=config.env src/ingesta.mjs

// Conexion a la base de datos
const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Limpiar las tablas existentes
const cleanUsuarios = "DROP TABLE IF EXISTS users;"
await conn.query(cleanUsuarios)
console.log("Tabla borrada con éxito")

const cleanAeropuertos = "DROP TABLE IF EXISTS airports;"
await conn.query(cleanAeropuertos)
console.log("Tabla borrada con éxito")

const cleanVuelos = "DROP TABLE IF EXISTS flights;"
await conn.query(cleanVuelos)
console.log("Tabla borrada con éxito")

const cleanAsientos = "DROP TABLE IF EXISTS seats;"
await conn.query(cleanAsientos)
console.log("Tabla borrada con éxito")

const cleanReservas = "DROP TABLE IF EXISTS reservations;"
await conn.query(cleanReservas)
console.log("Tabla borrada con éxito")

const cleanHoteles = "DROP TABLE IF EXISTS hotels;"
await conn.query(cleanHoteles)
console.log("Tabla borrada con éxito")

const cleanOfertas = "DROP TABLE IF EXISTS offers;"
await conn.query(cleanOfertas)
console.log("Tabla borrada con éxito")

const cleanEstadisticas = "DROP TABLE IF EXISTS userStats;"
await conn.query(cleanEstadisticas)
console.log("Tabla borrada con éxito")

// Crear la tabla de usuarios
const createUsuarios = `Create table if not exists users (
  userId int auto_increment primary key,
  firstName varchar(50) not null,
  lastName varchar(50) not null,
  email varchar(50) not null UNIQUE,
  age int not null,
  signupDate datetime not null default current_timestamp
);`
await conn.query(createUsuarios)
console.log("Tabla de usuarios creada")

// Crear la tabla de aeropuertos
const createAeropuertos = `Create table if not exists airports (
  airportCode varchar(10) primary key,
  airportName varchar(255) not null,
  city varchar(100) not null,
  countryCode varchar(10) not null,
  latitude float not null,
  longitude float not null,
  elvationFeet int not null,
  regionCode varchar(10) not null
);`
await conn.query(createAeropuertos)
console.log("Tabla de aeropuertos creada")

// Crear la tabla de vuelos
const createVuelos = `Create table if not exists flights (
  flightId int auto_increment primary key,
  flightNumber varchar(20) not null,
  airlineName varchar(100) not null,
  flightCode varchar(10) not null,
  departureAirportCode varchar(10) not null,
  arrivalAirportCode varchar(10) not null,
  departureTime datetime not null,
  arrivalTime datetime not null,
  durationMinutes int not null,
  price decimal(10,2) not null,
  FOREIGN KEY (departureAirportCode) REFERENCES airports(airportCode),
  FOREIGN KEY (arrivalAirportCode) REFERENCES airports(airportCode)
);`
await conn.query(createVuelos)
console.log("Tabla de vuelos creada")

// Crear la tabla de asientos
// EL NUMERO DE ASIENTOS ES VALIDO SI HAY UN NUMERO FIJO DE ASIENTOS POR VUELO PERO SI VEIS QUE ES MEJOR NO TENER UN NUMERO FIJO
// PODEMOS CAMBIARLO A VARCHAR
const createAsientos = `Create table if not exists seats (
  seatId int auto_increment primary key,
  flightId int not null,
  seatNumber enum('A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3') not null,  
  seatClass enum('economy', 'business', 'first') not null,
  seatType enum('aisle', 'window', 'middle') not null,
  seatStatus bool not null,
  FOREIGN KEY (flightId) REFERENCES flights(flightId)
);`
await conn.query(createAsientos)
console.log("Tabla de asientos creada")

// Crear la tabla de reservas
const createReservas = `Create table if not exists reservations (
  reservationId int auto_increment primary key,
  userId int not null,
  flightId int not null,
  seatId int not null,
  reservationDate datetime not null default current_timestamp,
  FOREIGN KEY (userId) REFERENCES users(userId),
  FOREIGN KEY (flightId) REFERENCES flights(flightId),
  FOREIGN KEY (seatId) REFERENCES seats(seatId)
);`
await conn.query(createReservas)
console.log("Tabla de reservas creada")

// Crear la tabla de hoteles
const createHoteles = `Create table if not exists hotels (
  hotelId int auto_increment primary key,
  hotelName varchar(255) not null,
  address varchar(255) not null,
  rating int not null,
  contactNumber varchar(50) not null,
  pricePerNight decimal(10,2) not null,
  city varchar(50) not null,
  country varchar(50) not null,
  email varchar(100) not null,
  chekInTime datetime not null,
  checkOutTime datetime not null
);`
await conn.query(createHoteles)
console.log("Tabla de hoteles creada")

// Crear la tabla de ofertas
const createOfertas = `Create table if not exists offers (
  offerId int auto_increment primary key,
  flightId int not null,
  hotelId int not null,
  discountPercentage int not null,
  startDate datetime not null,
  endDate datetime not null,
  FOREIGN KEY (flightId) REFERENCES flights(flightId),
  FOREIGN KEY (hotelId) REFERENCES hotels(hotelId)
);`
await conn.query(createOfertas);
console.log("Tabla de ofertas creada")

// Crear la tabla de estadisticas de usuario
const createEstadisticas = `Create table if not exists userStats (
  userId int primary key,
  totalFlights int not null default 0,
  totalHours int not null default 0,
  firstFlight datetime,
  lastFlight datetime,
  timesInFirstClass int not null default 0,
  mostUsedAirline varchar(100),
  totalSpent decimal(10,2) not null default 0,
  FOREIGN KEY (userId) REFERENCES users(userId)
);`
await conn.query(createEstadisticas)
console.log("Tabla de estadisticas de usuario creada")

console.log("Todas la tablas creadas con exito")

