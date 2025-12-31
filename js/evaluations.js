/**
 * Plan d'Action 2026 - Module Évaluations Complet v2.0
 * Questionnaires AVANT/APRÈS dynamiques + Évaluations trimestrielles avec Moments de Victoire
 */

// ============================================
// CONFIGURATION DES PÉRIODES D'ÉVALUATION
// ============================================

const PERIODES_EVALUATION = {
    initial: {
        nom: "Évaluation Initiale",
        description: "À remplir au début de l'objectif pour établir la baseline",
        icon: "🎯"
    },
    mensuelle: {
        nom: "Évaluation Mensuelle",
        description: "Bilan de fin de mois avec comparaison AVANT/APRÈS",
        icon: "📅"
    },
    trimestrielle: {
        nom: "Évaluation Trimestrielle",
        description: "Bilan approfondi avec moments de victoire",
        icon: "🏆"
    },
    semestrielle: {
        nom: "Évaluation Semestrielle",
        description: "Analyse globale de progression sur 6 mois",
        icon: "📊"
    },
    annuelle: {
        nom: "Évaluation Annuelle",
        description: "Bilan complet avec recommandations pour l'année suivante",
        icon: "🎉"
    }
};

// ============================================
// QUESTIONS DE BASE (communes à tous)
// ============================================

const QUESTIONS_BASE = {
    avant: [
        { id: "motivation", type: "scale", label: "Niveau de motivation actuel", min: 1, max: 10 },
        { id: "confiance", type: "scale", label: "Confiance d'atteindre l'objectif", min: 1, max: 10 },
        { id: "routine", type: "boolean", label: "Avez-vous une routine établie pour cet objectif ?" },
        { id: "obstacle_principal", type: "select", label: "Principal obstacle anticipé", 
          options: ["Manque de temps", "Manque de motivation", "Difficulté technique", "Distractions", "Fatigue", "Autre"] },
        { id: "attentes", type: "text", label: "Qu'espérez-vous accomplir cette période ?" }
    ],
    apres: [
        { id: "motivation", type: "scale", label: "Niveau de motivation actuel", min: 1, max: 10 },
        { id: "satisfaction", type: "scale", label: "Satisfaction de votre progression", min: 1, max: 10 },
        { id: "routine_maintenue", type: "select", label: "Avez-vous maintenu votre routine ?",
          options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] },
        { id: "obstacle_reel", type: "select", label: "Obstacle qui vous a le plus freiné",
          options: ["Aucun", "Manque de temps", "Manque de motivation", "Difficulté technique", "Distractions", "Fatigue", "Autre"] },
        { id: "commentaire", type: "text", label: "Commentaires et observations" }
    ]
};

// ============================================
// QUESTIONS TRIMESTRIELLES - MOMENTS DE VICTOIRE
// ============================================

const QUESTIONS_TRIMESTRIELLES = {
    victoires: [
        { id: "victoire_1", type: "text", label: "🏆 1ère grande victoire de ce trimestre", required: true },
        { id: "victoire_2", type: "text", label: "🏆 2ème grande victoire de ce trimestre", required: true },
        { id: "victoire_3", type: "text", label: "🏆 3ème grande victoire de ce trimestre", required: true }
    ],
    bilan: [
        { id: "constance_evolution", type: "select", label: "Évolution de votre constance sur 3 mois",
          options: ["Forte régression", "Légère régression", "Stable", "Légère amélioration", "Forte amélioration"] },
        { id: "objectifs_atteints", type: "select", label: "Objectifs mensuels atteints (≥75%)",
          options: ["0 mois sur 3", "1 mois sur 3", "2 mois sur 3", "3 mois sur 3"] },
        { id: "mois_difficile", type: "select", label: "Mois le plus difficile",
          options: ["Mois 1", "Mois 2", "Mois 3", "Aucun particulièrement difficile"] },
        { id: "raison_difficulte", type: "text", label: "Raison de la difficulté (si applicable)" },
        { id: "ajustement_strategie", type: "boolean", label: "Avez-vous ajusté votre stratégie en cours de trimestre ?" },
        { id: "nouvelle_capacite", type: "text", label: "Quelque chose que vous pouvez faire maintenant mais pas il y a 3 mois" },
        { id: "force_spirituelle", type: "scale", label: "Vous sentez-vous spirituellement plus fort(e) qu'il y a 3 mois ?", min: 1, max: 10, condition: "domaine === 'spirituel'" }
    ]
};

// ============================================
// QUESTIONS PAR DOMAINE
// ============================================

