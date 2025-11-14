# ShortyURL - Acortador de enlaces

Aplicación web para acortar URLs largas. Crea enlaces cortos y fáciles de compartir con seguimiento de clics.

## Requisitos previos

- Node.js 18 o superior
- Neon de PostgreSQL
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Eugenewu11/ShortyUrl.git
cd shortyurl
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/shortyurl
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=tu_secreto_seguro_aqui
```

4. Inicializa la base de datos:
```bash
npx @better-auth/cli generate
npx @better-auth/cli migrate
npx drizzle-kit generate
npx drizzle-kit push
```

## Uso

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre tu navegador en:
```
http://localhost:3000
```

3. Crea una cuenta o inicia sesión
4. Ingresa una URL larga para acortarla
5. Copia tu enlace corto en otra pestaña con el botón de copiar ó accede directamente a ella haciendo click sobre el enlace.


## Implementaciones futuras

1. Funcionalidad a la opción de recuperación de contraseña con ReSend.