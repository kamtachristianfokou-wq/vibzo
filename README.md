# Vibzo

Vidéos courtes, emplois et boutiques en Afrique de l'Ouest, du Centre, de l'Est et en Azerbaïdjan.

- **Démo** (contenus fictifs) : https://kamtachristianfokou-wq.github.io/vibzo/
- **Version réelle** (vrais comptes, vidéos, messages, commandes) : https://kamtachristianfokou-wq.github.io/vibzo/app/
  Elle nécessite un projet Supabase : voir [SETUP.md](SETUP.md).

## Contenu

| Dossier | Rôle |
| --- | --- |
| `app/` | Application réelle (PWA installable) |
| `supabase/schema.sql` | Base de données, sécurité, stockage, fonctions |
| `index.html` | Démo interactive |
| `privacy.html` | Politique de confidentialité |

## Fonctionnalités de la version réelle

- Comptes (e-mail et mot de passe), profils, photo, pays et région
- Fil vidéo « Pour toi » et « Abonnements », filtré par région, pays ou zone
- Publication de vidéos, likes, commentaires, favoris, abonnements, partage par lien
- Messagerie privée en temps réel
- Emploi : offres vérifiées par l'équipe, profils candidats, candidatures
- Boutiques : produits, photos, commandes avec paiement à la livraison, WhatsApp
- Signalements et back-office d'administration
