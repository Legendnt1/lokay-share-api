
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const Usuario = require('../src/models/usuario.model');
const Local = require('../src/models/local.model');

dotenv.config({ path: './api/.env' });

const seed = async () => {
  try {
    // Usar la URI de la variable de entorno
    const dbUri = process.env.MONGO_URI;
    if (!dbUri) {
      throw new Error("La variable de entorno MONGO_URI no está definida.");
    }
    await mongoose.connect(dbUri);
    console.log('MongoDB conectado para el seeder.');

    // Limpiar datos existentes
    await Usuario.deleteMany({});
    await Local.deleteMany({});
    console.log('Datos antiguos eliminados.');

    // --- CREAR USUARIOS ---
    const usuarios = await Usuario.create([
      {
        nombre: 'Ana Propietaria',
        usuario: 'anaprop',
        email: 'ana@example.com',
        rol: 'propietario',
        foto_perfil: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        nombre: 'Luis Cliente',
        usuario: 'luiscliente',
        email: 'luis@example.com',
        rol: 'cliente',
        foto_perfil: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        nombre: 'Carlos Propietario',
        usuario: 'carlosprop',
        email: 'carlos@example.com',
        rol: 'propietario',
        foto_perfil: 'https://randomuser.me/api/portraits/men/2.jpg'
      }
    ]);
    console.log('Usuarios creados.');

    const [ana, luis, carlos] = usuarios;

    // --- CREAR LOCALES CON DATOS RICOS ---
    const locales = await Local.create([
      {
        nombre: 'Cafetería El Rincón',
        descripcion: 'El mejor café de la ciudad, con granos peruanos de especialidad. Un lugar acogedor para trabajar o relajarse.',
        lokayShopUrl: 'https://shop.example.com/cafeteria-el-rincon',
        direccion: {
          pais: 'Perú',
          region: 'Lima',
          ciudad: 'Lima',
          distrito: 'Miraflores',
          calle: 'Av. Larco 123',
          referencia: 'Frente al parque Kennedy'
        },
        horarios: 'L-V: 8am - 8pm / S-D: 9am - 7pm',
        id_propietario: ana._id,
        reseñas: [
          {
            id_usuario: luis._id,
            usuario_nombre: luis.usuario,
            calificacion: 5,
            texto: '¡Excelente café y el ambiente es muy tranquilo! El wifi es rápido, ideal para trabajar.',
          },
          {
            id_usuario: carlos._id,
            usuario_nombre: carlos.usuario,
            calificacion: 4,
            texto: 'Buen lugar, el espresso es de calidad. Un poco lleno por las tardes.',
          }
        ],
        publicaciones: [
          {
            texto: '¡Nuevo método de extracción en la casa! Ven a probar nuestro V60 con granos de Chanchamayo. ☕️',
            url_imagen: 'https://images.unsplash.com/photo-1511920183353-3c7c95a5742c',
            comentarios: [
              {
                id_usuario: luis._id,
                usuario_nombre: luis.usuario,
                texto: '¡Qué buena noticia! Mañana paso a probarlo.'
              }
            ]
          }
        ]
      },
      {
        nombre: 'Librería El Saber',
        descripcion: 'Un universo de historias por descubrir. Tenemos desde best-sellers hasta joyas literarias independientes.',
        lokayShopUrl: 'https://shop.example.com/libreria-el-saber',
        direccion: {
          pais: 'Perú',
          region: 'Lima',
          ciudad: 'Lima',
          distrito: 'San Isidro',
          calle: 'Av. Arequipa 456',
          referencia: 'Cerca al Óvalo Gutiérrez'
        },
        horarios: 'L-S: 10am - 9pm',
        id_propietario: carlos._id,
        reseñas: [
           {
            id_usuario: ana._id,
            usuario_nombre: ana.usuario,
            calificacion: 5,
            texto: 'Una selección de libros increíble y el personal es muy amable y conocedor. Mi librería favorita.',
          }
        ],
        publicaciones: [
          {
            texto: 'Esta semana tenemos 20% de descuento en toda la sección de ciencia ficción. ¡No te lo pierdas!',
            url_imagen: 'https://images.unsplash.com/photo-1589998059171-988d887df646',
            likes: 15
          },
          {
            texto: 'Club de lectura este viernes: "Cien años de soledad". ¡Los esperamos!',
            likes: 8,
            comentarios: [
              {
                id_usuario: ana._id,
                usuario_nombre: ana.usuario,
                texto: '¡Ahí estaré sin falta!'
              },
              {
                id_usuario: luis._id,
                usuario_nombre: luis.usuario,
                texto: '¿A qué hora empieza?'
              }
            ]
          }
        ]
      },
    ]);
    console.log('Locales creados.');

    // --- ACTUALIZAR USUARIOS CON SUS LOCALES ---
    await Usuario.findByIdAndUpdate(ana._id, { $push: { locales_propios: locales[0]._id } });
    await Usuario.findByIdAndUpdate(carlos._id, { $push: { locales_propios: locales[1]._id } });
    console.log('Usuarios actualizados con sus locales.');

    console.log('¡Seed completado exitosamente!');
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB.');
    process.exit();
  } catch (error) {
    console.error('Error en el proceso de seed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
