// =====================================================================
// VIBZO : traduction de l'interface dans la langue officielle du pays
// L'interface est écrite en français ; ce module traduit automatiquement
// les textes affichés (sans toucher aux contenus publiés par les membres).
// =====================================================================

export const LANGS = { fr: 'Français', en: 'English', pt: 'Português', es: 'Español', ar: 'العربية', sw: 'Kiswahili', am: 'አማርኛ', az: 'Azərbaycanca' };
const COLS = ['en', 'pt', 'es', 'ar', 'sw', 'am', 'az'];

// Langue officielle utilisée par défaut dans chaque pays
export const OFFICIAL = {
  BJ: 'fr', BF: 'fr', CI: 'fr', GN: 'fr', ML: 'fr', NE: 'fr', SN: 'fr', TG: 'fr', CM: 'fr', CF: 'fr', CG: 'fr', CD: 'fr', GA: 'fr', TD: 'fr', DJ: 'fr', BI: 'fr',
  GM: 'en', GH: 'en', LR: 'en', NG: 'en', SL: 'en', KE: 'en', UG: 'en', RW: 'en', SS: 'en', ER: 'en',
  CV: 'pt', GW: 'pt', ST: 'pt', GQ: 'es', MR: 'ar', SO: 'ar', ET: 'am', TZ: 'sw', AZ: 'az',
};
// Autres langues officielles proposées en priorité dans le pays
export const ALSO = { CM: ['en'], RW: ['fr', 'sw'], BI: ['en'], KE: ['sw'], UG: ['sw'], TZ: ['en'], DJ: ['ar'], TD: ['ar'], GQ: ['fr', 'pt'], ER: ['ar'], SO: ['en'], MR: ['fr'] };

