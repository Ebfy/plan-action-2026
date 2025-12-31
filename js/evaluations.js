/**
 * Plan d'Action 2026 - Module Évaluations AVANT/APRÈS
 * Questionnaires adaptatifs selon le type d'objectif
 */

const EVALUATIONS_CONFIG = {
    
    // ============================================
    // CONFIGURATIONS DES ÉVALUATIONS PAR CATÉGORIE
    // ============================================

    // SPIRITUEL - Lecture Biblique
    lecture_biblique: {
        titre: "Évaluation Lecture Biblique",
        periodicite: ["mois", "trimestre", "semestre"],
        questionsAvant: [
            { id: "motivation", type: "scale", label: "Niveau de motivation pour la lecture", min: 1, max: 10 },
            { id: "comprehension", type: "scale", label: "Compréhension actuelle des textes", min: 1, max: 10 },
            { id: "regularite", type: "scale", label: "Régularité de lecture (auto-évaluation)", min: 1, max: 10 },
            { id: "application", type: "scale", label: "Application des enseignements dans ma vie", min: 1, max: 10 },
            { id: "difficultes", type: "text", label: "Principales difficultés rencontrées" },
            { id: "objectif_periode", type: "text", label: "Objectif pour cette période" }
        ],
        questionsApres: [
            { id: "motivation", type: "scale", label: "Niveau de motivation actuel", min: 1, max: 10 },
            { id: "comprehension", type: "scale", label: "Compréhension des textes lus", min: 1, max: 10 },
            { id: "regularite", type: "scale", label: "Régularité maintenue", min: 1, max: 10 },
            { id: "application", type: "scale", label: "Application des enseignements", min: 1, max: 10 },
            { id: "chapitres_lus", type: "number", label: "Nombre de chapitres lus cette période" },
            { id: "livre_prefere", type: "text", label: "Livre/passage qui m'a le plus marqué" },
            { id: "enseignement", type: "text", label: "Principal enseignement retenu" },
            { id: "satisfaction", type: "scale", label: "Satisfaction globale", min: 1, max: 10 }
        ]
    },

    // SPIRITUEL - Prière
    priere: {
        titre: "Évaluation Vie de Prière",
        periodicite: ["trimestre"],
        questionsAvant: [
            { id: "frequence", type: "select", label: "Fréquence actuelle de prière", options: ["Rarement", "Quelques fois/semaine", "Quotidien", "Plusieurs fois/jour"] },
            { id: "duree_moyenne", type: "number", label: "Durée moyenne par session (minutes)" },
            { id: "qualite", type: "scale", label: "Qualité de ma vie de prière", min: 1, max: 10 },
            { id: "concentration", type: "scale", label: "Niveau de concentration", min: 1, max: 10 },
            { id: "intimite", type: "scale", label: "Sentiment d'intimité avec Dieu", min: 1, max: 10 },
            { id: "sujets", type: "text", label: "Principaux sujets de prière" }
        ],
        questionsApres: [
            { id: "frequence", type: "select", label: "Fréquence de prière atteinte", options: ["Rarement", "Quelques fois/semaine", "Quotidien", "Plusieurs fois/jour"] },
            { id: "duree_moyenne", type: "number", label: "Durée moyenne atteinte (minutes)" },
            { id: "qualite", type: "scale", label: "Qualité de ma vie de prière", min: 1, max: 10 },
            { id: "concentration", type: "scale", label: "Niveau de concentration", min: 1, max: 10 },
            { id: "intimite", type: "scale", label: "Sentiment d'intimité avec Dieu", min: 1, max: 10 },
            { id: "exaucements", type: "text", label: "Prières exaucées ou en cours" },
            { id: "progres", type: "text", label: "Progrès constatés" },
            { id: "satisfaction", type: "scale", label: "Satisfaction globale", min: 1, max: 10 }
        ]
    },

    // PHYSIQUE - Nutrition/Détox
    nutrition: {
        titre: "Fiche Santé Détox",
        periodicite: ["session"], // Avant et après chaque session de détox
        questionsAvant: [
            { id: "energie", type: "scale", label: "Niveau d'énergie", min: 1, max: 10, emoji: "⚡" },
            { id: "digestion", type: "scale", label: "Qualité de digestion", min: 1, max: 10, emoji: "🍽️" },
            { id: "poids", type: "number", label: "Poids (kg)", step: 0.1, emoji: "⚖️" },
            { id: "sommeil", type: "scale", label: "Qualité du sommeil", min: 1, max: 10, emoji: "😴" },
            { id: "peau", type: "scale", label: "État de la peau", min: 1, max: 10, emoji: "✨" },
            { id: "humeur", type: "scale", label: "Humeur générale", min: 1, max: 10, emoji: "😊" },
            { id: "ballonnements", type: "boolean", label: "Ballonnements ou inconfort", emoji: "🫃" },
            { id: "maux_tete", type: "boolean", label: "Maux de tête fréquents", emoji: "🤕" },
            { id: "objectif", type: "text", label: "Ce que j'espère de cette détox" }
        ],
        questionsApres: [
            { id: "energie", type: "scale", label: "Niveau d'énergie", min: 1, max: 10, emoji: "⚡" },
            { id: "digestion", type: "scale", label: "Qualité de digestion", min: 1, max: 10, emoji: "🍽️" },
            { id: "poids", type: "number", label: "Poids (kg)", step: 0.1, emoji: "⚖️" },
            { id: "sommeil", type: "scale", label: "Qualité du sommeil", min: 1, max: 10, emoji: "😴" },
            { id: "peau", type: "scale", label: "État de la peau", min: 1, max: 10, emoji: "✨" },
            { id: "humeur", type: "scale", label: "Humeur générale", min: 1, max: 10, emoji: "😊" },
            { id: "ballonnements", type: "boolean", label: "Ballonnements ou inconfort", emoji: "🫃" },
            { id: "difficulte", type: "scale", label: "Difficulté ressentie", min: 1, max: 10 },
            { id: "bienfaits", type: "text", label: "Bienfaits ressentis" },
            { id: "continuer", type: "boolean", label: "Envie de continuer/recommencer" }
        ],
        calculerProgression: (avant, apres) => {
            // Calculer l'amélioration moyenne sur les indicateurs clés
            const indicateurs = ['energie', 'digestion', 'sommeil', 'peau', 'humeur'];
            let amelioration = 0;
            indicateurs.forEach(ind => {
                if (avant[ind] && apres[ind]) {
                    amelioration += (apres[ind] - avant[ind]);
                }
            });
            return Math.round((amelioration / indicateurs.length) * 10); // Score sur 100
        }
    },

    // INTELLECTUEL - Langue Étrangère
    langue_etrangere: {
        titre: "Évaluation Apprentissage Langue",
        periodicite: ["mois", "trimestre", "semestre"],
        questionsAvant: [
            { id: "niveau_auto", type: "select", label: "Niveau actuel (auto-évaluation)", options: ["A1 - Débutant", "A2 - Élémentaire", "B1 - Intermédiaire", "B2 - Intermédiaire avancé", "C1 - Avancé", "C2 - Maîtrise"] },
            { id: "comprehension_orale", type: "scale", label: "Compréhension orale", min: 1, max: 10 },
            { id: "comprehension_ecrite", type: "scale", label: "Compréhension écrite", min: 1, max: 10 },
            { id: "expression_orale", type: "scale", label: "Expression orale", min: 1, max: 10 },
            { id: "expression_ecrite", type: "scale", label: "Expression écrite", min: 1, max: 10 },
            { id: "vocabulaire", type: "number", label: "Vocabulaire estimé (mots)" },
            { id: "confiance", type: "scale", label: "Confiance pour communiquer", min: 1, max: 10 },
            { id: "objectif", type: "text", label: "Objectif pour cette période" }
        ],
        questionsApres: [
            { id: "niveau_auto", type: "select", label: "Niveau atteint (auto-évaluation)", options: ["A1 - Débutant", "A2 - Élémentaire", "B1 - Intermédiaire", "B2 - Intermédiaire avancé", "C1 - Avancé", "C2 - Maîtrise"] },
            { id: "comprehension_orale", type: "scale", label: "Compréhension orale", min: 1, max: 10 },
            { id: "comprehension_ecrite", type: "scale", label: "Compréhension écrite", min: 1, max: 10 },
            { id: "expression_orale", type: "scale", label: "Expression orale", min: 1, max: 10 },
            { id: "expression_ecrite", type: "scale", label: "Expression écrite", min: 1, max: 10 },
            { id: "vocabulaire", type: "number", label: "Vocabulaire estimé (mots)" },
            { id: "confiance", type: "scale", label: "Confiance pour communiquer", min: 1, max: 10 },
            { id: "xp_gagne", type: "number", label: "XP gagnés sur l'application" },
            { id: "temps_total", type: "number", label: "Temps total d'étude (heures)" },
            { id: "situations_reelles", type: "text", label: "Situations réelles où j'ai utilisé la langue" },
            { id: "difficultes", type: "text", label: "Difficultés rencontrées" },
            { id: "satisfaction", type: "scale", label: "Satisfaction globale", min: 1, max: 10 }
        ]
    },

    // INTELLECTUEL - Musique
    musique: {
        titre: "Évaluation Apprentissage Musical",
        periodicite: ["trimestre"],
        questionsAvant: [
            { id: "niveau", type: "select", label: "Niveau actuel", options: ["Grand débutant", "Débutant", "Intermédiaire", "Avancé"] },
            { id: "lecture_partition", type: "scale", label: "Lecture de partition", min: 1, max: 10 },
            { id: "technique", type: "scale", label: "Technique instrumentale", min: 1, max: 10 },
            { id: "repertoire", type: "number", label: "Nombre de morceaux maîtrisés" },
            { id: "motivation", type: "scale", label: "Motivation", min: 1, max: 10 },
            { id: "objectif_morceau", type: "text", label: "Morceau(x) à apprendre cette période" }
        ],
        questionsApres: [
            { id: "niveau", type: "select", label: "Niveau atteint", options: ["Grand débutant", "Débutant", "Intermédiaire", "Avancé"] },
            { id: "lecture_partition", type: "scale", label: "Lecture de partition", min: 1, max: 10 },
            { id: "technique", type: "scale", label: "Technique instrumentale", min: 1, max: 10 },
            { id: "repertoire", type: "number", label: "Nombre de morceaux maîtrisés" },
            { id: "morceaux_appris", type: "text", label: "Morceaux appris cette période" },
            { id: "temps_pratique", type: "number", label: "Heures de pratique totales" },
            { id: "satisfaction", type: "scale", label: "Satisfaction globale", min: 1, max: 10 }
        ]
    },

    // INTELLECTUEL - Lecture
    lecture: {
        titre: "Évaluation Objectif Lecture",
        periodicite: ["trimestre"],
        questionsAvant: [
            { id: "livres_prevus", type: "number", label: "Nombre de livres prévus" },
            { id: "genres", type: "text", label: "Genres/thèmes visés" },
            { id: "temps_lecture", type: "number", label: "Temps de lecture hebdo prévu (heures)" },
            { id: "motivation", type: "scale", label: "Motivation", min: 1, max: 10 }
        ],
        questionsApres: [
            { id: "livres_lus", type: "number", label: "Nombre de livres lus" },
            { id: "pages_lues", type: "number", label: "Nombre de pages lues" },
            { id: "livre_prefere", type: "text", label: "Livre préféré de la période" },
            { id: "enseignements", type: "text", label: "Principaux enseignements" },
            { id: "temps_reel", type: "number", label: "Temps de lecture réel (heures/semaine)" },
            { id: "satisfaction", type: "scale", label: "Satisfaction globale", min: 1, max: 10 }
        ]
    },

    // FINANCIER - Épargne
    epargne: {
        titre: "Évaluation Objectif Épargne",
        periodicite: ["mois"],
        questionsAvant: [
            { id: "montant_prevu", type: "number", label: "Montant prévu ce mois (XAF)" },
            { id: "revenus_prevus", type: "number", label: "Revenus prévus (XAF)" },
            { id: "depenses_fixes", type: "number", label: "Dépenses fixes prévues (XAF)" },
            { id: "objectif_specifique", type: "text", label: "Objectif spécifique (projet, urgence...)" },
            { id: "confiance", type: "scale", label: "Confiance d'atteindre l'objectif", min: 1, max: 10 }
        ],
        questionsApres: [
            { id: "montant_epargne", type: "number", label: "Montant effectivement épargné (XAF)" },
            { id: "revenus_reels", type: "number", label: "Revenus réels (XAF)" },
            { id: "depenses_reelles", type: "number", label: "Dépenses réelles (XAF)" },
            { id: "ecart", type: "number", label: "Écart par rapport à l'objectif (XAF)", computed: true },
            { id: "raison_ecart", type: "text", label: "Raison de l'écart (si applicable)" },
            { id: "depenses_imprevues", type: "text", label: "Dépenses imprévues" },
            { id: "total_cumule", type: "number", label: "Total épargne cumulée (XAF)" },
            { id: "satisfaction", type: "scale", label: "Satisfaction", min: 1, max: 10 }
        ]
    },

    // PHYSIQUE - Sport
    sport: {
        titre: "Évaluation Activité Sportive",
        periodicite: ["mois"],
        questionsAvant: [
            { id: "poids", type: "number", label: "Poids actuel (kg)", step: 0.1 },
            { id: "poids_cible", type: "number", label: "Poids cible (kg)", step: 0.1 },
            { id: "endurance", type: "scale", label: "Niveau d'endurance", min: 1, max: 10 },
            { id: "force", type: "scale", label: "Niveau de force", min: 1, max: 10 },
            { id: "souplesse", type: "scale", label: "Souplesse", min: 1, max: 10 },
            { id: "energie_generale", type: "scale", label: "Énergie générale", min: 1, max: 10 },
            { id: "objectif", type: "text", label: "Objectif du mois" }
        ],
        questionsApres: [
            { id: "poids", type: "number", label: "Poids actuel (kg)", step: 0.1 },
            { id: "sessions_realisees", type: "number", label: "Nombre de sessions réalisées" },
            { id: "endurance", type: "scale", label: "Niveau d'endurance", min: 1, max: 10 },
            { id: "force", type: "scale", label: "Niveau de force", min: 1, max: 10 },
            { id: "souplesse", type: "scale", label: "Souplesse", min: 1, max: 10 },
            { id: "energie_generale", type: "scale", label: "Énergie générale", min: 1, max: 10 },
            { id: "blessures", type: "boolean", label: "Blessures ou douleurs" },
            { id: "satisfaction", type: "scale", label: "Satisfaction globale", min: 1, max: 10 }
        ]
    },

    // PHYSIQUE - Discipline (Ponctualité)
    discipline: {
        titre: "Évaluation Ponctualité",
        periodicite: ["mois"],
        questionsAvant: [
            { id: "ponctualite_actuelle", type: "scale", label: "Ponctualité actuelle", min: 1, max: 10 },
            { id: "retards_semaine", type: "number", label: "Retards moyens par semaine" },
            { id: "heure_reveil", type: "time", label: "Heure de réveil habituelle" },
            { id: "heure_coucher", type: "time", label: "Heure de coucher habituelle" },
            { id: "obstacles", type: "text", label: "Principaux obstacles à la ponctualité" }
        ],
        questionsApres: [
            { id: "ponctualite_atteinte", type: "scale", label: "Ponctualité ce mois", min: 1, max: 10 },
            { id: "jours_a_lheure", type: "number", label: "Jours arrivé(e) à l'heure" },
            { id: "jours_en_avance", type: "number", label: "Jours arrivé(e) en avance" },
            { id: "jours_en_retard", type: "number", label: "Jours en retard" },
            { id: "moyenne_avance", type: "number", label: "Avance moyenne (minutes)" },
            { id: "ameliorations", type: "text", label: "Améliorations constatées" },
            { id: "satisfaction", type: "scale", label: "Satisfaction", min: 1, max: 10 }
        ]
    },

    // PROJET - Business
    business: {
        titre: "Évaluation Projet Business",
        periodicite: ["mois"],
        questionsAvant: [
            { id: "ca_prevu", type: "number", label: "CA prévu ce mois (XAF)" },
            { id: "contacts_cible", type: "number", label: "Nombre de contacts visés" },
            { id: "actions_prevues", type: "text", label: "Actions marketing prévues" },
            { id: "objectifs_cles", type: "text", label: "Objectifs clés du mois" },
            { id: "confiance", type: "scale", label: "Confiance", min: 1, max: 10 }
        ],
        questionsApres: [
            { id: "ca_realise", type: "number", label: "CA réalisé (XAF)" },
            { id: "contacts_obtenus", type: "number", label: "Nouveaux contacts obtenus" },
            { id: "actions_realisees", type: "text", label: "Actions marketing réalisées" },
            { id: "clients_nouveaux", type: "number", label: "Nouveaux clients" },
            { id: "visibilite_web", type: "scale", label: "Progression visibilité web", min: 1, max: 10 },
            { id: "lecons_apprises", type: "text", label: "Leçons apprises" },
            { id: "prochaines_actions", type: "text", label: "Prochaines actions prioritaires" },
            { id: "satisfaction", type: "scale", label: "Satisfaction", min: 1, max: 10 }
        ]
    },

    // INTELLECTUEL - Langue maternelle
    langue_maternelle: {
        titre: "Évaluation Révision Langue Maternelle",
        periodicite: ["trimestre"],
        questionsAvant: [
            { id: "grammaire", type: "scale", label: "Niveau grammaire", min: 1, max: 10 },
            { id: "orthographe", type: "scale", label: "Niveau orthographe", min: 1, max: 10 },
            { id: "conjugaison", type: "scale", label: "Niveau conjugaison", min: 1, max: 10 },
            { id: "vocabulaire", type: "scale", label: "Richesse vocabulaire", min: 1, max: 10 },
            { id: "points_faibles", type: "text", label: "Points faibles identifiés" }
        ],
        questionsApres: [
            { id: "grammaire", type: "scale", label: "Niveau grammaire", min: 1, max: 10 },
            { id: "orthographe", type: "scale", label: "Niveau orthographe", min: 1, max: 10 },
            { id: "conjugaison", type: "scale", label: "Niveau conjugaison", min: 1, max: 10 },
            { id: "vocabulaire", type: "scale", label: "Richesse vocabulaire", min: 1, max: 10 },
            { id: "sessions_realisees", type: "number", label: "Sessions de révision effectuées" },
            { id: "exercices_faits", type: "text", label: "Types d'exercices réalisés" },
            { id: "progres_constates", type: "text", label: "Progrès constatés" },
            { id: "satisfaction", type: "scale", label: "Satisfaction", min: 1, max: 10 }
        ]
    }
};

