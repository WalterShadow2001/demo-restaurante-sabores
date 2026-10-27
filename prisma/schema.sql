-- Schema for Restaurante Sabores de Delicias on Turso (libsql)

-- Drop tables if they exist (idempotent setup)
DROP TABLE IF EXISTS _prisma_migrations;
DROP TABLE IF EXISTS Pedido;
DROP TABLE IF EXISTS Resena;
DROP TABLE IF EXISTS Platillo;

-- Platillo
CREATE TABLE Platillo (
    id TEXT NOT NULL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria TEXT NOT NULL,
    imagen TEXT NOT NULL,
    etiquetas TEXT NOT NULL,
    disponible INTEGER NOT NULL DEFAULT 1,
    destacado INTEGER NOT NULL DEFAULT 0,
    creadoEn TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Pedido
CREATE TABLE Pedido (
    id TEXT NOT NULL PRIMARY KEY,
    clienteNombre TEXT NOT NULL,
    clientePhone TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'recibido',
    notas TEXT,
    creadoEn TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Resena
CREATE TABLE Resena (
    id TEXT NOT NULL PRIMARY KEY,
    autor TEXT NOT NULL,
    calificacion INTEGER NOT NULL,
    comentario TEXT NOT NULL,
    aprobada INTEGER NOT NULL DEFAULT 0,
    creadoEn TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
