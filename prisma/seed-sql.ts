// Seed data for Restaurante Sabores de Delicias (uses raw libsql client)
import { v4 as uuidv4 } from "uuid";

export async function seedData(client: any) {
  console.log("\n=== Seeding Platillos ===");

  const platillos: Array<{
    id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    imagen: string;
    etiquetas: string;
    disponible: boolean;
    destacado: boolean;
  }> = [
    // Entradas (3)
    {
      nombre: "Guacamole con totopos",
      descripcion:
        "Aguacate Hass molido al momento con tomate, cebolla, cilantro, limón y chile serrano. Servido con totopos de maíz horneados en casa.",
      precio: 95,
      categoria: "Entrada",
      imagen: "🥑",
      etiquetas: "veggie,recomendado",
      disponible: true,
      destacado: true,
    },
    {
      nombre: "Queso fundido con chorizo",
      descripcion:
        "Queso asadero derretido al horno con chorizo de Puebla casero, servido con tortillas de maíz recién hechas y salsa verde tatemada.",
      precio: 120,
      categoria: "Entrada",
      imagen: "🧀",
      etiquetas: "picante",
      disponible: true,
      destacado: false,
    },
    {
      nombre: "Nachos supremos",
      descripcion:
        "Totopos crujientes bañados en queso, frijoles refritos, guacamole, pico de gallo, crema, jalapeños y cilantro. Para compartir.",
      precio: 135,
      categoria: "Entrada",
      imagen: "🌽",
      etiquetas: "picante,veggie,compartir",
      disponible: true,
      destacado: false,
    },
    // Platos Fuertes (4)
    {
      nombre: "Tacos al pastor (orden de 5)",
      descripcion:
        "Cerdo marinado al pastor trompeado al momento en tortillas de maíz, con piña, cebolla, cilantro y salsa de árbol. Incluye 5 tacos.",
      precio: 145,
      categoria: "Plato Fuerte",
      imagen: "🌮",
      etiquetas: "recomendado,picante",
      disponible: true,
      destacado: true,
    },
    {
      nombre: "Enchiladas de mole",
      descripcion:
        "Tres enchiladas rellenas de pollo deshebrado, bañadas en mole poblano casero elaborado con 23 ingredientes. Acompañadas de arroz y frijoles.",
      precio: 165,
      categoria: "Plato Fuerte",
      imagen: "🌯",
      etiquetas: "recomendado",
      disponible: true,
      destacado: true,
    },
    {
      nombre: "Carne asada con guarniciones",
      descripcion:
        "Bistec de res a la brasa de 250g marinado con hierbas, servido con guacamole, frijoles puercos, papas rústicas y tortillas hechas a mano.",
      precio: 220,
      categoria: "Plato Fuerte",
      imagen: "🥩",
      etiquetas: "recomendado",
      disponible: true,
      destacado: false,
    },
    {
      nombre: "Cochinita pibil",
      descripcion:
        "Cerdo deshebrado marinado en achiote y jugo de naranja agria, cocido al horno por 8 horas en hoja de plátano. Servido con cebolla encurtida y salsa habanera.",
      precio: 175,
      categoria: "Plato Fuerte",
      imagen: "🍖",
      etiquetas: "picante",
      disponible: true,
      destacado: false,
    },
    // Bebidas (3)
    {
      nombre: "Agua de horchata",
      descripcion:
        "Bebida refrescante de arroz, canela, vainilla y azúcar. Sin alcohol. Vaso de 500ml.",
      precio: 45,
      categoria: "Bebida",
      imagen: "🥛",
      etiquetas: "veggie,sin-alcohol",
      disponible: true,
      destacado: true,
    },
    {
      nombre: "Agua de jamaica",
      descripcion:
        "Infusión de flor de jamaica endulzada al momento con un toque de limón. Sin alcohol. Vaso de 500ml.",
      precio: 40,
      categoria: "Bebida",
      imagen: "🌺",
      etiquetas: "veggie,sin-alcohol",
      disponible: true,
      destacado: false,
    },
    {
      nombre: "Margarita clásico",
      descripcion:
        "Tequila reposado, jugo de limón natural, triple sec y un toque de jarabe de agave. Servido con borde de sal y cubitos de hielo.",
      precio: 130,
      categoria: "Bebida",
      imagen: "🍹",
      etiquetas: "con-alcohol",
      disponible: true,
      destacado: false,
    },
    // Postres (2)
    {
      nombre: "Flan napolitano",
      descripcion:
        "Flan de huevo con vainilla y caramelo quemado al momento. Receta tradicional de la abuela. Servido frío.",
      precio: 65,
      categoria: "Postre",
      imagen: "🍮",
      etiquetas: "veggie,recomendado",
      disponible: true,
      destacado: true,
    },
    {
      nombre: "Tres leches",
      descripcion:
        "Bizcocho esponjoso bañado en tres leches (evaporada, condensada y crema). Cubierto con merengue flameado y una fresa fresca.",
      precio: 70,
      categoria: "Postre",
      imagen: "🍰",
      etiquetas: "veggie",
      disponible: true,
      destacado: false,
    },
  ];

  for (const p of platillos) {
    const id = uuidv4();
    await client.execute({
      sql: `INSERT INTO Platillo (id, nombre, descripcion, precio, categoria, imagen, etiquetas, disponible, destacado, creadoEn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`,
      args: [
        id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.categoria,
        p.imagen,
        p.etiquetas,
        p.disponible ? 1 : 0,
        p.destacado ? 1 : 0,
      ],
    });
    console.log("Inserted:", p.nombre);
  }

  console.log("\n=== Seeding Resenas ===");
  const resenas: Array<{
    autor: string;
    calificacion: number;
    comentario: string;
    aprobada: boolean;
  }> = [
    {
      autor: "María González",
      calificacion: 5,
      comentario:
        "La mejor comida mexicana de Delicias, los tacos al pastor son increíbles. Salsa picante de verdad y tortillas recién hechas. Volveré seguro.",
      aprobada: true,
    },
    {
      autor: "Juan Pérez",
      calificacion: 5,
      comentario:
        "Ambiente acogedor y comida deliciosa, 100% recomendado. El servicio es rápido y los precios justos para la calidad que ofrecen.",
      aprobada: true,
    },
    {
      autor: "Laura Ramírez",
      calificacion: 4,
      comentario:
        "Muy buen servicio, los nachos son generosos. Me gustó que atienden rápido y que los baños estaban limpios. Solo falto un poco más de picante.",
      aprobada: true,
    },
    {
      autor: "Pedro Martínez",
      calificacion: 5,
      comentario:
        "El mole es casero y se nota, volveré. Sabe como el de mi abuela de Puebla. Excelente lugar para venir en familia.",
      aprobada: false,
    },
    {
      autor: "Carmen Díaz",
      calificacion: 4,
      comentario:
        "Rico todo, pero el servicio un poco lento. La cochinita pibil estaba perfecta. Recomendado para comida tranquila sin prisa.",
      aprobada: false,
    },
  ];

  for (const r of resenas) {
    const id = uuidv4();
    await client.execute({
      sql: `INSERT INTO Resena (id, autor, calificacion, comentario, aprobada, creadoEn) VALUES (?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`,
      args: [id, r.autor, r.calificacion, r.comentario, r.aprobada ? 1 : 0],
    });
    console.log("Inserted resena:", r.autor, r.calificacion, "★");
  }

  console.log("\n=== Seeding Pedidos ===");
  const pedidos: Array<{
    clienteNombre: string;
    clientePhone: string;
    items: string;
    total: number;
    estado: string;
    notas?: string;
  }> = [
    {
      clienteNombre: "Roberto Suárez",
      clientePhone: "6391234567",
      items: JSON.stringify([
        { platilloId: "demo-1", nombre: "Tacos al pastor (orden de 5)", precio: 145, cantidad: 2 },
        { platilloId: "demo-2", nombre: "Agua de horchata", precio: 45, cantidad: 2 },
      ]),
      total: 380,
      estado: "entregado",
      notas: "Sin salsa picante por favor.",
    },
    {
      clienteNombre: "Ana Beltrán",
      clientePhone: "6397654321",
      items: JSON.stringify([
        { platilloId: "demo-3", nombre: "Enchiladas de mole", precio: 165, cantidad: 1 },
        { platilloId: "demo-4", nombre: "Flan napolitano", precio: 65, cantidad: 1 },
      ]),
      total: 230,
      estado: "en_preparacion",
      notas: "Empacado para llevar.",
    },
  ];

  for (const p of pedidos) {
    const id = uuidv4();
    await client.execute({
      sql: `INSERT INTO Pedido (id, clienteNombre, clientePhone, items, total, estado, notas, creadoEn) VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`,
      args: [
        id,
        p.clienteNombre,
        p.clientePhone,
        p.items,
        p.total,
        p.estado,
        p.notas ?? null,
      ],
    });
    console.log("Inserted pedido:", p.clienteNombre, p.estado);
  }

  console.log("\n=== Seed complete ===");
}
