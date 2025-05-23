import z from "zebras"
import mysql from "mysql2/promise"
import { fileURLToPath } from "url";
import path from "path"
import process from "process"

// Comando para ejecutar la ingesta.mjs desde la terminal del backend: node --env-file=config.env src/ingesta.mjs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexion a la base de datos
const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Limpiar las tablas existentes
const cleanReservas = "DROP TABLE IF EXISTS reservations;"
await conn.query(cleanReservas)
console.log("Tabla borrada con éxito")

const cleanEstadisticas = "DROP TABLE IF EXISTS userStats;"
await conn.query(cleanEstadisticas)
console.log("Tabla borrada con éxito")

const cleanUsuarios = "DROP TABLE IF EXISTS users;"
await conn.query(cleanUsuarios)
console.log("Tabla borrada con éxito")

const cleanAsientos = "DROP TABLE IF EXISTS seats;"
await conn.query(cleanAsientos)
console.log("Tabla borrada con éxito")

const cleanOfertas = "DROP TABLE IF EXISTS offers;"
await conn.query(cleanOfertas)
console.log("Tabla borrada con éxito")

const cleanVuelos = "DROP TABLE IF EXISTS flights;"
await conn.query(cleanVuelos)
console.log("Tabla borrada con éxito")

const cleanAeropuertos = "DROP TABLE IF EXISTS airports;"
await conn.query(cleanAeropuertos)
console.log("Tabla borrada con éxito")

const cleanHoteles = "DROP TABLE IF EXISTS hotels;"
await conn.query(cleanHoteles)
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
  elevationFeet int not null,
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

const csvPath = path.join(__dirname, "..", "csv");

// Usuarios
const usuarios = z.readCSV(path.join(csvPath, "usuarios.csv"));
for (const u of usuarios) {
  await conn.query(
    `INSERT INTO users (firstName, lastName, email, age, signupDate) VALUES (?, ?, ?, ?, ?)`,
    [u.firstName, u.lastName, u.email, parseInt(u.age) || 0, u.signupDate]
  );
}
console.log("Usuarios insertados");

// Aeropuertos
const aeropuertos = z.readCSV(path.join(csvPath, "aeropuertos.csv"));
for (const a of aeropuertos) {
  await conn.query(
    `INSERT INTO airports (airportCode, airportName, city, countryCode, latitude, 
    longitude, elvationFeet, regionCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      a.airportCode,
      a.airportName,
      a.city,
      a.countryCode,
      parseFloat(a.latitude) || 0,
      parseFloat(a.longitude) || 0,
      parseInt(a.elevationFeet) || 0, 
      a.regionCode
    ]
  );
}
console.log("Aeropuertos insertados");

// Vuelos
const vuelos = z.readCSV(path.join(csvPath, "vuelos.csv"));
for (const v of vuelos) {
  await conn.query(
    `INSERT INTO flights (flightNumber, airlineName, flightCode, departureAirportCode, 
    arrivalAirportCode, departureTime, arrivalTime, durationMinutes, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      v.flightNumber,
      v.airlineName,
      v.flightCode,
      v.departureAirportCode,
      v.arrivalAirportCode,
      v.departureTime,
      v.arrivalTime,
      parseInt(v.durationMinutes) || 0,
      parseFloat(v.price) || 0
    ]
  );
}
console.log("Vuelos insertados");

// Asientos
const asientos = z.readCSV(path.join(csvPath, "asientos.csv"));
for (const a of asientos) {
  await conn.query(
    `INSERT INTO seats (flightId, seatNumber, seatClass, seatType, seatStatus) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      parseInt(a.flightId) || 0,
      a.seatNumber,
      a.seatClass,
      a.seatType,
      a.seatStatus.toLowerCase() === "true" 
    ]
  );
}
console.log("Asientos insertados");

// Hoteles
const hoteles = z.readCSV(path.join(csvPath, "hoteles.csv"));
for (const h of hoteles) {
  await conn.query(
    `INSERT INTO hotels (hotelName, address, rating, contactNumber, pricePerNight, city, 
    country, email, chekInTime, checkOutTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      h.hotelName,
      h.address,
      parseFloat(h.rating) || 0,
      h.contactNumber,
      parseFloat(h.pricePerNight) || 0,
      h.city,
      h.country,
      h.email,
      h.chekInTime,
      h.checkOutTime
    ]
  );
}
console.log("Hoteles insertados");

// Ofertas
const ofertas = z.readCSV(path.join(csvPath, "ofertas.csv"));
for (const o of ofertas) {
  await conn.query(
    `INSERT INTO offers (flightId, hotelId, discountPercentage, startDate, endDate) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      parseInt(o.flightId) || 0,
      parseInt(o.hotelId) || 0,
      parseInt(o.discountPercentage) || 0,
      o.startDate,
      o.endDate
    ]
  );
}
console.log("Ofertas insertadas");

// Reservas
const reservas = z.readCSV(path.join(csvPath, "reservas.csv"));
for (const r of reservas) {
  await conn.query(
    `INSERT INTO reservations (userId, flightId, seatId, reservationDate) VALUES (?, ?, ?, ?)`,
    [
      parseInt(r.userId) || 0,
      parseInt(r.flightId) || 0,
      parseInt(r.seatId) || 0,
      r.reservationDate
    ]
  );
}
console.log("Reservas insertadas");

// Estadísticas
const estadisticas = z.readCSV(path.join(csvPath, "estadisticas.csv"));
for (const e of estadisticas) {
  await conn.query(
    `INSERT INTO userStats (userId, totalFlights, totalHours, firstFlight, lastFlight, 
    timesInFirstClass, mostUsedAirline, totalSpent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      parseInt(e.userId) || 0,
      parseInt(e.totalFlights) || 0,
      parseInt(e.totalHours) || 0,
      e.firstFlight,
      e.lastFlight,
      parseInt(e.timesInFirstClass) || 0,
      e.mostUsedAirline,
      parseFloat(e.totalSpent) || 0
    ]
  );
}
console.log("Estadísticas insertadas");

console.log("Todos los datos insertados");