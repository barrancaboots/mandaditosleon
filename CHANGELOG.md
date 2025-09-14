# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-13

Esta es la primera versión estable de la aplicación "Mandaditos León", que incluye un flujo completo para el cliente, desde el inicio de sesión hasta la finalización del pedido, con una interfaz de usuario moderna y funcionalidades en tiempo real.

### Added (Añadido)

- **Diseño de UI Moderno:** Se implementó una interfaz de usuario completamente nueva con una paleta de colores cohesiva basada en el logo, tipografía profesional (Poppins) y un enfoque en la experiencia del usuario.
- **Splash Screen Animado:** Se añadió una pantalla de carga animada para mejorar la primera impresión de la aplicación.
- **Logo Animado en Login:** La pantalla de inicio de sesión ahora cuenta con el logo animado para una apariencia más dinámica.
- **Pantalla de Seguimiento de Pedidos:** Se creó una nueva pestaña "Seguimiento" que muestra la ubicación del repartidor en un mapa en tiempo real para los pedidos en camino.
- **Rediseño de Pantallas Clave:**
  - **Inicio (`Home`):** Rediseñada con buscador fijo, carrusel de categorías con íconos y tarjetas de producto mejoradas.
  - **Carrito (`Cart`):** Rediseñado con una lista clara, controlador de cantidades y un resumen de pago fijo.
  - **Checkout:** Rediseñado para ser un proceso claro y sencillo en un solo paso.
  - **Mis Pedidos (`Orders`):** Rediseñado para mostrar el historial de pedidos en tarjetas limpias y fáciles de leer.
  - **Perfil (`Profile`):** Rediseñado con la información del usuario y un botón funcional para "Cerrar Sesión".
- **Pantalla de Ruta no Encontrada:** Se diseñó una pantalla de error "404" coherente con el estilo de la aplicación.
- **Base de Datos Completa:** Se completó y corrigió el esquema de la base de datos en Supabase, añadiendo la tabla `order_items` y estableciendo las relaciones correctas.

### Changed (Cambiado)

- **Enrutamiento Robusto:** Se refactorizó la estructura de enrutamiento en `app/_layout.tsx` y `app/index.tsx` para usar la configuración recomendada de Expo Router, eliminando bucles infinitos.
- **Tipado Consistente:** Se actualizaron todos los tipos de datos (`types/database.ts`) para que sean un reflejo exacto del esquema de la base de datos, y se refactorizaron los componentes y hooks (


