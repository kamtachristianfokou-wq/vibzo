// Pays, régions, monnaies et listes de référence de Vibzo
export const ZONES = { O: 'Afrique de l’Ouest', C: 'Afrique centrale', E: 'Afrique de l’Est', A: 'Azerbaïdjan' };

// [code, nom, drapeau, zone, monnaie, indicatif, régions]
const CL = [
  ['BJ', 'Bénin', '🇧🇯', 'O', 'FCFA', '+229', ['Littoral', 'Atlantique', 'Borgou', 'Zou', 'Ouémé']],
  ['BF', 'Burkina Faso', '🇧🇫', 'O', 'FCFA', '+226', ['Centre', 'Hauts-Bassins', 'Nord', 'Centre-Ouest']],
  ['CV', 'Cap-Vert', '🇨🇻', 'O', 'CVE', '+238', ['Santiago', 'São Vicente', 'Sal']],
  ['CI', 'Côte d’Ivoire', '🇨🇮', 'O', 'FCFA', '+225', ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro', 'Korhogo']],
  ['GM', 'Gambie', '🇬🇲', 'O', 'GMD', '+220', ['Banjul', 'Kanifing', 'Brikama']],
  ['GH', 'Ghana', '🇬🇭', 'O', 'GH₵', '+233', ['Grand Accra', 'Ashanti', 'Centrale', 'Nord']],
  ['GN', 'Guinée', '🇬🇳', 'O', 'GNF', '+224', ['Conakry', 'Kankan', 'Labé', 'Nzérékoré']],
  ['GW', 'Guinée-Bissau', '🇬🇼', 'O', 'FCFA', '+245', ['Bissau', 'Bafatá', 'Gabú']],
  ['LR', 'Liberia', '🇱🇷', 'O', 'L$', '+231', ['Montserrado', 'Bong', 'Nimba']],
  ['ML', 'Mali', '🇲🇱', 'O', 'FCFA', '+223', ['Bamako', 'Sikasso', 'Ségou', 'Kayes']],
  ['MR', 'Mauritanie', '🇲🇷', 'O', 'MRU', '+222', ['Nouakchott', 'Nouadhibou', 'Assaba']],
  ['NE', 'Niger', '🇳🇪', 'O', 'FCFA', '+227', ['Niamey', 'Zinder', 'Maradi', 'Tahoua']],
  ['NG', 'Nigeria', '🇳🇬', 'O', '₦', '+234', ['Lagos', 'FCT Abuja', 'Rivers', 'Kano', 'Oyo']],
  ['SN', 'Sénégal', '🇸🇳', 'O', 'FCFA', '+221', ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor']],
  ['SL', 'Sierra Leone', '🇸🇱', 'O', 'Le', '+232', ['Western Area', 'Bo', 'Kenema']],
  ['TG', 'Togo', '🇹🇬', 'O', 'FCFA', '+228', ['Maritime', 'Plateaux', 'Kara', 'Centrale', 'Savanes']],
  ['CM', 'Cameroun', '🇨🇲', 'C', 'FCFA', '+237', ['Littoral', 'Centre', 'Ouest', 'Nord', 'Sud-Ouest', 'Nord-Ouest', 'Adamaoua', 'Est', 'Sud', 'Extrême-Nord']],
  ['CF', 'Centrafrique', '🇨🇫', 'C', 'FCFA', '+236', ['Bangui', 'Ombella-M’Poko', 'Ouham']],
  ['CG', 'Congo-Brazzaville', '🇨🇬', 'C', 'FCFA', '+242', ['Brazzaville', 'Pointe-Noire', 'Niari']],
  ['CD', 'RD Congo', '🇨🇩', 'C', 'FC', '+243', ['Kinshasa', 'Haut-Katanga', 'Nord-Kivu', 'Sud-Kivu', 'Kasaï-Central']],
  ['GA', 'Gabon', '🇬🇦', 'C', 'FCFA', '+241', ['Estuaire', 'Haut-Ogooué', 'Ogooué-Maritime']],
  ['GQ', 'Guinée équatoriale', '🇬🇶', 'C', 'FCFA', '+240', ['Bioko Nord', 'Littoral']],
  ['TD', 'Tchad', '🇹🇩', 'C', 'FCFA', '+235', ['N’Djamena', 'Logone Occidental', 'Ouaddaï']],
  ['ST', 'São Tomé-et-Principe', '🇸🇹', 'C', 'Db', '+239', ['Água Grande', 'Príncipe']],
  ['BI', 'Burundi', '🇧🇮', 'E', 'FBu', '+257', ['Bujumbura', 'Gitega', 'Ngozi']],
  ['DJ', 'Djibouti', '🇩🇯', 'E', 'Fdj', '+253', ['Djibouti', 'Ali Sabieh', 'Tadjourah']],
  ['ER', 'Érythrée', '🇪🇷', 'E', 'Nfk', '+291', ['Maekel', 'Debub', 'Mer Rouge Nord']],
  ['ET', 'Éthiopie', '🇪🇹', 'E', 'Br', '+251', ['Addis-Abeba', 'Oromia', 'Amhara', 'Tigré']],
  ['KE', 'Kenya', '🇰🇪', 'E', 'KSh', '+254', ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru']],
  ['UG', 'Ouganda', '🇺🇬', 'E', 'USh', '+256', ['Centrale', 'Ouest', 'Est', 'Nord']],
  ['RW', 'Rwanda', '🇷🇼', 'E', 'RF', '+250', ['Kigali', 'Sud', 'Nord', 'Ouest', 'Est']],
  ['SO', 'Somalie', '🇸🇴', 'E', 'Sh.So.', '+252', ['Banaadir', 'Woqooyi Galbeed', 'Bari']],
  ['SS', 'Soudan du Sud', '🇸🇸', 'E', 'SSP', '+211', ['Équatoria-Central', 'Jonglei', 'Bahr el Ghazal']],
  ['TZ', 'Tanzanie', '🇹🇿', 'E', 'TSh', '+255', ['Dar es Salaam', 'Arusha', 'Mwanza', 'Zanzibar', 'Dodoma']],
  ['AZ', 'Azerbaïdjan', '🇦🇿', 'A', '₼', '+994', ['Bakou', 'Gandja', 'Soumgaït', 'Lankaran', 'Cheki']],
];

export const C = {};
CL.forEach(([k, n, f, z, cur, tel, r]) => { C[k] = { n, f, z, cur, tel, r }; });

export const SECTORS = ['Informatique', 'Commerce', 'Marketing', 'Finance', 'Transport', 'Hôtellerie', 'Santé', 'Éducation', 'BTP', 'Agriculture', 'Beauté', 'Autre'];
export const CONTRACTS = ['CDI', 'CDD', 'Stage', 'Freelance', 'Temps partiel', 'Petit boulot'];
export const REMOTE = ['Sur site', 'Hybride', 'Télétravail'];
export const REPORT_REASONS = ['Contenu sexuel ou nudité', 'Violence ou menace', 'Arnaque ou fraude', 'Harcèlement', 'Faux profil', 'Mineur en danger', 'Autre'];

export function money(v, cur) {
  if (v == null || v === '') return '';
  const n = Number(v);
  const s = Number.isInteger(n) ? n.toLocaleString('fr-FR') : n.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  return s + ' ' + (cur || '');
}