const QUESTIONS_PAR_DOMAINE = {
    // ========== SPIRITUEL ==========
    spirituel: {
        lecture_biblique: {
            avant: [
                { id: "chapitres_mois_dernier", type: "number", label: "Chapitres lus le mois dernier" },
                { id: "frequence_actuelle", type: "select", label: "Fréquence actuelle de lecture",
                  options: ["Jamais", "1-2x/mois", "1x/semaine", "2-3x/semaine", "Quotidien"] },
                { id: "comprehension", type: "scale", label: "Compréhension des textes", min: 1, max: 10 },
                { id: "moment_dedie", type: "boolean", label: "Avez-vous un moment dédié à la lecture ?" },
                { id: "regularite", type: "scale", label: "Régularité de lecture actuelle", min: 1, max: 10 }
            ],
            apres: [
                { id: "chapitres_lus", type: "number", label: "Chapitres lus ce mois" },
                { id: "frequence_respectee", type: "select", label: "Fréquence cible respectée",
                  options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] },
                { id: "comprehension", type: "scale", label: "Compréhension des textes", min: 1, max: 10 },
                { id: "regularite", type: "scale", label: "Régularité maintenue", min: 1, max: 10 },
                { id: "serie_max", type: "number", label: "Plus longue série de jours consécutifs" },
                { id: "application_pratique", type: "scale", label: "Application pratique dans la vie", min: 1, max: 10 },
                { id: "passage_marquant", type: "text", label: "Passage qui vous a le plus marqué" },
                { id: "enseignement_retenu", type: "text", label: "Principal enseignement retenu" }
            ],
            conditionnelles: {
                vocabulaire: [
                    { id: "mots_appris", type: "number", label: "Nouveaux mots appris (si version étrangère)", periode: "apres" },
                    { id: "lecture_sans_aide", type: "scale", label: "Capacité à lire sans traduction", min: 1, max: 10, periode: "apres" }
                ],
                audio: [
                    { id: "utilisation_audio", type: "select", label: "Utilisation de la Bible audio", 
                      options: ["Jamais", "Parfois", "Régulièrement"], periode: "avant" },
                    { id: "comprehension_orale", type: "scale", label: "Compréhension audio améliorée", min: 1, max: 10, periode: "apres" }
                ],
                journal: [
                    { id: "journal_tenu", type: "select", label: "Journal spirituel tenu régulièrement",
                      options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"], periode: "apres" },
                    { id: "entrees_journal", type: "number", label: "Nombre d'entrées ce mois", periode: "apres" }
                ]
            }
        },
        priere: {
            avant: [
                { id: "temps_priere_actuel", type: "select", label: "Temps de prière actuel par jour",
                  options: ["< 5 min", "5-15 min", "15-30 min", "30-60 min", "> 1h"] },
                { id: "qualite_priere", type: "scale", label: "Qualité de votre vie de prière", min: 1, max: 10 },
                { id: "concentration", type: "scale", label: "Niveau de concentration", min: 1, max: 10 },
                { id: "intimite_dieu", type: "scale", label: "Sentiment d'intimité avec Dieu", min: 1, max: 10 },
                { id: "distractions", type: "select", label: "Fréquence des distractions pendant la prière",
                  options: ["Jamais", "Parfois", "Souvent", "Toujours"] },
                { id: "sujets_priere", type: "text", label: "Principaux sujets de prière" }
            ],
            apres: [
                { id: "objectif_duree_atteint", type: "select", label: "Objectif de durée atteint",
                  options: ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] },
                { id: "qualite_priere", type: "scale", label: "Qualité de votre vie de prière", min: 1, max: 10 },
                { id: "concentration", type: "scale", label: "Niveau de concentration", min: 1, max: 10 },
                { id: "intimite_dieu", type: "scale", label: "Sentiment d'intimité avec Dieu", min: 1, max: 10 },
                { id: "distractions_diminuees", type: "boolean", label: "Les distractions ont-elles diminué ?" },
                { id: "exaucements", type: "text", label: "Prières exaucées ce mois" },
                { id: "progres_constates", type: "text", label: "Progrès constatés dans votre vie de prière" },
                { id: "temps_total_heures", type: "number", label: "Temps total de prière ce mois (heures estimées)" }
            ]
        },
        meditation: {
            avant: [
                { id: "frequence_meditation", type: "select", label: "Fréquence de méditation actuelle",
                  options: ["Jamais", "Rarement", "1x/semaine", "Plusieurs fois/semaine", "Quotidien"] },
                { id: "profondeur", type: "scale", label: "Profondeur de vos méditations", min: 1, max: 10 },
                { id: "methode", type: "select", label: "Méthode de méditation utilisée",
                  options: ["Lectio Divina", "Méditation sur versets", "Méditation contemplative", "Autre"] }
            ],
            apres: [
                { id: "sessions_meditation", type: "number", label: "Sessions de méditation ce mois" },
                { id: "profondeur", type: "scale", label: "Profondeur de vos méditations", min: 1, max: 10 },
                { id: "revelations", type: "text", label: "Révélations ou insights reçus" },
                { id: "impact_vie", type: "scale", label: "Impact sur votre vie quotidienne", min: 1, max: 10 }
            ]
        },
        etude_approfondie: {
            avant: [
                { id: "etudes_precedentes", type: "select", label: "Études approfondies déjà réalisées",
                  options: ["Aucune", "1", "2-3", "4+"] },
                { id: "ressources_utilisees", type: "select", label: "Utilisez-vous des commentaires/ressources ?",
                  options: ["Jamais", "Parfois", "Régulièrement"] },
                { id: "temps_etude_semaine", type: "select", label: "Temps consacré à l'étude par semaine",
                  options: ["< 1h", "1-2h", "2-5h", "> 5h"] },
                { id: "notes_structurees", type: "boolean", label: "Prenez-vous des notes structurées ?" }
            ],
            apres: [
                { id: "pourcentage_livre", type: "number", label: "Pourcentage du livre étudié", min: 0, max: 100 },
                { id: "ressources_consultees", type: "select", label: "Ressources complémentaires utilisées",
                  options: ["Aucune", "1-2", "3-5", "Plus de 5"] },
                { id: "notes_completes", type: "scale", label: "Complétude de vos notes d'étude", min: 1, max: 10 },
                { id: "comprehension_message", type: "scale", label: "Compréhension du message global", min: 1, max: 10 },
                { id: "capacite_expliquer", type: "select", label: "Pouvez-vous expliquer les thèmes principaux ?",
                  options: ["Pas du tout", "Partiellement", "Assez bien", "Très bien"] },
                { id: "impact_pratique", type: "scale", label: "Impact sur votre vie pratique", min: 1, max: 10 }
            ]
        },
        memorisation: {
            avant: [
                { id: "versets_connus", type: "select", label: "Versets connus par cœur actuellement",
                  options: ["< 5", "5-10", "10-20", "20-50", "50+"] },
                { id: "methode_memorisation", type: "select", label: "Méthode de mémorisation utilisée",
                  options: ["Répétition", "Cartes mémoire", "Chant", "Écriture", "Aucune"] },
                { id: "frequence_revision", type: "select", label: "Fréquence de révision",
                  options: ["Jamais", "Rarement", "Hebdomadaire", "Quotidien"] }
            ],
            apres: [
                { id: "nouveaux_versets", type: "number", label: "Nouveaux versets mémorisés ce mois" },
                { id: "recitation_sans_aide", type: "select", label: "Pouvez-vous les réciter sans aide ?",
                  options: ["Tous", "La plupart", "Quelques-uns", "Aucun"] },
                { id: "revision_effectuee", type: "boolean", label: "Avez-vous révisé les versets précédents ?" },
                { id: "versets_spontanes", type: "select", label: "Les versets vous reviennent-ils spontanément ?",
                  options: ["Jamais", "Parfois", "Souvent"] },
                { id: "capacite_memorisation", type: "scale", label: "Amélioration capacité mémorisation", min: 1, max: 10 }
            ]
        }
    },

    // ========== INTELLECTUEL ==========
    intellectuel: {
        langue_etrangere: {
            avant: [
                { id: "niveau_actuel", type: "select", label: "Niveau CECRL actuel",
                  options: ["Débutant complet", "A1 - Découverte", "A2 - Élémentaire", "B1 - Intermédiaire", "B2 - Avancé", "C1 - Autonome", "C2 - Maîtrise"] },
                { id: "sessions_mois_dernier", type: "number", label: "Sessions le mois dernier" },
                { id: "temps_total_dernier", type: "select", label: "Temps total d'apprentissage",
                  options: ["< 1h", "1-3h", "3-5h", "5-10h", "> 10h"] },
                { id: "vocabulaire_estime", type: "select", label: "Vocabulaire estimé",
                  options: ["< 200 mots", "200-500", "500-1000", "1000-2000", "2000+"] },
                { id: "comprehension_ecrite", type: "scale", label: "Compréhension écrite", min: 1, max: 10 },
                { id: "comprehension_orale", type: "scale", label: "Compréhension orale", min: 1, max: 10 },
                { id: "expression_orale", type: "scale", label: "Expression orale", min: 1, max: 10 },
                { id: "expression_ecrite", type: "scale", label: "Expression écrite", min: 1, max: 10 }
            ],
            apres: [
                { id: "sessions_completees", type: "number", label: "Sessions complétées ce mois" },
                { id: "niveau_atteint", type: "select", label: "Niveau CECRL estimé maintenant",
                  options: ["Débutant complet", "A1 - Découverte", "A2 - Élémentaire", "B1 - Intermédiaire", "B2 - Avancé", "C1 - Autonome", "C2 - Maîtrise"] },
                { id: "xp_application", type: "number", label: "XP gagnés sur l'application" },
                { id: "nouveaux_mots", type: "number", label: "Nouveaux mots appris (estimation)" },
                { id: "comprehension_ecrite", type: "scale", label: "Compréhension écrite", min: 1, max: 10 },
                { id: "comprehension_orale", type: "scale", label: "Compréhension orale", min: 1, max: 10 },
                { id: "expression_orale", type: "scale", label: "Expression orale", min: 1, max: 10 },
                { id: "expression_ecrite", type: "scale", label: "Expression écrite", min: 1, max: 10 },
                { id: "situations_reelles", type: "number", label: "Conversations réelles en langue cible" }
            ],
            conditionnelles: {
                comprehension_ecrite: [
                    { id: "lecture_sans_dico", type: "select", label: "Lecture sans dictionnaire",
                      options: ["Jamais", "Avec difficulté", "Partiellement", "Facilement"], periode: "avant" },
                    { id: "textes_lus", type: "number", label: "Textes/articles lus ce mois", periode: "apres" },
                    { id: "utilisation_dico_reduite", type: "boolean", label: "Utilisez-vous moins le dictionnaire ?", periode: "apres" }
                ],
                expression_orale: [
                    { id: "conversation_basique", type: "select", label: "Capacité conversation basique",
                      options: ["Pas du tout", "Difficilement", "Partiellement", "Facilement"], periode: "avant" },
                    { id: "fluidite_orale", type: "scale", label: "Fluidité à l'oral", min: 1, max: 10, periode: "apres" },
                    { id: "enregistrement_auto", type: "boolean", label: "Auto-enregistrement pratiqué", periode: "apres" },
                    { id: "presentation_simple", type: "select", label: "Pouvez-vous faire une présentation simple ?",
                      options: ["Pas du tout", "Partiellement", "Oui avec préparation", "Oui spontanément"], periode: "apres" }
                ],
                traduction_chansons: [
                    { id: "chansons_traduites", type: "number", label: "Chansons traduites ce mois", periode: "apres" },
                    { id: "vocabulaire_chansons", type: "scale", label: "Cette méthode aide pour le vocabulaire", min: 1, max: 10, periode: "apres" }
                ]
            }
        },
        chinois: {
            avant: [
                { id: "niveau_hsk", type: "select", label: "Niveau HSK actuel",
                  options: ["Débutant (pas de HSK)", "HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"] },
                { id: "caracteres_reconnus", type: "select", label: "Caractères reconnus",
                  options: ["< 100", "100-300", "300-600", "600-1200", "1200+"] },
                { id: "caracteres_ecrits", type: "select", label: "Caractères que vous savez écrire",
                  options: ["< 50", "50-150", "150-300", "300-600", "600+"] },
                { id: "maitrise_tons", type: "select", label: "Maîtrise des 4 tons",
                  options: ["Pas du tout", "Partiellement", "Assez bien", "Très bien"] },
                { id: "utilisation_pinyin", type: "select", label: "Utilisation du pinyin",
                  options: ["Toujours", "Souvent", "Parfois", "Rarement"] }
            ],
            apres: [
                { id: "progression_hsk", type: "select", label: "Progression vers le niveau HSK suivant",
                  options: ["Oui", "En cours", "Non"] },
                { id: "nouveaux_caracteres", type: "number", label: "Nouveaux caractères appris" },
                { id: "amelioration_tons", type: "scale", label: "Amélioration des tons", min: 1, max: 10 },
                { id: "test_hsk_blanc", type: "boolean", label: "Test HSK blanc effectué ce mois ?" },
                { id: "score_test", type: "number", label: "Score au test (si applicable)" },
                { id: "lecture_sans_pinyin", type: "select", label: "Lecture de textes simples sans pinyin",
                  options: ["Pas du tout", "Partiellement", "Majoritairement"] }
            ]
        },
        langue_maternelle: {
            avant: [
                { id: "grammaire", type: "scale", label: "Niveau en grammaire", min: 1, max: 10 },
                { id: "orthographe", type: "scale", label: "Niveau en orthographe", min: 1, max: 10 },
                { id: "conjugaison", type: "scale", label: "Niveau en conjugaison", min: 1, max: 10 },
                { id: "vocabulaire_richesse", type: "scale", label: "Richesse du vocabulaire", min: 1, max: 10 },
                { id: "frequence_erreurs", type: "select", label: "Fréquence des erreurs à l'écrit",
                  options: ["Très souvent", "Souvent", "Parfois", "Rarement", "Jamais"] },
                { id: "points_faibles", type: "text", label: "Vos principaux points faibles en français" }
            ],
            apres: [
                { id: "grammaire", type: "scale", label: "Niveau en grammaire", min: 1, max: 10 },
                { id: "orthographe", type: "scale", label: "Niveau en orthographe", min: 1, max: 10 },
                { id: "conjugaison", type: "scale", label: "Niveau en conjugaison", min: 1, max: 10 },
                { id: "vocabulaire_richesse", type: "scale", label: "Richesse du vocabulaire", min: 1, max: 10 },
                { id: "sessions_revision", type: "number", label: "Sessions de révision effectuées" },
                { id: "regles_revisees", type: "text", label: "Règles les plus révisées" },
                { id: "exercices_realises", type: "number", label: "Exercices réalisés" },
                { id: "amelioration_ecrits", type: "scale", label: "Amélioration dans les écrits professionnels", min: 1, max: 10 },
                { id: "progres_constates", type: "text", label: "Progrès constatés" }
            ]
        },
        musique: {
            avant: [
                { id: "niveau", type: "select", label: "Niveau actuel",
                  options: ["Débutant complet", "Faux débutant", "Débutant", "Élémentaire", "Intermédiaire", "Avancé"] },
                { id: "morceaux_maitrise", type: "number", label: "Morceaux maîtrisés actuellement" },
                { id: "lecture_partition", type: "select", label: "Lecture de partition",
                  options: ["Pas du tout", "Notes simples", "Assez bien", "Couramment"] },
                { id: "technique", type: "scale", label: "Niveau technique actuel", min: 1, max: 10 },
                { id: "pratique_reguliere", type: "boolean", label: "Pratique régulière établie ?" }
            ],
            apres: [
                { id: "sessions_pratique", type: "number", label: "Sessions de pratique ce mois" },
                { id: "heures_pratique", type: "number", label: "Heures totales de pratique" },
                { id: "nouveaux_morceaux", type: "number", label: "Nouveaux morceaux appris" },
                { id: "technique", type: "scale", label: "Niveau technique", min: 1, max: 10 },
                { id: "lecture_partition", type: "scale", label: "Amélioration lecture partition", min: 1, max: 10 },
                { id: "plaisir", type: "scale", label: "Plaisir à jouer", min: 1, max: 10 },
                { id: "morceau_sans_erreur", type: "boolean", label: "Capable de jouer un morceau entier sans erreur ?" },
                { id: "morceau_prefere", type: "text", label: "Morceau préféré appris ce mois" }
            ]
        },
        lecture: {
            avant: [
                { id: "livres_an_dernier", type: "number", label: "Livres lus l'année dernière" },
                { id: "pages_semaine", type: "number", label: "Pages lues par semaine en moyenne" },
                { id: "genres_preferes", type: "text", label: "Genres préférés" },
                { id: "temps_lecture_hebdo", type: "select", label: "Temps de lecture hebdomadaire",
                  options: ["< 1h", "1-2h", "2-5h", "5-10h", "> 10h"] },
                { id: "creneau_lecture", type: "boolean", label: "Créneau de lecture régulier ?" },
                { id: "prise_notes", type: "select", label: "Prise de notes pendant lecture",
                  options: ["Jamais", "Parfois", "Toujours"] }
            ],
            apres: [
                { id: "chapitres_pages_lus", type: "number", label: "Chapitres/pages lus ce mois" },
                { id: "livres_termines", type: "number", label: "Livres terminés" },
                { id: "livre_en_cours", type: "select", label: "Livre(s) prévu(s) en cours ?",
                  options: ["Non commencé", "En cours", "Terminé"] },
                { id: "connaissances_acquises", type: "scale", label: "Nouvelles connaissances acquises", min: 1, max: 10 },
                { id: "notes_prises", type: "select", label: "Notes ou réflexions prises",
                  options: ["Aucune", "Quelques-unes", "Régulièrement"] },
                { id: "livre_prefere", type: "text", label: "Livre préféré lu ce mois" },
                { id: "enseignement_principal", type: "text", label: "Principal enseignement retenu" }
            ]
        },
        formation: {
            avant: [
                { id: "cours_en_cours", type: "boolean", label: "Cours/formation actuellement en cours ?" },
                { id: "nom_formation", type: "text", label: "Nom de la formation/cours" },
                { id: "progression_actuelle", type: "number", label: "Pourcentage de progression actuelle", min: 0, max: 100 },
                { id: "temps_semaine", type: "select", label: "Temps consacré par semaine",
                  options: ["< 1h", "1-3h", "3-5h", "5-10h", "> 10h"] }
            ],
            apres: [
                { id: "progression_mois", type: "number", label: "Progression ce mois (%)", min: 0, max: 100 },
                { id: "modules_completes", type: "number", label: "Modules/chapitres complétés" },
                { id: "exercices_realises", type: "number", label: "Exercices/quiz réalisés" },
                { id: "score_moyen", type: "number", label: "Score moyen aux évaluations (%)", min: 0, max: 100 },
                { id: "certification_obtenue", type: "boolean", label: "Certification obtenue ?" },
                { id: "competences_acquises", type: "text", label: "Compétences acquises" }
            ]
        },
        publications: {
            avant: [
                { id: "publications_actif", type: "number", label: "Publications à votre actif" },
                { id: "article_en_cours", type: "boolean", label: "Article actuellement en cours de rédaction ?" },
                { id: "etape_actuelle", type: "select", label: "Étape actuelle du processus",
                  options: ["Pas commencé", "Recherche", "Rédaction", "Soumission", "Révision", "Accepté"] },
                { id: "heures_recherche_semaine", type: "select", label: "Heures de recherche par semaine",
                  options: ["< 2h", "2-5h", "5-10h", "> 10h"] },
                { id: "revues_cibles", type: "boolean", label: "Revues cibles identifiées ?" }
            ],
            apres: [
                { id: "progression_article", type: "select", label: "Progression sur votre publication",
                  options: ["Significative", "Un peu", "Pas vraiment", "Non"] },
                { id: "etape_atteinte", type: "select", label: "Étape atteinte",
                  options: ["Recherche", "Rédaction", "Soumission", "Révision", "Accepté", "Publié"] },
                { id: "soumission_effectuee", type: "boolean", label: "Article soumis ce mois ?" },
                { id: "retours_recus", type: "select", label: "Retours reçus",
                  options: ["Aucun", "Positifs", "Révisions demandées", "Rejeté"] },
                { id: "heures_travail", type: "number", label: "Heures de travail ce mois" }
            ]
        }
    },

    // ========== PHYSIQUE ==========
    physique: {
        detox: {
            avant: [
                { id: "energie", type: "scale", label: "⚡ Niveau d'énergie", min: 1, max: 10 },
                { id: "digestion", type: "scale", label: "🍽️ Qualité de digestion", min: 1, max: 10 },
                { id: "poids", type: "number", label: "⚖️ Poids (kg)", step: 0.1 },
                { id: "sommeil", type: "scale", label: "😴 Qualité du sommeil", min: 1, max: 10 },
                { id: "peau", type: "scale", label: "✨ État de la peau", min: 1, max: 10 },
                { id: "humeur", type: "scale", label: "😊 Humeur générale", min: 1, max: 10 },
                { id: "ballonnements", type: "boolean", label: "🫃 Ballonnements ou inconfort ?" },
                { id: "maux_tete", type: "boolean", label: "🤕 Maux de tête fréquents ?" }
            ],
            apres: [
                { id: "energie", type: "scale", label: "⚡ Niveau d'énergie", min: 1, max: 10 },
                { id: "digestion", type: "scale", label: "🍽️ Qualité de digestion", min: 1, max: 10 },
                { id: "poids", type: "number", label: "⚖️ Poids (kg)", step: 0.1 },
                { id: "sommeil", type: "scale", label: "😴 Qualité du sommeil", min: 1, max: 10 },
                { id: "peau", type: "scale", label: "✨ État de la peau", min: 1, max: 10 },
                { id: "humeur", type: "scale", label: "😊 Humeur générale", min: 1, max: 10 },
                { id: "ballonnements", type: "boolean", label: "🫃 Ballonnements diminués ?" },
                { id: "maux_tete", type: "boolean", label: "🤕 Maux de tête moins fréquents ?" },
                { id: "difficulte_detox", type: "scale", label: "Difficulté ressentie pendant la détox", min: 1, max: 10 },
                { id: "jours_respectes", type: "number", label: "Jours de détox respectés" },
                { id: "bienfaits", type: "text", label: "Bienfaits ressentis" },
                { id: "envie_continuer", type: "boolean", label: "Envie de continuer/recommencer ?" }
            ]
        },
        sport: {
            avant: [
                { id: "poids", type: "number", label: "Poids actuel (kg)", step: 0.1 },
                { id: "poids_cible", type: "number", label: "Poids cible (kg)", step: 0.1 },
                { id: "endurance", type: "scale", label: "Niveau d'endurance", min: 1, max: 10 },
                { id: "force", type: "scale", label: "Niveau de force", min: 1, max: 10 },
                { id: "souplesse", type: "scale", label: "Souplesse", min: 1, max: 10 },
                { id: "energie_generale", type: "scale", label: "Énergie générale", min: 1, max: 10 },
                { id: "frequence_actuelle", type: "select", label: "Fréquence sportive actuelle",
                  options: ["Jamais", "1x/semaine", "2-3x/semaine", "4-5x/semaine", "Quotidien"] }
            ],
            apres: [
                { id: "poids", type: "number", label: "Poids actuel (kg)", step: 0.1 },
                { id: "sessions_realisees", type: "number", label: "Sessions réalisées" },
                { id: "endurance", type: "scale", label: "Niveau d'endurance", min: 1, max: 10 },
                { id: "force", type: "scale", label: "Niveau de force", min: 1, max: 10 },
                { id: "souplesse", type: "scale", label: "Souplesse", min: 1, max: 10 },
                { id: "energie_generale", type: "scale", label: "Énergie générale", min: 1, max: 10 },
                { id: "blessures", type: "boolean", label: "Blessures ou douleurs ?" },
                { id: "performances", type: "text", label: "Performances ou records personnels" }
            ]
        },
        discipline: {
            avant: [
                { id: "ponctualite", type: "scale", label: "Ponctualité actuelle", min: 1, max: 10 },
                { id: "retards_semaine", type: "number", label: "Retards moyens par semaine" },
                { id: "heure_reveil", type: "time", label: "Heure de réveil habituelle" },
                { id: "heure_coucher", type: "time", label: "Heure de coucher habituelle" },
                { id: "respect_horaires", type: "scale", label: "Respect des horaires prévus", min: 1, max: 10 }
            ],
            apres: [
                { id: "ponctualite", type: "scale", label: "Ponctualité ce mois", min: 1, max: 10 },
                { id: "jours_a_lheure", type: "number", label: "Jours arrivé(e) à l'heure" },
                { id: "jours_en_avance", type: "number", label: "Jours arrivé(e) en avance" },
                { id: "jours_en_retard", type: "number", label: "Jours en retard" },
                { id: "moyenne_avance_minutes", type: "number", label: "Moyenne d'avance (minutes)" },
                { id: "respect_horaires", type: "scale", label: "Respect des horaires prévus", min: 1, max: 10 },
                { id: "ameliorations", type: "text", label: "Améliorations constatées" }
            ]
        }
    },

    // ========== FINANCIER ==========
    financier: {
        epargne: {
            avant: [
                { id: "montant_prevu", type: "number", label: "Montant prévu ce mois (XAF)" },
                { id: "revenus_prevus", type: "number", label: "Revenus prévus (XAF)" },
                { id: "depenses_fixes", type: "number", label: "Dépenses fixes prévues (XAF)" },
                { id: "objectif_specifique", type: "text", label: "Objectif spécifique pour cette épargne" },
                { id: "confiance_objectif", type: "scale", label: "Confiance d'atteindre l'objectif", min: 1, max: 10 }
            ],
            apres: [
                { id: "montant_epargne", type: "number", label: "Montant effectivement épargné (XAF)" },
                { id: "revenus_reels", type: "number", label: "Revenus réels (XAF)" },
                { id: "depenses_reelles", type: "number", label: "Dépenses réelles (XAF)" },
                { id: "ecart_prevu", type: "number", label: "Écart par rapport au prévu (XAF)", computed: true },
                { id: "depenses_imprevues", type: "text", label: "Dépenses imprévues" },
                { id: "raison_ecart", type: "text", label: "Raison de l'écart (si applicable)" },
                { id: "total_cumule", type: "number", label: "Total épargne cumulée (XAF)" }
            ]
        },
        investissement: {
            avant: [
                { id: "montant_invest_prevu", type: "number", label: "Montant d'investissement prévu (XAF)" },
                { id: "type_investissement", type: "select", label: "Type d'investissement",
                  options: ["Actions", "Obligations", "Immobilier", "Crypto", "Business", "Autre"] },
                { id: "rendement_attendu", type: "number", label: "Rendement attendu (%)" },
                { id: "niveau_risque", type: "select", label: "Niveau de risque accepté",
                  options: ["Très faible", "Faible", "Modéré", "Élevé", "Très élevé"] }
            ],
            apres: [
                { id: "montant_investi", type: "number", label: "Montant investi (XAF)" },
                { id: "rendement_reel", type: "number", label: "Rendement réel (%)" },
                { id: "valeur_portefeuille", type: "number", label: "Valeur actuelle du portefeuille (XAF)" },
                { id: "lecons_apprises", type: "text", label: "Leçons apprises" }
            ]
        }
    },

    // ========== PROJET ==========
    projet: {
        business: {
            avant: [
                { id: "ca_prevu", type: "number", label: "CA prévu ce mois (XAF)" },
                { id: "contacts_cible", type: "number", label: "Nombre de contacts visés" },
                { id: "actions_prevues", type: "text", label: "Actions marketing prévues" },
                { id: "objectifs_cles", type: "text", label: "Objectifs clés du mois" },
                { id: "confiance", type: "scale", label: "Confiance", min: 1, max: 10 }
            ],
            apres: [
                { id: "ca_realise", type: "number", label: "CA réalisé (XAF)" },
                { id: "contacts_obtenus", type: "number", label: "Nouveaux contacts obtenus" },
                { id: "clients_nouveaux", type: "number", label: "Nouveaux clients" },
                { id: "actions_realisees", type: "text", label: "Actions marketing réalisées" },
                { id: "visibilite_web", type: "scale", label: "Progression visibilité web", min: 1, max: 10 },
                { id: "objectifs_atteints", type: "text", label: "Objectifs atteints" },
                { id: "lecons_apprises", type: "text", label: "Leçons apprises" }
            ]
        },
        personnel: {
            avant: [
                { id: "nom_projet", type: "text", label: "Nom du projet" },
                { id: "progression_actuelle", type: "number", label: "Progression actuelle (%)", min: 0, max: 100 },
                { id: "etapes_restantes", type: "number", label: "Étapes restantes" },
                { id: "deadline", type: "text", label: "Date limite prévue" },
                { id: "blocages_actuels", type: "text", label: "Blocages actuels" }
            ],
            apres: [
                { id: "progression_mois", type: "number", label: "Progression ce mois (%)", min: 0, max: 100 },
                { id: "etapes_completees", type: "number", label: "Étapes complétées" },
                { id: "blocages_resolus", type: "text", label: "Blocages résolus" },
                { id: "nouveaux_blocages", type: "text", label: "Nouveaux blocages identifiés" },
                { id: "prochain_milestone", type: "text", label: "Prochain milestone" }
            ]
        }
    }
};

