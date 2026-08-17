# Pressing LIC — Frontend Angular

## 1. Installer les dépendances

```bash
cd pressing-frontend
npm install
```

## 2. Configurer l'URL de l'API

Deux fichiers d'environnement sont déjà prêts :

- `src/environments/environment.development.ts` → utilisé par `ng serve` (dev), pointe déjà sur `http://localhost:8000/api`
- `src/environments/environment.ts` → utilisé par `ng build` (prod), à adapter avec la vraie URL de ton API en production

Si ton backend Laravel tourne ailleurs (ex. Docker sur le port `8080`), modifie `apiUrl` dans `environment.development.ts`.

## 3. Vérifier le CORS côté backend

Le backend Laravel doit déjà autoriser `http://localhost:4200` dans `config/cors.php` (c'est le cas si tu as suivi le README du backend). Si tu changes le port du frontend, pense à l'ajouter aussi côté Laravel.

## 4. Lancer le serveur de dev

```bash
npm start
```

ou

```bash
ng serve
```

L'app est accessible sur **http://localhost:4200**.

## 5. Comptes de test (seedés côté backend)

- **Gestionnaire** : `gestionnaire@pressing-lic.sn` / `password`
- **Client** : crée un compte via la page "Inscription", ou utilise `client@example.com` / `password` si tu as gardé le seeder par défaut.

## 6. Ce qui est fonctionnel

| Fonctionnalité | Statut |
|---|---|
| Login / Register / Logout | ✅ (design moderne, layout split-panel) |
| Home publique (page d'accueil avant login) | ✅ |
| Mode clair / sombre sur tout le site | ✅ |
| Guards (connecté / gestionnaire) | ✅ |
| Intercepteur token Bearer automatique | ✅ |
| Déconnexion auto sur 401 | ✅ |
| Catalogue de services (liste, recherche, ajout, archivage) | ✅ |
| Dépôt de commande (panier de services) | ✅ |
| Liste des tickets (filtre par statut pour le gestionnaire) | ✅ |
| Détail d'un ticket (changement de statut, annulation, encaissement, téléchargement du reçu PDF) | ✅ |
| Statistiques (tableau de bord gestionnaire, Chart.js) | ✅ |
| Notifications (liste + marquer comme lue) | ✅ |

## 7. Structure du projet

```
src/app/
├── home/                     # Page d'accueil publique (Home)
├── auth/                    # Login, Register (design split-panel)
├── models/                  # Interfaces TypeScript (auth, service, ticket, paiement, pagination, statistique, notification)
├── services/                # Services HTTP + ThemeService (clair/sombre)
├── guards/                  # authGuard, gestionnaireGuard
├── interceptors/            # Ajout token Bearer, déconnexion sur 401
├── services-catalogue/      # ServiceList (catalogue), AddService (formulaire d'ajout)
├── tickets/                 # TicketList, DeposerTicket, TicketDetail
├── statistiques/            # Tableau de bord (Chart.js, réactif au thème)
├── notifications/           # Liste + marquer comme lue
├── app.ts / app.html / app.css   # Shell principal (navbar + toggle thème)
├── app.routes.ts             # Routes : '/' = Home publique, reste protégé
└── app.config.ts             # Providers (router, HttpClient, intercepteurs)

src/styles.css                # Design tokens (variables CSS clair/sombre)
```

## 9. Mode clair / sombre

Géré par `ThemeService` (signal + `localStorage`), applique/retire la classe `.dark` sur `<html>`. Toutes les couleurs de l'app passent par des variables CSS définies dans `src/styles.css` (`--bg`, `--surface`, `--text`, `--primary`, etc.) — pour ajouter un nouveau composant qui respecte le thème, utilise ces variables plutôt que des couleurs en dur.

## 8. Convention de nommage utilisée

Suit la structure que tu as fournie : pas de suffixe `.component.` dans les noms de fichiers (`login.ts` et non `login.component.ts`), configuré via `angular.json` (`schematics` → `@schematics/angular:component` → `"type": ""`). Génère un nouveau composant avec :

```bash
ng generate component mon-dossier/mon-composant
```
