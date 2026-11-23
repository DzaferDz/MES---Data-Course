import type { Phase } from '@/types';

export const phase1: Phase = {
  id: 1,
  titleKey: 'phases.phase1.title',
  descriptionKey: 'phases.phase1.description',
  icon: 'Compass',
  color: 'sky',
  lessons: [
    {
      id: '1.1',
      phaseId: 1,
      titleKey: '1.1 Problem Definition & Urban Mobility Landscape',
      estimatedMinutes: 30,
      deliverable: 'Project charter markdown file outlining the 5 core analytical questions and research scope.',
      objectives: [
        'Understand the operational challenges of German municipal public transport (ÖPNV).',
        'Define actionable business and research questions separating measurable facts from assumptions.',
        'Distinguish between real-time telemetry, historical aggregates, and derived features.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Business Problem: Punctuality, Weather & Urban Density',
          contentKey: `Public transport in Germany operates under stringent service level agreements (SLAs), yet passenger satisfaction is heavily affected by delays. Municipal transport authorities (Verkehrsverbünde like BVG in Berlin, HVV in Hamburg, RMV in Frankfurt, and VVS in Stuttgart) operate distinct infrastructure networks.

As an aspiring Data Analyst, your task is not merely to display transit numbers, but to answer questions critical to urban planners and operational directors:
1. **Network Reliability:** Which German metropolitan networks experience the highest systemic delays?
2. **Line Vulnerability:** Are specific transit lines (e.g. S-Bahn vs. U-Bahn vs. Bus) consistently fragile?
3. **Weather Interaction:** Does precipitation or sub-zero temperature correlate with disproportionate transit delays?
4. **Predictability:** Can we predict delayed arrivals based on historical patterns before a commuter boards?

### The Analytical Principle: Grounded Telemetry
In real-world data analytics, you never assume data exists in an ideal format. The Infranode API provides **live operational snapshots**, not pre-calculated historical trends. A primary milestone in this project is engineering your own historical data collection pipeline.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Assignment: Project Charter',
          contentKey: `In your local development environment (VS Code):
1. Create a root workspace folder: \`german-mobility-analytics\`.
2. Inside, create a \`docs/\` directory.
3. Write a \`PROJECT_CHARTER.md\` document containing:
   - Primary research objectives.
   - Stakeholder personas (e.g. Municipal Transit Authority vs. Commuter).
   - Feasibility boundaries (what the data can and cannot answer).
   - Hypotheses on weather impact vs. baseline weekday rush hours.`,
        },
        {
          type: 'expectedOutput',
          titleKey: 'Verification Criteria',
          contentKey: `Your \`PROJECT_CHARTER.md\` should include:
- A clear distinction between **operational delay** (seconds delayed against schedule) and **cancellation**.
- At least 3 testable hypotheses written in measurable terms.
- Explicit notation of data boundaries (e.g. real-time snapshot frequency, lack of passenger crowding counts).`,
        },
        {
          type: 'hints',
          titleKey: 'Hints',
          contentKey: `Focus on measurable variables:
- \`delay_s\` (delay in seconds)
- \`temperature_c\` (celsius)
- \`condition\` (rain, snow, dry, fog)
- \`hour_of_day\` (0–23)
- \`city_slug\` (categorical identifier)`,
        },
        {
          type: 'reflection',
          titleKey: 'Analytical Reflection',
          contentKey: `Why is it hazardous to claim that "rain causes train delays" based on a simple scatter plot without controlling for traffic volume or scheduled time of day? How would a junior analyst's explanation differ from a senior analyst's explanation?`,
        },
        {
          type: 'checklist',
          titleKey: 'Completion Checklist',
          contentKey: '',
          checklistItems: [
            'Created local workspace folder `german-mobility-analytics`',
            'Penned `PROJECT_CHARTER.md` with explicit research questions',
            'Documented limitations of API real-time feeds versus historical ground truth',
          ],
        },
      ],
    },
    {
      id: '1.2',
      phaseId: 1,
      titleKey: '1.2 Exploring Infranode REST APIs: Endpoints & Envelope Architecture',
      estimatedMinutes: 35,
      deliverable: 'JSON schema inventory documentation for `/api/v1/cities` and `/api/v1/cities/{city}/weather`.',
      objectives: [
        'Inspect the live Infranode REST API without requiring authentication keys.',
        'Understand standard HTTP status codes, headers, and the canonical JSON envelope (`data`, `meta`, `attribution`).',
        'Analyze the geographic attributes (lat, lon, AGS municipality key) of the 84 indexed German cities.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'REST Principles & Infranode Canonical Envelope',
          contentKey: `The Infranode API (\`https://infranode.dev/api/v1\`) standardizes open data from municipal portals and federal agencies (DWD, DELFI, DB Timetables).

Every response adheres to a strict canonical envelope:
\`\`\`json
{
  "data": { ... },
  "meta": {
    "correlation_id": "7c8974cfc5eb4d4394d1f4c68e6a57e7",
    "source_status": "ok",
    "cache_status": "HIT"
  }
}
\`\`\`

### Key Cities Endpoints:
- \`GET https://infranode.dev/api/v1/cities\` — Returns all 84 German cities over 100,000 residents.
- \`GET https://infranode.dev/api/v1/cities/berlin/weather\` — Real-time Deutscher Wetterdienst (DWD) observation.
- \`GET https://infranode.dev/api/v1/compare?resource=weather&cities=berlin,hamburg,muenchen\` — Multi-city live weather comparison.`,
        },
        {
          type: 'exercise',
          titleKey: 'Practical Task: Endpoint Probing & Inspection',
          contentKey: `Open your terminal or curl / Postman / PowerShell / Python:
1. Fetch \`https://infranode.dev/api/v1/cities\`.
2. Inspect the fields of the first 3 cities.
3. Fetch \`https://infranode.dev/api/v1/cities/frankfurt-am-main/weather\`.
4. Note which fields belong to metadata versus operational payload.
5. Create a \`docs/API_INVENTORY.md\` document outlining each endpoint, query parameter, and data type.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Inspection Script (Python)',
          contentKey: `\`\`\`python
import requests
import json

base_url = "https://infranode.dev/api/v1"

# 1. Fetch Cities
cities_resp = requests.get(f"{base_url}/cities")
cities = cities_resp.json()["data"]
print(f"Total cities returned: {len(cities)}")
print("Sample city structure:", json.dumps(cities[0], indent=2))

# 2. Fetch Weather for Munich
weather_resp = requests.get(f"{base_url}/cities/muenchen/weather")
weather_data = weather_resp.json()["data"]
print("Munich weather observation:", json.dumps(weather_data["payload"], indent=2))
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Successfully sent HTTP GET requests to `/cities` and `/weather` endpoints',
            'Parsed canonical `data` and `meta` envelope structures',
            'Created `docs/API_INVENTORY.md` with verified response schemas',
          ],
        },
      ],
    },
    {
      id: '1.3',
      phaseId: 1,
      titleKey: '1.3 Deep Dive into Transit Feeds: GTFS-RT vs. Regional Adapters',
      estimatedMinutes: 45,
      deliverable: 'Comparative analysis of GTFS-RT departure payloads vs. Regional adapter departures.',
      objectives: [
        'Understand GTFS (General Transit Feed Specification) and GTFS-RT (Real-Time).',
        'Compare DELFI nationwide stop catalogs with regional transport adapters (HVV, RMV, VVS).',
        'Identify primary identifiers: `trip_id`, `route_id`, `stop_id`, and `delay_s`.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Nationwide GTFS-RT vs. Regional Adapter Payloads',
          contentKey: `Germany has two distinct ways transit data is surfaced via Infranode:

#### 1. Nationwide GTFS-RT Feed (DELFI / Mobilithek)
- Endpoint: \`/api/v1/live/{city}/transit/departures?stop_id={delfi_id}\`
- Requires a valid \`stop_id\` from the stop catalog (\`/api/v1/cities/{city}/transit\`).
- Yields:
  - \`trip_id\`: Unique identifier for the vehicle run.
  - \`route_id\`: e.g., \`17518_400\` (internal line id).
  - \`delay_s\`: Delay in seconds (integer, can be negative if early, positive if late).
  - \`departure_time_iso\`: Scheduled departure time with ISO timezone.

#### 2. Regional Adapters (Hamburg HVV, Frankfurt RMV, Stuttgart VVS, Ruhrgebiet VRR)
- Endpoint: \`/api/v1/live/{city}/departures\`
- Direct live board (defaults to central station Hauptbahnhof).
- Returns direct line names: e.g., \`"line": "S3"\`, \`"line": "RE30"\`, \`"line": "U9"\`.
- Yields \`delay_s\` directly in seconds alongside destination strings.`,
        },
        {
          type: 'exercise',
          titleKey: 'Practical Task: Querying Live Departures',
          contentKey: `In your VS Code terminal:
1. Probe Frankfurt live departures: \`https://infranode.dev/api/v1/live/frankfurt-am-main/departures\`.
2. Probe Stuttgart live departures: \`https://infranode.dev/api/v1/live/stuttgart/departures\`.
3. Probe Hamburg live departures: \`https://infranode.dev/api/v1/live/hamburg/departures\`.
4. Document how \`delay_s\` behaves:
   - When a train is on time, what is \`delay_s\`?
   - How many seconds represent a 5-minute delay? (300 seconds)
   - Are there negative delays?`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Code: Comparing Regional Departures',
          contentKey: `\`\`\`python
import requests

cities = ["frankfurt-am-main", "stuttgart", "hamburg"]

for city in cities:
    url = f"https://infranode.dev/api/v1/live/{city}/departures"
    res = requests.get(url).json()
    deps = res.get("data", {}).get("payload", {}).get("departures", [])
    print(f"--- {city.upper()} ({len(deps)} departures) ---")
    for d in deps[:3]:
        line = d.get("line") or d.get("route_id")
        delay_min = round(d.get("delay_s", 0) / 60, 1)
        print(f"Line: {line:<8} Delay: {delay_min:>4} min -> {d.get('direction', 'N/A')}")
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Tested regional departure endpoints for Frankfurt, Hamburg, and Stuttgart',
            'Confirmed `delay_s` is measured in integer seconds',
            'Documented data schema differences between regional feeds and nationwide GTFS-RT',
          ],
        },
      ],
    },
    {
      id: '1.4',
      phaseId: 1,
      titleKey: '1.4 The Historical Data Challenge: Snapshot vs. Time-Series',
      estimatedMinutes: 40,
      deliverable: 'Architectural specification for the ongoing historical data collection strategy.',
      objectives: [
        'Recognize why the API does not supply historical queries and why that shapes our architecture.',
        'Distinguish between live observations, historical snapshots, and derived analytical features.',
        'Design a deduplication strategy using `content_hash` and `record_id`.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Real-World Reality of Transit Data',
          contentKey: `In an academic textbook, you might be handed a clean CSV with 2 years of cleaned historical delays. In real-world industry, public feeds provide **only current status**.

If you want to know:
- Does line S1 in Stuttgart regularly fail on rainy Friday afternoons?
- What was the median delay in Berlin during last week's cold snap?

You must **harvest, store, and version** that telemetry yourself over time.

### Infranode Audit Metadata
Every payload from Infranode includes:
- \`retrieved_at\`: Precise server retrieval timestamp (ISO 8601).
- \`content_hash\`: SHA-256 hash of the normalized payload.
- \`record_id\`: Unique record identifier preventing duplicate inserts.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Assignment: Storage Architecture Design',
          contentKey: `Create a document \`docs/DATA_COLLECTION_STRATEGY.md\`:
1. Define the collection interval (e.g. every 15 minutes).
2. Choose the raw storage format: Append-only JSON Lines (\`.jsonl\`) versus raw nested JSON snapshots.
3. Specify how failed network requests will be logged without breaking the pipeline.
4. Define the primary key for deduplication: \`(city_slug, line, departure_time_iso)\`.`,
        },
        {
          type: 'reflection',
          titleKey: 'Reflection: Rate Limits & Server Ethics',
          contentKey: `If an API is free and keyless, why should you still implement exponential backoff, rate throttling, and request caching? What happens if 500 automated scripts hit the server every 5 seconds?`,
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Understood that historical data must be compiled through periodic logging',
            'Identified deduplication keys (`content_hash`, `record_id`, `departure_time`)',
            'Drafted `DATA_COLLECTION_STRATEGY.md` with a 15-minute polling cadence',
          ],
        },
      ],
    },
    {
      id: '1.5',
      phaseId: 1,
      titleKey: '1.5 Professional Python Environment & Git Repository Setup',
      estimatedMinutes: 40,
      deliverable: 'Functional Python virtual environment (`.venv`), `.gitignore`, and Git repository structure.',
      objectives: [
        'Set up a clean virtual environment using Python 3.11+.',
        'Configure dependencies with `requirements.txt` (`requests`, `pandas`, `matplotlib`, `seaborn`, `scikit-learn`).',
        'Initialize a Git repository adhering to professional data science folder conventions.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Professional Data Project Directory Structure',
          contentKey: `Professional data engineering projects require clean separation of raw data, processed artifacts, source code, and documentation:

\`\`\`
german-mobility-analytics/
├── data/
│   ├── raw/                  # Immutable raw API responses (JSON / JSONL)
│   ├── processed/            # Cleaned, joined CSV / Parquet datasets
│   └── database/             # SQLite relational database files
├── notebooks/                # Exploratory Jupyter notebooks
├── src/
│   ├── collectors/           # API fetching scripts
│   ├── transformers/         # Data cleaning & feature engineering
│   └── models/               # ML delay prediction models
├── docs/                     # Specifications, data dictionary, architecture
├── reports/                  # Charts, exports, Power BI templates
├── .gitignore
├── README.md
└── requirements.txt
\`\`\`

> **Crucial Rule:** The \`data/raw/\` folder must be considered immutable. Never edit raw API responses in place. All transformations should produce fresh output in \`data/processed/\`.`,
        },
        {
          type: 'exercise',
          titleKey: 'Terminal Execution Task',
          contentKey: `1. Open your terminal in the \`german-mobility-analytics\` directory.
2. Create and activate a virtual environment:
   \`\`\`bash
   python -m venv .venv
   # Windows PowerShell:
   .venv\\Scripts\\Activate.ps1
   \`\`\`
3. Create \`requirements.txt\` with core analytical packages:
   \`\`\`text
   requests>=2.31.0
   pandas>=2.2.0
   numpy>=1.26.0
   matplotlib>=3.8.0
   seaborn>=0.13.0
   scikit-learn>=1.4.0
   \`\`\`
4. Install requirements: \`pip install -r requirements.txt\`.
5. Initialize git and write a solid \`.gitignore\` ignoring \`.venv/\`, \`__pycache__/\`, and large \`data/raw/*.json\` files if desired.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference .gitignore',
          contentKey: `\`\`\`gitignore
# Environments
.venv/
env/
venv/
*.pyc
__pycache__/

# OS & Editor
.DS_Store
Thumbs.db
.vscode/
.idea/

# Large data files (keep schema, gitignore large raw dumps)
data/raw/*.json
data/processed/*.parquet
data/database/*.db
\`\`\``,
          language: 'bash',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Created Python virtual environment and verified `python --version`',
            'Installed `requests`, `pandas`, `matplotlib`, `seaborn`, and `scikit-learn`',
            'Structured project directories according to industry standard',
            'Committed initial project layout to local Git',
          ],
        },
      ],
    },
  ],
};