// ============================================
// CLASSE GESTIONNAIRE D'ÉVALUATIONS
// ============================================

class EvaluationsManager {
    constructor(app) {
        this.app = app;
        this.config = EVALUATIONS_CONFIG;
    }

    // Obtenir la configuration d'évaluation pour un objectif
    getConfigForObjectif(objectif) {
        return this.config[objectif.categorie] || null;
    }

    // Vérifier si une évaluation est due
    isEvaluationDue(objectif, type = 'avant') {
        const config = this.getConfigForObjectif(objectif);
        if (!config) return false;

        const evaluations = this.app.data.evaluations || {};
        const objectifEvals = Object.values(evaluations).filter(
            e => e.objectifId === objectif.id && e.userId === this.app.currentUser.id
        );

        // Logique selon la périodicité
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        for (const periodicite of config.periodicite) {
            if (periodicite === 'session') {
                // Pour les évaluations par session (ex: détox), toujours proposer
                return true;
            }
            if (periodicite === 'mois') {
                // Vérifier si évaluation du mois existe
                const monthEval = objectifEvals.find(e => {
                    const evalDate = new Date(e.date);
                    return evalDate.getMonth() === currentMonth && 
                           evalDate.getFullYear() === currentYear &&
                           e.type === type;
                });
                if (!monthEval) return true;
            }
            if (periodicite === 'trimestre') {
                const currentQuarter = Math.floor(currentMonth / 3);
                const quarterEval = objectifEvals.find(e => {
                    const evalDate = new Date(e.date);
                    return Math.floor(evalDate.getMonth() / 3) === currentQuarter &&
                           evalDate.getFullYear() === currentYear &&
                           e.type === type;
                });
                if (!quarterEval) return true;
            }
        }
        return false;
    }

