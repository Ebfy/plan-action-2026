# 📋 Plan d'Action 2026

> **« Réalisation et Constance »**

Application PWA de suivi d'objectifs personnels développée par BlockchainLab.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PWA](https://img.shields.io/badge/PWA-Ready-purple)

## 🎯 Description

Plan d'Action 2026 est une application web progressive (PWA) permettant de définir, suivre et atteindre ses objectifs personnels dans 5 domaines de vie :

- 🙏 **Spirituel** - Prière, lecture biblique, méditation
- 🧠 **Intellectuel** - Langues, lecture, musique, formations
- 💰 **Financier** - Épargne, investissements
- 💪 **Physique** - Sport, nutrition, santé
- 💼 **Projet** - Projets personnels et professionnels

## ✨ Fonctionnalités

- ✅ **Dashboard personnalisé** avec vision et thème personnel
- ✅ **Score global** et scores par domaine avec jauges visuelles
- ✅ **Graphiques** radar et courbe d'évolution (Chart.js)
- ✅ **Saisie quotidienne** des objectifs réalisés
- ✅ **Calendrier** type heatmap GitHub
- ✅ **Alarmes** pré-configurées avec notifications
- ✅ **Multi-utilisateurs** (Fabien admin + Sandrine)
- ✅ **Thème clair/sombre**
- ✅ **PWA** installable sur mobile et desktop
- ✅ **Fonctionne hors-ligne**
- ✅ **Export JSON** des données

## 👥 Utilisateurs par défaut

| Utilisateur | Identifiant | Mot de passe | Rôle | Objectifs |
|-------------|-------------|--------------|------|-----------|
| Fabien | `fabien` | `fabien` | Admin | 6 |
| Sandrine | `sandrine` | `sandrine` | Standard | 10 |

## 🚀 Installation

### Option 1 : GitHub Pages (recommandé)

1. Fork ce repository
2. Allez dans Settings > Pages
3. Sélectionnez la branche `main` et le dossier `/root`
4. Votre app est disponible sur `https://votre-username.github.io/plan-action-2026`

### Option 2 : Hébergement local

```bash
# Cloner le repository
git clone https://github.com/votre-username/plan-action-2026.git

# Aller dans le dossier
cd plan-action-2026

# Lancer un serveur local (Python)
python -m http.server 8000

# Ou avec Node.js
npx serve
```

Ouvrir http://localhost:8000 dans votre navigateur.

## 📁 Structure du projet

```
plan-action-2026/
├── index.html          # Page principale
├── manifest.json       # Configuration PWA
├── sw.js              # Service Worker
├── css/
│   └── style.css      # Styles (thème clair/sombre)
├── js/
│   ├── data.js        # Données initiales (utilisateurs, objectifs, alarmes)
│   └── app.js         # Logique de l'application
├── icons/
│   └── icon-*.png     # Icônes PWA (72-512px)
└── README.md
```

## 📊 Objectifs pré-configurés

### Fabien (6 objectifs)
| # | Objectif | Domaine | Fréquence |
|---|----------|---------|-----------|
| 1 | 📖 Bible AT (NIV) | Spirituel | 5x/semaine |
| 2 | 🥗 Détox | Physique | 2x/mois → 1x/semaine |
| 3 | 🇬🇧 Anglais | Intellectuel | 5x/semaine |
| 4 | 🇨🇳 Chinois | Intellectuel | 5x/semaine |
| 5 | 💰 Épargne | Financier | Mensuel (2M XAF/an) |
| 6 | 🏊 Aquacam | Projet | Continu |

### Sandrine (10 objectifs)
| # | Objectif | Domaine | Fréquence |
|---|----------|---------|-----------|
| 1 | 🙏 Prière | Spirituel | Quotidien (1h/jour) |
| 2 | 📖 Bible | Spirituel | Quotidien (2 ch/jour) |
| 3 | 🎹 Piano | Intellectuel | 2x/semaine |
| 4 | 📚 Français | Intellectuel | Dimanche |
| 5 | 🇬🇧 Anglais | Intellectuel | Quotidien |
| 6 | 📚 Lecture | Intellectuel | 2-3 ch/semaine |
| 7 | 💰 Épargne | Financier | Mensuel (200K XAF) |
| 8 | 🏃 Sport | Physique | Sam-Dim |
| 9 | 🍎 Fruits | Physique | Lun-Jeu |
| 10 | ⏰ Ponctualité | Physique | Lun-Ven |

## 🎨 Captures d'écran

### Dashboard
Le dashboard affiche votre vision personnelle, le score global, et les scores par domaine avec des indicateurs visuels colorés.

### Indicateurs de progression
- 🟢 **Vert** (≥80%) : Excellent !
- 🟡 **Orange** (50-79%) : Tu peux faire mieux !
- 🔴 **Rouge** (<50%) : Attention, en danger !

## 🔧 Technologies utilisées

- **HTML5** / **CSS3** (Variables CSS, Grid, Flexbox)
- **JavaScript ES6+** (Classes, Modules)
- **Chart.js** - Graphiques interactifs
- **LocalStorage** - Stockage des données
- **Service Worker** - Fonctionnement hors-ligne
- **PWA** - Application installable

## 📱 Installation PWA

Sur mobile (Android/iOS) ou desktop (Chrome, Edge) :
1. Ouvrir l'application dans le navigateur
2. Cliquer sur "Ajouter à l'écran d'accueil" ou l'icône d'installation
3. L'application s'installe comme une app native

## 🔐 Données

Toutes les données sont stockées localement dans le navigateur (LocalStorage). 
- **Aucune donnée** n'est envoyée à un serveur
- Les données persistent entre les sessions
- Export JSON disponible pour sauvegarde

## 🛣️ Roadmap

- [ ] Intégration Firebase (synchronisation multi-appareils)
- [ ] Notifications push natives
- [ ] Mode tutoriel premier lancement
- [ ] Export PDF
- [ ] Graphiques avancés (heatmap annuel)
- [ ] Évaluations AVANT/APRÈS

## 📄 License

MIT License - BlockchainLab © 2026

## 🙏 Auteur

Développé avec ❤️ par **BlockchainLab**

---

*« La constance mène à la réalisation. »*
