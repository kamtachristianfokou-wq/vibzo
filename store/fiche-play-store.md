# Vibzo : fiche Google Play (à copier dans la Play Console)

## Informations de l'application
- **Nom de l'application (30 car. max)** : Vibzo : vidéos, emploi, rencontres
- **Langue par défaut** : Français (fr-FR)
- **Type** : Application · **Gratuite**
- **Catégorie** : Réseaux sociaux
- **E-mail de contact** : kamtachristianfokou@gmail.com
- **Site web** : https://vibzo.fun/
- **Politique de confidentialité** : https://vibzo.fun/privacy.html
- **Suppression de compte (URL)** : https://vibzo.fun/suppression-compte.html

## Description courte (80 car. max)
Vidéos, emplois, boutiques et rencontres près de chez toi, en Afrique et à Bakou.

## Description complète
Vibzo, c'est le réseau social vidéo de ta ville, de ta région et de ton pays.

🎬 VIDÉOS
Fais défiler des vidéos courtes, like, commente, enregistre et suis tes créateurs préférés. Publie tes propres vidéos et montre ta ville.

💼 EMPLOI
Trouve un travail ou recrute près de chez toi. Les offres sont vérifiées par l'équipe Vibzo avant publication : un vrai recruteur ne demande jamais d'argent. Crée ton profil candidat et discute directement avec les recruteurs.

🛍️ BOUTIQUES
Achète les produits de ta région, paie à la livraison. Commerçants : ouvrez votre boutique, ajoutez vos produits et montrez-les dans vos vidéos.

💘 RENCONTRES (membres Gold, 18 ans et plus)
Rencontre des adultes de ta ville, de ta région ou de ton pays, pour une relation sérieuse ou plus légère. Un match ouvre une discussion privée. Blocage et signalement en un clic.

🌍 35 PAYS, 8 LANGUES
Afrique de l'Ouest, Afrique centrale, Afrique de l'Est et Azerbaïdjan. L'application s'affiche dans la langue officielle de ton pays : français, anglais, portugais, espagnol, arabe, swahili, amharique ou azerbaïdjanais.

🛡️ SÉCURITÉ
Modération des contenus, signalement, blocage, profils de rencontre réservés aux majeurs, aucune publicité ciblée. Tu peux supprimer ton compte et toutes tes données à tout moment depuis l'application.

## Classification du contenu (questionnaire IARC) : réponses
- Catégorie : **Réseau social / communication**
- Interaction entre utilisateurs : **Oui** (messages, commentaires, contenus publiés par les utilisateurs)
- Partage de la position : **Non** (seulement pays/région/ville choisis par l'utilisateur)
- Achats numériques : **Non** dans l'app pour l'instant (activation des abonnements hors de l'app)
- Violence, contenu sexuel, langage grossier, drogues, jeux d'argent : **Non** dans le contenu fourni par l'app. Contenus des utilisateurs modérés.
- Fonction de rencontre : **Oui**, réservée aux 18 ans et plus

## Public cible et contenu
- Tranche d'âge cible : **18 ans et plus** (à cause de l'espace rencontres)
- L'application n'est **pas** destinée aux enfants

## Sécurité des données (Data safety) : réponses
- Données collectées : **Oui** · Données partagées avec des tiers : **Non** (seuls des prestataires techniques, Supabase et GitHub, qui agissent pour le compte de Vibzo)
- Chiffrées en transit : **Oui** · Suppression possible sur demande : **Oui** (dans l'app et via l'URL ci-dessus)
- Types de données collectés (tous « nécessaires au fonctionnement de l'app », « gestion du compte ») :
  - Infos personnelles : nom, adresse e-mail, ID utilisateur, adresse (livraison), téléphone
  - Infos personnelles sensibles : **orientation de recherche** (genre recherché) pour les rencontres
  - Photos et vidéos
  - Messages (messages privés dans l'app)
  - Contenu généré par l'utilisateur (commentaires, offres, produits, profils)
  - Infos sur l'app et activité : interactions (likes, abonnements), historique de recherche **non**
- Localisation précise : **Non** · Infos financières : **Non** · Contacts : **Non** · Identifiant publicitaire : **Non**

## Pays de distribution
Bénin, Burkina Faso, Cap-Vert, Côte d'Ivoire, Gambie, Ghana, Guinée, Guinée-Bissau, Liberia, Mali, Mauritanie, Niger, Nigeria, Sénégal, Sierra Leone, Togo, Cameroun, Centrafrique, Congo, RD Congo, Gabon, Guinée équatoriale, Tchad, São Tomé-et-Principe, Burundi, Djibouti, Érythrée, Éthiopie, Kenya, Ouganda, Rwanda, Somalie, Soudan du Sud, Tanzanie, Azerbaïdjan.
(Pas de distribution dans l'Union européenne : compte déclaré « non commerçant ».)

## Points de vigilance avant publication
1. **Abonnements dans l'app Android** : la règle de Google Play impose son système de paiement pour vendre des abonnements numériques (Gold) dans l'app. Avant de mettre l'app Android en production, il faudra soit intégrer Google Play Billing, soit ne pas proposer l'achat de Gold dans l'app Android.
2. **Test fermé obligatoire** : 12 testeurs minimum pendant 14 jours d'affilée avant de pouvoir demander l'accès à la production.
3. **Fichier assetlinks.json** : à ajouter dans `.well-known/` sur le site avec l'empreinte de la clé de signature (fournie dans le paquet PWABuilder), pour que l'app s'affiche en plein écran.