// ============================================
// QUESTIONS SEMESTRIELLES
// ============================================

const QUESTIONS_SEMESTRIELLES = [
    { id: "comparaison_6mois", type: "select", label: "Comparez votre niveau actuel à celui d'il y a 6 mois",
      options: ["Très inférieur", "Inférieur", "Égal", "Supérieur", "Très supérieur"] },
    { id: "victoire_semestrielle_1", type: "text", label: "🏆 Plus grande victoire du semestre" },
    { id: "victoire_semestrielle_2", type: "text", label: "🏆 Deuxième grande victoire" },
    { id: "victoire_semestrielle_3", type: "text", label: "🏆 Troisième grande victoire" },
    { id: "domaines_effort", type: "text", label: "Domaines nécessitant plus d'efforts" },
    { id: "entourage_remarque", type: "select", label: "Votre entourage a-t-il remarqué votre progression ?",
      options: ["Oui", "Non", "Je ne sais pas"] },
    { id: "recommandation_methode", type: "scale", label: "Recommanderiez-vous votre méthode à quelqu'un ?", min: 1, max: 10 },
    { id: "ajustement_objectifs", type: "boolean", label: "Souhaitez-vous ajuster vos objectifs pour le prochain semestre ?" },
    { id: "ajustements_prevus", type: "text", label: "Si oui, quels ajustements ?" }
];

