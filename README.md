# Atsume

Une application de gestion de collection de mangas complète ("mobile-first"), permettant aux collectionneurs de mangas de gérer leur collection physique, suivre leur progression de lecture, lister les prêts en cours et maintenir une liste de souhaits.

## Architecture

Ce projet est découpé en deux parties principales :

- **Backend (`/laravel-api`) :** API RESTful sous **Laravel 12**, structurée en **Domain-Driven Design (DDD)**, testée avec **PestPHP**, base de données **PostgreSQL** via Supabase, authentification **Laravel Sanctum**.
- **Frontend (`/pwa-client-v2`) :** Application **Next.js 16** (React 19) + **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, **Framer Motion**, **Three.js**. PWA-ready (Service Worker, mode hors ligne, scan de codes-barres).

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Animations | Framer Motion, Three.js |
| Backend | Laravel 12, PHP, DDD |
| Base de données | PostgreSQL (Supabase) |
| Auth | Laravel Sanctum |
| PWA | Service Worker, caching offline, installation native |
| Qualité | PestPHP, PHPStan (niveau 9), Laravel Pint, ESLint, TypeScript strict |
| CI/CD | GitHub Actions, Vercel (frontend) |

## Pages frontend

| Route | Description |
|---|---|
| `/collection` | Hub principal — collection de l'utilisateur |
| `/series/[id]` | Détail d'une série et ses volumes |
| `/scan` | Scanner de codes-barres pour ajouter un volume |
| `/search` | Recherche de mangas |
| `/planning` | Planning de lecture |
| `/settings` | Paramètres utilisateur |
| `/login`, `/register` | Authentification |
| `/user/[username]` | Profil public d'un utilisateur |

## Documentation

- **[Architecture & règles (AGENTS.md)](AGENTS.md)** — Stack technique, DDD, directives strictes de développement
- **[API (API.md)](API.md)** — Documentation des endpoints REST
- **[Animations (ANIMATIONS.md)](ANIMATIONS.md)** — Propositions d'effets Three.js UX

## Démarrage rapide

L'environnement complet tourne via **Docker Compose**.

```bash
git clone git@github.com:LTiollier/atsume.git
cd atsume
docker compose up -d
```

- API Backend : `http://localhost:8000/api`
- Frontend : `http://localhost:3000`

## Tests & qualité

```bash
# Backend (Pest)
docker compose exec backend ./vendor/bin/pest

# Frontend (TypeScript + ESLint)
cd pwa-client-v2
npm run typecheck
npm run lint
```