// fr | en | pt | es | ar | sw | am | az
const RAW = `Accueil|Home|Início|Inicio|الرئيسية|Nyumbani|መነሻ|Ana səhifə
Boutique|Shop|Loja|Tienda|المتجر|Duka|ሱቅ|Mağaza
Boutiques|Shops|Lojas|Tiendas|المتاجر|Maduka|ሱቆች|Mağazalar
Rencontres|Dating|Encontros|Citas|تعارف|Uchumba|ትውውቅ|Tanışlıq
Emplois|Jobs|Empregos|Empleos|وظائف|Kazi|ስራዎች|İş
Profil|Profile|Perfil|Perfil|الملف الشخصي|Wasifu|መገለጫ|Profil
Pour toi|For you|Para ti|Para ti|لك|Kwa ajili yako|ለእርስዎ|Sənin üçün
Abonnements|Following|A seguir|Siguiendo|المتابَعون|Unaofuata|የሚከተሏቸው|İzlədiklərin
Abonnés|Followers|Seguidores|Seguidores|المتابِعون|Wafuasi|ተከታዮች|İzləyicilər
J’aime|Likes|Gostos|Me gusta|إعجابات|Zinazopendwa|መውደዶች|Bəyənmələr
Rechercher|Search|Pesquisar|Buscar|بحث|Tafuta|ፈልግ|Axtar
Messages|Messages|Mensagens|Mensajes|الرسائل|Ujumbe|መልዕክቶች|Mesajlar
Message|Message|Mensagem|Mensaje|رسالة|Ujumbe|መልዕክት|Mesaj
Retour|Back|Voltar|Volver|رجوع|Rudi|ተመለስ|Geri
Fermer|Close|Fechar|Cerrar|إغلاق|Funga|ዝጋ|Bağla
Chargement|Loading|A carregar|Cargando|جارٍ التحميل|Inapakia|በመጫን ላይ|Yüklənir
Partager|Share|Partilhar|Compartir|مشاركة|Shiriki|አጋራ|Paylaş
Enregistrer|Save|Guardar|Guardar|حفظ|Hifadhi|አስቀምጥ|Yadda saxla
Enregistré|Saved|Guardado|Guardado|محفوظ|Imehifadhiwa|ተቀምጧል|Saxlanıldı
Signaler|Report|Denunciar|Denunciar|إبلاغ|Ripoti|ሪፖርት አድርግ|Şikayət et
Supprimer|Delete|Eliminar|Eliminar|حذف|Futa|ሰርዝ|Sil
Modifier|Edit|Editar|Editar|تعديل|Hariri|አስተካክል|Redaktə et
Annuler|Cancel|Cancelar|Cancelar|إلغاء|Ghairi|ሰርዝ|Ləğv et
Confirmer|Confirm|Confirmar|Confirmar|تأكيد|Thibitisha|አረጋግጥ|Təsdiqlə
Continuer|Continue|Continuar|Continuar|متابعة|Endelea|ቀጥል|Davam et
Appliquer|Apply|Aplicar|Aplicar|تطبيق|Tumia|ተግብር|Tətbiq et
Envoyer|Send|Enviar|Enviar|إرسال|Tuma|ላክ|Göndər
Options|Options|Opções|Opciones|خيارات|Chaguo|አማራጮች|Seçimlər
Paramètres|Settings|Definições|Ajustes|الإعدادات|Mipangilio|ቅንብሮች|Ayarlar
Ouvrir|Open|Abrir|Abrir|فتح|Fungua|ክፈት|Aç
Gérer|Manage|Gerir|Gestionar|إدارة|Simamia|አስተዳድር|İdarə et
Voir|View|Ver|Ver|عرض|Tazama|ተመልከት|Bax
Lire|Read|Ler|Leer|قراءة|Soma|አንብብ|Oxu
Détails|Details|Detalhes|Detalles|تفاصيل|Maelezo|ዝርዝሮች|Ətraflı
Suivre|Follow|Seguir|Seguir|متابعة|Fuata|ተከተል|İzlə
Abonné ✓|Following ✓|A seguir ✓|Siguiendo ✓|متابَع ✓|Unafuata ✓|ተከትለዋል ✓|İzləyirsən ✓
Plus tard|Later|Mais tarde|Más tarde|لاحقاً|Baadaye|በኋላ|Sonra
Découvrir|Discover|Descobrir|Descubrir|اكتشف|Gundua|አግኝ|Kəşf et
Publier|Post|Publicar|Publicar|نشر|Chapisha|አትም|Paylaş
Nouvelle vidéo|New video|Novo vídeo|Nuevo video|فيديو جديد|Video mpya|አዲስ ቪዲዮ|Yeni video
Publier une vidéo|Post a video|Publicar um vídeo|Publicar un video|انشر فيديو|Chapisha video|ቪዲዮ አትም|Video paylaş
Choisir une vidéo|Choose a video|Escolher um vídeo|Elegir un video|اختر فيديو|Chagua video|ቪዲዮ ምረጥ|Video seç
Changer de vidéo|Change video|Mudar de vídeo|Cambiar video|غيّر الفيديو|Badilisha video|ቪዲዮ ቀይር|Videonu dəyiş
Depuis ta galerie ou ta caméra · 50 Mo et 3 minutes maximum|From your gallery or camera · 50 MB and 3 minutes max|Da tua galeria ou câmara · 50 MB e 3 minutos no máximo|Desde tu galería o cámara · 50 MB y 3 minutos máximo|من معرضك أو الكاميرا · 50 ميغابايت و3 دقائق كحد أقصى|Kutoka kwenye picha au kamera · MB 50 na dakika 3 zaidi|ከጋለሪ ወይም ካሜራ · ከፍተኛ 50 MB እና 3 ደቂቃ|Qalereyadan və ya kameradan · maks. 50 MB və 3 dəqiqə
Titre à l’écran (facultatif)|On-screen title (optional)|Título no ecrã (opcional)|Título en pantalla (opcional)|عنوان على الشاشة (اختياري)|Kichwa kwenye skrini (hiari)|በስክሪን ላይ ርዕስ (አማራጭ)|Ekranda başlıq (istəyə bağlı)
Description|Description|Descrição|Descripción|الوصف|Maelezo|መግለጫ|Təsvir
Décris ta vidéo|Describe your video|Descreve o teu vídeo|Describe tu video|صف الفيديو|Eleza video yako|ቪዲዮህን ግለጽ|Videonu təsvir et
Hashtags|Hashtags|Hashtags|Hashtags|وسوم|Hashtag|ሃሽታጎች|Heşteqlər
Taguer un produit de ma boutique|Tag a product from my shop|Marcar um produto da minha loja|Etiquetar un producto de mi tienda|أضف منتجاً من متجري|Weka bidhaa ya duka langu|ከሱቄ ምርት ጨምር|Mağazamdan məhsul işarələ
Aucun|None|Nenhum|Ninguno|لا شيء|Hakuna|ምንም|Heç biri
Vidéo publiée|Video posted|Vídeo publicado|Video publicado|تم نشر الفيديو|Video imechapishwa|ቪዲዮው ታትሟል|Video paylaşıldı
Vidéo supprimée|Video deleted|Vídeo eliminado|Video eliminado|تم حذف الفيديو|Video imefutwa|ቪዲዮው ተሰርዟል|Video silindi
Choisis d’abord une vidéo|Choose a video first|Escolhe primeiro um vídeo|Elige primero un video|اختر فيديو أولاً|Chagua video kwanza|መጀመሪያ ቪዲዮ ምረጥ|Əvvəlcə video seç
Envoi en cours|Uploading|A enviar|Enviando|جارٍ الإرسال|Inapakia|በመላክ ላይ|Göndərilir
Patiente|Please wait|Aguarda|Espera|انتظر|Subiri|ይጠብቁ|Gözlə
Commentaires|Comments|Comentários|Comentarios|التعليقات|Maoni|አስተያየቶች|Şərhlər
Ajouter un commentaire|Add a comment|Adicionar um comentário|Añadir un comentario|أضف تعليقاً|Ongeza maoni|አስተያየት ጨምር|Şərh əlavə et
Connecte-toi pour commenter|Log in to comment|Inicia sessão para comentar|Inicia sesión para comentar|سجّل الدخول للتعليق|Ingia ili kutoa maoni|አስተያየት ለመስጠት ይግቡ|Şərh üçün daxil ol
Aucun commentaire. Sois le premier|No comments yet. Be the first|Sem comentários. Sê o primeiro|Sin comentarios. Sé el primero|لا تعليقات. كن الأول|Hakuna maoni. Kuwa wa kwanza|አስተያየት የለም። የመጀመሪያው ሁን|Şərh yoxdur. İlk sən ol
Lien copié|Link copied|Ligação copiada|Enlace copiado|تم نسخ الرابط|Kiungo kimenakiliwa|ሊንኩ ተቀድቷል|Link kopyalandı
Copie ce lien|Copy this link|Copia esta ligação|Copia este enlace|انسخ هذا الرابط|Nakili kiungo hiki|ይህን ሊንክ ቅዳ|Bu linki kopyala
Signaler la vidéo|Report video|Denunciar vídeo|Denunciar video|الإبلاغ عن الفيديو|Ripoti video|ቪዲዮውን ሪፖርት አድርግ|Videonu şikayət et
Voir le profil|View profile|Ver perfil|Ver perfil|عرض الملف|Tazama wasifu|መገለጫ ይመልከቱ|Profilə bax
Supprimer ma vidéo|Delete my video|Eliminar o meu vídeo|Eliminar mi video|حذف الفيديو|Futa video yangu|ቪዲዮዬን ሰርዝ|Videomu sil
Supprimer définitivement cette vidéo|Permanently delete this video|Eliminar este vídeo definitivamente|Eliminar este video definitivamente|حذف هذا الفيديو نهائياً|Futa video hii kabisa|ይህን ቪዲዮ በቋሚነት ሰርዝ|Bu videonu həmişəlik sil
Cette action est définitive|This cannot be undone|Esta ação é definitiva|Esta acción es definitiva|لا يمكن التراجع عن هذا|Hii haiwezi kutenduliwa|ይህ ሊቀለበስ አይችልም|Bu əməliyyat geri qaytarılmır
Pourquoi signales-tu ce contenu ? L’équipe Vibzo vérifie chaque signalement|Why are you reporting this? The Vibzo team reviews every report|Porque denuncias este conteúdo? A equipa Vibzo verifica cada denúncia|¿Por qué denuncias este contenido? El equipo de Vibzo revisa cada denuncia|لماذا تبلغ عن هذا المحتوى؟ يراجع فريق Vibzo كل بلاغ|Kwa nini unaripoti? Timu ya Vibzo hukagua kila ripoti|ለምን ሪፖርት ታደርጋለህ? የVibzo ቡድን እያንዳንዱን ሪፖርት ይመረምራል|Niyə şikayət edirsən? Vibzo komandası hər şikayəti yoxlayır
Merci, signalement envoyé|Thanks, report sent|Obrigado, denúncia enviada|Gracias, denuncia enviada|شكراً، تم إرسال البلاغ|Asante, ripoti imetumwa|እናመሰግናለን፣ ሪፖርቱ ተልኳል|Təşəkkürlər, şikayət göndərildi
Contenu sexuel ou nudité|Sexual content or nudity|Conteúdo sexual ou nudez|Contenido sexual o desnudez|محتوى جنسي أو عري|Maudhui ya ngono au uchi|ወሲባዊ ይዘት ወይም እርቃን|Cinsi məzmun və ya çılpaqlıq
Violence ou menace|Violence or threat|Violência ou ameaça|Violencia o amenaza|عنف أو تهديد|Vurugu au tishio|ሁከት ወይም ዛቻ|Zorakılıq və ya təhdid
Arnaque ou fraude|Scam or fraud|Burla ou fraude|Estafa o fraude|احتيال|Utapeli au udanganyifu|ማጭበርበር|Fırıldaq
Harcèlement|Harassment|Assédio|Acoso|تحرش|Unyanyasaji|ትንኮሳ|Təqib
Faux profil|Fake profile|Perfil falso|Perfil falso|ملف مزيف|Wasifu bandia|የውሸት መገለጫ|Saxta profil
Mineur en danger|Minor at risk|Menor em perigo|Menor en peligro|قاصر في خطر|Mtoto yuko hatarini|አደጋ ላይ ያለ ታዳጊ|Təhlükədə olan azyaşlı
Autre|Other|Outro|Otro|أخرى|Nyingine|ሌላ|Digər
Aucune vidéo ici pour l’instant|No videos here yet|Ainda não há vídeos aqui|Aún no hay videos aquí|لا توجد فيديوهات هنا بعد|Bado hakuna video hapa|እዚህ እስካሁን ቪዲዮ የለም|Hələ burada video yoxdur
Sois le premier à publier dans ta zone|Be the first to post in your area|Sê o primeiro a publicar na tua zona|Sé el primero en publicar en tu zona|كن أول من ينشر في منطقتك|Kuwa wa kwanza kuchapisha eneo lako|በአካባቢህ የመጀመሪያው አታሚ ሁን|Bölgəndə ilk paylaşan sən ol
Changer de zone|Change area|Mudar de zona|Cambiar de zona|غيّر المنطقة|Badilisha eneo|አካባቢ ቀይር|Bölgəni dəyiş
Tu as tout vu|You’re all caught up|Já viste tudo|Lo has visto todo|لقد شاهدت كل شيء|Umeona yote|ሁሉንም አይተሃል|Hamısına baxdın
Reviens plus tard ou explore une autre zone|Come back later or explore another area|Volta mais tarde ou explora outra zona|Vuelve más tarde o explora otra zona|عد لاحقاً أو استكشف منطقة أخرى|Rudi baadaye au gundua eneo lingine|በኋላ ተመለስ ወይም ሌላ አካባቢ አስስ|Sonra qayıt və ya başqa bölgəyə bax
Aucune vidéo|No videos|Sem vídeos|Sin videos|لا فيديوهات|Hakuna video|ቪዲዮ የለም|Video yoxdur
Suis des créateurs depuis « Pour toi » pour voir leurs vidéos ici|Follow creators from “For you” to see their videos here|Segue criadores em «Para ti» para ver os vídeos deles aqui|Sigue a creadores desde «Para ti» para ver sus videos aquí|تابع صناع المحتوى من «لك» لترى فيديوهاتهم هنا|Fuata watayarishi kutoka “Kwa ajili yako” kuona video zao hapa|ቪዲዮዎቻቸውን እዚህ ለማየት ከ«ለእርስዎ» ፈጣሪዎችን ተከተል|Videolarını burada görmək üçün «Sənin üçün»-dən yaradıcıları izlə
Connecte-toi pour suivre tes créateurs préférés|Log in to follow your favourite creators|Inicia sessão para seguir os teus criadores favoritos|Inicia sesión para seguir a tus creadores favoritos|سجّل الدخول لمتابعة صناع المحتوى المفضلين|Ingia ili kufuata watayarishi uwapendao|የምትወዳቸውን ፈጣሪዎች ለመከተል ግባ|Sevimli yaradıcılarını izləmək üçün daxil ol
Vidéos récentes|Recent videos|Vídeos recentes|Videos recientes|أحدث الفيديوهات|Video za hivi karibuni|የቅርብ ጊዜ ቪዲዮዎች|Son videolar
Personnes|People|Pessoas|Personas|أشخاص|Watu|ሰዎች|İnsanlar
Aucune vidéo trouvée|No videos found|Nenhum vídeo encontrado|No se encontraron videos|لم يتم العثور على فيديوهات|Hakuna video zilizopatikana|ቪዲዮ አልተገኘም|Video tapılmadı
Rechercher vidéos, #hashtags, @personnes|Search videos, #hashtags, @people|Pesquisar vídeos, #hashtags, @pessoas|Buscar videos, #hashtags, @personas|ابحث عن فيديوهات، #وسوم، @أشخاص|Tafuta video, #hashtag, @watu|ቪዲዮዎች፣ #ሃሽታጎች፣ @ሰዎች ፈልግ|Video, #heşteq, @insan axtar
Pays & région|Country & region|País e região|País y región|البلد والمنطقة|Nchi na mkoa|አገር እና ክልል|Ölkə və region
Pays|Country|País|País|البلد|Nchi|አገር|Ölkə
Région|Region|Região|Región|المنطقة|Mkoa|ክልል|Region
Ville|City|Cidade|Ciudad|المدينة|Mji|ከተማ|Şəhər
Continuer avec Google|Continue with Google|Continuar com o Google|Continuar con Google|المتابعة باستخدام Google|Endelea na Google|በGoogle ይቀጥሉ|Google ilə davam et
— ou avec ton e-mail —|— or with your email —|— ou com o teu e-mail —|— o con tu correo —|— أو ببريدك الإلكتروني —|— au kwa barua pepe yako —|— ወይም በኢሜይልዎ —|— və ya e-poçtunla —
Complète ton profil pour voir ce qui se passe près de chez toi.|Complete your profile to see what’s happening near you.|Completa o teu perfil para ver o que acontece perto de ti.|Completa tu perfil para ver lo que pasa cerca de ti.|أكمل ملفك لترى ما يحدث بالقرب منك.|Kamilisha wasifu wako uone kinachoendelea karibu nawe.|በአቅራቢያዎ ያለውን ለማየት መገለጫዎን ያጠናቅቁ።|Yaxınlıqda baş verənləri görmək üçün profilini tamamla.
C’est parti|Let’s go|Vamos lá|¡Vamos!|هيا بنا|Twende|እንጀምር|Başlayaq
Toute la zone|Whole area|Toda a zona|Toda la zona|المنطقة كلها|Eneo lote|ሙሉ አካባቢ|Bütün bölgə
Monde entier|Whole world|Mundo inteiro|Todo el mundo|العالم كله|Dunia nzima|መላው ዓለም|Bütün dünya
Monde entier (tous les pays)|Whole world (all countries)|Mundo inteiro (todos os países)|Todo el mundo (todos los países)|العالم كله (كل البلدان)|Dunia nzima (nchi zote)|መላው ዓለም (ሁሉም አገሮች)|Bütün dünya (bütün ölkələr)
Tout le pays|Whole country|Todo o país|Todo el país|البلد كله|Nchi nzima|መላው አገር|Bütün ölkə
Vibzo t’affiche les vidéos, emplois et boutiques de la zone choisie|Vibzo shows you videos, jobs and shops from the chosen area|O Vibzo mostra-te vídeos, empregos e lojas da zona escolhida|Vibzo te muestra videos, empleos y tiendas de la zona elegida|يعرض لك Vibzo الفيديوهات والوظائف والمتاجر في المنطقة المختارة|Vibzo inakuonyesha video, kazi na maduka ya eneo ulilochagua|Vibzo ከተመረጠው አካባቢ ቪዲዮዎችን፣ ስራዎችንና ሱቆችን ያሳያል|Vibzo seçilmiş bölgənin videolarını, işlərini və mağazalarını göstərir
Enregistrer comme ma région de profil|Save as my profile region|Guardar como a minha região de perfil|Guardar como mi región de perfil|احفظها كمنطقة ملفي|Hifadhi kama mkoa wa wasifu wangu|እንደ መገለጫ ክልሌ አስቀምጥ|Profil regionum kimi saxla
Région de profil mise à jour|Profile region updated|Região do perfil atualizada|Región del perfil actualizada|تم تحديث منطقة الملف|Mkoa wa wasifu umesasishwa|የመገለጫ ክልል ተዘምኗል|Profil regionu yeniləndi
Créer un compte|Sign up|Criar conta|Crear cuenta|إنشاء حساب|Fungua akaunti|መለያ ፍጠር|Qeydiyyat
Se connecter|Log in|Iniciar sessão|Iniciar sesión|تسجيل الدخول|Ingia|ግባ|Daxil ol
Se connecter / s’inscrire|Log in / Sign up|Entrar / Registar|Entrar / Registrarse|دخول / تسجيل|Ingia / Jisajili|ግባ / ተመዝገብ|Daxil ol / Qeydiyyat
Se déconnecter|Log out|Terminar sessão|Cerrar sesión|تسجيل الخروج|Toka|ውጣ|Çıxış
Déconnecté|Logged out|Sessão terminada|Sesión cerrada|تم تسجيل الخروج|Umetoka|ወጥተዋል|Çıxış edildi
Continuer sans compte|Continue without an account|Continuar sem conta|Continuar sin cuenta|المتابعة بدون حساب|Endelea bila akaunti|ያለ መለያ ቀጥል|Hesabsız davam et
Créer mon compte|Create my account|Criar a minha conta|Crear mi cuenta|أنشئ حسابي|Fungua akaunti yangu|መለያዬን ፍጠር|Hesabımı yarat
Vidéos · Emplois · Boutiques près de chez toi|Videos · Jobs · Shops near you|Vídeos · Empregos · Lojas perto de ti|Videos · Empleos · Tiendas cerca de ti|فيديوهات · وظائف · متاجر بالقرب منك|Video · Kazi · Maduka karibu nawe|ቪዲዮዎች · ስራዎች · በአቅራቢያህ ያሉ ሱቆች|Videolar · İşlər · Yaxınlıqdakı mağazalar
Ton nom|Your name|O teu nome|Tu nombre|اسمك|Jina lako|ስምህ|Adın
Nom d’utilisateur|Username|Nome de utilizador|Nombre de usuario|اسم المستخدم|Jina la mtumiaji|የተጠቃሚ ስም|İstifadəçi adı
E-mail|Email|E-mail|Correo|البريد الإلكتروني|Barua pepe|ኢሜይል|E-poçt
Mot de passe|Password|Palavra-passe|Contraseña|كلمة المرور|Nenosiri|የይለፍ ቃል|Şifrə
8 caractères minimum|At least 8 characters|Mínimo 8 caracteres|Mínimo 8 caracteres|8 أحرف على الأقل|Angalau herufi 8|ቢያንስ 8 ቁምፊዎች|Ən azı 8 simvol
Mot de passe oublié|Forgot password|Esqueceste a palavra-passe|¿Olvidaste la contraseña|نسيت كلمة المرور|Umesahau nenosiri|የይለፍ ቃል ረሱ|Şifrəni unutmusan
Téléphone (facultatif)|Phone (optional)|Telefone (opcional)|Teléfono (opcional)|الهاتف (اختياري)|Simu (hiari)|ስልክ (አማራጭ)|Telefon (istəyə bağlı)
Téléphone|Phone|Telefone|Teléfono|الهاتف|Simu|ስልክ|Telefon
J’ai 16 ans ou plus|I am 16 or older|Tenho 16 anos ou mais|Tengo 16 años o más|عمري 16 سنة أو أكثر|Nina miaka 16 au zaidi|ዕድሜዬ 16 ወይም ከዚያ በላይ ነው|16 yaşım var və ya böyüyəm
J’accepte la|I accept the|Aceito a|Acepto la|أوافق على|Nakubali|እቀበላለሁ|Qəbul edirəm:
politique de confidentialité|privacy policy|política de privacidade|política de privacidad|سياسة الخصوصية|sera ya faragha|የግላዊነት ፖሊሲ|məxfilik siyasəti
et je m’engage à respecter les autres membres|and I promise to respect other members|e comprometo-me a respeitar os outros membros|y me comprometo a respetar a los demás miembros|وأتعهد باحترام الأعضاء الآخرين|na naahidi kuwaheshimu wanachama wengine|ሌሎች አባላትን ለማክበር ቃል እገባለሁ|və digər üzvlərə hörmət edəcəyəm
Vérifie ta boîte e-mail|Check your inbox|Verifica o teu e-mail|Revisa tu correo|تحقق من بريدك|Angalia barua pepe yako|ኢሜይልህን ፈትሽ|E-poçtunu yoxla
Nous avons envoyé un lien de confirmation à|We sent a confirmation link to|Enviámos um link de confirmação para|Enviamos un enlace de confirmación a|أرسلنا رابط تأكيد إلى|Tumetuma kiungo cha uthibitisho kwa|የማረጋገጫ ሊንክ ልከናል ወደ|Təsdiq linki göndərdik:
Clique dessus, puis reviens te connecter|Tap it, then come back and log in|Clica nele e volta para entrar|Haz clic y vuelve a iniciar sesión|انقر عليه ثم عد لتسجيل الدخول|Bofya, kisha urudi kuingia|ጠቅ አድርግ ከዚያ ተመልሰህ ግባ|Üzərinə toxun, sonra qayıdıb daxil ol
Connexion requise|Login required|Sessão necessária|Inicio de sesión requerido|يلزم تسجيل الدخول|Unahitaji kuingia|መግባት ያስፈልጋል|Giriş tələb olunur
Crée un compte gratuit pour continuer|Create a free account to continue|Cria uma conta grátis para continuar|Crea una cuenta gratis para continuar|أنشئ حساباً مجانياً للمتابعة|Fungua akaunti bure ili kuendelea|ለመቀጠል ነፃ መለያ ፍጠር|Davam etmək üçün pulsuz hesab yarat
Bienvenue sur Vibzo|Welcome to Vibzo|Bem-vindo ao Vibzo|Bienvenido a Vibzo|مرحباً بك في Vibzo|Karibu Vibzo|ወደ Vibzo እንኳን በደህና መጡ|Vibzo-ya xoş gəldin
E-mail ou mot de passe incorrect|Wrong email or password|E-mail ou palavra-passe incorretos|Correo o contraseña incorrectos|البريد أو كلمة المرور غير صحيحة|Barua pepe au nenosiri si sahihi|የተሳሳተ ኢሜይል ወይም የይለፍ ቃል|E-poçt və ya şifrə yanlışdır
Offres|Offers|Ofertas|Ofertas|العروض|Nafasi|ክፍት ቦታዎች|Vakansiyalar
Candidats|Candidates|Candidatos|Candidatos|المرشحون|Waombaji|አመልካቾች|Namizədlər
Mes annonces|My ads|Os meus anúncios|Mis anuncios|إعلاناتي|Matangazo yangu|ማስታወቂያዎቼ|Elanlarım
Tous les secteurs|All sectors|Todos os setores|Todos los sectores|كل القطاعات|Sekta zote|ሁሉም ዘርፎች|Bütün sahələr
Publier une offre|Post a job|Publicar uma oferta|Publicar una oferta|انشر وظيفة|Tangaza kazi|ስራ አስታውቅ|Vakansiya yerləşdir
Mon profil candidat|My candidate profile|O meu perfil de candidato|Mi perfil de candidato|ملفي كمرشح|Wasifu wangu wa muombaji|የአመልካች መገለጫዬ|Namizəd profilim
Postuler|Apply|Candidatar-me|Postularme|تقدّم|Omba|አመልክት|Müraciət et
Candidature envoyée|Application sent|Candidatura enviada|Candidatura enviada|تم إرسال الطلب|Ombi limetumwa|ማመልከቻ ተልኳል|Müraciət göndərildi
Ton offre|Your job|A tua oferta|Tu oferta|وظيفتك|Nafasi yako|የአንተ ማስታወቂያ|Sənin vakansiyan
Candidatures|Applications|Candidaturas|Candidaturas|الطلبات|Maombi|ማመልከቻዎች|Müraciətlər
Contacter|Contact|Contactar|Contactar|تواصل|Wasiliana|አግኝ|Əlaqə saxla
Aucune offre dans cette zone pour l’instant|No jobs in this area yet|Ainda não há ofertas nesta zona|Aún no hay ofertas en esta zona|لا توجد وظائف في هذه المنطقة بعد|Bado hakuna nafasi katika eneo hili|በዚህ አካባቢ እስካሁን ስራ የለም|Bu bölgədə hələ vakansiya yoxdur
Publier la première offre|Post the first job|Publicar a primeira oferta|Publicar la primera oferta|انشر أول وظيفة|Tangaza nafasi ya kwanza|የመጀመሪያውን ስራ አስታውቅ|İlk vakansiyanı yerləşdir
Aucun candidat dans cette zone pour l’instant|No candidates in this area yet|Ainda não há candidatos nesta zona|Aún no hay candidatos en esta zona|لا يوجد مرشحون في هذه المنطقة بعد|Bado hakuna waombaji katika eneo hili|በዚህ አካባቢ እስካሁን አመልካች የለም|Bu bölgədə hələ namizəd yoxdur
Tu n’as publié aucune offre|You haven’t posted any jobs|Ainda não publicaste ofertas|No has publicado ofertas|لم تنشر أي وظيفة|Hujatangaza nafasi yoyote|ምንም ስራ አላስታወቅክም|Heç bir vakansiya yerləşdirməmisən
Connecte-toi pour gérer tes annonces|Log in to manage your ads|Inicia sessão para gerir os teus anúncios|Inicia sesión para gestionar tus anuncios|سجّل الدخول لإدارة إعلاناتك|Ingia ili kusimamia matangazo yako|ማስታወቂያዎችህን ለማስተዳደር ግባ|Elanlarını idarə etmək üçün daxil ol
En vérification|Under review|Em verificação|En revisión|قيد المراجعة|Inakaguliwa|በመገምገም ላይ|Yoxlanılır
En ligne|Live|Online|En línea|منشورة|Mtandaoni|ቀጥታ|Aktiv
Fermée|Closed|Fechada|Cerrada|مغلقة|Imefungwa|ተዘግቷል|Bağlı
Refusée|Rejected|Recusada|Rechazada|مرفوضة|Imekataliwa|ተቀባይነት አላገኘም|Rədd edildi
Active|Active|Ativa|Activa|نشطة|Hai|ንቁ|Aktiv
Suspendue|Suspended|Suspensa|Suspendida|موقوفة|Imesimamishwa|ታግዷል|Dayandırılıb
Nouvelle|New|Nova|Nueva|جديدة|Mpya|አዲስ|Yeni
Confirmée|Confirmed|Confirmada|Confirmada|مؤكدة|Imethibitishwa|ተረጋግጧል|Təsdiqləndi
Expédiée|Shipped|Enviada|Enviada|تم الشحن|Imetumwa|ተልኳል|Göndərildi
Livrée|Delivered|Entregue|Entregada|تم التسليم|Imefikishwa|ደርሷል|Çatdırıldı
Annulée|Cancelled|Cancelada|Cancelada|ملغاة|Imeghairiwa|ተሰርዟል|Ləğv edildi
Un vrai recruteur ne demande jamais d’argent pour un emploi. Signale toute demande de paiement|A real recruiter never asks for money for a job. Report any payment request|Um recrutador verdadeiro nunca pede dinheiro por um emprego. Denuncia qualquer pedido de pagamento|Un reclutador real nunca pide dinero por un empleo. Denuncia cualquier solicitud de pago|المُوظِّف الحقيقي لا يطلب المال مقابل وظيفة. أبلغ عن أي طلب دفع|Mwajiri halisi kamwe haombi pesa kwa kazi. Ripoti ombi lolote la malipo|እውነተኛ ቀጣሪ ለስራ ገንዘብ አይጠይቅም። ማንኛውንም የክፍያ ጥያቄ ሪፖርት አድርግ|Əsl işəgötürən iş üçün heç vaxt pul istəmir. İstənilən ödəniş tələbini şikayət et
Ton message au recruteur|Your message to the recruiter|A tua mensagem ao recrutador|Tu mensaje al reclutador|رسالتك إلى المُوظِّف|Ujumbe wako kwa mwajiri|ለቀጣሪው መልዕክትህ|İşəgötürənə mesajın
Astuce : complète ton profil candidat pour que le recruteur voie tes compétences|Tip: complete your candidate profile so the recruiter sees your skills|Dica: completa o teu perfil para o recrutador ver as tuas competências|Consejo: completa tu perfil para que el reclutador vea tus habilidades|نصيحة: أكمل ملفك ليرى المُوظِّف مهاراتك|Kidokezo: kamilisha wasifu wako ili mwajiri aone ujuzi wako|ጠቃሚ ምክር፡ ቀጣሪው ችሎታህን እንዲያይ መገለጫህን አሟላ|Məsləhət: işəgötürən bacarıqlarını görsün deyə profilini tamamla
Envoyer ma candidature|Send my application|Enviar a minha candidatura|Enviar mi candidatura|أرسل طلبي|Tuma ombi langu|ማመልከቻዬን ላክ|Müraciətimi göndər
Intitulé du poste|Job title|Cargo|Puesto|المسمى الوظيفي|Jina la kazi|የስራ መደብ|Vəzifə
Entreprise|Company|Empresa|Empresa|الشركة|Kampuni|ድርጅት|Şirkət
Nom de l’entreprise|Company name|Nome da empresa|Nombre de la empresa|اسم الشركة|Jina la kampuni|የድርጅቱ ስም|Şirkətin adı
Secteur|Sector|Setor|Sector|القطاع|Sekta|ዘርፍ|Sahə
Contrat|Contract|Contrato|Contrato|العقد|Mkataba|ውል|Müqavilə
Mode|Mode|Modalidade|Modalidad|النمط|Mfumo|ሁኔታ|Rejim
Facultatif|Optional|Opcional|Opcional|اختياري|Hiari|አማራጭ|İstəyə bağlı
Description du poste|Job description|Descrição do cargo|Descripción del puesto|وصف الوظيفة|Maelezo ya kazi|የስራ መግለጫ|İşin təsviri
Missions, profil recherché, horaires, comment postuler|Duties, profile wanted, hours, how to apply|Funções, perfil procurado, horário, como candidatar|Funciones, perfil buscado, horario, cómo postular|المهام، المواصفات، الساعات، طريقة التقديم|Majukumu, sifa, saa, jinsi ya kuomba|ተግባራት፣ የሚፈለግ መገለጫ፣ ሰዓት፣ እንዴት ማመልከት|Vəzifələr, tələblər, iş saatları, necə müraciət etmək
Les offres sont vérifiées par l’équipe Vibzo avant publication. Il est interdit de demander de l’argent aux candidats|Jobs are checked by the Vibzo team before going live. Asking candidates for money is forbidden|As ofertas são verificadas pela equipa Vibzo antes de publicadas. É proibido pedir dinheiro aos candidatos|El equipo de Vibzo verifica las ofertas antes de publicarlas. Está prohibido pedir dinero a los candidatos|يتحقق فريق Vibzo من الوظائف قبل نشرها. يُمنع طلب المال من المرشحين|Timu ya Vibzo hukagua nafasi kabla ya kuchapishwa. Ni marufuku kuwaomba waombaji pesa|ስራዎች ከመታተማቸው በፊት በVibzo ቡድን ይፈተሻሉ። አመልካቾችን ገንዘብ መጠየቅ የተከለከለ ነው|Vakansiyalar dərc olunmadan əvvəl Vibzo komandası tərəfindən yoxlanılır. Namizədlərdən pul istəmək qadağandır
Envoyer pour publication|Submit for publishing|Enviar para publicação|Enviar para publicar|أرسل للنشر|Tuma ichapishwe|ለህትመት ላክ|Dərc üçün göndər
Métier recherché|Job wanted|Profissão procurada|Puesto buscado|الوظيفة المطلوبة|Kazi unayotafuta|የምትፈልገው ስራ|Axtardığın peşə
Expérience|Experience|Experiência|Experiencia|الخبرة|Uzoefu|ልምድ|Təcrübə
Compétences (séparées par des virgules)|Skills (comma-separated)|Competências (separadas por vírgulas)|Habilidades (separadas por comas)|المهارات (مفصولة بفواصل)|Ujuzi (tenganisha kwa koma)|ችሎታዎች (በኮማ የተለዩ)|Bacarıqlar (vergüllə ayır)
Disponibilité|Availability|Disponibilidade|Disponibilidad|التوفر|Upatikanaji|ዝግጁነት|Hazırlıq
Immédiate|Immediately|Imediata|Inmediata|فوري|Mara moja|ወዲያውኑ|Dərhal
Sous 2 semaines|Within 2 weeks|Em 2 semanas|En 2 semanas|خلال أسبوعين|Ndani ya wiki 2|በ2 ሳምንት ውስጥ|2 həftə ərzində
Sous 1 mois|Within 1 month|Em 1 mês|En 1 mes|خلال شهر|Ndani ya mwezi 1|በ1 ወር ውስጥ|1 ay ərzində
À propos de toi|About you|Sobre ti|Sobre ti|عنك|Kuhusu wewe|ስለ አንተ|Haqqında
Visible par les recruteurs|Visible to recruiters|Visível para recrutadores|Visible para reclutadores|مرئي للمُوظِّفين|Inaonekana kwa waajiri|ለቀጣሪዎች የሚታይ|İşəgötürənlərə görünür
Profil candidat enregistré|Candidate profile saved|Perfil de candidato guardado|Perfil de candidato guardado|تم حفظ ملف المرشح|Wasifu umehifadhiwa|የአመልካች መገለጫ ተቀምጧል|Namizəd profili saxlanıldı
Pas encore de candidature|No applications yet|Ainda sem candidaturas|Aún no hay candidaturas|لا طلبات بعد|Bado hakuna maombi|እስካሁን ማመልከቻ የለም|Hələ müraciət yoxdur
Répondre|Reply|Responder|Responder|رد|Jibu|መልስ|Cavab ver
Offre fermée|Job closed|Oferta fechada|Oferta cerrada|تم إغلاق الوظيفة|Nafasi imefungwa|ስራው ተዘግቷል|Vakansiya bağlandı
Informatique|IT|Informática|Informática|المعلوماتية|TEHAMA|አይቲ|İnformatika
Commerce|Retail|Comércio|Comercio|التجارة|Biashara|ንግድ|Ticarət
Marketing|Marketing|Marketing|Marketing|التسويق|Masoko|ማርኬቲንግ|Marketinq
Finance|Finance|Finanças|Finanzas|المالية|Fedha|ፋይናንስ|Maliyyə
Transport|Transport|Transporte|Transporte|النقل|Usafiri|ትራንስፖርት|Nəqliyyat
Hôtellerie|Hospitality|Hotelaria|Hostelería|الفندقة|Ukarimu|ሆቴል|Otelçilik
Santé|Health|Saúde|Salud|الصحة|Afya|ጤና|Səhiyyə
Éducation|Education|Educação|Educación|التعليم|Elimu|ትምህርት|Təhsil
BTP|Construction|Construção|Construcción|البناء|Ujenzi|ግንባታ|Tikinti
Agriculture|Agriculture|Agricultura|Agricultura|الزراعة|Kilimo|ግብርና|Kənd təsərrüfatı
Beauté|Beauty|Beleza|Belleza|التجميل|Urembo|ውበት|Gözəllik
Stage|Internship|Estágio|Prácticas|تدريب|Mafunzo|ልምምድ|Təcrübə proqramı
Temps partiel|Part-time|Tempo parcial|Medio tiempo|دوام جزئي|Muda mfupi|የትርፍ ጊዜ|Yarımştat
Petit boulot|Gig|Biscate|Trabajo puntual|عمل مؤقت|Kibarua|ጊዜያዊ ስራ|Kiçik iş
Sur site|On-site|Presencial|Presencial|في الموقع|Kazini|በቦታው|Yerində
Hybride|Hybrid|Híbrido|Híbrido|هجين|Mseto|ድብልቅ|Hibrid
Télétravail|Remote|Teletrabalho|Remoto|عن بُعد|Kazi ya mbali|ከርቀት|Uzaqdan
Tu as une boutique|Do you have a shop|Tens uma loja|¿Tienes una tienda|هل لديك متجر|Una duka|ሱቅ አለህ|Mağazan var
Vends tes produits dans tes vidéos, partout dans ta région|Sell your products in your videos, across your region|Vende os teus produtos nos teus vídeos, em toda a tua região|Vende tus productos en tus videos, en toda tu región|بِع منتجاتك في فيديوهاتك في كل منطقتك|Uza bidhaa zako kwenye video zako, mkoa mzima|ምርቶችህን በቪዲዮዎችህ በመላው ክልልህ ሽጥ|Məhsullarını videolarında bütün regionda sat
Produits|Products|Produtos|Productos|المنتجات|Bidhaa|ምርቶች|Məhsullar
Produits populaires|Popular products|Produtos populares|Productos populares|منتجات شائعة|Bidhaa maarufu|ታዋቂ ምርቶች|Populyar məhsullar
Aucun produit dans cette zone pour l’instant|No products in this area yet|Ainda não há produtos nesta zona|Aún no hay productos en esta zona|لا منتجات في هذه المنطقة بعد|Bado hakuna bidhaa katika eneo hili|በዚህ አካባቢ እስካሁን ምርት የለም|Bu bölgədə hələ məhsul yoxdur
en stock|in stock|em stock|en stock|في المخزون|zipo|በክምችት|anbarda
Paiement à la livraison|Cash on delivery|Pagamento na entrega|Pago contra entrega|الدفع عند الاستلام|Lipa unapopokea|ሲደርስ ክፍያ|Çatdırılmada ödəniş
Commander|Order|Encomendar|Pedir|اطلب|Agiza|እዘዝ|Sifariş et
Contacter sur WhatsApp|Contact on WhatsApp|Contactar no WhatsApp|Contactar por WhatsApp|تواصل عبر واتساب|Wasiliana kwa WhatsApp|በዋትስአፕ አግኝ|WhatsApp-da əlaqə
C’est ton produit|This is your product|Este é o teu produto|Es tu producto|هذا منتجك|Hii ni bidhaa yako|ይህ የአንተ ምርት ነው|Bu sənin məhsulundur
Adresse de livraison|Delivery address|Morada de entrega|Dirección de entrega|عنوان التسليم|Anwani ya kufikisha|የማድረሻ አድራሻ|Çatdırılma ünvanı
Quartier, rue, repère|Area, street, landmark|Bairro, rua, referência|Barrio, calle, referencia|الحي، الشارع، معلم|Mtaa, barabara, alama|ሰፈር፣ መንገድ፣ ምልክት|Məhəllə, küçə, nişan
Note pour le vendeur (facultatif)|Note for the seller (optional)|Nota para o vendedor (opcional)|Nota para el vendedor (opcional)|ملاحظة للبائع (اختياري)|Ujumbe kwa muuzaji (hiari)|ለሻጩ ማስታወሻ (አማራጭ)|Satıcıya qeyd (istəyə bağlı)
Taille, couleur, horaires|Size, colour, times|Tamanho, cor, horário|Talla, color, horario|المقاس، اللون، الأوقات|Ukubwa, rangi, saa|መጠን፣ ቀለም፣ ሰዓት|Ölçü, rəng, saatlar
Paiement à la livraison : tu paies en espèces ou par Mobile Money quand tu reçois le produit|Cash on delivery: pay in cash or by mobile money when you receive the product|Pagamento na entrega: pagas em dinheiro ou Mobile Money quando recebes o produto|Pago contra entrega: pagas en efectivo o con dinero móvil al recibir el producto|الدفع عند الاستلام: تدفع نقداً أو عبر المحفظة الإلكترونية عند استلام المنتج|Lipa unapopokea: lipa taslimu au kwa pesa ya simu unapopokea bidhaa|ሲደርስ ክፍያ፡ ምርቱን ስትቀበል በጥሬ ገንዘብ ወይም በሞባይል ገንዘብ ትከፍላለህ|Çatdırılmada ödəniş: məhsulu alanda nağd və ya mobil pulla ödəyirsən
Confirmer la commande|Confirm order|Confirmar encomenda|Confirmar pedido|تأكيد الطلب|Thibitisha agizo|ትዕዛዙን አረጋግጥ|Sifarişi təsdiqlə
Commande envoyée au vendeur|Order sent to the seller|Encomenda enviada ao vendedor|Pedido enviado al vendedor|تم إرسال الطلب إلى البائع|Agizo limetumwa kwa muuzaji|ትዕዛዙ ለሻጩ ተልኳል|Sifariş satıcıya göndərildi
Indique ton adresse de livraison|Enter your delivery address|Indica a tua morada de entrega|Indica tu dirección de entrega|أدخل عنوان التسليم|Weka anwani yako|አድራሻህን አስገባ|Çatdırılma ünvanını yaz
Indique un numéro de téléphone valide|Enter a valid phone number|Indica um número de telefone válido|Indica un número de teléfono válido|أدخل رقم هاتف صحيح|Weka namba sahihi ya simu|ትክክለኛ ስልክ ቁጥር አስገባ|Düzgün telefon nömrəsi yaz
Commandes|Orders|Encomendas|Pedidos|الطلبات|Maagizo|ትዕዛዞች|Sifarişlər
Mes achats|My purchases|As minhas compras|Mis compras|مشترياتي|Manunuzi yangu|ግዢዎቼ|Alışlarım
Reçues|Received|Recebidas|Recibidos|المستلمة|Zilizopokelewa|የተቀበሉ|Gələnlər
Aucune commande pour l’instant|No orders yet|Ainda sem encomendas|Aún no hay pedidos|لا طلبات بعد|Bado hakuna maagizo|እስካሁን ትዕዛዝ የለም|Hələ sifariş yoxdur
Connecte-toi pour voir tes commandes|Log in to see your orders|Inicia sessão para ver as tuas encomendas|Inicia sesión para ver tus pedidos|سجّل الدخول لرؤية طلباتك|Ingia ili kuona maagizo yako|ትዕዛዞችህን ለማየት ግባ|Sifarişlərini görmək üçün daxil ol
À la livraison|On delivery|Na entrega|Contra entrega|عند الاستلام|Wakati wa kupokea|ሲደርስ|Çatdırılmada
Vendeur|Seller|Vendedor|Vendedor|البائع|Muuzaji|ሻጭ|Satıcı
Ouvrir ma boutique|Open my shop|Abrir a minha loja|Abrir mi tienda|افتح متجري|Fungua duka langu|ሱቄን ክፈት|Mağazamı aç
Modifier ma boutique|Edit my shop|Editar a minha loja|Editar mi tienda|تعديل متجري|Hariri duka langu|ሱቄን አስተካክል|Mağazamı redaktə et
Abonnement Vendeur|Seller subscription|Assinatura Vendedor|Suscripción Vendedor|اشتراك البائع|Usajili wa Muuzaji|የሻጭ ምዝገባ|Satıcı abunəliyi
Tes produits visibles par toute ta région|Your products seen across your region|Os teus produtos visíveis em toda a região|Tus productos visibles en toda tu región|منتجاتك مرئية في كل منطقتك|Bidhaa zako zinaonekana mkoa mzima|ምርቶችህ በመላው ክልልህ ይታያሉ|Məhsulların bütün regionda görünür
Produits tagués dans tes vidéos|Products tagged in your videos|Produtos marcados nos teus vídeos|Productos etiquetados en tus videos|منتجات موسومة في فيديوهاتك|Bidhaa kwenye video zako|በቪዲዮዎችህ ውስጥ የተለጠፉ ምርቶች|Videolarında işarələnmiş məhsullar
Commandes reçues directement dans Vibzo|Orders received straight in Vibzo|Encomendas recebidas diretamente no Vibzo|Pedidos recibidos directamente en Vibzo|طلبات تصلك مباشرة في Vibzo|Maagizo yanakufikia moja kwa moja Vibzo|ትዕዛዞች በቀጥታ በVibzo ይደርሳሉ|Sifarişlər birbaşa Vibzo-da gəlir
Ta boutique est activée par l’équipe Vibzo après validation|Your shop is activated by the Vibzo team after review|A tua loja é ativada pela equipa Vibzo após validação|Tu tienda la activa el equipo de Vibzo tras la validación|يفعّل فريق Vibzo متجرك بعد المراجعة|Duka lako huwashwa na timu ya Vibzo baada ya ukaguzi|ሱቅህ ከግምገማ በኋላ በVibzo ቡድን ይነቃል|Mağazan yoxlamadan sonra Vibzo komandası tərəfindən aktivləşdirilir
Nom de la boutique|Shop name|Nome da loja|Nombre de la tienda|اسم المتجر|Jina la duka|የሱቁ ስም|Mağazanın adı
Plateforme|Platform|Plataforma|Plataforma|المنصة|Jukwaa|መድረክ|Platforma
Boutique sur Vibzo|Shop on Vibzo|Loja no Vibzo|Tienda en Vibzo|متجر على Vibzo|Duka kwenye Vibzo|በVibzo ላይ ሱቅ|Vibzo-da mağaza
J’ai une boutique Shopify|I have a Shopify shop|Tenho uma loja Shopify|Tengo una tienda Shopify|لدي متجر Shopify|Nina duka la Shopify|የShopify ሱቅ አለኝ|Shopify mağazam var
J’ai une boutique WooCommerce|I have a WooCommerce shop|Tenho uma loja WooCommerce|Tengo una tienda WooCommerce|لدي متجر WooCommerce|Nina duka la WooCommerce|የWooCommerce ሱቅ አለኝ|WooCommerce mağazam var
Lien de ta boutique (facultatif)|Shop link (optional)|Link da tua loja (opcional)|Enlace de tu tienda (opcional)|رابط متجرك (اختياري)|Kiungo cha duka (hiari)|የሱቅህ ሊንክ (አማራጭ)|Mağaza linki (istəyə bağlı)
WhatsApp de la boutique|Shop WhatsApp|WhatsApp da loja|WhatsApp de la tienda|واتساب المتجر|WhatsApp ya duka|የሱቁ ዋትስአፕ|Mağazanın WhatsApp-ı
Envoyer ma demande|Send my request|Enviar o meu pedido|Enviar mi solicitud|أرسل طلبي|Tuma ombi langu|ጥያቄዬን ላክ|Müraciətimi göndər
Donne un nom à ta boutique|Give your shop a name|Dá um nome à tua loja|Ponle nombre a tu tienda|أعطِ اسماً لمتجرك|Lipe duka lako jina|ለሱቅህ ስም ስጥ|Mağazana ad ver
Mes produits|My products|Os meus produtos|Mis productos|منتجاتي|Bidhaa zangu|ምርቶቼ|Məhsullarım
Ajouter un produit|Add a product|Adicionar um produto|Añadir un producto|أضف منتجاً|Ongeza bidhaa|ምርት ጨምር|Məhsul əlavə et
Ajouter le produit|Add product|Adicionar produto|Añadir producto|أضف المنتج|Ongeza bidhaa|ምርቱን ጨምር|Məhsulu əlavə et
Nom du produit|Product name|Nome do produto|Nombre del producto|اسم المنتج|Jina la bidhaa|የምርቱ ስም|Məhsulun adı
Stock|Stock|Stock|Stock|المخزون|Akiba|ክምችት|Anbar
Photo|Photo|Foto|Foto|صورة|Picha|ፎቶ|Şəkil
Commandes reçues|Orders received|Encomendas recebidas|Pedidos recibidos|الطلبات المستلمة|Maagizo yaliyopokelewa|የደረሱ ትዕዛዞች|Gələn sifarişlər
Aucun produit pour l’instant|No products yet|Ainda sem produtos|Aún no hay productos|لا منتجات بعد|Bado hakuna bidhaa|እስካሁን ምርት የለም|Hələ məhsul yoxdur
Masquer|Hide|Ocultar|Ocultar|إخفاء|Ficha|ደብቅ|Gizlət
Afficher|Show|Mostrar|Mostrar|إظهار|Onyesha|አሳይ|Göstər
Produit ajouté|Product added|Produto adicionado|Producto añadido|تمت إضافة المنتج|Bidhaa imeongezwa|ምርቱ ተጨምሯል|Məhsul əlavə edildi
Produit supprimé|Product deleted|Produto eliminado|Producto eliminado|تم حذف المنتج|Bidhaa imefutwa|ምርቱ ተሰርዟል|Məhsul silindi
Nom et prix requis|Name and price required|Nome e preço obrigatórios|Nombre y precio obligatorios|الاسم والسعر مطلوبان|Jina na bei vinahitajika|ስም እና ዋጋ ያስፈልጋሉ|Ad və qiymət tələb olunur
Activer ma boutique (abonnement Vendeur)|Activate my shop (Seller subscription)|Ativar a minha loja (assinatura Vendedor)|Activar mi tienda (suscripción Vendedor)|تفعيل متجري (اشتراك البائع)|Washa duka langu (usajili wa Muuzaji)|ሱቄን አንቃ (የሻጭ ምዝገባ)|Mağazamı aktivləşdir (Satıcı abunəliyi)
Ma boutique|My shop|A minha loja|Mi tienda|متجري|Duka langu|ሱቄ|Mağazam
Mes vidéos|My videos|Os meus vídeos|Mis videos|فيديوهاتي|Video zangu|ቪዲዮዎቼ|Videolarım
Vidéos|Videos|Vídeos|Videos|فيديوهات|Video|ቪዲዮዎች|Videolar
Favoris|Saved|Guardados|Guardados|المحفوظات|Zilizohifadhiwa|የተቀመጡ|Saxlanılanlar
Modifier le profil|Edit profile|Editar perfil|Editar perfil|تعديل الملف|Hariri wasifu|መገለጫ አስተካክል|Profili redaktə et
Publie ta première vidéo avec le bouton|Post your first video with the button|Publica o teu primeiro vídeo com o botão|Publica tu primer video con el botón|انشر أول فيديو لك بالزر|Chapisha video yako ya kwanza kwa kitufe|የመጀመሪያ ቪዲዮህን በአዝራሩ አትም|İlk videonu düymə ilə paylaş
Rien ici pour le moment|Nothing here yet|Nada aqui por agora|Nada aquí por ahora|لا شيء هنا حالياً|Hakuna kitu hapa bado|እስካሁን እዚህ ምንም የለም|Hələ burada heç nə yoxdur
Profil introuvable|Profile not found|Perfil não encontrado|Perfil no encontrado|الملف غير موجود|Wasifu haupatikani|መገለጫ አልተገኘም|Profil tapılmadı
Crée ton compte pour publier, suivre des créateurs, postuler et vendre|Create your account to post, follow creators, apply and sell|Cria a tua conta para publicar, seguir criadores, candidatar-te e vender|Crea tu cuenta para publicar, seguir creadores, postularte y vender|أنشئ حسابك للنشر ومتابعة صناع المحتوى والتقديم والبيع|Fungua akaunti ili kuchapisha, kufuata, kuomba kazi na kuuza|ለማተም፣ ለመከተል፣ ለማመልከት እና ለመሸጥ መለያ ፍጠር|Paylaşmaq, izləmək, müraciət etmək və satmaq üçün hesab yarat
Photo de profil|Profile photo|Foto de perfil|Foto de perfil|صورة الملف|Picha ya wasifu|የመገለጫ ፎቶ|Profil şəkli
Nom|Name|Nome|Nombre|الاسم|Jina|ስም|Ad
Bio|Bio|Bio|Biografía|نبذة|Wasifu mfupi|ስለ እኔ|Haqqımda
Profil mis à jour|Profile updated|Perfil atualizado|Perfil actualizado|تم تحديث الملف|Wasifu umesasishwa|መገለጫ ተዘምኗል|Profil yeniləndi
Confidentialité|Privacy|Privacidade|Privacidad|الخصوصية|Faragha|ግላዊነት|Məxfilik
Langue|Language|Idioma|Idioma|اللغة|Lugha|ቋንቋ|Dil
Installer l’application|Install the app|Instalar a aplicação|Instalar la app|ثبّت التطبيق|Sakinisha programu|መተግበሪያውን ጫን|Tətbiqi quraşdır
Installer Vibzo|Install Vibzo|Instalar o Vibzo|Instalar Vibzo|ثبّت Vibzo|Sakinisha Vibzo|Vibzoን ጫን|Vibzo-nu quraşdır
Vibzo est déjà installée sur cet appareil|Vibzo is already installed on this device|O Vibzo já está instalado neste aparelho|Vibzo ya está instalada en este dispositivo|Vibzo مثبّت بالفعل على هذا الجهاز|Vibzo tayari imesakinishwa kwenye kifaa hiki|Vibzo በዚህ መሣሪያ ላይ አስቀድሞ ተጭኗል|Vibzo artıq bu cihazda quraşdırılıb
Back-office admin|Admin back office|Back-office admin|Panel de administración|لوحة الإدارة|Ofisi ya msimamizi|የአስተዳዳሪ ገጽ|Admin paneli
Vibzo Gold|Vibzo Gold|Vibzo Gold|Vibzo Gold|Vibzo Gold|Vibzo Gold|Vibzo Gold|Vibzo Gold
Badge Gold sur ton profil et tes vidéos|Gold badge on your profile and videos|Distintivo Gold no teu perfil e vídeos|Insignia Gold en tu perfil y videos|شارة Gold على ملفك وفيديوهاتك|Beji ya Gold kwenye wasifu na video|በመገለጫህና ቪዲዮዎችህ ላይ የGold ምልክት|Profilində və videolarında Gold nişanı
Profils 18+, signalement et blocage en un clic|18+ profiles, one-tap reporting and blocking|Perfis 18+, denúncia e bloqueio num toque|Perfiles 18+, denuncia y bloqueo en un toque|ملفات 18+، إبلاغ وحظر بنقرة|Wasifu 18+, kuripoti na kuzuia kwa mguso mmoja|18+ መገለጫዎች፣ በአንድ ንክኪ ሪፖርትና ማገድ|18+ profillər, bir toxunuşla şikayət və blok
relation sérieuse ou sans lendemain, entre adultes, par ville, région ou pays|serious or casual, between adults, by city, region or country|relação séria ou casual, entre adultos, por cidade, região ou país|relación seria o casual, entre adultos, por ciudad, región o país|علاقة جدية أو عابرة، بين البالغين، حسب المدينة أو المنطقة أو البلد|uhusiano wa dhati au wa muda, kati ya watu wazima, kwa mji, mkoa au nchi|ከባድ ወይም ጊዜያዊ ግንኙነት፣ በአዋቂዎች መካከል፣ በከተማ፣ ክልል ወይም አገር|ciddi və ya qısamüddətli, böyüklər arasında, şəhər, region və ya ölkə üzrə
Durée|Duration|Duração|Duración|المدة|Muda|ቆይታ|Müddət
1 mois|1 month|1 mês|1 mes|شهر واحد|Mwezi 1|1 ወር|1 ay
3 mois|3 months|3 meses|3 meses|3 أشهر|Miezi 3|3 ወራት|3 ay
12 mois|12 months|12 meses|12 meses|12 شهراً|Miezi 12|12 ወራት|12 ay
Comment veux-tu payer|How do you want to pay|Como queres pagar|¿Cómo quieres pagar|كيف تريد الدفع|Unataka kulipa vipi|እንዴት መክፈል ትፈልጋለህ|Necə ödəmək istəyirsən
Espèces|Cash|Dinheiro|Efectivo|نقداً|Taslimu|ጥሬ ገንዘብ|Nağd
Demander l’activation Gold|Request Gold activation|Pedir ativação Gold|Solicitar activación Gold|اطلب تفعيل Gold|Omba kuwasha Gold|የGold ማንቃት ጠይቅ|Gold aktivləşdirməni istə
Demander l’activation Vendeur|Request Seller activation|Pedir ativação Vendedor|Solicitar activación Vendedor|اطلب تفعيل البائع|Omba kuwasha Muuzaji|የሻጭ ማንቃት ጠይቅ|Satıcı aktivləşdirməni istə
L’équipe Vibzo te contacte dans la messagerie avec le prix de ton pays et les instructions de paiement. L’abonnement est activé dès réception|The Vibzo team will message you with your country’s price and payment instructions. Your subscription starts once payment is received|A equipa Vibzo contacta-te na mensagem com o preço do teu país e as instruções de pagamento. A assinatura é ativada após receção|El equipo de Vibzo te escribirá con el precio de tu país y las instrucciones de pago. La suscripción se activa al recibir el pago|سيراسلك فريق Vibzo بسعر بلدك وتعليمات الدفع. يُفعَّل الاشتراك عند استلام الدفع|Timu ya Vibzo itakutumia ujumbe na bei ya nchi yako na maelekezo ya malipo. Usajili huanza malipo yakipokelewa|የVibzo ቡድን የአገርህን ዋጋና የክፍያ መመሪያ በመልዕክት ይልክልሃል። ክፍያ ሲደርስ ምዝገባው ይነቃል|Vibzo komandası ölkənin qiyməti və ödəniş təlimatı ilə sənə yazacaq. Abunəlik ödəniş alınan kimi aktivləşir
Demande envoyée ✅ L’équipe Vibzo va te contacter|Request sent ✅ The Vibzo team will contact you|Pedido enviado ✅ A equipa Vibzo vai contactar-te|Solicitud enviada ✅ El equipo de Vibzo te contactará|تم إرسال الطلب ✅ سيتواصل معك فريق Vibzo|Ombi limetumwa ✅ Timu ya Vibzo itawasiliana nawe|ጥያቄው ተልኳል ✅ የVibzo ቡድን ያገኝሃል|Müraciət göndərildi ✅ Vibzo komandası səninlə əlaqə saxlayacaq
Aller aux rencontres|Go to dating|Ir para encontros|Ir a citas|اذهب إلى التعارف|Nenda kwenye uchumba|ወደ ትውውቅ ሂድ|Tanışlığa keç
Rencontre des personnes de ta ville, de ta région ou de ton pays|Meet people from your city, region or country|Conhece pessoas da tua cidade, região ou país|Conoce gente de tu ciudad, región o país|تعرّف على أشخاص من مدينتك أو منطقتك أو بلدك|Kutana na watu wa mji, mkoa au nchi yako|ከከተማህ፣ ክልልህ ወይም አገርህ ሰዎችን ተዋወቅ|Şəhərindən, regionundan və ya ölkəndən insanlarla tanış ol
L’espace rencontres est réservé aux membres|The dating area is reserved for|O espaço de encontros é reservado aos membros|El espacio de citas está reservado a los miembros|مساحة التعارف مخصصة لأعضاء|Sehemu ya uchumba ni kwa wanachama|የትውውቅ ክፍሉ ለአባላት ብቻ ነው|Tanışlıq bölməsi yalnız üzvlər üçündür
de 18 ans et plus|aged 18 and over|com 18 anos ou mais|de 18 años o más|البالغين 18 عاماً فأكثر|wenye miaka 18 na zaidi|18 ዓመትና ከዚያ በላይ|18 yaş və yuxarı
Ta demande Gold est en cours. L’équipe Vibzo te contacte dans la messagerie|Your Gold request is being processed. The Vibzo team will message you|O teu pedido Gold está em curso. A equipa Vibzo contacta-te na mensagem|Tu solicitud Gold está en curso. El equipo de Vibzo te escribirá|طلب Gold قيد المعالجة. سيراسلك فريق Vibzo|Ombi lako la Gold linashughulikiwa. Timu ya Vibzo itakutumia ujumbe|የGold ጥያቄህ በሂደት ላይ ነው። የVibzo ቡድን መልዕክት ይልክልሃል|Gold müraciətin icradadır. Vibzo komandası sənə yazacaq
Crée ton profil de rencontre|Create your dating profile|Cria o teu perfil de encontros|Crea tu perfil de citas|أنشئ ملف التعارف|Tengeneza wasifu wa uchumba|የትውውቅ መገለጫህን ፍጠር|Tanışlıq profilini yarat
Il est séparé de ton profil public. Seuls les membres Gold qui ont aussi un profil de rencontre peuvent le voir|It’s separate from your public profile. Only Gold members with a dating profile can see it|É separado do teu perfil público. Só membros Gold com perfil de encontros o podem ver|Está separado de tu perfil público. Solo los miembros Gold con perfil de citas pueden verlo|منفصل عن ملفك العام. لا يراه إلا أعضاء Gold الذين لديهم ملف تعارف|Ni tofauti na wasifu wako wa umma. Ni wanachama wa Gold wenye wasifu wa uchumba tu wanaouona|ከሕዝባዊ መገለጫህ የተለየ ነው። የትውውቅ መገለጫ ያላቸው የGold አባላት ብቻ ያዩታል|İctimai profilindən ayrıdır. Yalnız tanışlıq profili olan Gold üzvləri görə bilər
Réservé aux 18 ans et plus|For ages 18 and over only|Reservado a maiores de 18|Solo para mayores de 18|مخصص لمن هم 18 عاماً فأكثر|Kwa wenye miaka 18 na zaidi tu|ለ18 ዓመትና ከዚያ በላይ ብቻ|Yalnız 18 yaş və yuxarı
Respect et consentement avant tout|Respect and consent first|Respeito e consentimento acima de tudo|Respeto y consentimiento ante todo|الاحترام والموافقة أولاً|Heshima na ridhaa kwanza|መከባበርና ፈቃድ ቅድሚያ|Hörmət və razılıq hər şeydən öncə
Interdit : nudité, échanges d’argent, prostitution, faux profils|Forbidden: nudity, money requests, prostitution, fake profiles|Proibido: nudez, pedidos de dinheiro, prostituição, perfis falsos|Prohibido: desnudez, pedir dinero, prostitución, perfiles falsos|ممنوع: العري، طلب المال، الدعارة، الملفات المزيفة|Marufuku: uchi, kuomba pesa, ukahaba, wasifu bandia|የተከለከለ፡ እርቃን፣ ገንዘብ መጠየቅ፣ ዝሙት አዳሪነት፣ የውሸት መገለጫ|Qadağandır: çılpaqlıq, pul istəmək, fahişəlik, saxta profillər
Créer mon profil|Create my profile|Criar o meu perfil|Crear mi perfil|أنشئ ملفي|Tengeneza wasifu wangu|መገለጫዬን ፍጠር|Profilimi yarat
Mon profil rencontre|My dating profile|O meu perfil de encontros|Mi perfil de citas|ملف التعارف الخاص بي|Wasifu wangu wa uchumba|የትውውቅ መገለጫዬ|Tanışlıq profilim
Créer mon profil rencontre|Create my dating profile|Criar o meu perfil de encontros|Crear mi perfil de citas|أنشئ ملف التعارف|Tengeneza wasifu wangu wa uchumba|የትውውቅ መገለጫዬን ፍጠር|Tanışlıq profilimi yarat
Photo de toi (visage visible)|Photo of you (face visible)|Foto tua (rosto visível)|Foto tuya (cara visible)|صورتك (الوجه ظاهر)|Picha yako (uso uonekane)|የአንተ ፎቶ (ፊት የሚታይ)|Şəklin (üz görünsün)
Prénom|First name|Nome próprio|Nombre|الاسم الأول|Jina la kwanza|የመጀመሪያ ስም|Ad
Date de naissance|Date of birth|Data de nascimento|Fecha de nacimiento|تاريخ الميلاد|Tarehe ya kuzaliwa|የትውልድ ቀን|Doğum tarixi
Je suis|I am|Sou|Soy|أنا|Mimi ni|እኔ|Mən
Je cherche|Looking for|Procuro|Busco|أبحث عن|Natafuta|የምፈልገው|Axtarıram
Un homme|A man|Um homem|Un hombre|رجل|Mwanaume|ወንድ|Kişi
Une femme|A woman|Uma mulher|Una mujer|امرأة|Mwanamke|ሴት|Qadın
Des femmes|Women|Mulheres|Mujeres|نساء|Wanawake|ሴቶች|Qadınlar
Des hommes|Men|Homens|Hombres|رجال|Wanaume|ወንዶች|Kişilər
Les deux|Both|Ambos|Ambos|كلاهما|Wote|ሁለቱም|Hər ikisi
Ce que je recherche|What I’m looking for|O que procuro|Lo que busco|ما أبحث عنه|Ninachotafuta|የምፈልገው|Nə axtarıram
Relation sérieuse|Serious relationship|Relação séria|Relación seria|علاقة جدية|Uhusiano wa dhati|ከባድ ግንኙነት|Ciddi münasibət
Sans lendemain|Casual|Sem compromisso|Sin compromiso|علاقة عابرة|Bila ahadi|ጊዜያዊ|Öhdəliksiz
Ouvert(e) aux deux|Open to both|Aberto(a) às duas|Abierto(a) a ambas|منفتح على الاثنين|Wazi kwa yote mawili|ለሁለቱም ክፍት|Hər ikisinə açığam
À propos de moi|About me|Sobre mim|Sobre mí|عني|Kunihusu|ስለ እኔ|Haqqımda
Ce que j’aime, ce que je cherche|What I like, what I’m looking for|O que gosto, o que procuro|Lo que me gusta, lo que busco|ما أحبه وما أبحث عنه|Ninachopenda, ninachotafuta|የምወደው፣ የምፈልገው|Nəyi sevirəm, nə axtarıram
Centres d’intérêt (séparés par des virgules)|Interests (comma-separated)|Interesses (separados por vírgulas)|Intereses (separados por comas)|الاهتمامات (مفصولة بفواصل)|Mambo unayopenda (tenganisha kwa koma)|ፍላጎቶች (በኮማ የተለዩ)|Maraqlar (vergüllə ayır)
Musique, voyage, cuisine|Music, travel, cooking|Música, viagens, cozinha|Música, viajes, cocina|موسيقى، سفر، طبخ|Muziki, safari, mapishi|ሙዚቃ፣ ጉዞ፣ ምግብ ማብሰል|Musiqi, səyahət, mətbəx
Mon profil est visible|My profile is visible|O meu perfil está visível|Mi perfil es visible|ملفي مرئي|Wasifu wangu unaonekana|መገለጫዬ ይታያል|Profilim görünür
Je certifie avoir 18 ans ou plus|I confirm I am 18 or older|Certifico que tenho 18 anos ou mais|Certifico que tengo 18 años o más|أؤكد أن عمري 18 عاماً أو أكثر|Nathibitisha nina miaka 18 au zaidi|ዕድሜዬ 18 ወይም ከዚያ በላይ መሆኑን አረጋግጣለሁ|18 yaşım və ya daha çox olduğunu təsdiq edirəm
Je respecte la charte : consentement, respect, aucun échange d’argent, aucune nudité, aucun faux profil|I follow the rules: consent, respect, no money exchange, no nudity, no fake profiles|Respeito as regras: consentimento, respeito, sem dinheiro, sem nudez, sem perfis falsos|Respeto las normas: consentimiento, respeto, sin dinero, sin desnudez, sin perfiles falsos|ألتزم بالميثاق: الموافقة، الاحترام، لا تبادل للمال، لا عري، لا ملفات مزيفة|Nafuata kanuni: ridhaa, heshima, hakuna pesa, hakuna uchi, hakuna wasifu bandia|ደንቦቹን እከተላለሁ፡ ፈቃድ፣ መከባበር፣ ገንዘብ የለም፣ እርቃን የለም፣ የውሸት መገለጫ የለም|Qaydalara əməl edirəm: razılıq, hörmət, pul mübadiləsi yox, çılpaqlıq yox, saxta profil yox
Supprimer mon profil rencontre|Delete my dating profile|Eliminar o meu perfil de encontros|Eliminar mi perfil de citas|احذف ملف التعارف|Futa wasifu wangu wa uchumba|የትውውቅ መገለጫዬን ሰርዝ|Tanışlıq profilimi sil
Supprimer ton profil rencontre|Delete your dating profile|Eliminar o teu perfil de encontros|¿Eliminar tu perfil de citas|حذف ملف التعارف|Futa wasifu wako wa uchumba|የትውውቅ መገለጫህን ሰርዝ|Tanışlıq profilini sil
Indique ton prénom|Enter your first name|Indica o teu nome|Indica tu nombre|أدخل اسمك الأول|Weka jina lako la kwanza|የመጀመሪያ ስምህን አስገባ|Adını yaz
Indique ta date de naissance|Enter your date of birth|Indica a tua data de nascimento|Indica tu fecha de nacimiento|أدخل تاريخ ميلادك|Weka tarehe yako ya kuzaliwa|የትውልድ ቀንህን አስገባ|Doğum tarixini yaz
Indique ta ville|Enter your city|Indica a tua cidade|Indica tu ciudad|أدخل مدينتك|Weka mji wako|ከተማህን አስገባ|Şəhərini yaz
Ajoute une photo de toi|Add a photo of yourself|Adiciona uma foto tua|Añade una foto tuya|أضف صورة لك|Ongeza picha yako|የራስህን ፎቶ ጨምር|Öz şəklini əlavə et
Coche les deux cases pour continuer|Tick both boxes to continue|Marca as duas caixas para continuar|Marca las dos casillas para continuar|حدد المربعين للمتابعة|Weka alama visanduku vyote viwili ili kuendelea|ለመቀጠል ሁለቱንም ሳጥኖች ምልክት አድርግ|Davam etmək üçün hər iki xananı işarələ
L’espace rencontres est réservé aux 18 ans et plus|The dating area is for ages 18 and over|O espaço de encontros é reservado a maiores de 18|El espacio de citas es solo para mayores de 18|مساحة التعارف مخصصة لمن هم 18 عاماً فأكثر|Sehemu ya uchumba ni kwa wenye miaka 18 na zaidi|የትውውቅ ክፍሉ ለ18 ዓመትና ከዚያ በላይ ነው|Tanışlıq bölməsi 18 yaş və yuxarı üçündür
Profil rencontre enregistré|Dating profile saved|Perfil de encontros guardado|Perfil de citas guardado|تم حفظ ملف التعارف|Wasifu wa uchumba umehifadhiwa|የትውውቅ መገለጫ ተቀምጧል|Tanışlıq profili saxlanıldı
Profil rencontre supprimé|Dating profile deleted|Perfil de encontros eliminado|Perfil de citas eliminado|تم حذف ملف التعارف|Wasifu wa uchumba umefutwa|የትውውቅ መገለጫ ተሰርዟል|Tanışlıq profili silindi
Toutes intentions|All intentions|Todas as intenções|Todas las intenciones|كل النوايا|Nia zote|ሁሉም ዓላማዎች|Bütün niyyətlər
Tous âges|All ages|Todas as idades|Todas las edades|كل الأعمار|Umri wote|ሁሉም ዕድሜዎች|Bütün yaşlar
Ma région|My region|A minha região|Mi región|منطقتي|Mkoa wangu|ክልሌ|Regionum
Tes matchs|Your matches|Os teus matches|Tus matches|تطابقاتك|Wanaokufaa|ተዛማጆችህ|Uyğunluqların
Premier rendez-vous dans un lieu public, préviens un proche. N’envoie jamais d’argent|Meet first in a public place and tell someone close. Never send money|Primeiro encontro num local público, avisa alguém próximo. Nunca envies dinheiro|Primera cita en un lugar público, avisa a alguien cercano. Nunca envíes dinero|أول لقاء في مكان عام وأخبر شخصاً مقرباً. لا ترسل المال أبداً|Kutana kwanza mahali pa umma, mjulishe mtu wa karibu. Usitume pesa kamwe|የመጀመሪያው ቀጠሮ በሕዝብ ቦታ ይሁን፣ ለቅርብ ሰው አሳውቅ። ገንዘብ በፍጹም አትላክ|İlk görüş ictimai yerdə olsun, yaxınına xəbər ver. Heç vaxt pul göndərmə
Plus de profils ici pour l’instant|No more profiles here for now|Sem mais perfis aqui por agora|No hay más perfiles aquí por ahora|لا مزيد من الملفات هنا حالياً|Hakuna wasifu zaidi hapa kwa sasa|ለአሁን ተጨማሪ መገለጫ የለም|Hələlik burada başqa profil yoxdur
Élargis la zone (région, pays) ou reviens plus tard : de nouveaux membres arrivent chaque jour|Widen the area (region, country) or come back later: new members join every day|Alarga a zona (região, país) ou volta mais tarde: chegam novos membros todos os dias|Amplía la zona (región, país) o vuelve más tarde: llegan nuevos miembros cada día|وسّع المنطقة (المنطقة، البلد) أو عد لاحقاً: ينضم أعضاء جدد يومياً|Panua eneo (mkoa, nchi) au rudi baadaye: wanachama wapya hujiunga kila siku|አካባቢውን አስፋ (ክልል፣ አገር) ወይም በኋላ ተመለስ፡ በየቀኑ አዳዲስ አባላት ይመጣሉ|Bölgəni genişlət (region, ölkə) və ya sonra qayıt: hər gün yeni üzvlər qoşulur
C’est un match|It’s a match|É um match|¡Es un match|إنه تطابق|Mmefaana|ተዛምዷል|Uyğunluq var
Vous êtes plu|You like each other|Gostaram um do outro|Os habéis gustado|أعجبتما ببعضكما|Mmependana|ተዋደዳችሁ|Bir-birinizi bəyəndiniz
Envoyer un message|Send a message|Enviar uma mensagem|Enviar un mensaje|أرسل رسالة|Tuma ujumbe|መልዕክት ላክ|Mesaj göndər
Bloquer ce profil|Block this profile|Bloquear este perfil|Bloquear este perfil|حظر هذا الملف|Zuia wasifu huu|ይህን መገለጫ አግድ|Bu profili blokla
Signaler ce profil|Report this profile|Denunciar este perfil|Denunciar este perfil|الإبلاغ عن هذا الملف|Ripoti wasifu huu|ይህን መገለጫ ሪፖርት አድርግ|Bu profili şikayət et
Conseils de sécurité|Safety tips|Dicas de segurança|Consejos de seguridad|نصائح الأمان|Vidokezo vya usalama|የደህንነት ምክሮች|Təhlükəsizlik məsləhətləri
Profil bloqué|Profile blocked|Perfil bloqueado|Perfil bloqueado|تم حظر الملف|Wasifu umezuiwa|መገለጫው ታግዷል|Profil bloklandı
J’AIME|LIKE|GOSTO|ME GUSTA|أعجبني|NAPENDA|ወደድኩ|BƏYƏN
NON|NOPE|NÃO|NO|لا|HAPANA|አይ|YOX
Passer|Pass|Passar|Pasar|تخطّ|Ruka|እለፍ|Keç
Messages|Messages|Mensagens|Mensajes|الرسائل|Ujumbe|መልዕክቶች|Mesajlar
Rencontre|Dating|Encontro|Cita|تعارف|Uchumba|ትውውቅ|Tanışlıq
Emploi|Job|Emprego|Empleo|وظيفة|Kazi|ስራ|İş
Aucune conversation|No conversations|Sem conversas|Sin conversaciones|لا محادثات|Hakuna mazungumzo|ውይይት የለም|Söhbət yoxdur
Contacte un créateur, un recruteur ou un vendeur pour commencer|Contact a creator, recruiter or seller to get started|Contacta um criador, recrutador ou vendedor para começar|Contacta a un creador, reclutador o vendedor para empezar|تواصل مع صانع محتوى أو مُوظِّف أو بائع للبدء|Wasiliana na mtayarishi, mwajiri au muuzaji kuanza|ለመጀመር ፈጣሪን፣ ቀጣሪን ወይም ሻጭን አግኝ|Başlamaq üçün yaradıcı, işəgötürən və ya satıcı ilə əlaqə saxla
Écris un message|Write a message|Escreve uma mensagem|Escribe un mensaje|اكتب رسالة|Andika ujumbe|መልዕክት ጻፍ|Mesaj yaz
Ne partage jamais tes codes, mots de passe ou paiements d’avance. Signale tout comportement suspect|Never share codes, passwords or advance payments. Report anything suspicious|Nunca partilhes códigos, palavras-passe ou pagamentos antecipados. Denuncia comportamentos suspeitos|Nunca compartas códigos, contraseñas ni pagos por adelantado. Denuncia cualquier comportamiento sospechoso|لا تشارك أبداً الرموز أو كلمات المرور أو الدفعات المسبقة. أبلغ عن أي سلوك مريب|Usishiriki kamwe misimbo, manenosiri au malipo ya awali. Ripoti tabia yoyote ya shaka|ኮዶችን፣ የይለፍ ቃሎችን ወይም ቅድመ ክፍያዎችን በፍጹም አታጋራ። አጠራጣሪ ባህሪን ሪፖርት አድርግ|Kodları, şifrələri və ya qabaqcadan ödənişləri heç vaxt paylaşma. Şübhəli davranışı şikayət et
Signaler cette personne|Report this person|Denunciar esta pessoa|Denunciar a esta persona|الإبلاغ عن هذا الشخص|Ripoti mtu huyu|ይህን ሰው ሪፖርት አድርግ|Bu şəxsi şikayət et
Ouvre ce site dans|Open this site in|Abre este site no|Abre este sitio en|افتح هذا الموقع في|Fungua tovuti hii kwenye|ይህን ድረ-ገጽ ክፈት በ|Bu saytı burada aç:
Touche le bouton|Tap the button|Toca no botão|Toca el botón|اضغط على زر|Gusa kitufe|አዝራሩን ንካ|Düyməyə toxun
Touche le menu|Tap the menu|Toca no menu|Toca el menú|اضغط على القائمة|Gusa menyu|ምናሌውን ንካ|Menyuya toxun
en haut à droite|at the top right|no canto superior direito|arriba a la derecha|في أعلى اليمين|juu kulia|ከላይ በቀኝ|yuxarı sağda
Choisis|Choose|Escolhe|Elige|اختر|Chagua|ምረጥ|Seç
Sur l’écran d’accueil|Add to Home Screen|No ecrã principal|A la pantalla de inicio|إلى الشاشة الرئيسية|Kwenye skrini ya mwanzo|ወደ መነሻ ማያ|Əsas ekrana
Installer l’application|Install app|Instalar aplicação|Instalar aplicación|تثبيت التطبيق|Sakinisha programu|መተግበሪያ ጫን|Tətbiqi quraşdır
Ajouter à l’écran d’accueil|Add to Home screen|Adicionar ao ecrã principal|Añadir a la pantalla de inicio|إضافة إلى الشاشة الرئيسية|Ongeza kwenye skrini ya mwanzo|ወደ መነሻ ማያ ጨምር|Əsas ekrana əlavə et
carré avec une flèche|square with an arrow|quadrado com uma seta|cuadrado con una flecha|مربع بسهم|mraba wenye mshale|ቀስት ያለው ካሬ|oxlu kvadrat
Télécharger l’app Android (APK)|Download the Android app (APK)|Descarregar a app Android (APK)|Descargar la app Android (APK)|نزّل تطبيق أندرويد (APK)|Pakua programu ya Android (APK)|የAndroid መተግበሪያ አውርድ (APK)|Android tətbiqini yüklə (APK)
Si Android le demande, autorise l’installation depuis ton navigateur|If Android asks, allow installation from your browser|Se o Android pedir, permite a instalação a partir do navegador|Si Android lo pide, permite la instalación desde tu navegador|إذا طلب أندرويد ذلك، اسمح بالتثبيت من متصفحك|Android ikiuliza, ruhusu usakinishaji kutoka kivinjari chako|Android ከጠየቀ ከአሳሽህ መጫንን ፍቀድ|Android soruşsa, brauzerdən quraşdırmaya icazə ver
Back-office|Back office|Back-office|Administración|الإدارة|Ofisi ya nyuma|የኋላ ቢሮ|İdarəetmə
Accès réservé|Restricted access|Acesso reservado|Acceso restringido|دخول مقيد|Ufikiaji maalum|የተገደበ መዳረሻ|Məhdud giriş
Connexion impossible|Cannot connect|Não foi possível ligar|No se puede conectar|تعذر الاتصال|Haiwezi kuunganisha|መገናኘት አልተቻለም|Qoşulmaq mümkün deyil
Vérifie ta connexion internet puis recharge la page|Check your internet connection and reload the page|Verifica a ligação à internet e recarrega a página|Revisa tu conexión a internet y recarga la página|تحقق من اتصالك بالإنترنت وأعد تحميل الصفحة|Angalia mtandao wako kisha pakia upya ukurasa|የኢንተርኔት ግንኙነትህን ፈትሽና ገጹን እንደገና ጫን|İnternet bağlantını yoxla və səhifəni yenilə
Vidéo trop longue (3 minutes max)|Video too long (3 minutes max)|Vídeo demasiado longo (máx. 3 minutos)|Video demasiado largo (máx. 3 minutos)|الفيديو طويل جداً (3 دقائق كحد أقصى)|Video ni ndefu mno (dakika 3 zaidi)|ቪዲዮው በጣም ረጅም ነው (ከፍተኛ 3 ደቂቃ)|Video çox uzundur (maks. 3 dəqiqə)
Vidéo trop lourde (50 Mo max). Raccourcis-la ou réduis la qualité|Video too large (50 MB max). Shorten it or lower the quality|Vídeo demasiado pesado (máx. 50 MB). Encurta-o ou reduz a qualidade|Video demasiado pesado (máx. 50 MB). Acórtalo o baja la calidad|الفيديو كبير جداً (50 ميغابايت كحد أقصى). اختصره أو اخفض الجودة|Video ni kubwa mno (MB 50 zaidi). Ifupishe au punguza ubora|ቪዲዮው በጣም ትልቅ ነው (ከፍተኛ 50 MB)። አሳጥረው ወይም ጥራቱን ቀንስ|Video çox böyükdür (maks. 50 MB). Qısalt və ya keyfiyyəti azalt
Renseigne le poste et l’entreprise|Enter the job and the company|Indica o cargo e a empresa|Indica el puesto y la empresa|أدخل الوظيفة والشركة|Weka kazi na kampuni|ስራውንና ድርጅቱን አስገባ|Vəzifəni və şirkəti yaz
Indique le métier recherché|Enter the job you want|Indica a profissão procurada|Indica el puesto buscado|أدخل الوظيفة المطلوبة|Weka kazi unayotafuta|የምትፈልገውን ስራ አስገባ|Axtardığın peşəni yaz
Offre envoyée ✅ Elle sera en ligne après vérification|Job sent ✅ It will go live after review|Oferta enviada ✅ Ficará online após verificação|Oferta enviada ✅ Se publicará tras la revisión|تم إرسال الوظيفة ✅ ستُنشر بعد المراجعة|Nafasi imetumwa ✅ Itachapishwa baada ya ukaguzi|ማስታወቂያው ተልኳል ✅ ከግምገማ በኋላ ይታተማል|Vakansiya göndərildi ✅ Yoxlamadan sonra dərc olunacaq
Boutique mise à jour|Shop updated|Loja atualizada|Tienda actualizada|تم تحديث المتجر|Duka limesasishwa|ሱቁ ተዘምኗል|Mağaza yeniləndi
Abonnement ajouté|Now following|A seguir|Siguiendo|تمت المتابعة|Unafuata sasa|አሁን ይከተላሉ|İzləyirsən
Ajouté à tes favoris|Added to saved|Adicionado aos guardados|Añadido a guardados|أُضيف إلى المحفوظات|Imeongezwa kwenye zilizohifadhiwa|ወደ የተቀመጡ ታክሏል|Saxlanılanlara əlavə edildi
Retiré des favoris|Removed from saved|Removido dos guardados|Quitado de guardados|أُزيل من المحفوظات|Imeondolewa kwenye zilizohifadhiwa|ከተቀመጡ ተወግዷል|Saxlanılanlardan çıxarıldı
Connecte-toi pour aimer les vidéos|Log in to like videos|Inicia sessão para gostar de vídeos|Inicia sesión para dar me gusta|سجّل الدخول للإعجاب بالفيديوهات|Ingia ili kupenda video|ቪዲዮዎችን ለመውደድ ግባ|Videoları bəyənmək üçün daxil ol
Connecte-toi pour postuler|Log in to apply|Inicia sessão para te candidatares|Inicia sesión para postularte|سجّل الدخول للتقديم|Ingia ili kuomba|ለማመልከት ግባ|Müraciət üçün daxil ol
Connecte-toi pour commander|Log in to order|Inicia sessão para encomendar|Inicia sesión para pedir|سجّل الدخول للطلب|Ingia ili kuagiza|ለማዘዝ ግባ|Sifariş üçün daxil ol
Connecte-toi pour voir tes messages|Log in to see your messages|Inicia sessão para ver as tuas mensagens|Inicia sesión para ver tus mensajes|سجّل الدخول لرؤية رسائلك|Ingia ili kuona ujumbe wako|መልዕክቶችህን ለማየት ግባ|Mesajlarını görmək üçün daxil ol
Pays & région|Country & region|País e região|País y región|البلد والمنطقة|Nchi na mkoa|አገር እና ክልል|Ölkə və region
Afrique de l’Ouest|West Africa|África Ocidental|África Occidental|غرب أفريقيا|Afrika Magharibi|ምዕራብ አፍሪካ|Qərbi Afrika
Afrique centrale|Central Africa|África Central|África Central|وسط أفريقيا|Afrika ya Kati|መካከለኛው አፍሪካ|Mərkəzi Afrika
Afrique de l’Est|East Africa|África Oriental|África Oriental|شرق أفريقيا|Afrika Mashariki|ምሥራቅ አፍሪካ|Şərqi Afrika
Azerbaïdjan|Azerbaijan|Azerbaijão|Azerbaiyán|أذربيجان|Azabajani|አዘርባይጃን|Azərbaycan
à l’instant|just now|agora mesmo|ahora mismo|الآن|sasa hivi|አሁን|indicə
Supprimer mon compte|Delete my account|Eliminar a minha conta|Eliminar mi cuenta|حذف حسابي|Futa akaunti yangu|መለያዬን ሰርዝ|Hesabımı sil
Supprimer définitivement ton compte|Permanently delete your account|Eliminar definitivamente a tua conta|¿Eliminar definitivamente tu cuenta|حذف حسابك نهائياً|Futa akaunti yako kabisa|መለያህን በቋሚነት ሰርዝ|Hesabını həmişəlik sil
Écris SUPPRIMER pour confirmer|Type SUPPRIMER to confirm|Escreve SUPPRIMER para confirmar|Escribe SUPPRIMER para confirmar|اكتب SUPPRIMER للتأكيد|Andika SUPPRIMER kuthibitisha|ለማረጋገጥ SUPPRIMER ጻፍ|Təsdiq üçün SUPPRIMER yaz
Ton compte a été supprimé|Your account has been deleted|A tua conta foi eliminada|Tu cuenta ha sido eliminada|تم حذف حسابك|Akaunti yako imefutwa|መለያህ ተሰርዟል|Hesabın silindi
Utilisateurs par pays|Users by country|Utilizadores por país|Usuarios por país|المستخدمون حسب البلد|Watumiaji kwa nchi|ተጠቃሚዎች በአገር|Ölkələr üzrə istifadəçilər`;