// ============================================
// QUESTIONS ANNUELLES
// ============================================

const QUESTIONS_ANNUELLES = [
    { id: "objectif_principal_atteint", type: "select", label: "Avez-vous atteint votre objectif principal ?",
      options: ["Non atteint", "Partiellement (< 50%)", "Majoritairement (50-80%)", "Atteint (> 80%)", "Dépassé"] },
    { id: "pourcentage_realisation", type: "number", label: "Pourcentage de réalisation", min: 0, max: 100 },
    { id: "victoire_annee_1", type: "text", label: "🏆 Plus grande victoire de l'année" },
    { id: "victoire_annee_2", type: "text", label: "🏆 Deuxième grande victoire" },
    { id: "victoire_annee_3", type: "text", label: "🏆 Troisième grande victoire" },
    { id: "tournants_decisifs", type: "text", label: "Tournants décisifs de votre parcours" },
    { id: "fait_differemment", type: "text", label: "Ce que vous auriez fait différemment" },
    { id: "evolution_personnelle", type: "text", label: "Comment avez-vous évolué personnellement ?" },
    { id: "nouveaux_objectifs", type: "text", label: "Nouveaux objectifs pour l'année prochaine" },
    { id: "note_globale", type: "scale", label: "Note globale de satisfaction pour cette année", min: 1, max: 10 }
];