    // Générer le HTML du formulaire d'évaluation
    renderEvaluationForm(objectif, type = 'avant') {
        const config = this.getConfigForObjectif(objectif);
        if (!config) return '<p>Aucune évaluation configurée pour ce type d\'objectif.</p>';

        const questions = type === 'avant' ? config.questionsAvant : config.questionsApres;
        
        let html = `
            <div class="evaluation-form" data-objectif="${objectif.id}" data-type="${type}">
                <div class="evaluation-header">
                    <h3>${config.titre}</h3>
                    <span class="evaluation-type ${type}">${type === 'avant' ? '📋 AVANT' : '📊 APRÈS'}</span>
                </div>
                <div class="evaluation-objectif-info">
                    <span class="icon">${objectif.icon}</span>
                    <span>${objectif.titre}</span>
                </div>
                <div class="evaluation-questions">
        `;

        questions.forEach((q, index) => {
            html += this.renderQuestion(q, index);
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    // Rendre une question selon son type
    renderQuestion(question, index) {
        const emoji = question.emoji || '';
        let html = `
            <div class="evaluation-question" data-id="${question.id}">
                <label>${emoji} ${question.label}</label>
        `;

        switch (question.type) {
            case 'scale':
                html += this.renderScaleInput(question);
                break;
            case 'number':
                html += `<input type="number" class="form-control eval-input" 
                         min="${question.min || 0}" step="${question.step || 1}" 
                         placeholder="Entrez une valeur">`;
                break;
            case 'text':
                html += `<textarea class="form-control eval-input" rows="2" 
                         placeholder="Votre réponse..."></textarea>`;
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
                        <label><input type="radio" name="eval_${question.id}" value="true"> Oui</label>
                        <label><input type="radio" name="eval_${question.id}" value="false"> Non</label>
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

    // Collecter les réponses du formulaire
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
    saveEvaluation(objectifId, type, responses) {
        const evalId = `eval_${this.app.currentUser.id}_${objectifId}_${type}_${Date.now()}`;
        
        if (!this.app.data.evaluations) {
            this.app.data.evaluations = {};
        }

        this.app.data.evaluations[evalId] = {
            id: evalId,
            userId: this.app.currentUser.id,
            objectifId: objectifId,
            type: type, // 'avant' ou 'apres'
            date: new Date().toISOString(),
            responses: responses,
            periode: this.getCurrentPeriode()
        };

        this.app.saveData();
        return evalId;
    }

    // Obtenir la période actuelle
    getCurrentPeriode() {
        const now = new Date();
        return {
            mois: now.getMonth() + 1,
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

    // Comparer AVANT/APRÈS
    compareEvaluations(objectifId) {
        const evals = this.getEvaluations(objectifId);
        const avant = evals.filter(e => e.type === 'avant');
        const apres = evals.filter(e => e.type === 'apres');

        if (avant.length === 0 || apres.length === 0) return null;

        const lastAvant = avant[0];
        const lastApres = apres[0];

        // Calculer les différences pour les valeurs numériques
        const comparison = {};
        const objectif = this.app.data.objectifs[objectifId];
        const config = this.getConfigForObjectif(objectif);

        if (config && config.questionsAvant) {
            config.questionsAvant.forEach(q => {
                if (q.type === 'scale' || q.type === 'number') {
                    const avantVal = lastAvant.responses[q.id];
                    const apresVal = lastApres.responses[q.id];
                    if (avantVal !== undefined && apresVal !== undefined) {
                        comparison[q.id] = {
                            label: q.label,
                            avant: avantVal,
                            apres: apresVal,
                            difference: apresVal - avantVal,
                            pourcentage: avantVal > 0 ? Math.round(((apresVal - avantVal) / avantVal) * 100) : 0
                        };
                    }
                }
            });
        }

        return comparison;
    }

    // Générer un rapport de progression
    generateProgressReport(objectifId) {
        const comparison = this.compareEvaluations(objectifId);
        if (!comparison) return null;

        let improvements = 0;
        let declines = 0;
        let stable = 0;

        Object.values(comparison).forEach(c => {
            if (c.difference > 0) improvements++;
            else if (c.difference < 0) declines++;
            else stable++;
        });

        return {
            comparison,
            summary: {
                improvements,
                declines,
                stable,
                overallTrend: improvements > declines ? 'positive' : (declines > improvements ? 'negative' : 'stable')
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EVALUATIONS_CONFIG, EvaluationsManager };
}
