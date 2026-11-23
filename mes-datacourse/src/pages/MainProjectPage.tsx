import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  Database,
  Terminal,
  FileSpreadsheet,
  PieChart,
  Cpu,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  FolderTree,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const MainProjectPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'blueprint' | 'architecture' | 'data' | 'deliverables'>('blueprint');

  const pipelineStages = [
    {
      step: '01',
      title: 'Automated Harvester',
      subtitle: 'Python & Network Layer',
      desc: 'Scheduled daemon polling weather & live regional departures every 15 minutes. Implements exponential backoff, status code audits, and append-only JSONL recording.',
      tech: 'Python 3.11+ • requests • time',
      badge: 'Data Collection',
    },
    {
      step: '02',
      title: 'Data Engineering & Cleaning',
      subtitle: 'Pandas & Parquet Storage',
      desc: 'Deduplication across overlapping polling windows, UTC timestamp conversion, rush-hour indicators, and 15-minute as-of join merging transit and DWD weather.',
      tech: 'Pandas 2.2 • NumPy • PyArrow',
      badge: 'ETL & Feature Eng.',
    },
    {
      step: '03',
      title: 'Relational Star Schema',
      subtitle: 'SQLite Analytics Warehouse',
      desc: 'Normalized dimensions (dim_city, dim_line) and indexed fact tables (fact_transit_departures, fact_weather_observations). CTEs, DENSE_RANK window functions, and state-level rollups.',
      tech: 'SQLite 3 • Advanced SQL',
      badge: 'Relational Queries',
    },
    {
      step: '04',
      title: 'Executive BI & ML Modeling',
      subtitle: 'Excel, Power BI & Scikit-Learn',
      desc: 'Multi-dimensional PivotTables with Slicers, Star-schema Power BI dashboard with DAX measures, and chronological Random Forest delay prediction avoiding temporal leakage.',
      tech: 'Excel • Power BI • scikit-learn',
      badge: 'BI & Machine Learning',
    },
  ];

  const deliverables = [
    {
      title: 'Automated Data Collector',
      file: 'src/collectors/run_pipeline.py',
      tool: 'Python (requests)',
      icon: Terminal,
      description: 'Continuous 15-minute polling service with error handling, logging, and atomic JSONL writes.',
      skills: ['HTTP networking', 'Exponential backoff', 'Logging', 'File I/O'],
    },
    {
      title: 'Analytical Master Dataset',
      file: 'data/processed/master_transit_weather.parquet',
      tool: 'Pandas (Parquet)',
      icon: Database,
      description: 'Unified time-series dataset joining transport delays with DWD meteorological observations.',
      skills: ['Time-series joins', 'Deduplication', 'Feature engineering', 'Outlier auditing'],
    },
    {
      title: 'Relational Star Schema Database',
      file: 'data/database/mobility.db',
      tool: 'SQLite & DDL',
      icon: Database,
      description: 'Structured database warehouse with indexed foreign keys, dimensional tables, and analytical views.',
      skills: ['Schema normalization', 'Indexes', 'CTEs', 'Window functions'],
    },
    {
      title: 'Advanced SQL Query Suite',
      file: 'src/sql/analytical_queries.sql',
      tool: 'SQL',
      icon: Terminal,
      description: 'Production queries calculating DENSE_RANK() line fragility, state-level punctuality, and rolling moving averages.',
      skills: ['RANK / DENSE_RANK', 'LAG / LEAD', 'Moving averages', 'Subqueries'],
    },
    {
      title: 'Executive Analytical Workbook',
      file: 'reports/German_Mobility_Analytics.xlsx',
      tool: 'Microsoft Excel',
      icon: FileSpreadsheet,
      description: 'Structured Excel Tables (Ctrl+T), dynamic XLOOKUP formulas, multi-condition AVERAGEIFS, and interactive PivotCharts with Slicers.',
      skills: ['XLOOKUP', 'PivotTables', 'Report connections', 'Conditional formatting'],
    },
    {
      title: 'Power BI Portfolio Dashboard',
      file: 'reports/German_Mobility_Analytics.pbix',
      tool: 'Power BI & DAX',
      icon: PieChart,
      description: 'Executive overview, city comparison, and line fragility drill-through pages powered by custom CALCULATE measures.',
      skills: ['Power Query M', 'Data modeling (1:*)', 'DAX measures', 'Data storytelling'],
    },
    {
      title: 'Predictive ML Delay Model',
      file: 'src/models/02_train_evaluate.py',
      tool: 'Scikit-Learn',
      icon: Cpu,
      description: 'Supervised regression model evaluated using chronological validation (zero leakage), comparing Baseline vs. Random Forest.',
      skills: ['Time-aware validation', 'Baseline benchmarking', 'RandomForestRegressor', 'MAE / RMSE audit'],
    },
    {
      title: 'Documented GitHub Repository',
      file: 'README.md & docs/',
      tool: 'Git & Markdown',
      icon: GitBranch,
      description: 'Professional public repository with installation instructions, data dictionaries, methodology, and interview talking points.',
      skills: ['Technical documentation', 'Git workflow', 'Reproducible research', 'Portfolio presentation'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Hero Card */}
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 text-white rounded-2xl p-7 sm:p-10 border border-navy-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Central Capstone Project</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            German Urban Mobility & Public Transport Analytics
          </h1>

          <p className="text-navy-300 text-sm sm:text-base leading-relaxed">
            One comprehensive, real-world portfolio project connecting live municipal telemetry, weather observations,
            relational databases, interactive business dashboards, and applied machine learning.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-2xs text-navy-300">
            <span className="bg-navy-800/80 px-2.5 py-1 rounded-md border border-navy-700/60 font-mono">Python 3.11</span>
            <span className="bg-navy-800/80 px-2.5 py-1 rounded-md border border-navy-700/60 font-mono">Pandas</span>
            <span className="bg-navy-800/80 px-2.5 py-1 rounded-md border border-navy-700/60 font-mono">SQLite</span>
            <span className="bg-navy-800/80 px-2.5 py-1 rounded-md border border-navy-700/60 font-mono">Excel</span>
            <span className="bg-navy-800/80 px-2.5 py-1 rounded-md border border-navy-700/60 font-mono">Power BI</span>
            <span className="bg-navy-800/80 px-2.5 py-1 rounded-md border border-navy-700/60 font-mono">Scikit-Learn</span>
          </div>
        </div>
      </div>

      {/* Aesthetic Section Tabs */}
      <div className="flex items-center space-x-1 border-b border-surface-200 text-xs font-semibold">
        {[
          { id: 'blueprint', label: 'Executive Blueprint', icon: Briefcase },
          { id: 'architecture', label: 'Pipeline Architecture', icon: Layers },
          { id: 'data', label: 'Infranode Data Feeds', icon: Database },
          { id: 'deliverables', label: 'Portfolio Artifacts (8)', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-all ${
                isActive
                  ? 'border-accent-600 text-navy-950 font-bold'
                  : 'border-transparent text-navy-500 hover:text-navy-800 hover:border-surface-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-accent-600' : 'text-navy-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE BLUEPRINT */}
      {activeTab === 'blueprint' && (
        <div className="space-y-6 animate-fade-in">
          {/* Research Questions Grid */}
          <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-navy-950 tracking-tight">
                Core Analytical Research Questions
              </h2>
              <p className="text-xs text-navy-500 mt-1">
                The technical work across all 8 phases is structured to answer these five empirical business questions:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-50 border border-surface-200/80 space-y-2">
                <span className="font-mono text-2xs font-bold text-accent-700 uppercase tracking-wider block">
                  Question 01 • Network Reliability
                </span>
                <h3 className="font-bold text-navy-950 text-sm">
                  Which German metropolitan networks exhibit the highest systemic delays?
                </h3>
                <p className="text-navy-600 text-2xs leading-relaxed">
                  Benchmarking median arrival delays and punctuality rates (% delay ≤ 3 min) across Frankfurt, Stuttgart,
                  Hamburg, and Rhine-Ruhr, normalized by observation volume.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-50 border border-surface-200/80 space-y-2">
                <span className="font-mono text-2xs font-bold text-accent-700 uppercase tracking-wider block">
                  Question 02 • Line Fragility
                </span>
                <h3 className="font-bold text-navy-950 text-sm">
                  Which specific transit lines have the highest variance and unreliability?
                </h3>
                <p className="text-navy-600 text-2xs leading-relaxed">
                  Ranking transit lines using standard deviation and SQL window ranking (`DENSE_RANK()`) to detect fragile
                  corridors prone to sudden cascade delays.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-50 border border-surface-200/80 space-y-2">
                <span className="font-mono text-2xs font-bold text-accent-700 uppercase tracking-wider block">
                  Question 03 • Weather Interaction
                </span>
                <h3 className="font-bold text-navy-950 text-sm">
                  Does weather measurably degrade public transport performance?
                </h3>
                <p className="text-navy-600 text-2xs leading-relaxed">
                  Isolating precipitation, wind speed, and freezing temperatures from rush-hour traffic volume to
                  determine true environmental impact versus confounding time-of-day cycles.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-50 border border-surface-200/80 space-y-2">
                <span className="font-mono text-2xs font-bold text-accent-700 uppercase tracking-wider block">
                  Question 04 • Predictive Modeling
                </span>
                <h3 className="font-bold text-navy-950 text-sm">
                  Can we forecast future arrival delays using historical statistics?
                </h3>
                <p className="text-navy-600 text-2xs leading-relaxed">
                  Training a supervised Random Forest regressor with chronological train/test splitting to estimate expected
                  delay distributions on unseen future journeys.
                </p>
              </div>
            </div>
          </div>

          {/* Honesty & Data Reality Box */}
          <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-navy-950 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-accent-600" />
              <span>The Data Feasibility & Honesty Principle</span>
            </div>
            <p className="text-xs text-navy-600 leading-relaxed">
              In real enterprise analytics, you rarely receive a pristine dataset with years of pre-cleaned history.
              The Infranode API provides <strong>live operational status</strong>. A central skill taught in this course is
              recognizing data constraints, engineering your own collection pipeline, and distinguishing between what the
              data genuinely proves versus what cannot be claimed.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PIPELINE ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-navy-950 tracking-tight">
                End-to-End Analytics Pipeline Architecture
              </h2>
              <p className="text-xs text-navy-500 mt-1">
                How telemetry flows through each stage from raw REST requests to interactive dashboards and machine learning:
              </p>
            </div>

            <div className="space-y-4">
              {pipelineStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-surface-50 border border-surface-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl font-black text-navy-300 font-mono shrink-0">
                      {stage.step}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-navy-950 text-sm">{stage.title}</h3>
                        <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-white border border-surface-200 text-navy-700">
                          {stage.badge}
                        </span>
                      </div>
                      <p className="text-2xs text-navy-500 mt-0.5">{stage.subtitle}</p>
                      <p className="text-xs text-navy-700 mt-2 leading-relaxed max-w-2xl">{stage.desc}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right self-end sm:self-center">
                    <span className="text-2xs font-mono text-accent-700 bg-accent-50 px-2 py-1 rounded border border-accent-200/60 block">
                      {stage.tech}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directory Layout Card */}
          <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-navy-950 flex items-center space-x-2">
              <FolderTree className="w-4 h-4 text-accent-600" />
              <span>Target Portfolio Repository Layout</span>
            </h3>
            <pre className="bg-navy-950 text-navy-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-navy-800">
{`german-mobility-analytics/
├── data/
│   ├── raw/                  # Immutable raw API responses (.jsonl)
│   ├── processed/            # Clean Parquet files (master_transit_weather.parquet)
│   └── database/             # SQLite relational database (mobility.db)
├── src/
│   ├── collectors/           # http_client.py, run_pipeline.py
│   ├── transformers/         # 01_ingest.py, 02_clean_transit.py, 03_merge_weather.py
│   ├── sql/                  # schema.sql, analytical_queries.sql
│   └── models/               # 01_prepare_splits.py, 02_train_evaluate.py
├── notebooks/                # Exploratory data analysis notebooks
├── reports/                  # German_Mobility_Analytics.xlsx, .pbix, PNG charts
└── README.md                 # Professional portfolio documentation`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: INFRANODE DATA FEEDS */}
      {activeTab === 'data' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-navy-950 tracking-tight">
                Infranode Open API Data Feeds
              </h2>
              <p className="text-xs text-navy-500 mt-1">
                Zero-authentication open data endpoints providing live German municipal telemetry:
              </p>
            </div>

            <div className="space-y-4">
              {/* Feed 1 */}
              <div className="p-5 rounded-xl bg-surface-50 border border-surface-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-navy-900 text-accent-300 px-2 py-0.5 rounded">
                      GET
                    </span>
                    <span className="font-mono text-xs font-bold text-navy-950">
                      https://infranode.dev/api/v1/cities
                    </span>
                  </div>
                  <span className="text-2xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    84 Cities Indexed
                  </span>
                </div>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Returns all German municipalities over 100,000 residents with official Amtlicher Gemeindeschlüssel (AGS),
                  Wikidata QIDs, latitude/longitude coordinates, and census population numbers.
                </p>
                <div className="text-2xs text-navy-500 font-mono bg-white p-2 rounded border border-surface-200">
                  Key fields: slug, name_de, state, ags, population, geo.lat, geo.lon, coverage
                </div>
              </div>

              {/* Feed 2 */}
              <div className="p-5 rounded-xl bg-surface-50 border border-surface-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-navy-900 text-accent-300 px-2 py-0.5 rounded">
                      GET
                    </span>
                    <span className="font-mono text-xs font-bold text-navy-950">
                      https://infranode.dev/api/v1/cities/{'{city}'}/weather
                    </span>
                  </div>
                  <span className="text-2xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    DWD GeoNutzV Open Data
                  </span>
                </div>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Current Deutscher Wetterdienst observation for the specified municipality. Includes temperature in Celsius,
                  relative humidity percentage, wind speed, and weather condition string.
                </p>
                <div className="text-2xs text-navy-500 font-mono bg-white p-2 rounded border border-surface-200">
                  Key fields: payload.temperature_c, payload.humidity, payload.wind_speed, payload.condition, observed_at
                </div>
              </div>

              {/* Feed 3 */}
              <div className="p-5 rounded-xl bg-surface-50 border border-surface-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-navy-900 text-accent-300 px-2 py-0.5 rounded">
                      GET
                    </span>
                    <span className="font-mono text-xs font-bold text-navy-950">
                      https://infranode.dev/api/v1/live/{'{city}'}/departures
                    </span>
                  </div>
                  <span className="text-2xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Live Departure Boards
                  </span>
                </div>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Regional transit adapter departures (Frankfurt RMV, Stuttgart VVS, Hamburg HVV, Rhine-Ruhr VRR).
                  Supplies line names, destinations, departure countdowns, and delay in seconds.
                </p>
                <div className="text-2xs text-navy-500 font-mono bg-white p-2 rounded border border-surface-200">
                  Key fields: departures[].line, departures[].direction, departures[].delay_s, departures[].in_minutes
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PORTFOLIO DELIVERABLES */}
      {activeTab === 'deliverables' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl border border-surface-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-navy-950 tracking-tight">
                8 Core Portfolio Artifacts
              </h2>
              <p className="text-xs text-navy-500 mt-1">
                Concrete, measurable artifacts you will build and present in your technical job interviews:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverables.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-surface-50 border border-surface-200/80 flex flex-col justify-between space-y-3 hover:border-surface-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-lg bg-white border border-surface-200 text-accent-700 shadow-2xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-navy-950 text-xs">{item.title}</h3>
                            <span className="font-mono text-2xs text-navy-400 block">{item.file}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-2xs text-navy-600 mt-3 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-surface-200/60 flex flex-wrap gap-1 text-2xs">
                      {item.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-white text-navy-700 px-2 py-0.5 rounded border border-surface-200/80 font-mono text-2xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