// ============================================
// CLASSE GESTIONNAIRE D'ÉVALUATIONS v2.0
// ============================================

class EvaluationsManager {
    constructor(app) {
        this.app = app;
    }

    // Déterminer le type d'objectif
    getObjectifType(objectif) {
        const domaine = objectif.domaine || 'autre';
        const categorie = objectif.categorie || 'general';
        return { domaine, categorie };
    }

    // Obtenir les questions pour un objectif
    getQuestionsForObjectif(objectif, type = 'avant', periode = 'mensuelle') {
        const { domaine, categorie } = this.getObjectifType(objectif);
        let questions = [...QUESTIONS_BASE[type]];

        // Ajouter les questions spécifiques au domaine/catégorie
        if (QUESTIONS_PAR_DOMAINE[domaine] && QUESTIONS_PAR_DOMAINE[domaine][categorie]) {
            const specificQuestions = QUESTIONS_PAR_DOMAINE[domaine][categorie][type] || [];
            questions = [...questions, ...specificQuestions];

            // Ajouter les questions conditionnelles si les indicateurs sont cochés
            const conditionnelles = QUESTIONS_PAR_DOMAINE[domaine][categorie].conditionnelles || {};
            const indicateurs = objectif.indicateurs || [];
            
            Object.keys(conditionnelles).forEach(indicateur => {
                if (indicateurs.includes(indicateur)) {
                    const condQuestions = conditionnelles[indicateur].filter(q => 
                        !q.periode || q.periode === type
                    );
                    questions = [...questions, ...condQuestions];
                }
            });
        }

        // Ajouter les questions trimestrielles (moments de victoire)
        if (periode === 'trimestrielle' && type === 'apres') {
            questions = [...questions, ...QUESTIONS_TRIMESTRIELLES.victoires, ...QUESTIONS_TRIMESTRIELLES.bilan];
        }

        // Ajouter les questions semestrielles
        if (periode === 'semestrielle' && type === 'apres') {
            questions = [...questions, ...QUESTIONS_SEMESTRIELLES];
        }

        // Ajouter les questions annuelles
        if (periode === 'annuelle' && type === 'apres') {
            questions = [...questions, ...QUESTIONS_ANNUELLES];
        }

        return questions;
    }

