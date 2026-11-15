// =====================================================================
// CONFIGURATION VIBZO
// Remplace les deux valeurs ci-dessous par celles de ton projet Supabase :
// Supabase > Project Settings > API > "Project URL" et "anon public key".
// La clé "anon" est faite pour être publique : la sécurité est assurée
// par les règles de la base de données (Row Level Security).
// =====================================================================
export const SUPABASE_URL = 'https://pcfebfknjtqtgkhctxll.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_jzRFhRUH5JlyNcIcnAwgAQ_1W8oZUoh';

// Numéro WhatsApp de l'équipe Vibzo (activation Gold et Vendeur), format international sans +
export const SUPPORT_WHATSAPP = '994515201787';
// Coordonnées de paiement affichées après une demande d'abonnement (par zone : O, C, E, A)
export const PAYMENT_INFO = {
  A: { bank: 'Bank Respublika', holder: 'KAMTA FOKOU CHRISTIAN', iban: 'AZ46BRES41015AZ0012121865005' },
  C: { momo: 'MTN Mobile Money (Cameroun)', number: '+237673740713' },
  O: { momo: 'MTN Mobile Money (Cameroun)', number: '+237673740713' },
  E: { momo: 'MTN Mobile Money (Cameroun)', number: '+237673740713' },
};

// Lien de téléchargement direct de l'application Android (APK), vide tant qu'il n'existe pas
export const ANDROID_APK_URL = '';

// Prix des abonnements (Gold et Vendeur), par mois
export const SUB_PRICES = {
  A: { amount: 20, cur: '₼' },      // Azerbaïdjan : 20 manats
  default: { amount: 1000, cur: 'FCFA' }, // Afrique : 1 000 XAF
};
