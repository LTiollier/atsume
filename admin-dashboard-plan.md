# Spécification Technique : Dashboard Admin (DDD)

Ce document détaille la stratégie d'implémentation pour l'ajout d'une section "ADMIN" dans les paramètres, permettant de suivre l'activité du mois et l'état des tâches planifiées.

## 1. Modifications de la Base de Données

### Table `users`
Ajout d'un champ pour distinguer les administrateurs.
- Migration : `add_is_admin_to_users_table`
- Colonne : `is_admin` (boolean, default: false)

### Suivi des Cron Jobs
Pour suivre l'heure du run et le type sans dépendre uniquement des logs :
- Utilisation du `Cache` Laravel pour stocker les métadonnées du dernier run.
- Ou création d'une table `cron_executions` (id, command, ran_at, status).

---

## 2. Architecture Backend (DDD)

L'implémentation suivra la structure existante dans `laravel-api/app/`. Un nouveau module `Admin` sera créé.

### A. Domain Layer (`app/Admin/Domain`)
- **Entities / Value Objects** :
    - `AdminStats` : Objet contenant les compteurs (volumes, editions, series).
    - `CronStatus` : Objet contenant les infos du cron (heure, type, jobs en échec).
- **Interfaces** :
    - `AdminRepositoryInterface` : Définition des méthodes de récupération des données.

### B. Infrastructure Layer (`app/Admin/Infrastructure`)
- **Repositories** :
    - `EloquentAdminRepository` : Implémentation utilisant Eloquent pour compter les modèles créés ce mois-ci et interroger la table `failed_jobs`.
- **Services** :
    - Un `JobStatusService` pour récupérer les informations depuis `failed_jobs` et le cache de planification.

### C. Application Layer (`app/Admin/Application`)
- **Use Cases / Services** :
    - `GetAdminDashboardSummary` : Service orchestrateur qui récupère les stats et le statut des crons via les interfaces du domaine.

### D. Http Layer (`app/Http/Api/Admin`)
- **Controller** : `AdminDashboardController` avec une méthode `index`.
- **Middleware** : Création ou utilisation d'un middleware `AdminMiddleware` pour restreindre l'accès au porteur du flag `is_admin`.
- **Resources** : `AdminDashboardResource` pour formater la réponse JSON (séparation nette entre données brutes et format API).

---

## 3. Détails des Statistiques

### Statistiques du mois (`Manga` Domain)
Requêtes filtrées sur `created_at` >= début du mois en cours :
- `Series::where('created_at', '>=', now()->startOfMonth())->count()`
- `Edition::where('created_at', '>=', now()->startOfMonth())->count()`
- `Volume::where('created_at', '>=', now()->startOfMonth())->count()`

### État du Cron (`Infrastructure` / `System`)
- **Failed Jobs** : `DB::table('failed_jobs')->where('failed_at', '>=', today())->count()`.
- **Last Run** : Récupéré via `Cache::get('last_cron_run_at')`.
- **Type de Run** : Identifié via les commandes définies dans `routes/console.php`.

---

## 4. Architecture Frontend (PWA)

### Services API
- Ajout d'une méthode dans `services/api.ts` pour fetch `/api/admin/dashboard`.

### Composants React
- **`AdminSettings.tsx`** : Nouveau composant affiché uniquement si `user.is_admin` est vrai.
- Intégration dans la page `Settings` existante.
- Affichage sous forme de "Cards" ou de liste de statistiques :
    - Section "Activité du mois" (Compteurs).
    - Section "Santé du système" (Cron & Jobs).

---

## 5. Sécurité & Bonnes Pratiques

- **Protection des routes** : La route API sera protégée par `auth:sanctum` ET le middleware `admin`.
- **Performance** : Les statistiques lourdes (count sur des tables massives) pourront être mises en cache pour une durée courte (ex: 1 heure).
- **Extensibilité** : Le module `Admin` est isolé, permettant d'ajouter facilement des fonctionnalités (gestion utilisateurs, logs système) sans polluer les domaines métier (`Manga`, `User`).