    // Vérifier si une évaluation initiale est nécessaire
    needsInitialEvaluation(objectif) {
        const evaluations = this.app.data.evaluations || {};
        const objectifEvals = Object.values(evaluations).filter(
            e => e.objectifId === objectif.id && e.userId === this.app.currentUser.id
        );
        const hasInitial = objectifEvals.find(e => e.periode === 'initial');
        return !hasInitial;
    }

    // Vérifier si une évaluation est due
    isEvaluationDue(objectif, type = 'avant', periode = 'mensuelle') {
        const evaluations = this.app.data.evaluations || {};
        const objectifEvals = Object.values(evaluations).filter(
            e => e.objectifId === objectif.id && e.userId === this.app.currentUser.id
        );

        const now = new Date();

        // Évaluation initiale
        if (periode === 'initial') {
            return this.needsInitialEvaluation(objectif);
        }

        // Mensuelle
        if (periode === 'mensuelle') {
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const monthEval = objectifEvals.find(e => {
                const evalDate = new Date(e.date);
                return evalDate.getMonth() === currentMonth && 
                       evalDate.getFullYear() === currentYear &&
                       e.type === type &&
                       e.periode === 'mensuelle';
            });
            return !monthEval;
        }

        // Trimestrielle
        if (periode === 'trimestrielle') {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const quarterEval = objectifEvals.find(e => {
                const evalDate = new Date(e.date);
                return Math.floor(evalDate.getMonth() / 3) === currentQuarter &&
                       evalDate.getFullYear() === now.getFullYear() &&
                       e.type === type &&
                       e.periode === 'trimestrielle';
            });
            return !quarterEval;
        }

        // Semestrielle
        if (periode === 'semestrielle') {
            const currentSemester = now.getMonth() < 6 ? 1 : 2;
            const semesterEval = objectifEvals.find(e => {
                const evalDate = new Date(e.date);
                const evalSemester = evalDate.getMonth() < 6 ? 1 : 2;
                return evalSemester === currentSemester &&
                       evalDate.getFullYear() === now.getFullYear() &&
                       e.type === type &&
                       e.periode === 'semestrielle';
            });
            return !semesterEval;
        }

        return false;
    }

