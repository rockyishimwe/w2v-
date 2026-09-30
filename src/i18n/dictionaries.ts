import type { Locale } from "./locales";

/**
 * UI dictionaries.
 *
 * Keys are the English source strings — English is therefore the identity
 * mapping and needs no table, and any key missing from `rw`/`fr` falls
 * back to readable English rather than a blank.
 *
 * Only interface copy lives here. Content that comes from the database
 * (listing titles, activity entries) or from the AI is localised by the
 * server, which receives the language in the `Accept-Language` header.
 */
export type Dictionary = Record<string, string>;

/* ── Kinyarwanda ──────────────────────────────────────────────── */

const rw: Dictionary = {
  /* Navigation and chrome */
  Dashboard: "Imbonerahamwe",
  Scanner: "Gusikana",
  Discover: "Gushakisha",
  Exchange: "Guhanahana",
  Activities: "Ibikorwa",
  Settings: "Igenamiterere",
  Logout: "Gusohoka",
  Home: "Ahabanza",
  Chat: "Ikiganiro",
  Camera: "Kamera",
  Main: "Ibanze",
  Notifications: "Amatangazo",
  "Account settings": "Igenamiterere ry'konti",
  "Account menu": "Menu y'konti",
  "Search anything...": "Shakisha ikintu cyose...",
  "Your account": "Konti yawe",
  "Loading…": "Birimo gupakirwa…",
  Close: "Funga",

  /* Greetings */
  "Good Morning": "Mwaramutse",
  "Good Afternoon": "Mwiriwe",
  "Good Evening": "Mwiriwe",

  /* Shared actions */
  "View all": "Reba byose",
  "View map": "Reba ikarita",
  "View activity": "Reba ibikorwa",
  View: "Reba",
  all: "byose",
  map: "ikarita",
  Save: "Bika",
  "Save changes": "Bika impinduka",
  Cancel: "Hagarika",
  Remove: "Kuraho",
  Retry: "Ongera ugerageze",
  "More details": "Ibisobanuro birambuye",
  Back: "Subira inyuma",

  /* Dashboard cards */
  "Scan Waste": "Sikana imyanda",
  "Identify what you have and discover the best next steps.":
    "Menya icyo ufite hanyuma umenye icyo wakora.",
  "Open scanner": "Fungura gusikana",
  "items reused": "ibintu byongeye gukoreshwa",
  "organic waste diverted": "imyanda y'ibinyabuzima yakijijwe",
  "exchanges made": "guhanahana byakozwe",
  "Your Impact": "Icyo wagezeho",
  "Monthly goal": "Intego y'ukwezi",
  "Monthly goal progress": "Aho intego y'ukwezi igeze",
  "Quick Actions": "Ibikorwa byihuse",
  "Identify and get options": "Menya kandi ubone amahitamo",
  "Explore Ideas": "Shakisha ibitekerezo",
  "DIY, reuse and more": "Ibyo wikorera, kongera gukoresha n'ibindi",
  "Find Exchange Items": "Shaka ibyo guhanahana",
  "Give or get materials": "Tanga cyangwa ubone ibikoresho",
  "Recent Activity": "Ibikorwa biheruka",
  "Recommended for you": "Ibyo tugusaba",
  "Nearby Exchange": "Guhanahana hafi yawe",
  Opportunities: "Amahirwe",
  "Recent Chat": "Ikiganiro giheruka",
  "Need help?": "Ukeneye ubufasha?",
  "Chat with Waste Assistant": "Ganira n'Umufasha w'imyanda",
  "Ask anything about your waste.": "Baza ikibazo cyose ku myanda yawe.",
  "Waste Assistant": "Umufasha w'imyanda",
  "Ask the assistant what to do with your waste.":
    "Baza umufasha icyo wakora ku myanda yawe.",
  "No activity yet — scan your first item!":
    "Nta gikorwa kirabaho — sikana ikintu cyawe cya mbere!",
  "Ideas you create or ask the assistant about will appear here.":
    "Ibitekerezo wakoze cyangwa wabajije umufasha bizagaragara hano.",
  "No listings yet — post one from the Exchange page.":
    "Nta bintu birashyirwaho — shyiraho kimwe ku ipaji yo guhanahana.",
  Today: "Uyu munsi",
  Yesterday: "Ejo hashize",
  "just now": "nonaha",

  /* Settings */
  "Manage your account, language and security":
    "Genzura konti yawe, ururimi n'umutekano",
  Profile: "Umwirondoro",
  "Your name is used to greet you and on your exchange listings.":
    "Izina ryawe rikoreshwa mu kugusuhuza no ku bintu uhanahana.",
  "First name": "Izina",
  "Last name": "Izina ry'umuryango",
  Email: "Imeyili",
  "Your email identifies your account and can't be changed here.":
    "Imeyili yawe iranga konti yawe kandi ntishobora guhindurirwa hano.",
  Language: "Ururimi",
  "AI answers, tips and guides come back in this language.":
    "Ibisubizo bya AI, inama n'ubuyobozi bizagaruka muri uru rurimi.",
  'Pick a language, then press "Save changes" in Profile.':
    'Hitamo ururimi, hanyuma ukande "Bika impinduka" mu mwirondoro.',
  Password: "Ijambobanga",
  "Changing your password signs you out of every device.":
    "Guhindura ijambobanga bigusohora ku bikoresho byose.",
  "Current password": "Ijambobanga rigezweho",
  "New password": "Ijambobanga rishya",
  "Confirm new password": "Emeza ijambobanga rishya",
  "Update password": "Hindura ijambobanga",
  Sessions: "Ibiganiro",
  "Sign out here, or end every session if you used a shared device.":
    "Sohoka hano, cyangwa uhagarike ibiganiro byose niba wakoresheje igikoresho gisangiwe.",
  "Sign out": "Sohoka",
  "Sign out everywhere": "Sohoka ahantu hose",
  "Upload photo": "Ohereza ifoto",
  "Change photo": "Hindura ifoto",
  "JPG, PNG or GIF · 1 MB": "JPG, PNG cyangwa GIF · 1 MB",
  "Photo updated.": "Ifoto yahinduwe.",
  "Choose a JPG, PNG or GIF image.": "Hitamo ifoto ya JPG, PNG cyangwa GIF.",
  "That image is larger than 1 MB — pick a smaller one.":
    "Iyo foto irenga 1 MB — hitamo intoya kurushaho.",
  "Couldn't upload that photo.": "Ntibyashobotse kohereza iyo foto.",
  "Couldn't remove that photo.": "Ntibyashobotse gukuraho iyo foto.",
  "Saved.": "Byabitswe.",
  "This account signs in with Google.": "Iyi konti yinjira ukoresheje Google.",

  /* Activity */
  "My Activity": "Ibikorwa byanjye",
  Impact: "Icyo byagezeho",
  "Items reused": "Ibintu byongeye gukoreshwa",
  Exchanges: "Guhanahana",
  "Last 30 days": "Iminsi 30 ishize",
  "Date range: last 30 days": "Igihe: iminsi 30 ishize",
  "Filter activity by type": "Shungura ibikorwa ukurikije ubwoko",
  All: "Byose",
  Scan: "Gusikana",
  Reuse: "Kongera gukoresha",
  Recycling: "Gutunganya",
  "Log a scan, recycle or exchange to see it here.":
    "Andika gusikana, gutunganya cyangwa guhanahana kugira ngo ubibone hano.",

  /* Discover */
  "Discover. Reuse. Recycle.": "Shakisha. Ongera ukoreshe. Tunganya.",
  "Explore creative ways to give new life to your waste":
    "Shakisha uburyo bushya bwo guha imyanda yawe ubuzima bushya",
  "Browse by Category": "Shakisha ukurikije icyiciro",
  "Fresh ideas for your materials": "Ibitekerezo bishya ku bikoresho byawe",
  "More ideas from the community": "Ibindi bitekerezo biva mu baturage",
  "Browse ideas": "Reba ibitekerezo",
  Difficulty: "Urwego rw'ubugoye",
  Easy: "Byoroshye",
  Medium: "Biringaniye",

  /* Exchange */
  "Exchange Details": "Ibisobanuro byo guhanahana",
  "Give, find, or exchange reusable materials in your community.":
    "Tanga, shaka cyangwa uhanahane ibikoresho bishobora kongera gukoreshwa mu baturage bawe.",
  "Featured Listings": "Ibintu byatoranyijwe",
  "Nearby Listings": "Ibintu bya hafi",
  "Create Listing": "Shyiraho ikintu",
  "Create listing": "Shyiraho ikintu",
  "Create the first listing": "Shyiraho ikintu cya mbere",
  "Be the first to post a reusable item for your community.":
    "Ba uwa mbere ushyiraho ikintu gishobora kongera gukoreshwa mu baturage bawe.",
  "All materials": "Ibikoresho byose",
  Material: "Ikikoresho",
  Category: "Icyiciro",
  Condition: "Imiterere",
  Distance: "Intera",
  "Distance (km)": "Intera (km)",
  "District / area": "Akarere / agace",
  "Listing type": "Ubwoko bw'ikintu",
  "Listing Type": "Ubwoko bw'ikintu",
  New: "Gishya",
  Good: "Cyiza",
  Fair: "Gihagije",
  Free: "Ubuntu",
  Sale: "Kugurisha",
  "Message Poster": "Andikira uwagishyizeho",
  "Posted by": "Byashyizweho na",
  "More Exchange Items from this Area": "Ibindi bintu byo muri aka gace",
  "Attach a photo": "Shyiraho ifoto",
  "Help others give waste a new purpose!":
    "Fasha abandi guha imyanda intego nshya!",

  /* Assistant */
  "Waste Assistant chat": "Ikiganiro n'Umufasha w'imyanda",
  "Ask about any material…": "Baza ku kikoresho icyo ari cyo cyose…",
  Send: "Ohereza",
  Examples: "Ingero",

  /* Scanner */
  "Identify waste and discover what to do with it":
    "Menya imyanda hanyuma umenye icyo wayikoresha",
  "Capture photo": "Fata ifoto",
  "Back to camera": "Subira kuri kamera",
  "Back to scanner": "Subira ku gusikana",
  "Back to scan result": "Subira ku bisubizo byo gusikana",
  "Analyzing your photo…": "Turimo gusesengura ifoto yawe…",
  "Image analyzed": "Ifoto yasesenguwe",
  "AI Identified": "AI yamenye",
  "AI Recommendations": "Ibyo AI igusaba",
  Confidence: "Icyizere",
  "Detected items": "Ibyabonetse",
  "Good lighting": "Urumuri ruhagije",
  "Keep it steady": "Gumya neza",
  "How it works": "Uko bikora",
  "Materials Needed": "Ibikoresho bikenewe",

  /* Auth */
  "Log in": "Injira",
  Login: "Injira",
  "Create your account": "Fungura konti yawe",
  "Sign up": "Iyandikishe",
  "Email address": "Aderesi imeyili",
  "Confirm Password": "Emeza ijambobanga",
  "Forgot password?": "Wibagiwe ijambobanga?",
  "Back to log in": "Subira ku kwinjira",
  "Less waste. More value.": "Imyanda nkeya. Agaciro kenshi.",
  "Build a sustainable tomorrow.": "Twubake ejo hazaza heza.",
  "Almost anything can have a second life!":
    "Hafi ya buri kintu gishobora kongera gukoreshwa!",
  Google: "Google",

  /* Settings feedback */
  "Your profile has been updated.": "Umwirondoro wawe wavuguruwe.",
  "Couldn't save your profile.": "Ntibishoboye kubika umwirondoro wawe.",
  "Couldn't change the language.": "Ntibishoboye guhindura ururimi.",
  "The two new passwords don't match.":
    "Amagambo mashya y'ibanga ntabwo ahura.",
  "Couldn't change your password. Please try again.":
    "Ntibishoboye guhindura ijambo ry'ibanga. Ongera ugerageze.",
  "Your photo": "Ifoto yawe",
  "Uploading…": "Birimo koherezwa…",
  "The app switches language as soon as you pick one.":
    "Porogaramu ihindura ururimi ukimara kuruhitamo.",
};