const DICT = new Map();
const core = t => { const m = t.match(/^([^\p{L}\p{N}]*)([\s\S]*?)([^\p{L}\p{N}]*)$/u); return m ? m : [t, '', t, '']; };
RAW.split('\n').forEach(line => {
  const p = line.split('|'); if (p.length !== 8) return;
  const key = core(p[0])[2]; if (!key) return;
  const row = {}; COLS.forEach((l, i) => { row[l] = core(p[i + 1])[2]; }); DICT.set(key, row);
});

const AGO = { en: ['{n} min ago', '{n} h ago', '{n} d ago'], pt: ['há {n} min', 'há {n} h', 'há {n} d'], es: ['hace {n} min', 'hace {n} h', 'hace {n} d'], ar: ['منذ {n} د', 'منذ {n} س', 'منذ {n} ي'], sw: ['dakika {n} zilizopita', 'saa {n} zilizopita', 'siku {n} zilizopita'], am: ['ከ{n} ደቂቃ በፊት', 'ከ{n} ሰዓት በፊት', 'ከ{n} ቀን በፊት'], az: ['{n} dəq əvvəl', '{n} saat əvvəl', '{n} gün əvvəl'] };

let lang = 'fr';
export const getLang = () => lang;

function translateText(s) {
  if (lang === 'fr' || !s || !/\p{L}/u.test(s)) return null;
  const m = core(s); const pre = m[1], mid = m[2], post = m[3];
  const row = DICT.get(mid);
  if (row && row[lang]) return pre + row[lang] + post;
  const c2 = mid.match(/^(.+?) \((\d+)$/); if (c2 && DICT.get(c2[1]) && DICT.get(c2[1])[lang]) return pre + DICT.get(c2[1])[lang] + ' (' + c2[2] + post;
  const a = mid.match(/^il y a (\d+) (min|h|j)$/);
  if (a && AGO[lang]) return pre + AGO[lang][{ min: 0, h: 1, j: 2 }[a[2]]].replace('{n}', a[1]) + post;
  return null;
}
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE']);
function translateNode(root) {
  if (lang === 'fr' || !root) return;
  if (root.nodeType === 3) { tText(root); return; }
  if (root.nodeType !== 1 || SKIP.has(root.tagName)) return;
  tAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => n.nodeType === 1 && SKIP.has(n.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  let n; while ((n = w.nextNode())) { if (n.nodeType === 3) tText(n); else tAttrs(n); }
}
function tText(n) { if (n.__vz === n.nodeValue) return; const t = translateText(n.nodeValue); if (t != null) { n.nodeValue = t; } n.__vz = n.nodeValue; }
function tAttrs(el) { ['placeholder', 'aria-label', 'title'].forEach(a => { const v = el.getAttribute && el.getAttribute(a); if (v) { const t = translateText(v); if (t != null) el.setAttribute(a, t); } }); }

let obs;
export function initI18n(l) {
  lang = LANGS[l] ? l : 'fr';
  document.documentElement.lang = lang;
  if (obs) obs.disconnect();
  if (lang === 'fr') return;
  translateNode(document.body);
  obs = new MutationObserver(ms => { ms.forEach(m => { if (m.type === 'characterData') tText(m.target); else m.addedNodes.forEach(translateNode); }); });
  obs.observe(document.body, { subtree: true, childList: true, characterData: true });
}
export function langFor(country) { return OFFICIAL[country] || 'fr'; }