    // Obtenir les évaluations dues pour l'utilisateur
    getPendingEvaluations() {
        const pending = [];
        const objectifs = Object.values(this.app.data.objectifs || {}).filter(
            o => o.userId === this.app.currentUser.id
        );

        objectifs.forEach(obj => {
            // Évaluation initiale
            if (this.needsInitialEvaluation(obj)) {
                pending.push({
                    objectif: obj,
                    type: 'avant',
                    periode: 'initial',
                    urgence: 'haute',
                    label: 'Évaluation initiale requise'
                });
            }

            // Mensuelle AVANT (début de mois)
            if (this.isEvaluationDue(obj, 'avant', 'mensuelle')) {
                pending.push({
                    objectif: obj,
                    type: 'avant',
                    periode: 'mensuelle',
                    urgence: 'moyenne',
                    label: 'Évaluation AVANT du mois'
                });
            }

            // Mensuelle APRÈS (fin de mois - à partir du 25)
            const now = new Date();
            if (now.getDate() >= 25 && this.isEvaluationDue(obj, 'apres', 'mensuelle')) {
                pending.push({
                    objectif: obj,
                    type: 'apres',
                    periode: 'mensuelle',
                    urgence: 'haute',
                    label: 'Évaluation APRÈS du mois'
                });
            }

            // Trimestrielle (dernier mois du trimestre)
            const isEndOfQuarter = [2, 5, 8, 11].includes(now.getMonth()) && now.getDate() >= 20;
            if (isEndOfQuarter && this.isEvaluationDue(obj, 'apres', 'trimestrielle')) {
                pending.push({
                    objectif: obj,
                    type: 'apres',
                    periode: 'trimestrielle',
                    urgence: 'haute',
                    label: '🏆 Bilan trimestriel avec Moments de Victoire'
                });
            }
        });

        return pending;
    }

    // Générer le HTML du formulaire
    renderEvaluationForm(objectif, type = 'avant', periode = 'mensuelle') {
        const questions = this.getQuestionsForObjectif(objectif, type, periode);
        const periodeInfo = PERIODES_EVALUATION[periode] || PERIODES_EVALUATION.mensuelle;
        
        let html = `
            <div class="evaluation-form" data-objectif="${objectif.id}" data-type="${type}" data-periode="${periode}">
                <div class="evaluation-header">
                    <h3>${periodeInfo.icon} ${periodeInfo.nom}</h3>
                    <span class="evaluation-type ${type}">${type === 'avant' ? '📋 AVANT' : '📊 APRÈS'}</span>
                </div>
                <p class="evaluation-description">${periodeInfo.description}</p>
                <div class="evaluation-objectif-info">
                    <span class="icon">${objectif.icon || '🎯'}</span>
                    <span>${objectif.titre}</span>
                </div>
        `;

        // Section Moments de Victoire pour évaluation trimestrielle
        if (periode === 'trimestrielle' && type === 'apres') {
            html += `
                <div class="victoires-section">
                    <h4>🏆 Vos 3 Moments de Victoire ce Trimestre</h4>
                    <p class="victoires-intro">Célébrez vos réussites ! Identifiez 3 accomplissements dont vous êtes fier(e). Ces victoires seront conservées et affichées dans votre tableau de bord pour vous motiver.</p>
                </div>
            `;
        }

        html += `<div class="evaluation-questions">`;

        questions.forEach((q, index) => {
            html += this.renderQuestion(q, index);
        });

        html += `</div></div>`;

        return html;
    }

    // Rendre une question
    renderQuestion(question, index) {
        const isVictoire = question.id.includes('victoire');
        let html = `
            <div class="evaluation-question ${isVictoire ? 'victoire-question' : ''}" data-id="${question.id}">
                <label>${question.label}${question.required ? ' *' : ''}</label>
        `;

        switch (question.type) {
            case 'scale':
                html += this.renderScaleInput(question);
                break;
            case 'number':
                html += `<input type="number" class="form-control eval-input" 
                         min="${question.min || 0}" 
                         max="${question.max !== undefined ? question.max : ''}" 
                         step="${question.step || 1}" 
                         placeholder="Entrez une valeur">`;
                break;
            case 'text':
                html += `<textarea class="form-control eval-input" rows="${isVictoire ? 3 : 2}" 
                         placeholder="${isVictoire ? 'Décrivez votre victoire...' : 'Votre réponse...'}"></textarea>`;
                break;
            case 'select':
                html += `<select class="form-control eval-input">
                    <option value="">-- Sélectionnez --</option>
                    ${question.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>`;
                break;
            case 'boolean':
                html += `
                    <div class="eval-boolean">
                        <label class="bool-option"><input type="radio" name="eval_${question.id}_${index}" value="true"><span>Oui</span></label>
                        <label class="bool-option"><input type="radio" name="eval_${question.id}_${index}" value="false"><span>Non</span></label>
                    </div>
                `;
                break;
            case 'time':
                html += `<input type="time" class="form-control eval-input">`;
                break;
        }

        html += `</div>`;
        return html;
    }

    // Rendre une échelle de 1 à 10
    renderScaleInput(question) {
        const min = question.min || 1;
        const max = question.max || 10;
        
        let html = `<div class="scale-input">`;
        for (let i = min; i <= max; i++) {
            html += `
                <label class="scale-option">
                    <input type="radio" name="scale_${question.id}" value="${i}">
                    <span>${i}</span>
                </label>
            `;
        }
        html += `
            <div class="scale-labels">
                <span>Faible</span>
                <span>Excellent</span>
            </div>
        </div>`;
        return html;
    }

    // Collecter les réponses
    collectResponses(formContainer) {
        const responses = {};
        const questions = formContainer.querySelectorAll('.evaluation-question');
        
        questions.forEach(q => {
            const id = q.dataset.id;
            const input = q.querySelector('.eval-input');
            const scaleInput = q.querySelector('input[type="radio"]:checked');
            const booleanInput = q.querySelector('input[name^="eval_"]:checked');

            if (input) {
                responses[id] = input.value;
            } else if (scaleInput) {
                responses[id] = parseInt(scaleInput.value);
            } else if (booleanInput) {
                responses[id] = booleanInput.value === 'true';
            }
        });

        return responses;
    }

