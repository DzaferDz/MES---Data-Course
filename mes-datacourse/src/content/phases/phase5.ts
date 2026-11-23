import type { Phase } from '@/types';

export const phase5: Phase = {
  id: 5,
  titleKey: 'phases.phase5.title',
  descriptionKey: 'phases.phase5.description',
  icon: 'Database',
  color: 'amber',
  lessons: [
    {
      id: '5.1',
      phaseId: 5,
      titleKey: '5.1 Relational Schema Design: Star Schema & Normalization',
      estimatedMinutes: 45,
      deliverable: 'DDL schema script `src/sql/schema.sql` defining dimensional model.',
      objectives: [
        'Understand Dimensional Modeling (Fact tables vs. Dimension tables).',
        'Design `dim_city`, `dim_line`, `fact_transit_departures`, and `fact_weather_observations`.',
        'Define primary keys, foreign keys, constraints, and indexes for fast analytical query execution.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'From Flat DataFrames to Dimensional Models',
          contentKey: `While Pandas stores everything in a single wide DataFrame in RAM, enterprise data warehouses (Snowflake, BigQuery, PostgreSQL) organize data into **Star Schemas**:

### The Mobility Star Schema:
1. **\`dim_city\`**: City metadata (city_slug, name_de, state, population, lat, lon).
2. **\`dim_line\`**: Transit route catalog (line_id, city_slug, line_name, transit_type).
3. **\`fact_transit_departures\`**: High-volume telemetry (id, city_slug, line_name, departure_time, delay_s, delay_min, is_rush_hour).
4. **\`fact_weather_observations\`**: Environmental facts (id, city_slug, observation_time, temperature_c, humidity, wind_speed, condition).

This structure avoids redundant string storage, speeds up joins, and matches what corporate BI tools expect!`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Write Schema DDL',
          contentKey: `Create \`src/sql/schema.sql\`:
- Write \`CREATE TABLE\` statements for SQLite/PostgreSQL.
- Specify column data types: \`INTEGER\`, \`REAL\`, \`TEXT\`, \`DATETIME\`.
- Add foreign key constraints between fact tables and \`dim_city\`.
- Create performance indexes on \`(city_slug, departure_time)\` and \`(line_name)\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference DDL Implementation',
          contentKey: `\`\`\`sql
-- Dimensional Table: Cities
CREATE TABLE IF NOT EXISTS dim_city (
    city_slug TEXT PRIMARY KEY,
    name_de TEXT NOT NULL,
    state TEXT NOT NULL,
    population INTEGER,
    lat REAL,
    lon REAL
);

-- Fact Table: Transit Departures
CREATE TABLE IF NOT EXISTS fact_transit_departures (
    departure_id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_slug TEXT NOT NULL,
    line_name TEXT NOT NULL,
    direction TEXT,
    delay_s INTEGER NOT NULL,
    delay_min REAL NOT NULL,
    departure_time DATETIME NOT NULL,
    is_rush_hour INTEGER DEFAULT 0,
    FOREIGN KEY (city_slug) REFERENCES dim_city(city_slug)
);

-- Fact Table: Weather Observations
CREATE TABLE IF NOT EXISTS fact_weather_observations (
    weather_id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_slug TEXT NOT NULL,
    observation_time DATETIME NOT NULL,
    temperature_c REAL,
    humidity REAL,
    wind_speed REAL,
    condition TEXT,
    FOREIGN KEY (city_slug) REFERENCES dim_city(city_slug)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_transit_city_time ON fact_transit_departures(city_slug, departure_time);
CREATE INDEX IF NOT EXISTS idx_transit_line ON fact_transit_departures(line_name);
CREATE INDEX IF NOT EXISTS idx_weather_city_time ON fact_weather_observations(city_slug, observation_time);
\`\`\``,
          language: 'sql',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Created normalized star schema DDL in `src/sql/schema.sql`',
            'Configured Foreign Keys linking facts to dimensions',
            'Created performance composite indexes on query filter columns',
          ],
        },
      ],
    },
    {
      id: '5.2',
      phaseId: 5,
      titleKey: '5.2 SQLite Database Setup & Automated ETL Loading',
      estimatedMinutes: 40,
      deliverable: 'Automated ETL loader script `src/transformers/load_to_sqlite.py`.',
      objectives: [
        'Initialize a local SQLite relational database `data/database/mobility.db`.',
        'Load clean Pandas DataFrames into SQL tables using `df.to_sql(..., if_exists="append")`.',
        'Verify row counts and relational integrity using Python `sqlite3`.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Bridging Python and SQL Storage',
          contentKey: `SQLite is a serverless, zero-configuration SQL engine embedded directly in Python's standard library. It is widely used for embedded analytics, local testing, and data engineering pipelines.

Using \`df.to_sql()\`, we can push thousands of cleaned records into indexed database tables in fractions of a second.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Build SQLite Database Loader',
          contentKey: `Write \`src/transformers/load_to_sqlite.py\`:
1. Connect to \`data/database/mobility.db\`.
2. Execute \`src/sql/schema.sql\` to initialize tables.
3. Fetch city metadata from \`https://infranode.dev/api/v1/cities\` and insert into \`dim_city\`.
4. Load cleaned transit and weather datasets into \`fact_transit_departures\` and \`fact_weather_observations\`.
5. Run a test SQL query verifying total rows in each table.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import sqlite3
import pandas as pd
import requests
import os

DB_PATH = os.path.join("data", "database", "mobility.db")
SCHEMA_PATH = os.path.join("src", "sql", "schema.sql")

os.makedirs("data/database", exist_ok=True)
conn = sqlite3.connect(DB_PATH)

# 1. Execute Schema
with open(SCHEMA_PATH, "r") as f:
    conn.executescript(f.read())
print("Database schema successfully verified.")

# 2. Populate dim_city
cities_res = requests.get("https://infranode.dev/api/v1/cities").json().get("data", [])
dim_city_rows = []
for c in cities_res:
    dim_city_rows.append({
        "city_slug": c["slug"],
        "name_de": c["name_de"],
        "state": c["state"],
        "population": c["population"],
        "lat": c["geo"]["lat"] if c.get("geo") else None,
        "lon": c["geo"]["lon"] if c.get("geo") else None
    })
df_cities = pd.DataFrame(dim_city_rows)
df_cities.to_sql("dim_city", conn, if_exists="replace", index=False)
print(f"Populated dim_city: {len(df_cities)} records.")

# 3. Populate facts if clean data exists
transit_path = "data/processed/clean_transit.parquet"
if os.path.exists(transit_path):
    df_t = pd.read_parquet(transit_path)
    df_t_sql = df_t[["city_slug", "line", "direction", "delay_s", "delay_min", "collected_at"]].copy()
    df_t_sql.rename(columns={"line": "line_name", "collected_at": "departure_time"}, inplace=True)
    df_t_sql.to_sql("fact_transit_departures", conn, if_exists="append", index=False)
    print(f"Loaded {len(df_t_sql)} rows into fact_transit_departures.")

conn.close()
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Initialized `mobility.db` with relational schema',
            'Loaded `dim_city` dimension from live API catalog',
            'Successfully inserted transit departure facts into SQLite',
          ],
        },
      ],
    },
    {
      id: '5.3',
      phaseId: 5,
      titleKey: '5.3 Advanced Analytical SQL: Window Functions, CTEs & Ranking',
      estimatedMinutes: 55,
      deliverable: 'Analytical SQL script collection `src/sql/analytical_queries.sql`.',
      objectives: [
        'Master Common Table Expressions (CTEs) for modular query organization.',
        'Use Window Functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`) to identify top delayed lines per city.',
        'Apply `LAG()` and `LEAD()` to examine delay progression across consecutive departures.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Why Window Functions are Crucial for Data Analysts',
          contentKey: `Unlike basic \`GROUP BY\` which collapses rows into a single summary, **Window Functions** compute aggregations while preserving individual row details!

Syntax:
\`\`\`sql
SELECT
    city_slug,
    line_name,
    delay_min,
    AVG(delay_min) OVER (PARTITION BY city_slug) AS city_avg_delay,
    RANK() OVER (PARTITION BY city_slug ORDER BY delay_min DESC) AS delay_rank
FROM fact_transit_departures;
\`\`\`

Here, \`PARTITION BY city_slug\` computes the rank **within each city independently**.
This is a standard question in senior technical interviews!`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Write Analytical Queries',
          contentKey: `In \`src/sql/analytical_queries.sql\`, write queries answering:
1. **Query 1:** Top 3 most delayed transit lines in each city using CTE and \`DENSE_RANK()\`.
2. **Query 2:** Join \`fact_transit_departures\` with \`dim_city\` to show average delay by German Bundesland (Federal State).
3. **Query 3:** Moving Average: Calculate a 3-departure rolling average delay for line S3 in Stuttgart using:
   \`AVG(delay_min) OVER (ORDER BY departure_time ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference SQL Solutions',
          contentKey: `\`\`\`sql
-- 1. Top 3 Most Delayed Lines Per City using CTE + DENSE_RANK()
WITH LineAggregates AS (
    SELECT
        city_slug,
        line_name,
        COUNT(*) AS total_departures,
        ROUND(AVG(delay_min), 2) AS avg_delay_min,
        ROUND(MAX(delay_min), 2) AS max_delay_min
    FROM fact_transit_departures
    GROUP BY city_slug, line_name
    HAVING COUNT(*) >= 5  -- Filter out lines with minimal sample size
),
RankedLines AS (
    SELECT
        city_slug,
        line_name,
        avg_delay_min,
        total_departures,
        DENSE_RANK() OVER (PARTITION BY city_slug ORDER BY avg_delay_min DESC) as delay_rank
    FROM LineAggregates
)
SELECT * FROM RankedLines WHERE delay_rank <= 3;


-- 2. State-Level Performance (Relational JOIN)
SELECT
    c.state,
    COUNT(t.departure_id) AS total_observations,
    ROUND(AVG(t.delay_min), 2) AS state_avg_delay_min,
    ROUND(100.0 * SUM(CASE WHEN t.delay_s <= 180 THEN 1 ELSE 0 END) / COUNT(*), 1) AS state_punctuality_pct
FROM fact_transit_departures t
JOIN dim_city c ON t.city_slug = c.city_slug
GROUP BY c.state
ORDER BY state_punctuality_pct DESC;


-- 3. Rolling Moving Average Delay for Stuttgart S-Bahn
SELECT
    departure_time,
    line_name,
    delay_min,
    ROUND(AVG(delay_min) OVER (
        PARTITION BY line_name
        ORDER BY departure_time
        ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
    ), 2) AS rolling_5_avg_delay
FROM fact_transit_departures
WHERE city_slug = 'stuttgart' AND line_name = 'S3'
ORDER BY departure_time;
\`\`\``,
          language: 'sql',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Wrote CTE with `DENSE_RANK() OVER (PARTITION BY city_slug...)`',
            'Implemented state-level join using `CASE WHEN` punctuality logic',
            'Calculated rolling moving average delay with window framing clauses',
          ],
        },
      ],
    },
  ],
};
