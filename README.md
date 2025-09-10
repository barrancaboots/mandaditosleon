
## 📜 Licencia

Este proyecto está licenciado bajo la **Creative Commons Atribución-NoComercial-SinDerivadas 4.0 Internacional**.

Esto significa que eres libre de copiar y redistribuir el código para fines no comerciales, siempre y cuando des el crédito apropiado al autor original, **Mario Felipe Luevano Villagomez**.

⚠️ **No está permitido** el uso de este software para fines comerciales ni la distribuc
ión de versiones modificadas.

Para más detalles, consulta el archivo `LICENSE` en el repositorio.
![Logo de Mandaditos León](https://raw.githubusercontent.com/direccionbarrancaboots-max/mandaditosleon/main/assets/images/adaptive-icon.png)

**Mandaditos León** es una aplicación móvil completa para un servicio de delivery enfocado en supermercados, desarrollada con React Native y Expo.

## ✨ Características Principales

- **Autenticación de Usuarios**: Registro e inicio de sesión seguros para clientes.
- **Catálogo de Productos**: Navegación por categorías para explorar los productos disponibles.
- **Carrito de Compras**: Funcionalidad completa para añadir, gestionar y ver productos seleccionados.
- **Proceso de Compra**: Flujo de checkout para ingresar dirección y finalizar el pedido.
- **Historial de Pedidos**: Los usuarios pueden consultar el estado y el historial de sus pedidos.
- **Soporte Multilenguaje**: Preparado para funcionar en español e inglés.

---

## 🚀 Tecnologías Utilizadas

Este proyecto está construido con un stack tecnológico moderno y escalable:

- **Frontend**: React Native con Expo
- **Backend & Base de Datos**: Supabase (PostgreSQL)
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router
- **Gestión de Estado**: React Context

---

## 🛠️ Guía de Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Requisitos Previos

- Node.js (LTS) y npm
- Expo CLI (`npm install -g expo-cli`)
- Git
- Una cuenta gratuita en [Supabase](https://supabase.com)

### 1. Configuración del Backend (Supabase)

1.  **Crea un proyecto en Supabase**: Inicia sesión y crea un nuevo proyecto.
2.  **Ejecuta el script de la base de datos**:
    - Ve a la sección **"SQL Editor"** en tu dashboard de Supabase.
    - Copia todo el contenido del archivo `supabase/migrations/20250906023703_pale_cave.sql` y ejecútalo. Esto creará todas las tablas y políticas de seguridad necesarias.
3.  **Obtén tus credenciales**: Ve a **Project Settings > API** y copia tu **URL del Proyecto** y tu **Clave `anon` `public`**.

### 2. Configuración del Frontend (Local)

1.  **Clona el repositorio**:
    ```bash
    git clone [https://github.com/direccionbarrancaboots-max/mandaditosleon.git](https://github.com/direccionbarrancaboots-max/mandaditosleon.git)
    cd mandaditosleon
    ```

2.  **Instala las dependencias**:
    ```bash
    npm install
    ```

3.  **Conecta con Supabase**:
    - Abre el archivo `lib/supabase.ts`.
    - Reemplaza los valores de `supabaseUrl` y `supabaseAnonKey` con las credenciales que obtuviste de tu proyecto de Supabase.
      ```typescript
      const supabaseUrl = 'TU_URL_DE_SUPABASE';
      const supabaseAnonKey = 'TU_ANON_KEY_DE_SUPABASE';
      ```

---

## ▶️ Comandos Disponibles

Una vez configurado, puedes usar los siguientes scripts desde la raíz del proyecto:

- **`npm start`**: Inicia el servidor de desarrollo de Expo. Podrás escanear un QR con la app Expo Go para ver el proyecto en tu teléfono.
- **`npm run android`**: Intenta abrir la aplicación en un emulador de Android conectado.
- **`npm run ios`**: Intenta abrir la aplicación en un simulador de iOS (solo en macOS).
- **`npm run web`**: Ejecuta la aplicación en un navegador web.