    // Sauvegarder une évaluation
    saveEvaluation(objectifId, type, periode, responses) {
        const evalId = `eval_${this.app.currentUser.id}_${objectifId}_${type}_${periode}_${Date.now()}`;
        
        if (!this.app.data.evaluations) {
            this.app.data.evaluations = {};
        }

        this.app.data.evaluations[evalId] = {
            id: evalId,
            userId: this.app.currentUser.id,
            objectifId: objectifId,
            type: type,
            periode: periode,
            date: new Date().toISOString(),
            responses: responses,
            periodeDetails: this.getCurrentPeriodeDetails()
        };

        this.app.saveData();
        return evalId;
    }

    // Obtenir les détails de la période actuelle
    getCurrentPeriodeDetails() {
        const now = new Date();
        const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                         'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return {
            mois: now.getMonth() + 1,
            moisNom: moisNoms[now.getMonth()],
            trimestre: Math.floor(now.getMonth() / 3) + 1,
            semestre: now.getMonth() < 6 ? 1 : 2,
            annee: now.getFullYear()
        };
    }

    // Obtenir les évaluations d'un objectif
    getEvaluations(objectifId) {
        const evaluations = this.app.data.evaluations || {};
        return Object.values(evaluations).filter(
            e => e.objectifId === objectifId && e.userId === this.app.currentUser.id
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Calculer la progression entre deux évaluations
    calculateProgression(objectifId) {
        const evals = this.getEvaluations(objectifId);
        const avant = evals.filter(e => e.type === 'avant').sort((a, b) => new Date(a.date) - new Date(b.date));
        const apres = evals.filter(e => e.type === 'apres').sort((a, b) => new Date(b.date) - new Date(a.date));

        if (avant.length === 0 || apres.length === 0) return null;

        const firstAvant = avant[0]; // Première évaluation AVANT
        const lastApres = apres[0];  // Dernière évaluation APRÈS

        const comparison = {};
        const improvements = [];
        const declines = [];
        const stable = [];

        // Comparer toutes les valeurs numériques communes
        Object.keys(firstAvant.responses).forEach(field => {
            const avantVal = firstAvant.responses[field];
            const apresVal = lastApres.responses[field];

            if (typeof avantVal === 'number' && typeof apresVal === 'number') {
                const diff = apresVal - avantVal;
                const percentChange = avantVal !== 0 ? ((diff / avantVal) * 100).toFixed(1) : 0;

                comparison[field] = {
                    avant: avantVal,
                    apres: apresVal,
                    difference: diff,
                    pourcentage: percentChange
                };

                if (diff > 0) {
                    improvements.push({ field, diff, percentChange });
                } else if (diff < 0) {
                    declines.push({ field, diff, percentChange });
                } else {
                    stable.push({ field });
                }
            }
        });

        return {
            comparison,
            summary: {
                improvements: improvements.length,
                declines: declines.length,
                stable: stable.length,
                overallTrend: improvements.length > declines.length ? 'positive' : 
                              improvements.length < declines.length ? 'negative' : 'stable'
            },
            details: { improvements, declines, stable },
            dateDebut: firstAvant.date,
            dateFin: lastApres.date
        };
    }

    // Générer un rapport de victoires
    getVictoiresReport(objectifId = null) {
        const evaluations = this.app.data.evaluations || {};
        let evals = Object.values(evaluations).filter(
            e => e.userId === this.app.currentUser.id && 
                 (e.periode === 'trimestrielle' || e.periode === 'semestrielle' || e.periode === 'annuelle') && 
                 e.type === 'apres'
        );

        if (objectifId) {
            evals = evals.filter(e => e.objectifId === objectifId);
        }
        
        const victoires = [];
        evals.forEach(ev => {
            const objectif = this.app.data.objectifs?.[ev.objectifId];
            const baseVictoire = {
                date: ev.date,
                periode: ev.periode,
                trimestre: ev.periodeDetails?.trimestre,
                objectifTitre: objectif?.titre || 'Objectif supprimé',
                objectifIcon: objectif?.icon || '🎯'
            };

            // Victoires trimestrielles
            if (ev.responses.victoire_1) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_1, rang: 1 });
            if (ev.responses.victoire_2) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_2, rang: 2 });
            if (ev.responses.victoire_3) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_3, rang: 3 });

            // Victoires semestrielles
            if (ev.responses.victoire_semestrielle_1) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_semestrielle_1, rang: 1 });
            if (ev.responses.victoire_semestrielle_2) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_semestrielle_2, rang: 2 });
            if (ev.responses.victoire_semestrielle_3) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_semestrielle_3, rang: 3 });

            // Victoires annuelles
            if (ev.responses.victoire_annee_1) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_annee_1, rang: 1 });
            if (ev.responses.victoire_annee_2) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_annee_2, rang: 2 });
            if (ev.responses.victoire_annee_3) victoires.push({ ...baseVictoire, texte: ev.responses.victoire_annee_3, rang: 3 });
        });

        return victoires.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Générer une synthèse IA de progression
    generateProgressSummary(objectifId) {
        const progression = this.calculateProgression(objectifId);
        if (!progression) return null;

        const { summary, details, comparison } = progression;
        const objectif = this.app.data.objectifs?.[objectifId];

        let message = '';
        let icon = '';

        if (summary.overallTrend === 'positive') {
            icon = '📈';
            message = `Excellente progression ! ${summary.improvements} indicateurs en hausse.`;
            if (details.improvements.length > 0) {
                const topImprovement = details.improvements.sort((a, b) => b.diff - a.diff)[0];
                message += ` Meilleure amélioration : ${topImprovement.field} (+${topImprovement.diff} points).`;
            }
        } else if (summary.overallTrend === 'negative') {
            icon = '📉';
            message = `Ce mois a été plus difficile. ${summary.declines} indicateurs en baisse.`;
            message += ` Analysez les obstacles rencontrés pour ajuster votre stratégie.`;
        } else {
            icon = '➡️';
            message = `Progression stable. Maintenez vos efforts pour voir des améliorations.`;
        }

        return {
            icon,
            message,
            trend: summary.overallTrend,
            stats: {
                ameliorations: summary.improvements,
                regressions: summary.declines,
                stables: summary.stable
            }
        };
    }
}

// Export pour utilisation dans l'application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PERIODES_EVALUATION,
        QUESTIONS_BASE,
        QUESTIONS_TRIMESTRIELLES,
        QUESTIONS_PAR_DOMAINE,
        QUESTIONS_SEMESTRIELLES,
        QUESTIONS_ANNUELLES,
        EvaluationsManager 
    };
}
