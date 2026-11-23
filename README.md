# MES-DataCourse
> **German Urban Mobility & Public Transport Analytics**
> Intensive, Project-Based Learning Platform for Practical Data Analytics and Introductory Data Science. Made with AI to help me learn Data Science

---

## 🚀 Overview

**MES-DataCourse** is a comprehensive, interactive learning platform designed to teach practical, employable Data Analytics skills through an authentic, end-to-end analytical project analyzing German municipal public transport and weather data from **Infranode**.

### 🔑 Key Platform Features
- **100% Project-Based Learning (PBL):** Every concept connects directly to analyzing real German municipal transit systems.
- **Real-World API Grounding:** Powered by Infranode's keyless REST APIs:
  - Cities metadata: `https://infranode.dev/api/v1/cities`
  - Deutscher Wetterdienst (DWD) weather: `https://infranode.dev/api/v1/cities/{city}/weather`
  - Real-time transit departures: `https://infranode.dev/api/v1/live/{city}/departures`
- **Trilingual Internationalization:** Full support for **English**, **German (Deutsch)**, and **Bosnian/Croatian/Serbian (BHS)** with instant global switching.
- **External Coding Workflow:** No artificial in-browser compiler. You write, execute, and debug your code in professional tools (**VS Code**, **SQLite**, **Excel**, **Power BI**). The platform provides rigorous acceptance criteria, expected outcomes, and reference implementations.
- **Active Recall & Spaced Repetition:** Integrated **SM-2 spaced repetition flashcard engine** to ensure long-term retention of critical syntax and analytical concepts.
- **Personal Knowledge Base:** Persistent, Markdown-enabled notes repository with lesson tagging and search.
- **Integrated Focus Pomodoro Timer:** 25/5/15 minute intervals with daily focus time tracking.
- **Zero AI-Slop Design:** Restrained navy/teal aesthetic, high information density, and professional typography.

---

## 🧭 The 8 Learning Phases

| Phase | Domain | Primary Deliverable |
|---|---|---|
| **Phase 1** | Data Exploration & Project Setup | Project Charter, Infranode API Inventory, Repository Layout |
| **Phase 2** | Python & API Data Collection | Automated continuous harvester (`run_pipeline.py`) polling weather & departures |
| **Phase 3** | Pandas, Cleaning & Feature Engineering | Cleaned, deduplicated, and unified analytical master table (`master_transit_weather.parquet`) |
| **Phase 4** | Exploratory Data Analysis & Statistics | Delay distribution percentiles (p50, p90), cross-city reliability rankings, stratified weather analysis |
| **Phase 5** | SQL & Relational Databases | Normalized Star Schema, SQLite database (`mobility.db`), window functions (`DENSE_RANK`, `LAG`/`LEAD`) |
| **Phase 6** | Excel for Professional Analysis | Dynamic Excel Tables (`Ctrl + T`), `XLOOKUP`, `AVERAGEIFS`, multi-dimensional PivotTables & Slicers |
| **Phase 7** | Power BI & Business Intelligence | Star Schema data model, production DAX measures (`CALCULATE`), 3-page interactive portfolio dashboard |
| **Phase 8** | Machine Learning: Delay Prediction | Chronological train/test split, heuristic baseline, Linear Regression, and Random Forest Regressor |

---

## 💻 Quick Start: Running the Learning Platform

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.11+)
- **VS Code** (or your preferred editor)

### Installation & Launch
\`\`\`bash
# 1. Navigate to the platform app directory
cd mes-datacourse

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the local development server
npm run dev
\`\`\`

Open your browser at **`http://localhost:5173`** to access MES-DataCourse.

---

## 🗂️ Recommended Learner Workspace Structure

As you follow the lessons, create your project workspace alongside this platform:

\`\`\`
german-mobility-analytics/
├── data/
│   ├── raw/                  # Immutable JSON Lines API dumps (weather_snapshots.jsonl, transit_snapshots.jsonl)
│   ├── processed/            # Clean Parquet files (clean_transit.parquet, master_transit_weather.parquet)
│   └── database/             # SQLite database (mobility.db)
├── src/
│   ├── collectors/           # http_client.py, collect_weather.py, collect_transit.py, run_pipeline.py
│   ├── transformers/         # 01_ingest.py, 02_clean_transit.py, 03_merge_weather.py, load_to_sqlite.py
│   ├── sql/                  # schema.sql, analytical_queries.sql
│   └── models/               # 01_prepare_splits.py, 02_train_evaluate.py
├── notebooks/                # Exploratory EDA and visualization notebooks
├── reports/                  # German_Mobility_Analytics.xlsx, Power BI .pbix, exported PNG charts
├── docs/                     # PROJECT_CHARTER.md, API_INVENTORY.md, ML_FORMULATION.md
├── requirements.txt
└── README.md
\`\`\`

---

## 📄 License & Data Sources
- **Infranode API:** Open-source proxy REST API standardizing open municipal data across 84 German cities (`https://infranode.dev`).
- **Weather Telemetry:** Deutscher Wetterdienst (DWD) under GeoNutzV.
- **Transit Telemetry:** DELFI e.V. (CC BY 4.0) & Regional Transport Authorities (HVV, RMV, VVS, VRR).