// Kept only temporarily so source upgrades that still contain this table do
// not affect the English/French runtime dictionary. It is not exposed by
// `dictionaries` and cannot be selected by the application.
void rw;

/* ── French ───────────────────────────────────────────────────── */

const fr: Dictionary = {
  /* Navigation and chrome */
  Dashboard: "Tableau de bord",
  Scanner: "Scanner",
  Discover: "Découvrir",
  Exchange: "Échange",
  Activities: "Activités",
  Settings: "Paramètres",
  Logout: "Déconnexion",
  Home: "Accueil",
  Chat: "Discussion",
  Camera: "Caméra",
  Main: "Principal",
  Notifications: "Notifications",
  "Account settings": "Paramètres du compte",
  "Account menu": "Menu du compte",
  "Search anything...": "Rechercher…",
  "Your account": "Votre compte",
  "Loading…": "Chargement…",
  Close: "Fermer",

  /* Greetings */
  "Good Morning": "Bonjour",
  "Good Afternoon": "Bon après-midi",
  "Good Evening": "Bonsoir",

  /* Shared actions */
  "View all": "Tout voir",
  "View map": "Voir la carte",
  "View activity": "Voir l'activité",
  View: "Voir",
  all: "tout",
  map: "la carte",
  Save: "Enregistrer",
  "Save changes": "Enregistrer",
  Cancel: "Annuler",
  Remove: "Supprimer",
  Retry: "Réessayer",
  "More details": "Plus de détails",
  Back: "Retour",

  /* Dashboard cards */
  "Scan Waste": "Scanner un déchet",
  "Identify what you have and discover the best next steps.":
    "Identifiez ce que vous avez et découvrez quoi en faire.",
  "Open scanner": "Ouvrir le scanner",
  "items reused": "objets réutilisés",
  "organic waste diverted": "déchets organiques détournés",
  "exchanges made": "échanges réalisés",
  "Your Impact": "Votre impact",
  "Monthly goal": "Objectif mensuel",
  "Monthly goal progress": "Progression de l'objectif mensuel",
  "Quick Actions": "Actions rapides",
  "Identify and get options": "Identifier et voir les options",
  "Explore Ideas": "Explorer les idées",
  "DIY, reuse and more": "Bricolage, réemploi et plus",
  "Find Exchange Items": "Trouver des objets à échanger",
  "Give or get materials": "Donner ou obtenir des matériaux",
  "Recent Activity": "Activité récente",
  "Recommended for you": "Recommandé pour vous",
  "Nearby Exchange": "Échanges à",
  Opportunities: "proximité",
  "Recent Chat": "Discussion récente",
  "Need help?": "Besoin d'aide ?",
  "Chat with Waste Assistant": "Discuter avec l'assistant déchets",
  "Ask anything about your waste.":
    "Posez n'importe quelle question sur vos déchets.",
  "Waste Assistant": "Assistant déchets",
  "Ask the assistant what to do with your waste.":
    "Demandez à l'assistant quoi faire de vos déchets.",
  "No activity yet — scan your first item!":
    "Aucune activité — scannez votre premier objet !",
  "Ideas you create or ask the assistant about will appear here.":
    "Les idées que vous créez ou demandez à l'assistant apparaîtront ici.",
  "No listings yet — post one from the Exchange page.":
    "Aucune annonce — publiez-en une depuis la page Échange.",
  Today: "Aujourd'hui",
  Yesterday: "Hier",
  "just now": "à l'instant",

  /* Settings */
  "Manage your account, language and security":
    "Gérez votre compte, votre langue et votre sécurité",
  Profile: "Profil",
  "Your name is used to greet you and on your exchange listings.":
    "Votre nom sert à vous accueillir et apparaît sur vos annonces.",
  "First name": "Prénom",
  "Last name": "Nom",
  Email: "E-mail",
  "Your email identifies your account and can't be changed here.":
    "Votre e-mail identifie votre compte et ne peut pas être modifié ici.",
  Language: "Langue",
  "AI answers, tips and guides come back in this language.":
    "Les réponses de l'IA, les conseils et les guides seront dans cette langue.",
  'Pick a language, then press "Save changes" in Profile.':
    "Choisissez une langue, puis appuyez sur « Enregistrer » dans Profil.",
  Password: "Mot de passe",
  "Changing your password signs you out of every device.":
    "Changer votre mot de passe vous déconnecte de tous les appareils.",
  "Current password": "Mot de passe actuel",
  "New password": "Nouveau mot de passe",
  "Confirm new password": "Confirmer le nouveau mot de passe",
  "Update password": "Modifier le mot de passe",
  Sessions: "Sessions",
  "Sign out here, or end every session if you used a shared device.":
    "Déconnectez-vous ici, ou fermez toutes les sessions si l'appareil est partagé.",
  "Sign out": "Se déconnecter",
  "Sign out everywhere": "Se déconnecter partout",
  "Upload photo": "Ajouter une photo",
  "Change photo": "Changer la photo",
  "JPG, PNG or GIF · 1 MB": "JPG, PNG ou GIF · 1 Mo",
  "Photo updated.": "Photo mise à jour.",
  "Choose a JPG, PNG or GIF image.": "Choisissez une image JPG, PNG ou GIF.",
  "That image is larger than 1 MB — pick a smaller one.":
    "Cette image dépasse 1 Mo — choisissez-en une plus petite.",
  "Couldn't upload that photo.": "Impossible d'envoyer cette photo.",
  "Couldn't remove that photo.": "Impossible de supprimer cette photo.",
  "Saved.": "Enregistré.",
  "This account signs in with Google.": "Ce compte se connecte avec Google.",

  /* Activity */
  "My Activity": "Mon activité",
  Impact: "Impact",
  "Items reused": "Objets réutilisés",
  Exchanges: "Échanges",
  "Last 30 days": "30 derniers jours",
  "Date range: last 30 days": "Période : 30 derniers jours",
  "Filter activity by type": "Filtrer par type d'activité",
  All: "Tout",
  Scan: "Scan",
  Reuse: "Réemploi",
  Recycling: "Recyclage",
  "Log a scan, recycle or exchange to see it here.":
    "Enregistrez un scan, un recyclage ou un échange pour le voir ici.",

  /* Discover */
  "Discover. Reuse. Recycle.": "Découvrir. Réutiliser. Recycler.",
  "Explore creative ways to give new life to your waste":
    "Explorez des idées créatives pour donner une seconde vie à vos déchets",
  "Browse by Category": "Parcourir par catégorie",
  "Fresh ideas for your materials": "De nouvelles idées pour vos matériaux",
  "More ideas from the community": "Plus d'idées de la communauté",
  "Browse ideas": "Voir les idées",
  Difficulty: "Difficulté",
  Easy: "Facile",
  Medium: "Moyen",

  /* Exchange */
  "Exchange Details": "Détails de l'annonce",
  "Give, find, or exchange reusable materials in your community.":
    "Donnez, trouvez ou échangez des matériaux réutilisables près de chez vous.",
  "Featured Listings": "Annonces en vedette",
  "Nearby Listings": "Annonces à proximité",
  "Create Listing": "Publier une annonce",
  "Create listing": "Publier une annonce",
  "Create the first listing": "Publier la première annonce",
  "Be the first to post a reusable item for your community.":
    "Soyez le premier à publier un objet réutilisable pour votre communauté.",
  "All materials": "Tous les matériaux",
  Material: "Matériau",
  Category: "Catégorie",
  Condition: "État",
  Distance: "Distance",
  "Distance (km)": "Distance (km)",
  "District / area": "District / zone",
  "Listing type": "Type d'annonce",
  "Listing Type": "Type d'annonce",
  New: "Neuf",
  Good: "Bon",
  Fair: "Correct",
  Free: "Gratuit",
  Sale: "Vente",
  "Message Poster": "Contacter l'auteur",
  "Posted by": "Publié par",
  "More Exchange Items from this Area": "Autres objets dans cette zone",
  "Attach a photo": "Ajouter une photo",
  "Help others give waste a new purpose!":
    "Aidez les autres à donner un nouvel usage aux déchets !",

  /* Assistant */
  "Waste Assistant chat": "Discussion avec l'assistant déchets",
  "Ask about any material…": "Posez une question sur un matériau…",
  Send: "Envoyer",
  Examples: "Exemples",

  /* Scanner */
  "Identify waste and discover what to do with it":
    "Identifiez un déchet et découvrez quoi en faire",
  "Capture photo": "Prendre une photo",
  "Back to camera": "Retour à la caméra",
  "Back to scanner": "Retour au scanner",
  "Back to scan result": "Retour au résultat",
  "Analyzing your photo…": "Analyse de votre photo…",
  "Image analyzed": "Image analysée",
  "AI Identified": "Identifié par l'IA",
  "AI Recommendations": "Recommandations de l'IA",
  Confidence: "Confiance",
  "Detected items": "Éléments détectés",
  "Good lighting": "Bon éclairage",
  "Keep it steady": "Gardez stable",
  "How it works": "Comment ça marche",
  "Materials Needed": "Matériaux nécessaires",

  /* Auth */
  "Log in": "Se connecter",
  Login: "Connexion",
  "Create your account": "Créez votre compte",
  "Sign up": "S'inscrire",
  "Email address": "Adresse e-mail",
  "Confirm Password": "Confirmer le mot de passe",
  "Forgot password?": "Mot de passe oublié ?",
  "Back to log in": "Retour à la connexion",
  "Less waste. More value.": "Moins de déchets. Plus de valeur.",
  "Build a sustainable tomorrow.": "Construisons un avenir durable.",
  "Almost anything can have a second life!":
    "Presque tout peut avoir une seconde vie !",
  Google: "Google",

  Search: "Rechercher",
  "Scan something you're about": "Scannez ce que vous êtes sur le point",
  "Take a photo or upload an image, and our AI will identify the item and suggest the best next steps.":
    "Prenez une photo ou importez une image : notre IA identifiera l'objet et vous proposera les prochaines étapes.",
  "Take Photo": "Prendre une photo",
  "What you can get:": "Ce que vous pouvez obtenir :",
  "Quick Tip": "Conseil rapide",
  "Make sure the image is clear and well-lit for better results.":
    "Assurez-vous que l'image est nette et bien éclairée pour de meilleurs résultats.",

  /* Settings feedback */
  "Your profile has been updated.": "Votre profil a été mis à jour.",
  "Couldn't save your profile.": "Impossible d'enregistrer votre profil.",
  "Couldn't change the language.": "Impossible de changer la langue.",
  "The two new passwords don't match.":
    "Les deux nouveaux mots de passe ne correspondent pas.",
  "Couldn't change your password. Please try again.":
    "Impossible de changer votre mot de passe. Veuillez réessayer.",
  "Your photo": "Votre photo",
  "Uploading…": "Téléversement…",
  "The app switches language as soon as you pick one.":
    "L'application change de langue dès que vous en choisissez une.",
};

export const dictionaries: Record<Locale, Dictionary | undefined> = {
  en: undefined, // identity — keys are already English
  fr,
};
