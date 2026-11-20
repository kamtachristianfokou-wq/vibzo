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
Depuis ta galerie ou ta caméra · tous formats · 3 minutes maximum|From your gallery or camera · any format · 3 minutes max|Da tua galeria ou câmara · todos os formatos · 3 minutos no máximo|Desde tu galería o cámara · todos los formatos · 3 minutos máximo|من معرضك أو الكاميرا · كل الصيغ · 3 دقائق كحد أقصى|Kutoka kwenye picha au kamera · miundo yote · dakika 3 zaidi|ከጋለሪ ወይም ካሜራ · ሁሉም ቅርጸቶች · ከፍተኛ 3 ደቂቃ|Qalereyadan və ya kameradan · bütün formatlar · maks. 3 dəqiqə
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
Format vidéo non compatible|Incompatible video format|Formato de vídeo incompatível|Formato de vídeo no compatible|تنسيق فيديو غير متوافق|Muundo wa video hauendani|ተኳሃኝ ያልሆነ የቪዲዮ ቅርጸት|Uyğunsuz video formatı
J’ai compris|Got it|Entendi|Entendido|فهمت|Nimeelewa|ገባኝ|Başa düşdüm
Préparation de la vidéo…|Preparing video…|A preparar o vídeo…|Preparando el video…|جارٍ تجهيز الفيديو…|Inaandaa video…|ቪዲዮውን በማዘጋጀት ላይ…|Video hazırlanır…
Conversion du format…|Converting format…|A converter o formato…|Convirtiendo el formato…|جارٍ تحويل الصيغة…|Inabadilisha muundo…|ቅርጸቱን በመቀየር ላይ…|Format çevrilir…
Demande envoyée|Request sent|Pedido enviado|Solicitud enviada|تم إرسال الطلب|Ombi limetumwa|ጥያቄው ተልኳል|Sorğu göndərildi
💬 Écrire à Vibzo sur WhatsApp|💬 Message Vibzo on WhatsApp|💬 Escrever à Vibzo no WhatsApp|💬 Escribir a Vibzo por WhatsApp|💬 راسل Vibzo على واتساب|💬 Andika kwa Vibzo WhatsApp|💬 ለVibzo በWhatsApp ይጻፉ|💬 Vibzo-ya WhatsApp-da yaz
Virement bancaire|Bank transfer|Transferência bancária|Transferencia bancaria|تحويل بنكي|Uhamisho wa benki|የባንክ ዝውውር|Bank köçürməsi
📋 Copier l’IBAN|📋 Copy IBAN|📋 Copiar o IBAN|📋 Copiar el IBAN|📋 نسخ IBAN|📋 Nakili IBAN|📋 IBAN ይቅዱ|📋 IBAN-ı kopyala
Fermer|Close|Fechar|Cerrar|إغلاق|Funga|ዝጋ|Bağla
Après ta demande, paie le montant et envoie la capture sur WhatsApp. L’abonnement est activé dès réception.|After your request, pay the amount and send the screenshot on WhatsApp. Your subscription is activated on receipt.|Depois do pedido, paga o valor e envia a captura pelo WhatsApp. A assinatura é ativada após a receção.|Tras tu solicitud, paga el importe y envía la captura por WhatsApp. La suscripción se activa al recibirla.|بعد طلبك، ادفع المبلغ وأرسل لقطة الشاشة عبر واتساب. يتم التفعيل عند الاستلام.|Baada ya ombi, lipa kiasi na tuma picha ya malipo kwa WhatsApp. Usajili unawashwa tukipokea.|ከጥያቄዎ በኋላ መጠኑን ይክፈሉ እና ቅጽበታዊ ገጽ እይታውን በWhatsApp ይላኩ።|Sorğudan sonra məbləği ödə və ekran görüntüsünü WhatsApp-a göndər. Abunə alındıqdan sonra aktivləşir.
/ mois|/ month|/ mês|/ mes|/ شهر|/ mwezi|/ ወር|/ ay
Prix|Price|Preço|Precio|السعر|Bei|ዋጋ|Qiymət
📋 Copier le numéro|📋 Copy number|📋 Copiar o número|📋 Copiar el número|📋 نسخ الرقم|📋 Nakili namba|📋 ቁጥሩን ይቅዱ|📋 Nömrəni kopyala
💍 Amour|💍 Love|💍 Amor|💍 Amor|💍 حب|💍 Mapenzi|💍 ፍቅር|💍 Sevgi
🔥 Ce soir|🔥 Tonight|🔥 Esta noite|🔥 Esta noche|🔥 الليلة|🔥 Usiku huu|🔥 ዛሬ ማታ|🔥 Bu axşam
Dispo ce soir ?|Free tonight?|Disponível esta noite?|¿Libre esta noche?|متاح الليلة؟|Upo huru usiku huu?|ዛሬ ማታ ነፃ ነዎት?|Bu axşam boşsan?
🟢 Tu es dispo ce soir|🟢 You're free tonight|🟢 Estás disponível esta noite|🟢 Estás libre esta noche|🟢 أنت متاح الليلة|🟢 Uko huru usiku huu|🟢 ዛሬ ማታ ነፃ ነዎት|🟢 Bu axşam boşsan
Montre aux autres que tu es libre maintenant (6 h)|Show others you're free now (6 h)|Mostra que estás livre agora (6 h)|Muestra que estás libre ahora (6 h)|أظهر للآخرين أنك متاح الآن (6 ساعات)|Waonyeshe wengine uko huru sasa (saa 6)|አሁን ነፃ መሆንዎን ያሳዩ (6 ሰዓት)|İndi boş olduğunu göstər (6 saat)
Activer|Turn on|Ativar|Activar|تفعيل|Washa|አብራ|Aktivləşdir
Arrêter|Stop|Parar|Parar|إيقاف|Simamisha|አቁም|Dayandır
Autres photos (jusqu’à 5)|More photos (up to 5)|Mais fotos (até 5)|Más fotos (hasta 5)|صور أخرى (حتى 5)|Picha zaidi (hadi 5)|ተጨማሪ ፎቶዎች (እስከ 5)|Digər şəkillər (5-ə qədər)
⭐ T’a super-liké|⭐ Super-liked you|⭐ Deu-te um Super Like|⭐ Te dio Super Like|⭐ أعجب بك جداً|⭐ Amekupenda sana|⭐ በጣም ወደደዎት|⭐ Səni super bəyəndi
💛 T’a liké|💛 Liked you|💛 Gostou de ti|💛 Le gustas|💛 أعجب بك|💛 Amekupenda|💛 ወደደዎት|💛 Səni bəyəndi
🟢 Dispo ce soir|🟢 Free tonight|🟢 Livre esta noite|🟢 Libre esta noche|🟢 متاح الليلة|🟢 Huru usiku huu|🟢 ዛሬ ማታ ነፃ|🟢 Bu axşam boş
⭐ Super Like envoyé !|⭐ Super Like sent!|⭐ Super Like enviado!|⭐ ¡Super Like enviado!|⭐ تم إرسال الإعجاب الكبير!|⭐ Super Like imetumwa!|⭐ ሱፐር ላይክ ተልኳል!|⭐ Super Like göndərildi!
↺ Profil récupéré|↺ Profile restored|↺ Perfil recuperado|↺ Perfil recuperado|↺ تم استرجاع الملف|↺ Wasifu umerudishwa|↺ መገለጫው ተመልሷል|↺ Profil geri qaytarıldı
✨ Pour toi|✨ For you|✨ Para ti|✨ Para ti|✨ لك|✨ Kwa ajili yako|✨ ለእርስዎ|✨ Sənin üçün
✨ Profils suggérés|✨ Suggested profiles|✨ Perfis sugeridos|✨ Perfiles sugeridos|✨ ملفات مقترحة|✨ Wasifu uliopendekezwa|✨ የተጠቆሙ መገለጫዎች|✨ Təklif olunan profillər
Tu cherches un travail ?|Looking for a job?|Procuras trabalho?|¿Buscas trabajo?|تبحث عن عمل؟|Unatafuta kazi?|ሥራ እየፈለጉ ነው?|İş axtarırsan?
Tu recrutes ?|Hiring?|Estás a recrutar?|¿Contratas?|هل توظّف؟|Unaajiri?|እየቀጠሩ ነው?|İşçi axtarırsan?
📄 Créer mon profil candidat|📄 Create my candidate profile|📄 Criar o meu perfil de candidato|📄 Crear mi perfil de candidato|📄 أنشئ ملفي كمرشح|📄 Unda wasifu wangu wa mwombaji|📄 የእጩ መገለጫዬን ፍጠር|📄 Namizəd profilimi yarat
Je cherche un travail|I'm looking for work|Procuro trabalho|Busco trabajo|أبحث عن عمل|Natafuta kazi|ሥራ እፈልጋለሁ|İş axtarıram
Je recrute|I'm hiring|Estou a recrutar|Estoy contratando|أنا أوظّف|Ninaajiri|እቀጥራለሁ|İşçi götürürəm
🌍 Partout dans le monde|🌍 Anywhere in the world|🌍 Em qualquer parte do mundo|🌍 En cualquier parte del mundo|🌍 في أي مكان في العالم|🌍 Popote duniani|🌍 በዓለም ዙሪያ|🌍 Dünyanın hər yerində
🌍 Partout dans le monde (je peux partir)|🌍 Anywhere in the world (I can relocate)|🌍 Em qualquer parte do mundo (posso mudar-me)|🌍 En cualquier parte del mundo (puedo mudarme)|🌍 في أي مكان في العالم (يمكنني الانتقال)|🌍 Popote duniani (naweza kuhamia)|🌍 በዓለም ዙሪያ (መዛወር እችላለሁ)|🌍 Dünyanın hər yerində (köçə bilərəm)
💻 En télétravail, pour le monde entier|💻 Remote, for the whole world|💻 Em teletrabalho, para o mundo inteiro|💻 En remoto, para todo el mundo|💻 عن بُعد، للعالم كله|💻 Kwa mbali, duniani kote|💻 ርቀት ሥራ፣ ለመላው ዓለም|💻 Uzaqdan, bütün dünya üçün
Compétences recherchées (séparées par des virgules)|Required skills (comma-separated)|Competências procuradas (separadas por vírgulas)|Competencias buscadas (separadas por comas)|المهارات المطلوبة (مفصولة بفواصل)|Ujuzi unaohitajika (tenganisha kwa koma)|የሚፈለጉ ክህሎቶች (በኮማ ይለዩ)|Tələb olunan bacarıqlar (vergüllə)
🌍 Monde entier|🌍 Whole world|🌍 Mundo inteiro|🌍 Todo el mundo|🌍 العالم كله|🌍 Dunia nzima|🌍 መላው ዓለም|🌍 Bütün dünya
Programme Créateurs|Creator Program|Programa de Criadores|Programa de Creadores|برنامج صُنّاع المحتوى|Mpango wa Watayarishi|የፈጣሪዎች ፕሮግራም|Yaradıcılar Proqramı
Gagne de l’argent avec tes vidéos|Earn money with your videos|Ganha dinheiro com os teus vídeos|Gana dinero con tus videos|اربح المال من فيديوهاتك|Pata pesa kwa video zako|በቪዲዮዎችዎ ገንዘብ ያግኙ|Videolarınla pul qazan
Conditions pour rejoindre|Requirements to join|Condições para aderir|Requisitos para unirte|شروط الانضمام|Masharti ya kujiunga|የመቀላቀል መስፈርቶች|Qoşulma şərtləri
Où recevoir tes gains ?|Where should we pay you?|Onde receber os teus ganhos?|¿Dónde recibir tus ganancias?|أين تستلم أرباحك؟|Upokee mapato wapi?|ገቢዎን የት ይቀበላሉ?|Qazancını harada alırsan?
💰 Rejoindre le Programme Créateurs|💰 Join the Creator Program|💰 Aderir ao Programa de Criadores|💰 Unirme al Programa de Creadores|💰 انضم إلى برنامج صُنّاع المحتوى|💰 Jiunge na Mpango wa Watayarishi|💰 የፈጣሪዎች ፕሮግራምን ይቀላቀሉ|💰 Yaradıcılar Proqramına qoşul
Astuces pour grandir|Tips to grow|Dicas para crescer|Consejos para crecer|نصائح للنمو|Vidokezo vya kukua|ለማደግ ምክሮች|İnkişaf üçün məsləhətlər
Lier mes autres réseaux|Link my other networks|Ligar as minhas outras redes|Vincular mis otras redes|ربط شبكاتي الأخرى|Unganisha mitandao yangu mingine|ሌሎች አውታረ መረቦቼን አገናኝ|Digər şəbəkələrimi bağla
Vues|Views|Visualizações|Vistas|المشاهدات|Mitazamo|እይታዎች|Baxışlar
Vues (30 j)|Views (30 d)|Visualizações (30 d)|Vistas (30 d)|المشاهدات (30 يومًا)|Mitazamo (siku 30)|እይታዎች (30 ቀን)|Baxışlar (30 gün)
Créer mon compte gratuit|Create my free account|Criar a minha conta grátis|Crear mi cuenta gratis|أنشئ حسابي المجاني|Fungua akaunti yangu bure|ነፃ መለያዬን ፍጠር|Pulsuz hesabımı yarat
Regarder d’abord|Watch first|Ver primeiro|Ver primero|شاهد أولاً|Tazama kwanza|መጀመሪያ ተመልከት|Əvvəlcə bax
Vidéos, emplois, boutiques et rencontres. Gratuit.|Videos, jobs, shops and dating. Free.|Vídeos, empregos, lojas e encontros. Grátis.|Videos, empleos, tiendas y citas. Gratis.|فيديوهات، وظائف، متاجر وتعارف. مجاناً.|Video, kazi, maduka na marafiki. Bure.|ቪዲዮዎች፣ ስራዎች፣ ሱቆች እና ትውውቅ። ነፃ።|Videolar, iş, mağazalar və tanışlıq. Pulsuz.
Ton ami|Your friend|O teu amigo|Tu amigo|صديقك|Rafiki yako|ጓደኛህ|Dostun
t’invite !|invites you!|convida-te!|te invita!|يدعوك!|anakualika!|ይጋብዝሃል!|səni dəvət edir!
Installe Vibzo|Install Vibzo|Instala o Vibzo|Instala Vibzo|ثبّت Vibzo|Sakinisha Vibzo|Vibzoን ጫን|Vibzo-nu quraşdır
Plus rapide, comme une vraie application|Faster, like a real app|Mais rápido, como uma app a sério|Más rápido, como una app de verdad|أسرع، مثل تطبيق حقيقي|Haraka zaidi, kama programu halisi|ፈጣን፣ እንደ እውነተኛ መተግበሪያ|Daha sürətli, əsl tətbiq kimi
Installer|Install|Instalar|Instalar|تثبيت|Sakinisha|ጫን|Quraşdır
Pour bien commencer|Getting started|Para começar bem|Para empezar bien|للبدء بشكل جيد|Kuanza vizuri|በጥሩ ሁኔታ ለመጀመር|Yaxşı başlanğıc üçün
Ajoute ta photo de profil|Add your profile photo|Adiciona a tua foto de perfil|Añade tu foto de perfil|أضف صورة ملفك الشخصي|Weka picha ya wasifu wako|የመገለጫ ፎቶህን ጨምር|Profil şəklini əlavə et
Publie ta première vidéo|Post your first video|Publica o teu primeiro vídeo|Publica tu primer video|انشر أول فيديو لك|Chapisha video yako ya kwanza|የመጀመሪያ ቪዲዮህን ለጥፍ|İlk videonu paylaş
Suis 3 créateurs|Follow 3 creators|Segue 3 criadores|Sigue a 3 creadores|تابع 3 صنّاع محتوى|Fuata watayarishi 3|3 ፈጣሪዎችን ተከተል|3 yaradıcını izlə
Lie ton TikTok / Instagram|Link your TikTok / Instagram|Liga o teu TikTok / Instagram|Vincula tu TikTok / Instagram|اربط TikTok / Instagram|Unganisha TikTok / Instagram yako|TikTok / Instagramህን አገናኝ|TikTok / Instagram-ını bağla
Invite tes amis (3 amis = 7 jours de Gold)|Invite your friends (3 friends = 7 days of Gold)|Convida os teus amigos (3 amigos = 7 dias de Gold)|Invita a tus amigos (3 amigos = 7 días de Gold)|ادعُ أصدقاءك (3 أصدقاء = 7 أيام Gold)|Alika marafiki zako (marafiki 3 = siku 7 za Gold)|ጓደኞችህን ጋብዝ (3 ጓደኞች = 7 ቀን Gold)|Dostlarını dəvət et (3 dost = 7 gün Gold)
Enregistrer / partager la vidéo|Save / share the video|Guardar / partilhar o vídeo|Guardar / compartir el video|حفظ / مشاركة الفيديو|Hifadhi / shiriki video|ቪዲዮውን አስቀምጥ / አጋራ|Videonu saxla / paylaş
Ajout de la signature Vibzo. Garde l’écran allumé.|Adding the Vibzo signature. Keep the screen on.|A adicionar a assinatura Vibzo. Mantém o ecrã ligado.|Añadiendo la firma de Vibzo. Mantén la pantalla encendida.|جارٍ إضافة توقيع Vibzo. أبقِ الشاشة مضاءة.|Inaongeza sahihi ya Vibzo. Weka skrini ikiwa imewashwa.|የVibzo ፊርማ እየታከለ ነው። ማያውን አብርተህ ያዝ።|Vibzo imzası əlavə olunur. Ekranı açıq saxla.
Vidéo prête|Video ready|Vídeo pronto|Video listo|الفيديو جاهز|Video iko tayari|ቪዲዮው ዝግጁ ነው|Video hazırdır
Partager (WhatsApp, Instagram…)|Share (WhatsApp, Instagram…)|Partilhar (WhatsApp, Instagram…)|Compartir (WhatsApp, Instagram…)|مشاركة (WhatsApp، Instagram…)|Shiriki (WhatsApp, Instagram…)|አጋራ (WhatsApp, Instagram…)|Paylaş (WhatsApp, Instagram…)
Ignorer|Skip|Saltar|Omitir|تخطَّ|Ruka|ዝለል|Keç
1er mois offert à l’ouverture|1st month free when you open|1.º mês grátis na abertura|1.er mes gratis al abrir|الشهر الأول مجاني عند الافتتاح|Mwezi wa 1 bure unapofungua|ሲከፍቱ የመጀመሪያው ወር ነፃ|Açılışda 1-ci ay pulsuz
Tes produits ne sont plus visibles. Renouvelle pour les remettre en ligne.|Your products are no longer visible. Renew to put them back online.|Os teus produtos já não estão visíveis. Renova para os voltar a mostrar.|Tus productos ya no son visibles. Renueva para volver a mostrarlos.|منتجاتك لم تعد ظاهرة. جدّد لإعادتها.|Bidhaa zako hazionekani tena. Huisha ili zirudi mtandaoni.|ምርቶችህ ከአሁን በኋላ አይታዩም። እንደገና ለማሳየት አድስ።|Məhsulların artıq görünmür. Yenidən göstərmək üçün yenilə.
Renouveler|Renew|Renovar|Renovar|تجديد|Huisha|አድስ|Yenilə
Renouveler mon abonnement Vendeur|Renew my Seller subscription|Renovar a minha assinatura de Vendedor|Renovar mi suscripción de Vendedor|تجديد اشتراك البائع|Huisha usajili wangu wa Muuzaji|የሻጭ ምዝገባዬን አድስ|Satıcı abunəliyimi yenilə
Boutique ouverte : ton 1er mois est offert !|Shop open: your 1st month is free!|Loja aberta: o teu 1.º mês é grátis!|Tienda abierta: ¡tu 1.er mes es gratis!|تم فتح المتجر: الشهر الأول مجاني!|Duka limefunguliwa: mwezi wako wa 1 ni bure!|ሱቁ ተከፍቷል፦ የመጀመሪያው ወርህ ነፃ ነው!|Mağaza açıldı: 1-ci ayın pulsuzdur!
Seuls les abonnés et les vues de vrais comptes (e-mail confirmé) comptent. Les fausses vues, comptes multiples ou robots entraînent l’exclusion du programme.|Only followers and views from real accounts (confirmed email) count. Fake views, multiple accounts or bots lead to exclusion from the program.|Só contam seguidores e visualizações de contas reais (e-mail confirmado). Visualizações falsas, contas múltiplas ou robôs levam à exclusão do programa.|Solo cuentan los seguidores y vistas de cuentas reales (correo confirmado). Las vistas falsas, cuentas múltiples o bots conllevan la exclusión del programa.|تُحتسب فقط المتابعات والمشاهدات من حسابات حقيقية (بريد مؤكَّد). المشاهدات المزيفة أو الحسابات المتعددة أو الروبوتات تؤدي إلى الاستبعاد من البرنامج.|Wafuasi na matazamo kutoka akaunti halisi (barua pepe iliyothibitishwa) pekee ndiyo yanahesabiwa. Matazamo bandia, akaunti nyingi au roboti husababisha kuondolewa kwenye mpango.|ከእውነተኛ መለያዎች (የተረጋገጠ ኢሜይል) የመጡ ተከታዮችና እይታዎች ብቻ ይቆጠራሉ። ሐሰተኛ እይታዎች፣ ብዙ መለያዎች ወይም ሮቦቶች ከፕሮግራሙ ያስወጣሉ።|Yalnız real hesabların (təsdiqlənmiş e-poçt) izləyiciləri və baxışları sayılır. Saxta baxışlar, çoxlu hesablar və ya botlar proqramdan çıxarılmaya səbəb olur.
Vues valides (30 j)|Valid views (30 d)|Visualizações válidas (30 d)|Vistas válidas (30 d)|مشاهدات صالحة (30 يومًا)|Matazamo halali (siku 30)|ትክክለኛ እይታዎች (30 ቀን)|Etibarlı baxışlar (30 gün)
Doucement 🙂 Trop d'actions en peu de temps, réessaie dans quelques minutes.|Easy 🙂 Too many actions in a short time, try again in a few minutes.|Calma 🙂 Demasiadas ações em pouco tempo, tenta de novo daqui a alguns minutos.|Despacio 🙂 Demasiadas acciones en poco tiempo, inténtalo en unos minutos.|على مهلك 🙂 إجراءات كثيرة في وقت قصير، حاول بعد بضع دقائق.|Polepole 🙂 Vitendo vingi kwa muda mfupi, jaribu tena baada ya dakika chache.|ቀስ በል 🙂 በአጭር ጊዜ ብዙ እርምጃዎች፣ ከጥቂት ደቂቃዎች በኋላ እንደገና ሞክር።|Yavaş 🙂 Qısa müddətdə çox hərəkət, bir neçə dəqiqədən sonra yenidən cəhd et.
Nouvelle version de Vibzo|New version of Vibzo|Nova versão do Vibzo|Nueva versión de Vibzo|إصدار جديد من Vibzo|Toleo jipya la Vibzo|አዲስ የVibzo ስሪት|Vibzo-nun yeni versiyası
Mettre à jour|Update|Atualizar|Actualizar|تحديث|Sasisha|አዘምን|Yenilə
Lancer un live|Go LIVE|Fazer um live|Hacer un directo|ابدأ بثًا مباشرًا|Anzisha mubashara|ቀጥታ ስርጭት ጀምር|Canlı yayına başla
Filme-toi en direct, reçois des cœurs et des cadeaux|Stream yourself live and get hearts and gifts|Transmite-te em direto e recebe corações e presentes|Transmite en directo y recibe corazones y regalos|بثّ نفسك مباشرة واحصل على قلوب وهدايا|Jirushe mubashara upate mioyo na zawadi|ራስህን በቀጥታ አሰራጭ፣ ልቦችና ስጦታዎች ተቀበል|Özünü canlı yayımla, ürək və hədiyyələr qazan
En direct|Live|Em direto|En directo|مباشر|Mubashara|ቀጥታ|Canlı
EN DIRECT|LIVE|AO VIVO|EN DIRECTO|مباشر|MUBASHARA|ቀጥታ|CANLI
En direct maintenant|Live now|Em direto agora|En directo ahora|مباشر الآن|Mubashara sasa|አሁን በቀጥታ|İndi canlı
Lancer mon live|Start my live|Iniciar o meu live|Iniciar mi directo|ابدأ بثي المباشر|Anzisha mubashara wangu|የእኔን ቀጥታ ጀምር|Canlı yayınımı başlat
Personne n’est en direct pour le moment. Sois le premier|Nobody is live right now. Be the first|Ninguém está em direto agora. Sê o primeiro|Nadie está en directo ahora. Sé el primero|لا أحد في بث مباشر الآن. كن الأول|Hakuna aliye mubashara sasa. Kuwa wa kwanza|አሁን ማንም በቀጥታ የለም። የመጀመሪያው ሁን|Hazırda heç kim canlı deyil. İlk sən ol
Passer en direct|Go live|Entrar em direto|Salir en directo|ابدأ البث|Anza mubashara|በቀጥታ ጀምር|Canlı yayına çıx
Titre du live|Live title|Título do live|Título del directo|عنوان البث|Kichwa cha mubashara|የቀጥታ ርዕስ|Yayının adı
Ex : Questions-réponses|E.g. Q&A|Ex.: Perguntas e respostas|Ej.: Preguntas y respuestas|مثال: أسئلة وأجوبة|Mfano: Maswali na majibu|ምሳሌ፦ ጥያቄና መልስ|Məs.: Sual-cavab
Interdit en live : nudité, violence, arnaques, mineurs exposés. Les lives peuvent être signalés et coupés|Not allowed on live: nudity, violence, scams, exposed minors. Lives can be reported and shut down|Proibido em direto: nudez, violência, burlas, menores expostos. Os lives podem ser denunciados e interrompidos|Prohibido en directo: desnudos, violencia, estafas, menores expuestos. Los directos pueden denunciarse y cortarse|ممنوع في البث: العري، العنف، الاحتيال، تعريض القاصرين. يمكن الإبلاغ عن البث وإيقافه|Hairuhusiwi mubashara: uchi, vurugu, utapeli, kuonyesha watoto. Mubashara unaweza kuripotiwa na kusimamishwa|በቀጥታ የተከለከለ፦ እርቃን፣ ሁከት፣ ማጭበርበር፣ ልጆችን ማጋለጥ። ቀጥታ ስርጭቶች ሪፖርት ሊደረጉና ሊቋረጡ ይችላሉ|Canlıda qadağandır: çılpaqlıq, zorakılıq, fırıldaq, azyaşlıların nümayişi. Yayınlar şikayət edilə və dayandırıla bilər
Filme-toi en direct : tes abonnés reçoivent une notification, tes fans t’envoient des cœurs et des cadeaux (convertibles en argent|Go live: your followers get a notification, your fans send you hearts and gifts (convertible to cash|Faz um direto: os teus seguidores recebem uma notificação, os fãs enviam-te corações e presentes (convertíveis em dinheiro|Transmite en directo: tus seguidores reciben una notificación, tus fans te envían corazones y regalos (convertibles en dinero|بثّ مباشرة: يتلقى متابعوك إشعارًا ويرسل لك معجبوك قلوبًا وهدايا (قابلة للتحويل إلى مال|Jirushe mubashara: wafuasi wako wanapata arifa, mashabiki wanakutumia mioyo na zawadi (zinabadilishwa kuwa pesa|በቀጥታ አሰራጭ፦ ተከታዮችህ ማሳወቂያ ይደርሳቸዋል፣ አድናቂዎችህ ልቦችና ስጦታዎች ይልኩልሃል (ወደ ገንዘብ የሚቀየሩ|Canlı yayımla: izləyicilərin bildiriş alır, fanatların sənə ürək və hədiyyələr göndərir (pula çevrilə bilər
Dis quelque chose|Say something|Diz alguma coisa|Di algo|قل شيئًا|Sema kitu|አንድ ነገር በል|Bir şey yaz
Connecte-toi pour discuter|Log in to chat|Inicia sessão para conversar|Inicia sesión para chatear|سجّل الدخول للدردشة|Ingia ili kuzungumza|ለመወያየት ግባ|Söhbət üçün daxil ol
Terminer|End|Terminar|Terminar|إنهاء|Maliza|ጨርስ|Bitir
Touche pour activer le son|Tap to turn on sound|Toca para ativar o som|Toca para activar el sonido|المس لتشغيل الصوت|Gusa kuwasha sauti|ድምፅ ለማብራት ንካ|Səsi açmaq üçün toxun
Préparation du live|Getting your live ready|A preparar o live|Preparando el directo|جارٍ تجهيز البث|Inaandaa mubashara|ቀጥታውን በማዘጋጀት ላይ|Yayın hazırlanır
Connexion au live|Joining the live|A ligar ao live|Conectando al directo|جارٍ الاتصال بالبث|Inaunganisha na mubashara|ከቀጥታው ጋር በመገናኘት ላይ|Yayına qoşulur
Le live est terminé|The live has ended|O live terminou|El directo ha terminado|انتهى البث|Mubashara umeisha|ቀጥታው አብቅቷል|Yayın bitdi
Ce live est terminé|This live has ended|Este live terminou|Este directo ha terminado|انتهى هذا البث|Mubashara huu umeisha|ይህ ቀጥታ አብቅቷል|Bu yayın bitib
Live terminé|Live ended|Live terminado|Directo terminado|انتهى البث|Mubashara umeisha|ቀጥታ አብቅቷል|Yayın bitdi
Spectateurs max|Peak viewers|Espectadores máx|Espectadores máx|أقصى عدد مشاهدين|Watazamaji wengi zaidi|ከፍተኛ ተመልካቾች|Maks. izləyici
Cœurs|Hearts|Corações|Corazones|قلوب|Mioyo|ልቦች|Ürəklər
Cadeaux|Gifts|Presentes|Regalos|هدايا|Zawadi|ስጦታዎች|Hədiyyələr
Super|Great|Ótimo|Genial|رائع|Safi|በጣም ጥሩ|Əla
Les lives arrivent très bientôt|Live is coming very soon|Os lives chegam muito em breve|Los directos llegan muy pronto|البث المباشر قادم قريبًا جدًا|Mubashara inakuja hivi karibuni|ቀጥታ ስርጭት በቅርቡ ይመጣል|Canlı yayın çox tezliklə gəlir
Les lives arrivent très bientôt sur Vibzo|Live is coming very soon to Vibzo|Os lives chegam muito em breve ao Vibzo|Los directos llegan muy pronto a Vibzo|البث المباشر قادم قريبًا جدًا إلى Vibzo|Mubashara inakuja hivi karibuni kwenye Vibzo|ቀጥታ ስርጭት በቅርቡ ወደ Vibzo ይመጣል|Canlı yayın tezliklə Vibzo-da
Le serveur vidéo est en cours d’activation. Tu recevras une notification dès que tu pourras passer en direct|The video server is being activated. You’ll get a notification as soon as you can go live|O servidor de vídeo está a ser ativado. Vais receber uma notificação assim que puderes fazer um direto|El servidor de vídeo se está activando. Recibirás una notificación cuando puedas transmitir en directo|يجري تفعيل خادم الفيديو. ستتلقى إشعارًا فور تمكنك من البث المباشر|Seva ya video inawashwa. Utapata arifa mara utakapoweza kwenda mubashara|የቪዲዮ ሰርቨሩ እየነቃ ነው። በቀጥታ መሄድ ስትችል ማሳወቂያ ይደርስሃል|Video server aktivləşdirilir. Canlı yayına çıxa bildiyin an bildiriş alacaqsan
Partager ce produit|Share this product|Partilhar este produto|Compartir este producto|شارك هذا المنتج|Shiriki bidhaa hii|ይህን ምርት አጋራ|Bu məhsulu paylaş
Partager l’offre|Share the job|Partilhar a oferta|Compartir la oferta|شارك العرض|Shiriki tangazo|ማስታወቂያውን አጋራ|Elanı paylaş
Nouveau match ! Écris-lui un message|New match! Send them a message|Novo match! Envia-lhe uma mensagem|¡Nuevo match! Envíale un mensaje|توافق جديد! أرسل له رسالة|Mechi mpya! Mtumie ujumbe|አዲስ ተዛማጅ! መልእክት ላክ|Yeni uyğunluq! Ona mesaj yaz
Tu es en direct ! Tes abonnés ont été prévenus|You’re live! Your followers have been notified|Estás em direto! Os teus seguidores foram avisados|¡Estás en directo! Tus seguidores han sido avisados|أنت في بث مباشر! تم إخطار متابعيك|Uko mubashara! Wafuasi wako wamearifiwa|በቀጥታ ላይ ነህ! ተከታዮችህ ተነግሯቸዋል|Canlıdasan! İzləyicilərinə xəbər verildi
Autorise la caméra et le micro pour faire un live|Allow camera and microphone to go live|Permite a câmara e o microfone para fazer um live|Permite la cámara y el micrófono para hacer un directo|اسمح بالكاميرا والميكروفون لبدء البث|Ruhusu kamera na maikrofoni ili kwenda mubashara|በቀጥታ ለመሄድ ካሜራና ማይክሮፎን ፍቀድ|Canlı yayın üçün kamera və mikrofona icazə ver
Connecte-toi pour lancer un live|Log in to go live|Inicia sessão para fazer um live|Inicia sesión para hacer un directo|سجّل الدخول لبدء بث مباشر|Ingia ili uanzishe mubashara|ቀጥታ ለመጀመር ግባ|Canlı yayın üçün daxil ol
Connecte-toi pour envoyer des cœurs|Log in to send hearts|Inicia sessão para enviar corações|Inicia sesión para enviar corazones|سجّل الدخول لإرسال القلوب|Ingia ili kutuma mioyo|ልቦችን ለመላክ ግባ|Ürək göndərmək üçün daxil ol
Retourner la caméra|Flip camera|Virar a câmara|Girar la cámara|قلب الكاميرا|Geuza kamera|ካሜራ ቀይር|Kameranı çevir
Micro coupé|Mic off|Microfone desligado|Micrófono apagado|الميكروفون مغلق|Maikrofoni imezimwa|ማይክ ጠፍቷል|Mikrofon söndürülüb
Micro activé|Mic on|Microfone ligado|Micrófono encendido|الميكروفون مفعّل|Maikrofoni imewashwa|ማይክ በርቷል|Mikrofon açıqdır
Couper le live|Shut down live|Cortar o live|Cortar el directo|إيقاف البث|Sitisha mubashara|ቀጥታውን አቋርጥ|Yayını dayandır
Tendances de la semaine|Trending this week|Tendências da semana|Tendencias de la semana|الأكثر رواجًا هذا الأسبوع|Zinazovuma wiki hii|የሳምንቱ ተወዳጆች|Həftənin trendləri
Les plus vues|Most viewed|Mais vistos|Más vistos|الأكثر مشاهدة|Zilizotazamwa zaidi|በብዛት የታዩ|Ən çox baxılan
Résultats|Results|Resultados|Resultados|النتائج|Matokeo|ውጤቶች|Nəticələr
Offres pour toi|Jobs for you|Ofertas para ti|Ofertas para ti|وظائف لك|Kazi kwa ajili yako|ለአንተ የሚሆኑ ስራዎች|Sənin üçün vakansiyalar
Tu cherches un travail|Looking for a job|Procuras trabalho|¿Buscas trabajo|تبحث عن عمل|Unatafuta kazi|ስራ ትፈልጋለህ|İş axtarırsan
Crée ton profil candidat : Vibzo te propose automatiquement les offres qui te correspondent, dans ton pays et partout dans le monde|Create your candidate profile: Vibzo automatically suggests jobs that match you, in your country and worldwide|Cria o teu perfil de candidato: o Vibzo propõe-te automaticamente as ofertas que combinam contigo, no teu país e no mundo inteiro|Crea tu perfil de candidato: Vibzo te propone automáticamente las ofertas que encajan contigo, en tu país y en todo el mundo|أنشئ ملفك كمرشح: يقترح عليك Vibzo تلقائيًا الوظائف المناسبة لك في بلدك وحول العالم|Unda wasifu wako wa mwombaji: Vibzo inakupendekezea kazi zinazokufaa, nchini mwako na duniani kote|የእጩ መገለጫህን ፍጠር፦ Vibzo የሚስማሙህን ስራዎች በሀገርህና በዓለም ዙሪያ በራሱ ያቀርብልሃል|Namizəd profilini yarat: Vibzo sənə uyğun vakansiyaları ölkəndə və bütün dünyada avtomatik təklif edir
Profils pour tes offres|Profiles for your jobs|Perfis para as tuas ofertas|Perfiles para tus ofertas|ملفات مناسبة لوظائفك|Wasifu kwa matangazo yako|ለማስታወቂያዎችህ የሚሆኑ መገለጫዎች|Elanların üçün profillər
Tu recrutes|Hiring|Estás a recrutar|¿Estás contratando|هل توظّف|Unaajiri|ትቀጥራለህ|İşçi axtarırsan
Publie une offre : Vibzo te suggère automatiquement les meilleurs candidats, près de chez toi ou dans le monde entier|Post a job: Vibzo automatically suggests the best candidates, near you or worldwide|Publica uma oferta: o Vibzo sugere-te automaticamente os melhores candidatos, perto de ti ou no mundo inteiro|Publica una oferta: Vibzo te sugiere automáticamente los mejores candidatos, cerca de ti o en todo el mundo|انشر وظيفة: يقترح عليك Vibzo تلقائيًا أفضل المرشحين بالقرب منك أو حول العالم|Chapisha tangazo: Vibzo inakupendekezea waombaji bora, karibu nawe au duniani kote|ማስታወቂያ ለጥፍ፦ Vibzo ምርጥ እጩዎችን በአቅራቢያህ ወይም በዓለም ዙሪያ በራሱ ይጠቁምሃል|Elan yerləşdir: Vibzo sənə ən yaxşı namizədləri yaxınlıqda və ya bütün dünyada avtomatik təklif edir
gagne de l’argent avec tes vidéos|earn money with your videos|ganha dinheiro com os teus vídeos|gana dinero con tus vídeos|اربح المال من فيديوهاتك|pata pesa kwa video zako|በቪዲዮዎችህ ገንዘብ አግኝ|videolarınla pul qazan
Copier le lien|Copy link|Copiar link|Copiar enlace|نسخ الرابط|Nakili kiungo|ሊንኩን ቅዳ|Linki kopyala
Sur place|On-site|Presencial|Presencial|في الموقع|Ofisini|በቦታው|Yerində
publié par|posted by|publicado por|publicado por|نشره|imechapishwa na|የለጠፈው|paylaşan
Pas encore de notification. Publie, commente et suis des créateurs|No notifications yet. Post, comment and follow creators|Ainda sem notificações. Publica, comenta e segue criadores|Aún no hay notificaciones. Publica, comenta y sigue a creadores|لا توجد إشعارات بعد. انشر وعلّق وتابع المبدعين|Bado hakuna arifa. Chapisha, toa maoni na ufuate wabunifu|እስካሁን ማሳወቂያ የለም። ለጥፍ፣ አስተያየት ስጥና ፈጣሪዎችን ተከተል|Hələ bildiriş yoxdur. Paylaş, şərh yaz və yaradıcıları izlə
Validation en 2 étapes|2-step verification|Verificação em 2 passos|Verificación en 2 pasos|التحقق بخطوتين|Uthibitisho wa hatua 2|ባለ 2 ደረጃ ማረጋገጫ|2 addımlı doğrulama
conseillé|recommended|recomendado|recomendado|موصى به|inapendekezwa|ይመከራል|tövsiyə olunur
activée|on|ativada|activada|مفعّلة|imewashwa|በርቷል|aktiv
Mon portefeuille|My wallet|A minha carteira|Mi monedero|محفظتي|Pochi yangu|የእኔ ቦርሳ|Pul kisəm
pièces et gains|coins and earnings|moedas e ganhos|monedas y ganancias|العملات والأرباح|sarafu na mapato|ሳንቲሞችና ገቢዎች|sikkələr və qazanc
Inviter des amis|Invite friends|Convidar amigos|Invitar amigos|ادعُ أصدقاءك|Alika marafiki|ጓደኞችን ጋብዝ|Dostları dəvət et
Inviter des amis · gagne du Gold|Invite friends · earn Gold|Convidar amigos · ganha Gold|Invitar amigos · gana Gold|ادعُ أصدقاءك · اربح Gold|Alika marafiki · pata Gold|ጓደኞችን ጋብዝ · Gold አግኝ|Dostları dəvət et · Gold qazan
Connecté|Logged in as|Ligado como|Conectado como|متصل باسم|Umeingia kama|የገባው|Daxil olub
Afficher l’objectif|Show goal|Mostrar objetivo|Mostrar objetivo|اعرض الهدف|Onyesha lengo|ግቡን አሳይ|Hədəfi göstər
Astuce : publie d’abord une vidéo de ton travail, puis ajoute-la ici|Tip: first post a video of your work, then add it here|Dica: publica primeiro um vídeo do teu trabalho e depois adiciona-o aqui|Consejo: publica primero un vídeo de tu trabajo y luego añádelo aquí|نصيحة: انشر أولًا فيديو لعملك ثم أضفه هنا|Kidokezo: chapisha kwanza video ya kazi yako, kisha uiongeze hapa|ጠቃሚ ምክር፦ መጀመሪያ የስራህን ቪዲዮ ለጥፍ፣ ከዚያ እዚህ ጨምር|Məsləhət: əvvəlcə işinin videosunu paylaş, sonra buraya əlavə et
Astuce : touche un commentaire pour l’épingler en haut du live|Tip: tap a comment to pin it at the top of the live|Dica: toca num comentário para o fixar no topo do live|Consejo: toca un comentario para fijarlo arriba del directo|نصيحة: المس تعليقًا لتثبيته أعلى البث|Kidokezo: gusa maoni ili kuyabandika juu ya mubashara|ጠቃሚ ምክር፦ አስተያየትን በቀጥታው አናት ላይ ለመለጠፍ ንካው|Məsləhət: şərhi yayının yuxarısına bərkitmək üçün ona toxun
Aucune|None|Nenhuma|Ninguna|لا شيء|Hakuna|ምንም|Heç biri
Aucune vidéo téléchargée pour l’instant|No downloaded videos yet|Ainda não há vídeos descarregados|Aún no hay vídeos descargados|لا توجد فيديوهات محمّلة بعد|Bado hakuna video zilizopakuliwa|እስካሁን የወረደ ቪዲዮ የለም|Hələ yüklənmiş video yoxdur
Avis|Reviews|Avaliações|Opiniones|التقييمات|Maoni|ግምገማዎች|Rəylər
avis|reviews|avaliações|opiniones|تقييمات|maoni|ግምገማዎች|rəy
Avis clients|Customer reviews|Avaliações de clientes|Opiniones de clientes|تقييمات العملاء|Maoni ya wateja|የደንበኞች ግምገማ|Müştəri rəyləri
Badge vérifié|Verified badge|Selo verificado|Insignia verificada|شارة التحقق|Beji ya uthibitisho|የተረጋገጠ ባጅ|Təsdiq nişanı
Catégorie|Category|Categoria|Categoría|الفئة|Aina|ምድብ|Kateqoriya
Ce que les créateurs doivent montrer, ce qui est interdit|What creators must show, what is forbidden|O que os criadores devem mostrar e o que é proibido|Lo que los creadores deben mostrar y lo que está prohibido|ما يجب أن يعرضه المبدعون وما هو ممنوع|Kile wabunifu wanapaswa kuonyesha na kilichokatazwa|ፈጣሪዎች ማሳየት ያለባቸውና የተከለከለው|Yaradıcılar nəyi göstərməli, nə qadağandır
Ce que tu proposes, tes horaires, ton expérience|What you offer, your hours, your experience|O que ofereces, o teu horário, a tua experiência|Lo que ofreces, tu horario, tu experiencia|ما تقدمه، أوقات عملك، خبرتك|Unachotoa, saa zako, uzoefu wako|የምታቀርበው፣ የስራ ሰዓትህ፣ ልምድህ|Nə təklif edirsən, iş saatların, təcrübən
Ces documents servent uniquement à la vérification. Ils ne sont jamais publiés|These documents are only used for verification. They are never published|Estes documentos servem apenas para a verificação. Nunca são publicados|Estos documentos solo sirven para la verificación. Nunca se publican|تُستخدم هذه الوثائق للتحقق فقط ولا تُنشر أبدًا|Nyaraka hizi zinatumika kwa uthibitisho tu. Hazichapishwi kamwe|እነዚህ ሰነዶች ለማረጋገጫ ብቻ ያገለግላሉ። በፍጹም አይታተሙም|Bu sənədlər yalnız yoxlama üçündür. Heç vaxt dərc olunmur
Choix|Choice|Opção|Opción|خيار|Chaguo|ምርጫ|Seçim
Choix 3 (facultatif|Choice 3 (optional|Opção 3 (opcional|Opción 3 (opcional|الخيار 3 (اختياري|Chaguo 3 (si lazima|ምርጫ 3 (አማራጭ|Seçim 3 (könüllü
Choix 4 (facultatif|Choice 4 (optional|Opção 4 (opcional|Opción 4 (opcional|الخيار 4 (اختياري|Chaguo 4 (si lazima|ምርጫ 4 (አማራጭ|Seçim 4 (könüllü
Coiffure & beauté|Hair & beauty|Cabeleireiro e beleza|Peluquería y belleza|تصفيف الشعر والتجميل|Nywele na urembo|የፀጉርና የውበት|Saç və gözəllik
Couture & mode|Tailoring & fashion|Costura e moda|Costura y moda|الخياطة والموضة|Ushonaji na mitindo|ልብስ ስፌትና ፋሽን|Dərzilik və moda
Mécanique|Mechanics|Mecânica|Mecánica|الميكانيك|Ufundi wa magari|መካኒክ|Mexanika
Plomberie|Plumbing|Canalização|Fontanería|السباكة|Mabomba|የቧንቧ ስራ|Santexnika
Électricité|Electrical|Eletricidade|Electricidad|الكهرباء|Umeme|ኤሌክትሪክ|Elektrik
Ménage & entretien|Cleaning & housekeeping|Limpeza e manutenção|Limpieza y mantenimiento|التنظيف والصيانة|Usafi na matengenezo|ጽዳትና ጥገና|Təmizlik və baxım
Cuisine & traiteur|Cooking & catering|Cozinha e catering|Cocina y catering|الطبخ والتموين|Upishi na huduma za chakula|ምግብ ማብሰልና አቅርቦት|Mətbəx və ketrinq
Photo & vidéo|Photo & video|Foto e vídeo|Foto y vídeo|التصوير والفيديو|Picha na video|ፎቶና ቪዲዮ|Foto və video
Cours & soutien scolaire|Lessons & tutoring|Aulas e explicações|Clases y apoyo escolar|الدروس والدعم المدرسي|Masomo na ufundishaji|ትምህርትና የቤት አስጠኚ|Dərslər və repetitorluq
Informatique & téléphones|Computers & phones|Informática e telemóveis|Informática y teléfonos|الحواسيب والهواتف|Kompyuta na simu|ኮምፒውተርና ስልክ|Kompüter və telefonlar
Transport & déménagement|Transport & moving|Transporte e mudanças|Transporte y mudanzas|النقل والانتقال|Usafiri na kuhamisha|ትራንስፖርትና ቤት ማዛወር|Nəqliyyat və köçmə
Événements & DJ|Events & DJ|Eventos e DJ|Eventos y DJ|المناسبات والدي جي|Matukio na DJ|ዝግጅቶችና ዲጄ|Tədbirlər və DJ
Santé & bien-être|Health & wellness|Saúde e bem-estar|Salud y bienestar|الصحة والعافية|Afya na ustawi|ጤናና ደህንነት|Sağlamlıq və rifah
Construction & BTP|Construction|Construção|Construcción|البناء|Ujenzi|ግንባታ|Tikinti
Créateur|Creator|Criador|Creador|مبدع|Mbunifu|ፈጣሪ|Yaradıcı
Recruteur|Recruiter|Recrutador|Reclutador|مُوظِّف|Mwajiri|ቀጣሪ|İşə götürən
Créer le défi|Create the challenge|Criar o desafio|Crear el reto|أنشئ التحدي|Unda changamoto|ፈተናውን ፍጠር|Çağırışı yarat
Demander la vérification|Request verification|Pedir verificação|Solicitar verificación|اطلب التحقق|Omba uthibitisho|ማረጋገጫ ጠይቅ|Yoxlama istə
Demander à rejoindre l’écran|Ask to join the screen|Pedir para entrar no ecrã|Pedir unirse a la pantalla|اطلب الانضمام إلى الشاشة|Omba kujiunga kwenye skrini|ስክሪኑን ለመቀላቀል ጠይቅ|Ekrana qoşulmağı xahiş et
Quitter l’écran|Leave the screen|Sair do ecrã|Salir de la pantalla|غادر الشاشة|Ondoka kwenye skrini|ከስክሪኑ ውጣ|Ekrandan çıx
Des centaines de créateurs filment des vidéos avec ton produit et ton hashtag. Tu paies uniquement les prix des gagnants, plus 15 % de frais Vibzo|Hundreds of creators film videos with your product and hashtag. You only pay the winners' prizes, plus a 15% Vibzo fee|Centenas de criadores filmam vídeos com o teu produto e o teu hashtag. Pagas apenas os prémios dos vencedores, mais 15% de taxa Vibzo|Cientos de creadores graban vídeos con tu producto y tu hashtag. Solo pagas los premios de los ganadores, más un 15 % de comisión de Vibzo|يصوّر مئات المبدعين فيديوهات بمنتجك ووسمك. تدفع جوائز الفائزين فقط، مع 15٪ رسوم Vibzo|Mamia ya wabunifu wanarekodi video na bidhaa yako na hashtag yako. Unalipa zawadi za washindi tu, pamoja na ada ya Vibzo ya 15%|በመቶዎች የሚቆጠሩ ፈጣሪዎች በምርትህና በሃሽታግህ ቪዲዮ ይቀርጻሉ። የአሸናፊዎቹን ሽልማት ብቻ ትከፍላለህ፣ እና 15% የVibzo ክፍያ|Yüzlərlə yaradıcı sənin məhsulun və heşteqinlə video çəkir. Yalnız qaliblərin mükafatlarını və 15% Vibzo haqqını ödəyirsən
Défi sponsorisé|Sponsored challenge|Desafio patrocinado|Reto patrocinado|تحدٍ مموّل|Changamoto iliyodhaminiwa|በስፖንሰር የቀረበ ፈተና|Sponsorlu çağırış
Défis avec des prix|Challenges with prizes|Desafios com prémios|Retos con premios|تحديات بجوائز|Changamoto zenye zawadi|ሽልማት ያላቸው ፈተናዎች|Mükafatlı çağırışlar
Ensuite, envoie sur WhatsApp|Then send on WhatsApp|Depois, envia pelo WhatsApp|Luego, envía por WhatsApp|ثم أرسل عبر واتساب|Kisha tuma kwa WhatsApp|ከዚያ በWhatsApp ላክ|Sonra WhatsApp ilə göndər
Ex : Montre ton meilleur pas de danse avec notre jus|E.g. Show your best dance move with our juice|Ex.: Mostra o teu melhor passo de dança com o nosso sumo|Ej.: Muestra tu mejor paso de baile con nuestro zumo|مثال: أظهر أفضل حركة رقص مع عصيرنا|Mfano: Onyesha mtindo wako bora wa kucheza na juisi yetu|ምሳሌ፦ ምርጥ የዳንስ እንቅስቃሴህን ከጭማቂያችን ጋር አሳይ|Məs.: Şirəmizlə ən yaxşı rəqs hərəkətini göstər
Ex : Quelle tenue pour demain|E.g. Which outfit for tomorrow|Ex.: Que roupa para amanhã|Ej.: ¿Qué ropa para mañana|مثال: أي ملابس للغد|Mfano: Nguo gani kwa kesho|ምሳሌ፦ ለነገ የትኛው ልብስ|Məs.: Sabah üçün hansı geyim
Ex : Tresses et nattes à domicile|E.g. Braids at home|Ex.: Tranças ao domicílio|Ej.: Trenzas a domicilio|مثال: تضفير الشعر في المنزل|Mfano: Kusuka nywele nyumbani|ምሳሌ፦ በቤት የፀጉር ሽሩባ|Məs.: Evdə hörüklər
Fermer le chat|Close the chat|Fechar o chat|Cerrar el chat|أغلق الدردشة|Funga gumzo|ውይይቱን ዝጋ|Söhbəti bağla
Invite jusqu’à 3 personnes à l’écran avec toi. Les visiteurs non connectés ne peuvent pas être invités|Invite up to 3 people on screen with you. Visitors who are not logged in can't be invited|Convida até 3 pessoas para o ecrã contigo. Visitantes sem sessão iniciada não podem ser convidados|Invita hasta 3 personas a la pantalla contigo. Los visitantes sin sesión no pueden ser invitados|ادعُ حتى 3 أشخاص إلى الشاشة معك. لا يمكن دعوة الزوار غير المسجلين|Alika hadi watu 3 kwenye skrini pamoja nawe. Wageni ambao hawajaingia hawawezi kualikwa|እስከ 3 ሰዎችን ከአንተ ጋር ወደ ስክሪኑ ጋብዝ። ያልገቡ ጎብኚዎች ሊጋበዙ አይችሉም|Ekrana səninlə 3 nəfərə qədər dəvət et. Daxil olmamış qonaqlar dəvət edilə bilməz
Lancer le sondage|Start the poll|Iniciar a sondagem|Iniciar la encuesta|ابدأ الاستطلاع|Anzisha kura|ምርጫውን ጀምር|Sorğunu başlat
Lancer un défi pour ma marque|Launch a challenge for my brand|Lançar um desafio para a minha marca|Lanzar un reto para mi marca|أطلق تحديًا لعلامتي التجارية|Anzisha changamoto kwa chapa yangu|ለብራንዴ ፈተና ጀምር|Brendim üçün çağırış başlat
Lancer un sondage|Start a poll|Lançar uma sondagem|Lanzar una encuesta|أطلق استطلاعًا|Anzisha kura|ምርጫ ጀምር|Sorğu başlat
Le badge ✔ Vérifié montre que l’équipe Vibzo a contrôlé ton identité. Les acheteurs et les candidats te font plus confiance, et tu vends plus|The ✔ Verified badge shows that the Vibzo team checked your identity. Buyers and candidates trust you more, and you sell more|O selo ✔ Verificado mostra que a equipa Vibzo confirmou a tua identidade. Compradores e candidatos confiam mais em ti e vendes mais|La insignia ✔ Verificado muestra que el equipo de Vibzo comprobó tu identidad. Compradores y candidatos confían más en ti y vendes más|تُظهر شارة ✔ موثّق أن فريق Vibzo تحقق من هويتك. يثق بك المشترون والمرشحون أكثر وتبيع أكثر|Beji ✔ Imethibitishwa inaonyesha kuwa timu ya Vibzo imekagua utambulisho wako. Wanunuzi na waombaji wanakuamini zaidi, na unauza zaidi|✔ የተረጋገጠ ባጅ የVibzo ቡድን ማንነትህን እንዳጣራ ያሳያል። ገዢዎችና እጩዎች የበለጠ ያምኑሃል፣ የበለጠም ትሸጣለህ|✔ Təsdiqlənmiş nişanı Vibzo komandasının şəxsiyyətini yoxladığını göstərir. Alıcılar və namizədlər sənə daha çox güvənir, daha çox satırsan
Les messages contenant ces mots sont cachés pour tout le monde|Messages containing these words are hidden for everyone|As mensagens com estas palavras ficam ocultas para todos|Los mensajes con estas palabras se ocultan para todos|تُخفى الرسائل التي تحتوي على هذه الكلمات عن الجميع|Ujumbe wenye maneno haya unafichwa kwa kila mtu|እነዚህን ቃላት የያዙ መልእክቶች ለሁሉም ይደበቃሉ|Bu sözləri olan mesajlar hamı üçün gizlədilir
Les vidéos ne se chargent qu’au moment où tu les regardes, les aperçus sont désactivés. Tu consommes beaucoup moins de données|Videos only load when you watch them and previews are turned off. You use much less data|Os vídeos só carregam quando os vês e as pré-visualizações ficam desligadas. Gastas muito menos dados|Los vídeos solo se cargan cuando los ves y las vistas previas se desactivan. Consumes muchos menos datos|لا تُحمَّل الفيديوهات إلا عند مشاهدتها وتُعطَّل المعاينات. تستهلك بيانات أقل بكثير|Video zinapakia tu unapozitazama na hakiki zimezimwa. Unatumia data kidogo sana|ቪዲዮዎቹ የሚጫኑት ስትመለከታቸው ብቻ ነው፣ ቅድመ እይታዎች ጠፍተዋል። በጣም ያነሰ ዳታ ትጠቀማለህ|Videolar yalnız baxanda yüklənir, önizləmələr söndürülür. Daha az data işlədirsən
Mode petit forfait|Data saver mode|Modo poupança de dados|Modo ahorro de datos|وضع توفير البيانات|Hali ya kuokoa data|የዳታ ቁጠባ ሁነታ|Data qənaət rejimi
Petit forfait & hors ligne|Data saver & offline|Poupança de dados e offline|Ahorro de datos y sin conexión|توفير البيانات وبدون اتصال|Kuokoa data na nje ya mtandao|የዳታ ቁጠባና ከመስመር ውጭ|Data qənaəti və oflayn
Modération du chat|Chat moderation|Moderação do chat|Moderación del chat|إدارة الدردشة|Udhibiti wa gumzo|የውይይት ቁጥጥር|Söhbət moderasiyası
Mode lent|Slow mode|Modo lento|Modo lento|الوضع البطيء|Hali ya polepole|ዝግ ያለ ሁነታ|Yavaş rejim
Mots interdits (séparés par des virgules|Banned words (separated by commas|Palavras proibidas (separadas por vírgulas|Palabras prohibidas (separadas por comas|كلمات ممنوعة (مفصولة بفواصل|Maneno yaliyokatazwa (yakitenganishwa kwa koma|የተከለከሉ ቃላት (በኮማ የተለዩ|Qadağan sözlər (vergüllə ayrılmış
Nom complet (comme sur ta pièce d’identité|Full name (as on your ID|Nome completo (como no teu documento|Nombre completo (como en tu documento|الاسم الكامل (كما في هويتك|Jina kamili (kama kwenye kitambulisho chako|ሙሉ ስም (በመታወቂያህ ላይ እንዳለው|Tam ad (şəxsiyyət vəsiqəndəki kimi
Nom de la marque|Brand name|Nome da marca|Nombre de la marca|اسم العلامة التجارية|Jina la chapa|የብራንድ ስም|Brendin adı
Noter|Rate|Avaliar|Valorar|قيّم|Kadiria|ደረጃ ስጥ|Qiymətləndir
Noter ce prestataire|Rate this provider|Avaliar este prestador|Valorar a este proveedor|قيّم مقدم الخدمة هذا|Kadiria mtoa huduma huyu|ይህን አገልግሎት ሰጪ ደረጃ ስጥ|Bu xidmətçini qiymətləndir
Noter la boutique|Rate the shop|Avaliar a loja|Valorar la tienda|قيّم المتجر|Kadiria duka|ሱቁን ደረጃ ስጥ|Mağazanı qiymətləndir
Objectif|Goal|Objetivo|Objetivo|الهدف|Lengo|ግብ|Hədəf
Objectif de cadeaux|Gift goal|Objetivo de presentes|Objetivo de regalos|هدف الهدايا|Lengo la zawadi|የስጦታ ግብ|Hədiyyə hədəfi
Obtenir le badge vérifié|Get the verified badge|Obter o selo verificado|Obtener la insignia verificada|احصل على شارة التحقق|Pata beji ya uthibitisho|የተረጋገጠ ባጅ አግኝ|Təsdiq nişanı al
Obtenir|Get|Obter|Obtener|احصل|Pata|አግኝ|Al
Outils du live|Live tools|Ferramentas do live|Herramientas del directo|أدوات البث|Zana za mubashara|የቀጥታ መሳሪያዎች|Yayın alətləri
Partager le défi|Share the challenge|Partilhar o desafio|Compartir el reto|شارك التحدي|Shiriki changamoto|ፈተናውን አጋራ|Çağırışı paylaş
Partager le live|Share the live|Partilhar o live|Compartir el directo|شارك البث|Shiriki mubashara|ቀጥታውን አጋራ|Yayını paylaş
Partager mon live|Share my live|Partilhar o meu live|Compartir mi directo|شارك بثي|Shiriki mubashara wangu|ቀጥታዬን አጋራ|Yayınımı paylaş
Pas encore de participation. Sois le premier|No entries yet. Be the first|Ainda sem participações. Sê o primeiro|Aún no hay participaciones. Sé el primero|لا مشاركات بعد. كن الأول|Bado hakuna washiriki. Kuwa wa kwanza|እስካሁን ተሳታፊ የለም። የመጀመሪያው ሁን|Hələ iştirak yoxdur. İlk sən ol
Pas encore d’avis|No reviews yet|Ainda sem avaliações|Aún no hay opiniones|لا تقييمات بعد|Bado hakuna maoni|እስካሁን ግምገማ የለም|Hələ rəy yoxdur
Personne pour le moment|Nobody yet|Ninguém por agora|Nadie por ahora|لا أحد حاليًا|Hakuna mtu kwa sasa|ለአሁን ማንም የለም|Hələ heç kim yoxdur
Pièces à atteindre|Coins to reach|Moedas a atingir|Monedas a alcanzar|العملات المطلوبة|Sarafu za kufikia|የሚደረስባቸው ሳንቲሞች|Çatılacaq sikkələr
Pour les marques|For brands|Para marcas|Para marcas|للعلامات التجارية|Kwa chapa|ለብራንዶች|Brendlər üçün
Une photo de ta pièce d’identité (carte, passeport ou permis|A photo of your ID (card, passport or driving licence|Uma foto do teu documento (cartão, passaporte ou carta de condução|Una foto de tu documento (DNI, pasaporte o permiso|صورة لهويتك (بطاقة أو جواز سفر أو رخصة|Picha ya kitambulisho chako (kadi, pasipoti au leseni|የመታወቂያህ ፎቶ (ካርድ፣ ፓስፖርት ወይም መንጃ ፈቃድ|Şəxsiyyət vəsiqənin şəkli (kart, pasport və ya sürücülük vəsiqəsi
Un selfie où tu tiens cette pièce à côté de ton visage|A selfie holding that ID next to your face|Uma selfie a segurar esse documento junto ao rosto|Un selfie sosteniendo ese documento junto a tu cara|صورة سيلفي وأنت تحمل الهوية بجانب وجهك|Selfie ukishika kitambulisho hicho karibu na uso wako|ያንን መታወቂያ ከፊትህ አጠገብ ይዘህ የራስ ፎቶ|O vəsiqəni üzünün yanında tutduğun selfi
Pour une entreprise : une photo de ton registre de commerce (facultatif|For a company: a photo of your business registration (optional|Para uma empresa: uma foto do teu registo comercial (opcional|Para una empresa: una foto de tu registro mercantil (opcional|للشركات: صورة من سجلك التجاري (اختياري|Kwa kampuni: picha ya usajili wa biashara yako (si lazima|ለድርጅት፦ የንግድ ምዝገባህ ፎቶ (አማራጭ|Şirkət üçün: ticarət reyestrinin şəkli (könüllü
Prix à partir de (facultatif|Price from (optional|Preço a partir de (opcional|Precio desde (opcional|السعر ابتداءً من (اختياري|Bei kuanzia (si lazima|ዋጋ ከ (አማራጭ|Qiymət, başlayaraq (könüllü
Produit conforme ? Livraison rapide ? Vendeur sérieux|Product as described? Fast delivery? Reliable seller|Produto conforme? Entrega rápida? Vendedor sério|¿Producto conforme? ¿Entrega rápida? ¿Vendedor serio|هل المنتج مطابق؟ توصيل سريع؟ بائع جاد|Bidhaa sahihi? Uwasilishaji wa haraka? Muuzaji makini|ምርቱ እንደተገለጸው ነው? ፈጣን ማድረስ? ታማኝ ሻጭ|Məhsul uyğundur? Çatdırılma sürətlidir? Satıcı etibarlıdır
Proposer mon service|Offer my service|Oferecer o meu serviço|Ofrecer mi servicio|اعرض خدمتي|Toa huduma yangu|አገልግሎቴን አቅርብ|Xidmətimi təklif et
Prénom et nom|First and last name|Nome e apelido|Nombre y apellido|الاسم واللقب|Jina la kwanza na la mwisho|ስምና የአባት ስም|Ad və soyad
Publie une vidéo avec|Post a video with|Publica um vídeo com|Publica un vídeo con|انشر فيديو مع|Chapisha video yenye|ቪዲዮ ለጥፍ ከ|Bu heşteqlə video paylaş
avant la fin. Classement selon les vues réelles et les j’aime. Les gagnants reçoivent leur prix dans leur portefeuille Vibzo, retirable en Mobile Money|before the end. Ranking by real views and likes. Winners get their prize in their Vibzo wallet, withdrawable via Mobile Money|antes do fim. Classificação pelas visualizações reais e gostos. Os vencedores recebem o prémio na carteira Vibzo, levantável por Mobile Money|antes del final. Clasificación según las vistas reales y los me gusta. Los ganadores reciben su premio en su monedero Vibzo, retirable por Mobile Money|قبل النهاية. الترتيب حسب المشاهدات الحقيقية والإعجابات. يتلقى الفائزون جوائزهم في محفظة Vibzo، قابلة للسحب عبر Mobile Money|kabla ya mwisho. Nafasi kwa mitazamo halisi na kupendwa. Washindi wanapata zawadi kwenye pochi yao ya Vibzo, inayotolewa kwa Mobile Money|ከማብቂያው በፊት። ደረጃው በእውነተኛ እይታዎችና መውደዶች ነው። አሸናፊዎች ሽልማታቸውን በVibzo ቦርሳቸው ያገኛሉ፣ በሞባይል ገንዘብ ይወጣል|bitməmişdən əvvəl. Sıralama real baxışlara və bəyənmələrə görədir. Qaliblər mükafatı Vibzo pul kisəsində alır, Mobile Money ilə çıxarıla bilər
Publier mon avis|Post my review|Publicar a minha avaliação|Publicar mi opinión|انشر تقييمي|Chapisha maoni yangu|ግምገማዬን ለጥፍ|Rəyimi paylaş
Publier mon service|Publish my service|Publicar o meu serviço|Publicar mi servicio|انشر خدمتي|Chapisha huduma yangu|አገልግሎቴን ለጥፍ|Xidmətimi dərc et
Quand tu ouvres Vibzo en Wi-Fi, 10 nouvelles vidéos sont gardées pour plus tard, sans internet|When you open Vibzo on Wi-Fi, 10 new videos are saved for later, without internet|Quando abres o Vibzo em Wi-Fi, 10 vídeos novos ficam guardados para depois, sem internet|Cuando abres Vibzo con Wi-Fi, se guardan 10 vídeos nuevos para más tarde, sin internet|عند فتح Vibzo عبر الواي فاي، تُحفظ 10 فيديوهات جديدة لمشاهدتها لاحقًا دون إنترنت|Ukifungua Vibzo kwenye Wi-Fi, video 10 mpya zinahifadhiwa kwa baadaye, bila intaneti|Vibzoን በWi-Fi ስትከፍት 10 አዳዲስ ቪዲዮዎች ለኋላ ያለ ኢንተርኔት ይቀመጣሉ|Vibzo-nu Wi-Fi ilə açanda 10 yeni video sonra internetsiz baxmaq üçün saxlanılır
Règles et description|Rules and description|Regras e descrição|Reglas y descripción|القواعد والوصف|Kanuni na maelezo|ደንቦችና መግለጫ|Qaydalar və təsvir
Seul toi peux écrire|Only you can write|Só tu podes escrever|Solo tú puedes escribir|أنت فقط من يمكنه الكتابة|Ni wewe tu unayeweza kuandika|መጻፍ የምትችለው አንተ ብቻ ነህ|Yalnız sən yaza bilərsən
Sondage|Poll|Sondagem|Encuesta|استطلاع|Kura|ምርጫ|Sorğu
Spectateurs|Viewers|Espectadores|Espectadores|المشاهدون|Watazamaji|ተመልካቾች|İzləyicilər
spectateurs|viewers|espectadores|espectadores|مشاهدين|watazamaji|ተመልካቾች|izləyici
Spectateurs et invités|Viewers and guests|Espectadores e convidados|Espectadores e invitados|المشاهدون والضيوف|Watazamaji na wageni|ተመልካቾችና እንግዶች|İzləyicilər və qonaqlar
Titre du défi|Challenge title|Título do desafio|Título del reto|عنوان التحدي|Kichwa cha changamoto|የፈተናው ርዕስ|Çağırışın adı
Ton avis (facultatif|Your review (optional|A tua avaliação (opcional|Tu opinión (opcional|تقييمك (اختياري|Maoni yako (si lazima|ግምገማህ (አማራጭ|Rəyin (könüllü
Ton avis est public et aide les autres acheteurs à éviter les arnaques|Your review is public and helps other buyers avoid scams|A tua avaliação é pública e ajuda outros compradores a evitar burlas|Tu opinión es pública y ayuda a otros compradores a evitar estafas|تقييمك علني ويساعد المشترين الآخرين على تجنب الاحتيال|Maoni yako ni ya umma na yanasaidia wanunuzi wengine kuepuka utapeli|ግምገማህ ለሕዝብ ክፍት ነው፣ ሌሎች ገዢዎች ከማጭበርበር እንዲጠበቁ ይረዳል|Rəyin açıqdır və digər alıcılara fırıldaqdan qaçmağa kömək edir
Tous les pays|All countries|Todos os países|Todos los países|جميع الدول|Nchi zote|ሁሉም ሀገራት|Bütün ölkələr
Tu peux noter un prestataire après avoir échangé avec lui par message sur Vibzo|You can rate a provider after messaging with them on Vibzo|Podes avaliar um prestador depois de trocar mensagens com ele no Vibzo|Puedes valorar a un proveedor después de hablar con él por mensaje en Vibzo|يمكنك تقييم مقدم الخدمة بعد التراسل معه على Vibzo|Unaweza kumkadiria mtoa huduma baada ya kuwasiliana naye kwa ujumbe kwenye Vibzo|በVibzo በመልእክት ከተነጋገርክ በኋላ አገልግሎት ሰጪውን ደረጃ መስጠት ትችላለህ|Vibzo-da onunla yazışdıqdan sonra xidmətçini qiymətləndirə bilərsən
Télécharger 10 vidéos maintenant|Download 10 videos now|Descarregar 10 vídeos agora|Descargar 10 vídeos ahora|حمّل 10 فيديوهات الآن|Pakua video 10 sasa|አሁን 10 ቪዲዮዎችን አውርድ|İndi 10 video yüklə
Télécharger automatiquement en Wi-Fi|Download automatically on Wi-Fi|Descarregar automaticamente em Wi-Fi|Descargar automáticamente con Wi-Fi|التحميل تلقائيًا عبر الواي فاي|Pakua kiotomatiki kwenye Wi-Fi|በWi-Fi በራስ-ሰር አውርድ|Wi-Fi ilə avtomatik yüklə
Une barre de progression s’affiche pour tous : tes fans t’aident à l’atteindre avec leurs cadeaux|A progress bar is shown to everyone: your fans help you reach it with their gifts|Uma barra de progresso aparece para todos: os teus fãs ajudam-te a atingi-la com presentes|Una barra de progreso se muestra a todos: tus fans te ayudan a alcanzarla con sus regalos|يظهر شريط تقدم للجميع: يساعدك معجبوك على بلوغه بهداياهم|Upau wa maendeleo unaonekana kwa wote: mashabiki wako wanakusaidia kuufikia kwa zawadi zao|የእድገት አሞሌ ለሁሉም ይታያል፦ አድናቂዎችህ በስጦታቸው እንድትደርስበት ይረዱሃል|Hamıya irəliləyiş zolağı görünür: fanatların hədiyyələrlə ona çatmağa kömək edir
Vendeur non vérifié|Unverified seller|Vendedor não verificado|Vendedor no verificado|بائع غير موثّق|Muuzaji asiyethibitishwa|ያልተረጋገጠ ሻጭ|Təsdiqlənməmiş satıcı
Vendeur vérifié par Vibzo|Seller verified by Vibzo|Vendedor verificado pelo Vibzo|Vendedor verificado por Vibzo|بائع موثّق من Vibzo|Muuzaji amethibitishwa na Vibzo|በVibzo የተረጋገጠ ሻጭ|Vibzo tərəfindən təsdiqlənmiş satıcı
Vidéo de démonstration (une de tes vidéos|Demo video (one of your videos|Vídeo de demonstração (um dos teus vídeos|Vídeo de demostración (uno de tus vídeos|فيديو توضيحي (أحد فيديوهاتك|Video ya maonyesho (moja ya video zako|የማሳያ ቪዲዮ (ከቪዲዮዎችህ አንዱ|Nümayiş videosu (videolarından biri
Vidéos hors ligne|Offline videos|Vídeos offline|Vídeos sin conexión|فيديوهات بدون اتصال|Video za nje ya mtandao|ከመስመር ውጭ ቪዲዮዎች|Oflayn videolar
Regarder sans internet|Watch without internet|Ver sem internet|Ver sin internet|شاهد دون إنترنت|Tazama bila intaneti|ያለ ኢንተርኔት ተመልከት|İnternetsiz bax
Tout supprimer|Delete all|Apagar tudo|Eliminar todo|احذف الكل|Futa zote|ሁሉንም ሰርዝ|Hamısını sil
Vérifié|Verified|Verificado|Verificado|موثّق|Imethibitishwa|የተረጋገጠ|Təsdiqlənib
ventes livrées|delivered sales|vendas entregues|ventas entregadas|مبيعات مُسلَّمة|mauzo yaliyowasilishwa|የደረሱ ሽያጮች|çatdırılmış satış
sur Vibzo depuis|on Vibzo since|no Vibzo desde|en Vibzo desde|على Vibzo منذ|kwenye Vibzo tangu|በVibzo ከ|Vibzo-da bu vaxtdan
dès|from|desde|desde|ابتداءً من|kuanzia|ከ|başlayaraq
À partir de|From|A partir de|Desde|ابتداءً من|Kuanzia|ከ|Başlayaraq
message toutes les 10 secondes par spectateur|message every 10 seconds per viewer|mensagem a cada 10 segundos por espectador|mensaje cada 10 segundos por espectador|رسالة كل 10 ثوانٍ لكل مشاهد|ujumbe kila sekunde 10 kwa kila mtazamaji|መልእክት በየ10 ሰከንዱ ለእያንዳንዱ ተመልካች|hər izləyiçi üçün 10 saniyədə bir mesaj
Écrire pour réserver|Message to book|Escrever para reservar|Escribir para reservar|راسل للحجز|Andika ili kuweka nafasi|ለመያዝ ጻፍ|Rezerv üçün yaz
à payer pour lancer le défi|to pay to launch the challenge|a pagar para lançar o desafio|a pagar para lanzar el reto|للدفع لإطلاق التحدي|kulipa ili kuanzisha changamoto|ፈተናውን ለመጀመር የሚከፈል|çağırışı başlatmaq üçün ödəniləcək
j restants|days left|dias restantes|días restantes|يوم متبقٍ|siku zimebaki|ቀናት ቀርተዋል|gün qalıb
participations|entries|participações|participaciones|مشاركات|washiriki|ተሳታፊዎች|iştirak
Participer|Join|Participar|Participar|شارك|Shiriki|ተሳተፍ|Qatıl
Classement|Ranking|Classificação|Clasificación|الترتيب|Msimamo|ደረጃ|Sıralama
Choisir|Choose|Escolher|Elegir|اختر|Chagua|ምረጥ|Seç
Valider les gagnants|Confirm winners|Confirmar vencedores|Confirmar ganadores|أكّد الفائزين|Thibitisha washindi|አሸናፊዎችን አረጋግጥ|Qalibləri təsdiqlə
Services|Services|Serviços|Servicios|الخدمات|Huduma|አገልግሎቶች|Xidmətlər
Mes services|My services|Os meus serviços|Mis servicios|خدماتي|Huduma zangu|አገልግሎቶቼ|Xidmətlərim
Près de chez toi|Near you|Perto de ti|Cerca de ti|بالقرب منك|Karibu nawe|በአቅራቢያህ|Yaxınlığında
Tout|All|Tudo|Todo|الكل|Zote|ሁሉም|Hamısı
Vidéo|Video|Vídeo|Vídeo|فيديو|Video|ቪዲዮ|Video
Masqué|Hidden|Oculto|Oculto|مخفي|Imefichwa|ተደብቋል|Gizli
Quartier / zone d’intervention|Neighbourhood / service area|Bairro / zona de atuação|Barrio / zona de servicio|الحي / منطقة العمل|Mtaa / eneo la huduma|ሰፈር / የአገልግሎት ክልል|Məhəllə / xidmət ərazisi
WhatsApp (facultatif|WhatsApp (optional|WhatsApp (opcional|WhatsApp (opcional|واتساب (اختياري|WhatsApp (si lazima|WhatsApp (አማራጭ|WhatsApp (könüllü
Devise|Currency|Moeda|Moneda|العملة|Sarafu|ምንዛሬ|Valyuta
Participants|Participants|Participantes|Participantes|المشاركون|Washiriki|ተሳታፊዎች|İştirakçılar
Défi créé|Challenge created|Desafio criado|Reto creado|تم إنشاء التحدي|Changamoto imeundwa|ፈተና ተፈጥሯል|Çağırış yaradıldı
Il sera mis en ligne dès réception du paiement|It will go live as soon as payment is received|Será publicado assim que o pagamento for recebido|Se publicará en cuanto se reciba el pago|سيُنشر فور استلام الدفع|Itachapishwa mara malipo yatakapopokelewa|ክፍያው እንደደረሰ ይለቀቃል|Ödəniş alınan kimi yayımlanacaq
Montant à payer|Amount to pay|Montante a pagar|Importe a pagar|المبلغ المستحق|Kiasi cha kulipa|የሚከፈለው መጠን|Ödəniləcək məbləğ
de prix|in prizes|em prémios|en premios|من الجوائز|ya zawadi|ሽልማት|mükafat
Envoyer la preuve sur WhatsApp|Send proof on WhatsApp|Enviar comprovativo pelo WhatsApp|Enviar comprobante por WhatsApp|أرسل الإثبات عبر واتساب|Tuma uthibitisho kwa WhatsApp|ማረጋገጫውን በWhatsApp ላክ|Sübutu WhatsApp ilə göndər
Ton compte est vérifié|Your account is verified|A tua conta está verificada|Tu cuenta está verificada|حسابك موثّق|Akaunti yako imethibitishwa|መለያህ ተረጋግጧል|Hesabın təsdiqlənib
Compte vérifié|Verified account|Conta verificada|Cuenta verificada|حساب موثّق|Akaunti imethibitishwa|የተረጋገጠ መለያ|Təsdiqlənmiş hesab
Envoyer sur WhatsApp|Send on WhatsApp|Enviar pelo WhatsApp|Enviar por WhatsApp|أرسل عبر واتساب|Tuma kwa WhatsApp|በWhatsApp ላክ|WhatsApp ilə göndər
Recruteur vérifié par Vibzo|Recruiter verified by Vibzo|Recrutador verificado pelo Vibzo|Reclutador verificado por Vibzo|موظِّف موثّق من Vibzo|Mwajiri amethibitishwa na Vibzo|በVibzo የተረጋገጠ ቀጣሪ|Vibzo tərəfindən təsdiqlənmiş işəgötürən
son identité a été contrôlée|their identity has been checked|a identidade foi verificada|su identidad ha sido comprobada|تم التحقق من هويته|utambulisho wake umekaguliwa|ማንነቱ ተረጋግጧል|şəxsiyyəti yoxlanılıb
Réponse du vendeur|Seller's reply|Resposta do vendedor|Respuesta del vendedor|رد البائع|Jibu la muuzaji|የሻጩ መልስ|Satıcının cavabı
Répondre à cet avis|Reply to this review|Responder a esta avaliação|Responder a esta opinión|رد على هذا التقييم|Jibu maoni haya|ለዚህ ግምገማ መልስ ስጥ|Bu rəyə cavab ver
Avis envoyé|Review sent|Avaliação enviada|Opinión enviada|تم إرسال التقييم|Maoni yametumwa|ግምገማ ተልኳል|Rəy göndərildi
Vendre pendant le live|Sell during the live|Vender durante o live|Vender durante el directo|بِع أثناء البث|Uza wakati wa mubashara|በቀጥታ ጊዜ ሽጥ|Yayın zamanı sat
Vendre un produit|Sell a product|Vender um produto|Vender un producto|بِع منتجًا|Uza bidhaa|ምርት ሽጥ|Məhsul sat
Épingler|Pin|Fixar|Fijar|ثبّت|Bandika|ለጥፍ|Bərkit
Épinglé|Pinned|Fixado|Fijado|مثبّت|Imebandikwa|ተለጥፏል|Bərkidilib
Retirer le produit de l’écran|Remove the product from the screen|Retirar o produto do ecrã|Quitar el producto de la pantalla|أزل المنتج من الشاشة|Ondoa bidhaa kwenye skrini|ምርቱን ከስክሪኑ አስወግድ|Məhsulu ekrandan götür
Inviter|Invite|Convidar|Invitar|ادعُ|Alika|ጋብዝ|Dəvət et
Accepter|Accept|Aceitar|Aceptar|اقبل|Kubali|ተቀበል|Qəbul et
Expulser|Remove|Expulsar|Expulsar|اطرد|Mfukuze|አስወጣ|Çıxar
Retirer|Remove|Retirar|Quitar|أزل|Ondoa|አስወግድ|Götür
À l’écran|On screen|No ecrã|En pantalla|على الشاشة|Kwenye skrini|በስክሪኑ ላይ|Ekranda
Demande|Request|Pedido|Solicitud|طلب|Ombi|ጥያቄ|Sorğu
votes|votes|votos|votos|أصوات|kura|ድምፆች|səs
Retirer l’objectif|Remove goal|Remover objetivo|Quitar objetivo|أزل الهدف|Ondoa lengo|ግቡን አስወግድ|Hədəfi götür
Question|Question|Pergunta|Pregunta|السؤال|Swali|ጥያቄ|Sual
Affiché|Shown|Visível|Visible|معروض|Inaonyeshwa|ታይቷል|Göstərilir
En cours|In progress|Em curso|En curso|جارٍ|Inaendelea|በሂደት ላይ|Davam edir
Tu es à l’écran avec l’animateur|You're on screen with the host|Estás no ecrã com o anfitrião|Estás en pantalla con el anfitrión|أنت على الشاشة مع المضيف|Uko kwenye skrini na mwenyeji|ከአስተናጋጁ ጋር በስክሪኑ ላይ ነህ|Aparıcı ilə ekrandasan
Le chat est fermé par l’animateur|The host has closed the chat|O anfitrião fechou o chat|El anfitrión ha cerrado el chat|أغلق المضيف الدردشة|Mwenyeji amefunga gumzo|አስተናጋጁ ውይይቱን ዘግቷል|Aparıcı söhbəti bağlayıb
Mode lent activé|Slow mode on|Modo lento ativado|Modo lento activado|تم تفعيل الوضع البطيء|Hali ya polepole imewashwa|ዝግ ያለ ሁነታ በርቷል|Yavaş rejim aktivdir
Objectif atteint ! Merci à tous|Goal reached! Thank you all|Objetivo atingido! Obrigado a todos|¡Objetivo alcanzado! Gracias a todos|تم بلوغ الهدف! شكرًا للجميع|Lengo limefikiwa! Asanteni nyote|ግቡ ተሳክቷል! ሁላችሁንም እናመሰግናለን|Hədəfə çatıldı! Hamıya təşəkkürlər
Merci pour ton avis|Thanks for your review|Obrigado pela tua avaliação|Gracias por tu opinión|شكرًا على تقييمك|Asante kwa maoni yako|ስለ ግምገማህ እናመሰግናለን|Rəyin üçün təşəkkürlər
Ton service est en ligne|Your service is live|O teu serviço está online|Tu servicio está publicado|خدمتك متاحة الآن|Huduma yako iko hewani|አገልግሎትህ በመስመር ላይ ነው|Xidmətin yayımdadır
Demande envoyée à l’animateur|Request sent to the host|Pedido enviado ao anfitrião|Solicitud enviada al anfitrión|تم إرسال الطلب إلى المضيف|Ombi limetumwa kwa mwenyeji|ጥያቄው ለአስተናጋጁ ተልኳል|Sorğu aparıcıya göndərildi
Commentaire épinglé|Comment pinned|Comentário fixado|Comentario fijado|تم تثبيت التعليق|Maoni yamebandikwa|አስተያየቱ ተለጥፏል|Şərh bərkidildi
Règles du chat mises à jour|Chat rules updated|Regras do chat atualizadas|Reglas del chat actualizadas|تم تحديث قواعد الدردشة|Kanuni za gumzo zimesasishwa|የውይይት ደንቦች ተዘምነዋል|Söhbət qaydaları yeniləndi
Mode petit forfait activé|Data saver on|Poupança de dados ativada|Ahorro de datos activado|تم تفعيل توفير البيانات|Kuokoa data kumewashwa|የዳታ ቁጠባ በርቷል|Data qənaəti aktivdir
Pas de connexion internet|No internet connection|Sem ligação à internet|Sin conexión a internet|لا يوجد اتصال بالإنترنت|Hakuna muunganisho wa intaneti|የኢንተርኔት ግንኙነት የለም|İnternet bağlantısı yoxdur
Regarder mes vidéos hors ligne|Watch my offline videos|Ver os meus vídeos offline|Ver mis vídeos sin conexión|شاهد فيديوهاتي بدون اتصال|Tazama video zangu za nje ya mtandao|ከመስመር ውጭ ቪዲዮዎቼን ተመልከት|Oflayn videolarıma bax
Réessayer|Try again|Tentar de novo|Reintentar|أعد المحاولة|Jaribu tena|እንደገና ሞክር|Yenidən cəhd et
Gagnants récompensés|Winners rewarded|Vencedores premiados|Ganadores premiados|تمت مكافأة الفائزين|Washindi wamezawadiwa|አሸናፊዎች ተሸልመዋል|Qaliblər mükafatlandırıldı
Défi sponsorisé par|Challenge sponsored by|Desafio patrocinado por|Reto patrocinado por|تحدٍ برعاية|Changamoto imedhaminiwa na|በስፖንሰር የቀረበ ፈተና በ|Sponsorlu çağırış:
Prestataire non vérifié : ne paie jamais tout à l’avance. Paie après le travail ou au rendez-vous|Unverified provider: never pay everything in advance. Pay after the work or at the appointment|Prestador não verificado: nunca pagues tudo adiantado. Paga depois do trabalho ou no encontro|Proveedor no verificado: nunca pagues todo por adelantado. Paga después del trabajo o en la cita|مقدم خدمة غير موثّق: لا تدفع كل شيء مقدمًا أبدًا. ادفع بعد العمل أو عند الموعد|Mtoa huduma asiyethibitishwa: usilipe kila kitu mapema. Lipa baada ya kazi au kwenye miadi|ያልተረጋገጠ አገልግሎት ሰጪ፦ ሁሉንም አስቀድመህ በፍጹም አትክፈል። ከስራው በኋላ ወይም በቀጠሮው ላይ ክፈል|Təsdiqlənməmiş xidmətçi: heç vaxt hər şeyi əvvəlcədən ödəmə. İşdən sonra və ya görüşdə ödə
Choix 1|Choice 1|Opção 1|Opción 1|الخيار 1|Chaguo 1|ምርጫ 1|Seçim 1
Choix 2|Choice 2|Opção 2|Opción 2|الخيار 2|Chaguo 2|ምርጫ 2|Seçim 2
1 message toutes les 10 secondes par spectateur|1 message every 10 seconds per viewer|1 mensagem a cada 10 segundos por espectador|1 mensaje cada 10 segundos por espectador|رسالة واحدة كل 10 ثوانٍ لكل مشاهد|Ujumbe 1 kila sekunde 10 kwa kila mtazamaji|በየ10 ሰከንዱ 1 መልእክት ለእያንዳንዱ ተመልካች|Hər izləyiçi üçün 10 saniyədə 1 mesaj
Aa Ajouter un texte|Aa Add text|Aa Adicionar texto|Aa Añadir texto|Aa أضف نصًا|Aa Ongeza maandishi|Aa ጽሑፍ ጨምር|Aa Mətn əlavə et
Ajouter|Add|Adicionar|Añadir|أضف|Ongeza|ጨምር|Əlavə et
Ajouter un son|Add a sound|Adicionar um som|Añadir un sonido|أضف صوتًا|Ongeza sauti|ድምፅ ጨምር|Səs əlavə et
Choisis un son tendance : il sera ajouté à ta vidéo pendant que tu filmes|Pick a trending sound: it will be added to your video while you film|Escolhe um som em alta: será adicionado ao teu vídeo enquanto filmas|Elige un sonido en tendencia: se añadirá a tu vídeo mientras grabas|اختر صوتًا رائجًا: سيُضاف إلى فيديوك أثناء التصوير|Chagua sauti inayovuma: itaongezwa kwenye video yako unaporekodi|ተወዳጅ ድምፅ ምረጥ፦ ስትቀርጽ ወደ ቪዲዮህ ይጨመራል|Trend səs seç: çəkərkən videona əlavə olunacaq
Effets, minuteur, texte, sons tendance|Effects, timer, text, trending sounds|Efeitos, temporizador, texto, sons em alta|Efectos, temporizador, texto, sonidos en tendencia|مؤثرات، مؤقت، نص، أصوات رائجة|Madoido, kipima muda, maandishi, sauti zinazovuma|ውጤቶች፣ ሰዓት ቆጣሪ፣ ጽሑፍ፣ ተወዳጅ ድምፆች|Effektlər, taymer, mətn, trend səslər
Ex : Ma journée à Douala|E.g. My day in Douala|Ex.: O meu dia em Douala|Ej.: Mi día en Douala|مثال: يومي في دوالا|Mfano: Siku yangu Douala|ምሳሌ፦ በዱዋላ ቀኔ|Məs.: Dualada günüm
Ex : Mon premier challenge|E.g. My first challenge|Ex.: O meu primeiro desafio|Ej.: Mi primer reto|مثال: أول تحدٍ لي|Mfano: Changamoto yangu ya kwanza|ምሳሌ፦ የመጀመሪያ ፈተናዬ|Məs.: İlk çağırışım
Ex : Regarde jusqu’à la fin|E.g. Watch till the end|Ex.: Vê até ao fim|Ej.: Mira hasta el final|مثال: شاهد حتى النهاية|Mfano: Tazama hadi mwisho|ምሳሌ፦ እስከ መጨረሻው ተመልከት|Məs.: Sona qədər bax
Faire un Collage|Make a Stitch|Fazer um Stitch|Hacer un Stitch|اصنع Stitch|Tengeneza Stitch|Stitch ስራ|Stitch et
Faire un Duo|Make a Duet|Fazer um Dueto|Hacer un Dúo|اصنع ثنائيًا|Tengeneza Duet|ዱዌት ስራ|Duet et
Filmer avec Vibzo|Film with Vibzo|Filmar com o Vibzo|Grabar con Vibzo|صوّر مع Vibzo|Rekodi na Vibzo|በVibzo ቅረጽ|Vibzo ilə çək
Minuteur|Timer|Temporizador|Temporizador|المؤقت|Kipima muda|ሰዓት ቆጣሪ|Taymer
Filtres|Filters|Filtros|Filtros|المرشحات|Vichujio|ማጣሪያዎች|Filtrlər
Micro|Mic|Microfone|Micrófono|الميكروفون|Maikrofoni|ማይክ|Mikrofon
Extrait|Clip|Excerto|Fragmento|مقطع|Kipande|ቅንጭብ|Fraqment
Ouverture de la caméra|Opening the camera|A abrir a câmara|Abriendo la cámara|جارٍ فتح الكاميرا|Inafungua kamera|ካሜራውን በመክፈት ላይ|Kamera açılır
Publier la story|Post the story|Publicar a story|Publicar la historia|انشر القصة|Chapisha hadithi|ታሪኩን ለጥፍ|Hekayəni paylaş
Republier pour mes abonnés|Repost to my followers|Republicar para os meus seguidores|Republicar para mis seguidores|أعد النشر لمتابعيّ|Chapisha tena kwa wafuasi wangu|ለተከታዮቼ እንደገና ለጥፍ|İzləyicilərim üçün yenidən paylaş
Annuler la republication|Undo repost|Anular republicação|Deshacer republicación|ألغِ إعادة النشر|Tendua kuchapisha tena|ዳግም መለጠፉን ሰርዝ|Yenidən paylaşmanı ləğv et
Retourner|Flip|Virar|Girar|اقلب|Geuza|ቀይር|Çevir
Son · toutes les vidéos avec ce son|Sound · all videos with this sound|Som · todos os vídeos com este som|Sonido · todos los vídeos con este sonido|صوت · كل الفيديوهات بهذا الصوت|Sauti · video zote zenye sauti hii|ድምፅ · ይህ ድምፅ ያላቸው ሁሉም ቪዲዮዎች|Səs · bu səsli bütün videolar
Ta story|Your story|A tua story|Tu historia|قصتك|Hadithi yako|ታሪክህ|Hekayən
Ta story est visible 24 heures par tes abonnés, puis elle disparaît|Your story is visible to your followers for 24 hours, then it disappears|A tua story fica visível 24 horas para os teus seguidores e depois desaparece|Tu historia es visible 24 horas para tus seguidores y luego desaparece|قصتك مرئية لمتابعيك 24 ساعة ثم تختفي|Hadithi yako inaonekana kwa wafuasi wako kwa saa 24, kisha inatoweka|ታሪክህ ለተከታዮችህ ለ24 ሰዓት ይታያል፣ ከዚያ ይጠፋል|Hekayən izləyicilərinə 24 saat görünür, sonra yox olur
Ta vidéo sera visible par tous dans ta région. Interdit : nudité, violence, arnaques, contenus mettant en scène des mineurs de façon inappropriée|Your video will be visible to everyone in your region. Forbidden: nudity, violence, scams, content showing minors inappropriately|O teu vídeo ficará visível para todos na tua região. Proibido: nudez, violência, burlas, conteúdos que mostrem menores de forma inapropriada|Tu vídeo será visible para todos en tu región. Prohibido: desnudos, violencia, estafas, contenidos que muestren a menores de forma inapropiada|سيكون فيديوك مرئيًا للجميع في منطقتك. ممنوع: العري والعنف والاحتيال والمحتوى الذي يُظهر القاصرين بشكل غير لائق|Video yako itaonekana kwa kila mtu katika eneo lako. Imekatazwa: uchi, vurugu, utapeli, maudhui yanayoonyesha watoto isivyofaa|ቪዲዮህ በክልልህ ላሉ ሁሉ ይታያል። የተከለከለ፦ እርቃን፣ ሁከት፣ ማጭበርበር፣ ልጆችን አግባብ ባልሆነ መንገድ የሚያሳይ ይዘት|Videon bölgəndəki hər kəsə görünəcək. Qadağandır: çılpaqlıq, zorakılıq, fırıldaq, azyaşlıları yersiz göstərən məzmun
Texte|Text|Texto|Texto|نص|Maandishi|ጽሑፍ|Mətn
Texte de la story (facultatif|Story text (optional|Texto da story (opcional|Texto de la historia (opcional|نص القصة (اختياري|Maandishi ya hadithi (si lazima|የታሪኩ ጽሑፍ (አማራጭ|Hekayənin mətni (könüllü
Utiliser ce son|Use this sound|Usar este som|Usar este sonido|استخدم هذا الصوت|Tumia sauti hii|ይህን ድምፅ ተጠቀም|Bu səsdən istifadə et
Utiliser|Use|Usar|Usar|استخدم|Tumia|ተጠቀም|İstifadə et
vidéos|videos|vídeos|vídeos|فيديوهات|video|ቪዲዮዎች|video
vues|views|visualizações|vistas|مشاهدات|mitazamo|እይታዎች|baxış
Story 24 h|Story 24 h|Story 24 h|Historia 24 h|قصة 24 س|Hadithi saa 24|ታሪክ 24 ሰ|Hekayə 24 s
Position|Position|Posição|Posición|الموضع|Mahali|ቦታ|Mövqe
En haut|Top|Em cima|Arriba|في الأعلى|Juu|ከላይ|Yuxarıda
Au milieu|Middle|Ao meio|En medio|في الوسط|Katikati|በመሃል|Ortada
En bas|Bottom|Em baixo|Abajo|في الأسفل|Chini|ከታች|Aşağıda
Retirer les textes|Remove texts|Remover textos|Quitar textos|أزل النصوص|Ondoa maandishi|ጽሑፎቹን አስወግድ|Mətnləri götür
Retirer le son|Remove sound|Remover som|Quitar sonido|أزل الصوت|Ondoa sauti|ድምፁን አስወግድ|Səsi götür
avec|with|com|con|مع|na|ከ|ilə
Duo|Duet|Dueto|Dúo|ثنائي|Duet|ዱዌት|Duet
Collage|Stitch|Stitch|Stitch|Stitch|Stitch|Stitch|Stitch
Story publiée ⏱ Elle reste 24 heures|Story posted ⏱ It stays for 24 hours|Story publicada ⏱ Fica 24 horas|Historia publicada ⏱ Se queda 24 horas|تم نشر القصة ⏱ تبقى 24 ساعة|Hadithi imechapishwa ⏱ Inakaa saa 24|ታሪኩ ተለጥፏል ⏱ ለ24 ሰዓት ይቆያል|Hekayə paylaşıldı ⏱ 24 saat qalır
Son ajouté|Sound added|Som adicionado|Sonido añadido|تمت إضافة الصوت|Sauti imeongezwa|ድምፅ ተጨምሯል|Səs əlavə olundu
Autorise la caméra et le micro pour filmer|Allow camera and microphone to film|Permite a câmara e o microfone para filmar|Permite la cámara y el micrófono para grabar|اسمح بالكاميرا والميكروفون للتصوير|Ruhusu kamera na maikrofoni ili kurekodi|ለመቅረጽ ካሜራና ማይክሮፎን ፍቀድ|Çəkmək üçün kamera və mikrofona icazə ver
Recommencer depuis le début|Start over from the beginning|Recomeçar do início|Empezar de nuevo|البدء من جديد|Anza upya tangu mwanzo|ከመጀመሪያው እንደገና ጀምር|Əvvəldən başla
Supprimer cette story|Delete this story|Apagar esta story|Eliminar esta historia|احذف هذه القصة|Futa hadithi hii|ይህን ታሪክ ሰርዝ|Bu hekayəni sil
Story supprimée|Story deleted|Story apagada|Historia eliminada|تم حذف القصة|Hadithi imefutwa|ታሪኩ ተሰርዟል|Hekayə silindi
Micro coupé : seul le son sera enregistré|Mic off: only the sound will be recorded|Microfone desligado: só o som será gravado|Micrófono apagado: solo se grabará el sonido|الميكروفون مغلق: سيُسجَّل الصوت فقط|Maikrofoni imezimwa: sauti tu itarekodiwa|ማይክ ጠፍቷል፦ ድምፁ ብቻ ይቀረጻል|Mikrofon söndürülüb: yalnız səs yazılacaq
Répondre en vidéo|Reply with video|Responder em vídeo|Responder con vídeo|الرد بفيديو|Jibu kwa video|በቪዲዮ መልስ|Videoyla cavab ver
Réponse en vidéo à|Video reply to|Resposta em vídeo a|Respuesta en vídeo a|رد بالفيديو على|Jibu la video kwa|የቪዲዮ መልስ ለ|Video cavabı:
Réponse à|Reply to|Resposta a|Respuesta a|رد على|Jibu kwa|መልስ ለ|Cavab:
Le créateur a désactivé les commentaires|The creator turned off comments|O criador desativou os comentários|El creador desactivó los comentarios|عطّل صاحب المحتوى التعليقات|Mtayarishaji amezima maoni|ፈጣሪው አስተያየቶችን አጥፍቷል|Müəllif şərhləri bağlayıb
Le créateur a désactivé le téléchargement|The creator turned off downloads|O criador desativou as transferências|El creador desactivó las descargas|عطّل صاحب المحتوى التنزيل|Mtayarishaji amezima upakuaji|ፈጣሪው ማውረድን አጥፍቷል|Müəllif yükləməni bağlayıb
Faire un Duo ou un Collage avec ma vidéo|Duet or Stitch with my video|Fazer Dueto ou Stitch com o meu vídeo|Hacer Dúo o Stitch con mi vídeo|عمل ثنائي أو Stitch مع فيديوي|Duet au Stitch na video yangu|ከቪዲዮዬ ጋር ዱዌት ወይም Stitch|Videomla Duet və ya Stitch etmək
Télécharger ma publication|Download my post|Transferir a minha publicação|Descargar mi publicación|تنزيل منشوري|Kupakua chapisho langu|ልጥፌን ማውረድ|Paylaşımımı yükləmək
Qui peut|Who can|Quem pode|Quién puede|من يمكنه|Nani anaweza|ማን ይችላል|Kim edə bilər
Commenter|Comment|Comentar|Comentar|التعليق|Kutoa maoni|አስተያየት መስጠት|Şərh yazmaq
Enregistrer les vidéos que je regarde|Save the videos I watch|Guardar os vídeos que vejo|Guardar los vídeos que veo|حفظ الفيديوهات التي أشاهدها|Hifadhi video ninazotazama|የምመለከታቸውን ቪዲዮዎች አስቀምጥ|Baxdığım videoları yadda saxla
Les vidéos que tu regardes apparaîtront ici. Seul toi peux voir ton historique|Videos you watch will appear here. Only you can see your history|Os vídeos que vês aparecem aqui. Só tu podes ver o teu histórico|Los vídeos que ves aparecerán aquí. Solo tú puedes ver tu historial|ستظهر هنا الفيديوهات التي تشاهدها. أنت فقط ترى سجلك|Video unazotazama zitaonekana hapa. Ni wewe tu unayeona historia yako|የምትመለከታቸው ቪዲዮዎች እዚህ ይታያሉ። ታሪክህን የምታየው አንተ ብቻ ነህ|Baxdığın videolar burada görünəcək. Tarixçəni yalnız sən görürsən
Historique de visionnage|Watch history|Histórico de visualização|Historial de reproducción|سجل المشاهدة|Historia ya kutazama|የእይታ ታሪክ|Baxış tarixçəsi
Effacer l’historique|Clear history|Apagar histórico|Borrar historial|مسح السجل|Futa historia|ታሪኩን አጽዳ|Tarixçəni təmizlə
Historique en pause|History paused|Histórico em pausa|Historial en pausa|السجل متوقف مؤقتًا|Historia imesitishwa|ታሪክ ቆሟል|Tarixçə dayandırıldı
Historique activé|History on|Histórico ativado|Historial activado|تم تفعيل السجل|Historia imewashwa|ታሪክ በርቷል|Tarixçə aktivdir
Historique effacé|History cleared|Histórico apagado|Historial borrado|تم مسح السجل|Historia imefutwa|ታሪኩ ተጠርጓል|Tarixçə təmizləndi
Pas intéressé|Not interested|Não tenho interesse|No me interesa|غير مهتم|Sipendezwi|ፍላጎት የለኝም|Maraqlı deyil
Confidentialité de la publication|Post privacy|Privacidade da publicação|Privacidad de la publicación|خصوصية المنشور|Faragha ya chapisho|የልጥፉ ግላዊነት|Paylaşımın məxfiliyi
Épingler sur mon profil|Pin to my profile|Fixar no meu perfil|Fijar en mi perfil|تثبيت في ملفي|Bandika kwenye wasifu wangu|በመገለጫዬ ላይ ሰካ|Profilimə sabitlə
Désépingler du profil|Unpin from profile|Desafixar do perfil|Desfijar del perfil|إلغاء التثبيت من الملف|Ondoa kwenye wasifu|ከመገለጫ ንቀል|Profildən götür
Épinglée en haut de ton profil|Pinned to the top of your profile|Fixado no topo do teu perfil|Fijado arriba en tu perfil|تم التثبيت أعلى ملفك|Imebandikwa juu ya wasifu wako|በመገለጫህ አናት ላይ ተሰክቷል|Profilinin yuxarısına sabitləndi
Désépinglée|Unpinned|Desafixado|Desfijado|أُلغي التثبيت|Imeondolewa|ተነቅሏል|Sabitləmə götürüldü
Enregistrer les photos|Save the photos|Guardar as fotos|Guardar las fotos|حفظ الصور|Hifadhi picha|ፎቶዎቹን አስቀምጥ|Şəkilləri yadda saxla
Supprimer ma publication|Delete my post|Apagar a minha publicação|Eliminar mi publicación|حذف منشوري|Futa chapisho langu|ልጥፌን ሰርዝ|Paylaşımımı sil
Statistiques créateur|Creator analytics|Estatísticas de criador|Estadísticas de creador|إحصاءات صانع المحتوى|Takwimu za mtayarishaji|የፈጣሪ ስታቲስቲክስ|Müəllif statistikası
Statistiques|Analytics|Estatísticas|Estadísticas|الإحصاءات|Takwimu|ስታቲስቲክስ|Statistika
Bien-être et temps d’écran|Wellbeing and screen time|Bem-estar e tempo de ecrã|Bienestar y tiempo de pantalla|الرفاهية ووقت الشاشة|Ustawi na muda wa skrini|ደህንነትና የስክሪን ጊዜ|Rifah və ekran vaxtı
Bien-être|Wellbeing|Bem-estar|Bienestar|الرفاهية|Ustawi|ደህንነት|Rifah
Choisir des photos|Choose photos|Escolher fotos|Elegir fotos|اختر صورًا|Chagua picha|ፎቶዎችን ምረጥ|Şəkillər seç
Ajouter des photos|Add photos|Adicionar fotos|Añadir fotos|أضف صورًا|Ongeza picha|ፎቶዎችን ጨምር|Şəkil əlavə et
Décris tes photos|Describe your photos|Descreve as tuas fotos|Describe tus fotos|صِف صورك|Eleza picha zako|ፎቶዎችህን ግለጽ|Şəkillərini təsvir et
Jusqu’à 10 photos · elles défilent comme un diaporama|Up to 10 photos · they play as a slideshow|Até 10 fotos · passam como um diaporama|Hasta 10 fotos · se muestran como presentación|حتى 10 صور · تُعرض كعرض شرائح|Hadi picha 10 · zinaonyeshwa kama onyesho la slaidi|እስከ 10 ፎቶዎች · እንደ ስላይድ ትዕይንት ይታያሉ|10 şəklə qədər · slayd-şou kimi göstərilir
La musique joue pendant le diaporama|Music plays during the slideshow|A música toca durante o diaporama|La música suena durante la presentación|تُشغَّل الموسيقى أثناء العرض|Muziki unacheza wakati wa onyesho|በስላይድ ትዕይንቱ ጊዜ ሙዚቃ ይጫወታል|Slayd-şou zamanı musiqi çalır
Tes photos seront visibles par tous dans ta région. Interdit : nudité, violence, arnaques, contenus mettant en scène des mineurs de façon inappropriée|Your photos will be visible to everyone in your region. Forbidden: nudity, violence, scams, content showing minors inappropriately|As tuas fotos ficarão visíveis para todos na tua região. Proibido: nudez, violência, burlas, conteúdos que mostrem menores de forma inapropriada|Tus fotos serán visibles para todos en tu región. Prohibido: desnudos, violencia, estafas, contenidos que muestren a menores de forma inapropiada|ستكون صورك مرئية للجميع في منطقتك. ممنوع: العري والعنف والاحتيال والمحتوى الذي يُظهر القاصرين بشكل غير لائق|Picha zako zitaonekana kwa kila mtu katika eneo lako. Imekatazwa: uchi, vurugu, utapeli, maudhui yanayoonyesha watoto isivyofaa|ፎቶዎችህ በክልልህ ላሉ ሁሉ ይታያሉ። የተከለከለ፦ እርቃን፣ ሁከት፣ ማጭበርበር፣ ልጆችን አግባብ ባልሆነ መንገድ የሚያሳይ ይዘት|Şəkillərin bölgəndəki hər kəsə görünəcək. Qadağandır: çılpaqlıq, zorakılıq, fırıldaq, azyaşlıları yersiz göstərən məzmun
Nouvelle publication photo|New photo post|Nova publicação de fotos|Nueva publicación de fotos|منشور صور جديد|Chapisho jipya la picha|አዲስ የፎቶ ልጥፍ|Yeni şəkil paylaşımı
Photos|Photos|Fotos|Fotos|صور|Picha|ፎቶዎች|Şəkillər
Photos publiées 🎉|Photos posted 🎉|Fotos publicadas 🎉|Fotos publicadas 🎉|تم نشر الصور 🎉|Picha zimechapishwa 🎉|ፎቶዎቹ ተለጥፈዋል 🎉|Şəkillər paylaşıldı 🎉
Choisis d’abord des photos|Choose photos first|Escolhe primeiro as fotos|Elige primero las fotos|اختر الصور أولًا|Chagua picha kwanza|መጀመሪያ ፎቶዎችን ምረጥ|Əvvəlcə şəkil seç
10 photos au maximum|10 photos maximum|Máximo 10 fotos|Máximo 10 fotos|10 صور كحد أقصى|Picha 10 zaidi|ቢበዛ 10 ፎቶዎች|Maksimum 10 şəkil
Téléchargement des photos|Downloading photos|A transferir as fotos|Descargando las fotos|جارٍ تنزيل الصور|Inapakua picha|ፎቶዎችን በማውረድ ላይ|Şəkillər yüklənir
Image illisible|Unreadable image|Imagem ilegível|Imagen ilegible|صورة غير مقروءة|Picha haisomeki|የማይነበብ ምስል|Oxunmayan şəkil
Autoriser Duo et Collage|Allow Duet and Stitch|Permitir Dueto e Stitch|Permitir Dúo y Stitch|السماح بالثنائي وStitch|Ruhusu Duet na Stitch|ዱዌትና Stitch ፍቀድ|Duet və Stitch-ə icazə ver
Autoriser le téléchargement|Allow downloads|Permitir transferências|Permitir descargas|السماح بالتنزيل|Ruhusu upakuaji|ማውረድ ፍቀድ|Yükləməyə icazə ver
Autoriser les commentaires|Allow comments|Permitir comentários|Permitir comentarios|السماح بالتعليقات|Ruhusu maoni|አስተያየቶችን ፍቀድ|Şərhlərə icazə ver
Comptes|Accounts|Contas|Cuentas|الحسابات|Akaunti|መለያዎች|Hesablar
Sons|Sounds|Sons|Sonidos|الأصوات|Sauti|ድምፆች|Səslər
Top|Top|Top|Top|الأبرز|Bora|ምርጥ|Top
Aucun résultat|No results|Sem resultados|Sin resultados|لا توجد نتائج|Hakuna matokeo|ምንም ውጤት የለም|Nəticə yoxdur
Aucun live ne correspond à ta recherche|No live matches your search|Nenhum live corresponde à tua pesquisa|Ningún directo coincide con tu búsqueda|لا يوجد بث يطابق بحثك|Hakuna live inayolingana na utafutaji wako|ከፍለጋህ ጋር የሚዛመድ ቀጥታ ስርጭት የለም|Axtarışına uyğun canlı yayım yoxdur
Nouveaux abonnés|New followers|Novos seguidores|Nuevos seguidores|متابعون جدد|Wafuasi wapya|አዲስ ተከታዮች|Yeni izləyicilər
Tes meilleures publications|Your top posts|As tuas melhores publicações|Tus mejores publicaciones|أفضل منشوراتك|Machapisho yako bora|ምርጥ ልጥፎችህ|Ən yaxşı paylaşımların
Vues par jour|Views per day|Visualizações por dia|Vistas por día|المشاهدات يوميًا|Mitazamo kwa siku|በቀን እይታዎች|Gündəlik baxışlar
abonnés au total|followers in total|seguidores no total|seguidores en total|متابعًا إجمالًا|wafuasi kwa jumla|ጠቅላላ ተከታዮች|ümumi izləyici
pièces de cadeaux reçues|gift coins received|moedas de presentes recebidas|monedas de regalos recibidas|عملة هدايا مستلمة|sarafu za zawadi zilizopokelewa|የተቀበሉ የስጦታ ሳንቲሞች|alınmış hədiyyə sikkəsi
Les vidéos regardées jusqu’au bout sont montrées à plus de monde. Accroche dans les 2 premières secondes|Videos watched to the end are shown to more people. Hook viewers in the first 2 seconds|Os vídeos vistos até ao fim são mostrados a mais pessoas. Prende a atenção nos 2 primeiros segundos|Los vídeos vistos hasta el final se muestran a más gente. Engancha en los 2 primeros segundos|الفيديوهات التي تُشاهد حتى النهاية تُعرض لعدد أكبر. اجذب الانتباه في أول ثانيتين|Video zinazotazamwa hadi mwisho huonyeshwa kwa watu wengi zaidi. Vutia katika sekunde 2 za kwanza|እስከ መጨረሻ የሚታዩ ቪዲዮዎች ለብዙ ሰዎች ይታያሉ። በመጀመሪያዎቹ 2 ሰከንዶች ትኩረት ሳብ|Sona qədər baxılan videolar daha çox insana göstərilir. İlk 2 saniyədə diqqəti cəlb et
Publie ta première vidéo pour voir tes statistiques|Post your first video to see your analytics|Publica o teu primeiro vídeo para ver as estatísticas|Publica tu primer vídeo para ver tus estadísticas|انشر أول فيديو لك لترى إحصاءاتك|Chapisha video yako ya kwanza uone takwimu zako|ስታቲስቲክስህን ለማየት የመጀመሪያ ቪዲዮህን ለጥፍ|Statistikanı görmək üçün ilk videonu paylaş
Visionnage moyen|Average watch|Visualização média|Reproducción media|متوسط المشاهدة|Wastani wa kutazama|አማካይ እይታ|Orta baxış
Partages|Shares|Partilhas|Compartidos|المشاركات|Ushirikishaji|ማጋራቶች|Paylaşımlar
jours|days|dias|días|أيام|siku|ቀናት|gün
Aujourd’hui|Today|Hoje|Hoy|اليوم|Leo|ዛሬ|Bu gün
Moyenne par jour|Daily average|Média diária|Media diaria|المعدل اليومي|Wastani wa kila siku|የቀን አማካይ|Gündəlik orta
7 derniers jours|Last 7 days|Últimos 7 dias|Últimos 7 días|آخر 7 أيام|Siku 7 zilizopita|ያለፉት 7 ቀናት|Son 7 gün
Désactivé|Off|Desativado|Desactivado|معطّل|Imezimwa|ጠፍቷል|Söndürülüb
Le temps est compté sur cet appareil seulement, quand tu regardes des vidéos, des stories ou des lives|Time is counted on this device only, while you watch videos, stories or lives|O tempo é contado só neste aparelho, quando vês vídeos, stories ou lives|El tiempo se cuenta solo en este dispositivo, cuando ves vídeos, historias o directos|يُحسب الوقت على هذا الجهاز فقط أثناء مشاهدة الفيديوهات أو القصص أو البث|Muda unahesabiwa kwenye kifaa hiki tu, unapotazama video, hadithi au live|ጊዜው የሚቆጠረው በዚህ መሣሪያ ብቻ ነው፣ ቪዲዮዎችን፣ ታሪኮችን ወይም ቀጥታ ስርጭቶችን ስትመለከት|Vaxt yalnız bu cihazda, video, hekayə və ya canlı yayıma baxanda hesablanır
Limite de temps d’écran par jour|Daily screen time limit|Limite diário de tempo de ecrã|Límite diario de tiempo de pantalla|حد وقت الشاشة اليومي|Kikomo cha muda wa skrini kwa siku|የዕለት የስክሪን ጊዜ ገደብ|Gündəlik ekran vaxtı limiti
Rappel de pause après|Break reminder after|Lembrete de pausa após|Recordatorio de pausa tras|تذكير بالاستراحة بعد|Kikumbusho cha mapumziko baada ya|የእረፍት ማስታወሻ ከ|Fasilə xatırlatması
Et si tu faisais une pause|Time for a break|E se fizesses uma pausa|¿Y si te tomas un descanso|ما رأيك في استراحة|Vipi ukipumzika kidogo|ትንሽ ብታርፍስ|Bəlkə fasilə verəsən
Ton temps d’écran du jour est atteint|You've reached today's screen time|Atingiste o teu tempo de ecrã de hoje|Has alcanzado tu tiempo de pantalla de hoy|لقد بلغت وقت الشاشة لليوم|Umefikia muda wako wa skrini wa leo|የዛሬውን የስክሪን ጊዜህን ደርሰሃል|Bugünkü ekran vaxtın bitdi
Tu regardes Vibzo depuis|You've been watching Vibzo for|Estás a ver o Vibzo há|Llevas viendo Vibzo|أنت تشاهد Vibzo منذ|Umetazama Vibzo kwa|Vibzoን እየተመለከትክ ያለኸው ለ|Vibzo-ya baxırsan:
Lève-toi, bois de l’eau, regarde au loin quelques instants|Stand up, drink some water, look into the distance for a moment|Levanta-te, bebe água, olha ao longe por uns instantes|Levántate, bebe agua, mira a lo lejos unos instantes|انهض واشرب الماء وانظر بعيدًا لبضع لحظات|Simama, kunywa maji, tazama mbali kwa muda|ተነስ፣ ውሃ ጠጣ፣ ለጥቂት ጊዜ ወደ ሩቅ ተመልከት|Qalx, su iç, bir anlıq uzağa bax
Aujourd’hui :|Today:|Hoje:|Hoy:|اليوم:|Leo:|ዛሬ፦|Bu gün:
Tu avais choisi une limite de|You set a limit of|Escolheste um limite de|Elegiste un límite de|لقد اخترت حدًا قدره|Ulichagua kikomo cha|የመረጥከው ገደብ|Seçdiyin limit:
D’accord, je fais une pause|OK, I'll take a break|Está bem, vou fazer uma pausa|Vale, me tomo un descanso|حسنًا، سآخذ استراحة|Sawa, nitapumzika|እሺ፣ አርፋለሁ|Yaxşı, fasilə verirəm
Fermer pour aujourd’hui|Close for today|Fechar por hoje|Cerrar por hoy|إغلاق لهذا اليوم|Funga kwa leo|ለዛሬ ዝጋ|Bu günlük bağla
Continuer à regarder|Keep watching|Continuar a ver|Seguir viendo|متابعة المشاهدة|Endelea kutazama|መመልከት ቀጥል|Baxmağa davam et
Encore 15 minutes|15 more minutes|Mais 15 minutos|15 minutos más|15 دقيقة أخرى|Dakika 15 zaidi|ተጨማሪ 15 ደቂቃ|Daha 15 dəqiqə
À tout à l’heure 👋|See you later 👋|Até já 👋|Hasta luego 👋|إلى اللقاء 👋|Tutaonana baadaye 👋|በኋላ እንገናኝ 👋|Sonra görüşərik 👋
Tu peux épingler 3 vidéos au maximum|You can pin up to 3 videos|Podes fixar até 3 vídeos|Puedes fijar hasta 3 vídeos|يمكنك تثبيت 3 فيديوهات كحد أقصى|Unaweza kubandika video 3 zaidi|ቢበዛ 3 ቪዲዮዎችን መሰካት ትችላለህ|Maksimum 3 video sabitləyə bilərsən
Ce créateur n'autorise pas les Duos et Collages|This creator doesn't allow Duets and Stitches|Este criador não permite Duetos e Stitches|Este creador no permite Dúos ni Stitches|صاحب المحتوى لا يسمح بالثنائي وStitch|Mtayarishaji huyu haruhusu Duet na Stitch|ይህ ፈጣሪ ዱዌትና Stitch አይፈቅድም|Bu müəllif Duet və Stitch-ə icazə vermir
Photo invalide|Invalid photo|Foto inválida|Foto no válida|صورة غير صالحة|Picha si sahihi|ልክ ያልሆነ ፎቶ|Yanlış şəkil
Maximum 10 photos|Maximum 10 photos|Máximo 10 fotos|Máximo 10 fotos|10 صور كحد أقصى|Picha 10 zaidi|ቢበዛ 10 ፎቶዎች|Maksimum 10 şəkil
abonnés|followers|seguidores|seguidores|متابعون|wafuasi|ተከታዮች|izləyici
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
  if (root.nodeType !== 1) return; if (SKIP.has(root.tagName)) { if (root.tagName === 'TEXTAREA') tAttrs(root); return; }
  tAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => { if (n.nodeType === 1 && SKIP.has(n.tagName)) { if (n.tagName === 'TEXTAREA') tAttrs(n); return NodeFilter.FILTER_REJECT; } return NodeFilter.FILTER_ACCEPT; } });
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
