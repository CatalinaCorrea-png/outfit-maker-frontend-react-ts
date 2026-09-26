# 👗 Outfit Maker — Frontend

SPA for **Outfit Maker**, a virtual wardrobe where you add your clothes and combine them into outfits.
It consumes the API from the [Java 21 + Spring Boot 4 backend](https://github.com/CatalinaCorrea-png/outfit-maker-backend-java).

![Status](https://img.shields.io/badge/status-in_progress-F59E0B?style=flat-square)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white)

## What's done

- **Public landing page** with a quick four-step guide (sign in, add clothes, build outfits, ask
  the AI for one), illustrated with taped polaroids and custom SVG drawings.
- **Sign up** with form validation: required fields, email format, a password of at least 8
  characters and a confirmation that has to match. Errors show up under each field.
- **Automatic login after signing up:** once the account is created, you're logged in and taken
  to your wardrobe without entering your details again.
- **Login** with form validation and error messages in the selected language. On both login and
  sign up, the button is disabled while the request is in flight, to prevent double submits.
- **JWT session.** The *access token* lives only in memory and the *refresh token* in an
  `httpOnly` cookie managed by the backend. Axios interceptors renew the token with a
  *single-flight* refresh: if several requests fail at once, a single refresh runs and all of
  them are retried. Reloading the page (F5) restores the session, and when it expires a modal with
  a *focus trap* appears.
- **Garment catalog** connected to the API, with filters by category, name, brand, pattern,
  formality, season and active/archived, sorted ascending or descending.
- **Spanish and English** with i18next:
  - texts split by module (`auth`, `common`, `errors`, `garments`, `home`);
  - **typed keys**: TypeScript flags an error if a translation that doesn't exist is used;
  - the language is detected from the browser, can be changed from the landing, login, sign up or
    navbar, and is remembered.
- **Backend errors translated by code.** The API sends a stable code
  (`AUTH_INVALID_CREDENTIALS`, `TOKEN_EXPIRED`…) and the frontend turns it into a message in the
  active language.
- **Accessibility:** ARIA attributes on controls (button state, collapsible panels, loading
  indicator) and a *focus trap* in the session-expired modal.

## Not yet

- Outfits view and adding/editing garments.
- AI outfit generator.
- Tests.

## Running it

Requires the [backend](https://github.com/CatalinaCorrea-png/outfit-maker-backend-java) to be running.

```bash
pnpm install
cp .env.example .env     # VITE_API_URL=http://localhost:8080
pnpm dev                 # http://localhost:5173
```
