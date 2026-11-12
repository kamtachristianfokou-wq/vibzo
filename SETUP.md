# Vibzo : mise en service de la version réelle

La version réelle de Vibzo se trouve à la racine du dépôt. Elle a besoin d'un serveur
**Supabase** (gratuit pour démarrer) qui stocke les comptes, les vidéos, les messages,
les boutiques et les offres d'emploi.

## 1. Créer le projet Supabase (10 minutes)

1. Va sur https://supabase.com et clique sur **Start your project**, puis connecte-toi avec GitHub.
2. **New project** :
   - Name : `vibzo`
   - Database password : choisis un mot de passe fort et garde-le précieusement
   - Region : **Central EU (Frankfurt)**, la plus proche de l'Afrique et de Bakou
   - Plan : **Free**
3. Attends 2 minutes que le projet soit prêt.

## 2. Créer la base de données

1. Dans le menu de gauche : **SQL Editor** > **New query**.
2. Copie tout le contenu du fichier `supabase/schema.sql`, colle-le, puis clique sur **Run**.
3. Le message « Success. No rows returned » doit s'afficher.
4. Fais de même avec `supabase/migration_002_rencontres.sql` (section Rencontres, demandes d'abonnement, langues).

## 3. Réglages de connexion

Dans **Authentication** > **Sign In / Providers** > **Email** :

- Pour démarrer vite : désactive **Confirm email**. Les membres peuvent se connecter
  tout de suite après l'inscription.
- Pour plus tard (recommandé dès qu'il y a beaucoup d'inscriptions) : réactive
  **Confirm email** et configure un service d'envoi d'e-mails (par exemple Resend)
  dans **Authentication** > **Emails** > **SMTP Settings**. Le service d'e-mails
  intégré de Supabase n'envoie que quelques e-mails par heure.

Dans **Authentication** > **URL Configuration** :

- Site URL : `https://kamtachristianfokou-wq.github.io/vibzo/`

## 4. Relier l'application

1. **Project Settings** > **API** (ou **Data API**) : copie la **Project URL** et la clé **anon public**.
2. Ouvre `config.js` et remplace les deux valeurs (déjà fait pour le projet pcfebfknjtqtgkhctxll).
3. Facultatif : mets ton numéro WhatsApp dans `SUPPORT_WHATSAPP` (format international sans +,
   par exemple `994501234567`). Il sert aux demandes d'activation Gold et Vendeur.

La clé « anon » est faite pour être publique. La sécurité est assurée par les règles
de la base de données (Row Level Security) déjà incluses dans `schema.sql`.
Ne mets **jamais** la clé `service_role` dans l'application.

## 5. Devenir administrateur

1. Ouvre l'application et crée ton compte.
2. Dans Supabase > **SQL Editor**, exécute (remplace par ton nom d'utilisateur) :

```sql
update public.profiles set role = 'admin' where username = 'ton_nom_utilisateur';
```

3. Recharge l'application : **Profil** > ⚙️ > **Back-office admin** apparaît.

## Ce que fait le back-office

- Valider ou refuser les **offres d'emploi** (protection contre les arnaques).
- Activer les **boutiques** pour 30 jours après paiement de l'abonnement Vendeur.
- Activer **Gold** pour un membre après paiement.
- Traiter les **signalements** (masquer une vidéo, supprimer un commentaire).
- Voir les statistiques par pays.

## Limites du plan gratuit Supabase

- 500 Mo de base de données, 1 Go de fichiers (environ 100 à 200 vidéos courtes).
- Vidéos limitées à 50 Mo chacune.
- Quand l'audience grandit : passer au plan Pro (25 $/mois) ou déplacer les vidéos vers Mux / Cloudflare Stream.
