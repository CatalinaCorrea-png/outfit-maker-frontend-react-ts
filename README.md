# 👗 Outfit Maker — Frontend

SPA de **Outfit Maker**, un armario virtual para cargar tus prendas y combinarlas en outfits.
Consume la API del [backend en Kotlin + Spring Boot](https://github.com/CatalinaCorrea-png/outfit-maker-backend-kotlin).

![Estado](https://img.shields.io/badge/estado-en_desarrollo-F59E0B?style=flat-square)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white)

## Qué está hecho

- **Login** con validación del formulario y mensajes de error en el idioma elegido.
- **Sesión con JWT.** El *access token* vive solo en memoria y el *refresh token* en una cookie
  `httpOnly` que maneja el backend. Los interceptores de Axios renuevan el token con un refresh
  *single-flight*: si varias requests fallan a la vez, se hace un solo refresh y se reintentan
  todas. Al recargar la página (F5) la sesión se recupera sin perderse, y cuando vence aparece un
  modal con *focus trap*.
- **Catálogo de prendas** conectado a la API, con filtros por categoría, nombre, marca, estampado,
  formalidad, temporada y activas/archivadas, y orden ascendente o descendente.
- **Español e inglés** con i18next:
  - textos separados por módulo (`auth`, `common`, `errors`, `garments`);
  - **claves tipadas**: TypeScript marca un error si se usa una traducción que no existe;
  - el idioma se detecta del navegador, se puede cambiar desde el login o el navbar y queda
    guardado.
- **Errores del backend traducidos por código.** La API manda un código fijo
  (`AUTH_INVALID_CREDENTIALS`, `TOKEN_EXPIRED`…) y el frontend lo convierte en un mensaje del
  idioma activo.
- **Accesibilidad:** atributos ARIA en los controles (estado de botones, paneles desplegables,
  indicador de carga) y *focus trap* en el modal de sesión vencida.

## Todavía no

- Registro, vista de outfits y alta/edición de prendas.
- Tests.

## Cómo correrlo

Necesita el [backend](https://github.com/CatalinaCorrea-png/outfit-maker-backend-kotlin) corriendo.

```bash
pnpm install
cp .env.example .env     # VITE_API_URL=http://localhost:8080
pnpm dev                 # http://localhost:5173
```
