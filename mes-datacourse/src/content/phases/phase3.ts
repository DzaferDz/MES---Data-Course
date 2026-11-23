import type { Phase } from '@/types';

export const phase3: Phase = {
  id: 3,
  titleKey: 'phases.phase3.title',
  descriptionKey: 'phases.phase3.description',
  icon: 'Table',
  color: 'blue',
  lessons: [
    {
      id: '3.1',
      phaseId: 3,
      titleKey: '3.1 Ingesting JSON Lines into Pandas DataFrames',
      estimatedMinutes: 40,
      deliverable: 'Data ingestion notebook or script `src/transformers/01_ingest.py`.',
      objectives: [
        'Read multi-line JSON files using `pd.read_json(..., lines=True)`.',
        'Inspect DataFrame memory usage, shape, and column types (`dtypes`).',
        'Understand Pandas Series vs. DataFrame mental models in memory.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'JSON Lines & Efficient Memory Loading',
          contentKey: `JSON Lines (\`.jsonl\`) is the industry standard for append-only streaming logs. Because each line is a valid JSON object, Pandas can parse it line-by-line without loading a giant nested structure:

\`\`\`python
import pandas as pd
df_transit = pd.read_json("data/raw/transit_snapshots.jsonl", lines=True)
df_weather = pd.read_json("data/raw/weather_snapshots.jsonl", lines=True)
\`\`\`

### Fundamental Inspection Commands:
- \`df.info()\`: Shows non-null count and data types.
- \`df.describe()\`: Rapid statistical overview for numerical columns (\`delay_s\`, \`delay_min\`, \`temperature_c\`).
- \`df.head(5)\`: Inspect top rows.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Initial Data Inspection',
          contentKey: `1. Open VS Code and create \`src/transformers/01_ingest.py\` (or a Jupyter notebook).
2. Load \`data/raw/transit_snapshots.jsonl\`.
3. Check:
   - What is the total row count?
   - What is the min and max observed \`delay_s\`?
   - How many distinct \`city_slug\` values are present?
   - Are there null values in the \`line\` or \`direction\` columns?`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import os

transit_path = os.path.join("data", "raw", "transit_snapshots.jsonl")

if not os.path.exists(transit_path):
    print("No data collected yet. Please run Phase 2 collector first!")
else:
    df = pd.read_json(transit_path, lines=True)
    print(f"Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    print("\\nColumn Data Types:")
    print(df.dtypes)
    print("\\nMissing Value Counts:")
    print(df.isnull().sum())
    print("\\nDelays Summary (minutes):")
    print(df["delay_min"].describe())
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Successfully loaded `transit_snapshots.jsonl` via `pd.read_json(..., lines=True)`',
            'Audited missing values using `.isnull().sum()`',
            'Inspected distribution parameters with `.describe()`',
          ],
        },
      ],
    },
    {
      id: '3.2',
      phaseId: 3,
      titleKey: '3.2 Data Cleaning: Types, Deduplication & Sanity Boundaries',
      estimatedMinutes: 50,
      deliverable: 'Cleaned transit dataset module `src/transformers/02_clean_transit.py`.',
      objectives: [
        'Cast ISO timestamp strings to native `pd.Timestamp` with UTC timezone awareness.',
        'Remove identical observations resulting from overlapping polling intervals.',
        'Filter anomalous outliers (e.g. data bugs indicating 24+ hour delays).',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Reality of Duplicate Transit Observations',
          contentKey: `Because we poll departure boards every 15 minutes, a delayed train due in 25 minutes will appear in **both** the 12:00 run and the 12:15 run!

If we simply calculate the average delay without deduplication, that delayed train gets counted twice, biasing our metrics.

### Deduplication Strategy:
We define a unique transit event identity:
A departure is identical if:
\`(city_slug, line, direction, approximate_scheduled_departure)\` match!
Alternatively, we keep only the latest observation closest to departure (\`in_minutes <= 5\`).`,
        },
        {
          type: 'exercise',
          titleKey: 'Cleaning Implementation',
          contentKey: `Write \`src/transformers/02_clean_transit.py\`:
1. Parse \`collected_at\` using \`pd.to_datetime(df['collected_at'])\`.
2. Clean \`line\` string: strip whitespace, uppercase line codes (e.g. \`s3\` -> \`S3\`).
3. Define realistic delay boundaries: discard observations where \`delay_s > 7200\` (over 2 hours) or \`delay_s < -300\` (over 5 minutes early).
4. Save the cleaned DataFrame to \`data/processed/clean_transit.parquet\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import os

raw_file = os.path.join("data", "raw", "transit_snapshots.jsonl")
output_file = os.path.join("data", "processed", "clean_transit.parquet")

df = pd.read_json(raw_file, lines=True)

# 1. Parse Timestamps
df["collected_at"] = pd.to_datetime(df["collected_at"], utc=True)

# 2. Clean Text Fields
df["line"] = df["line"].astype(str).str.strip().str.upper()
df["direction"] = df["direction"].fillna("Unknown").astype(str).str.strip()

# 3. Deduplicate
before_count = len(df)
df = df.drop_duplicates(subset=["city_slug", "line", "direction", "collected_at"])

# 4. Outlier Filtering (Sensible operational bounds: -5 min to +120 min)
df = df[(df["delay_s"] >= -300) & (df["delay_s"] <= 7200)]

os.makedirs("data/processed", exist_ok=True)
df.to_parquet(output_file, index=False)
print(f"Cleaned transit data: {before_count} -> {len(df)} rows. Saved to {output_file}")
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Converted `collected_at` to timezone-aware UTC datetime',
            'Standardized line nomenclature with uppercase strings',
            'Exported cleaned dataset to Apache Parquet format',
          ],
        },
      ],
    },
    {
      id: '3.3',
      phaseId: 3,
      titleKey: '3.3 Feature Engineering: Temporal Flags & Delay Classifications',
      estimatedMinutes: 45,
      deliverable: 'Enriched dataset with `hour`, `day_of_week`, `is_rush_hour`, and `delay_tier`.',
      objectives: [
        'Extract cyclical temporal features from timestamps (`hour`, `day_name`, `is_weekend`).',
        'Create analytical flags: `is_rush_hour` (7-9 AM, 4-6 PM on weekdays).',
        'Create categorical delay bins (`on_time`, `minor_delay`, `severe_delay`).',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Feature Engineering for Transportation',
          contentKey: `Raw data alone cannot answer whether rush hour drives unreliability. We must explicitly construct domain-specific features:

1. **Temporal Features:**
   - \`hour\`: \`df["collected_at"].dt.hour\` (0-23)
   - \`day_of_week\`: \`df["collected_at"].dt.day_name()\`
   - \`is_weekend\`: \`df["collected_at"].dt.weekday >= 5\`
   - \`is_rush_hour\`: Monday–Friday between 07:00–09:00 or 16:00–18:00.

2. **Standard Deutsche Bahn / VDV Punctuality Standards:**
   - \`on_time\`: Delay < 60 seconds.
   - \`slight_delay\`: 60s to 300s (1 to 5 minutes).
   - \`delayed\`: 300s to 900s (5 to 15 minutes).
   - \`severely_delayed\`: > 900s (over 15 minutes).`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Feature Creation',
          contentKey: `Using your cleaned DataFrame:
1. Add columns \`hour\` (int), \`weekday\` (str), and \`is_weekend\` (bool).
2. Add a boolean column \`is_rush_hour\`.
3. Use \`pd.cut()\` to create a categorical column \`delay_category\` with bins: \`[-inf, 60, 300, 900, inf]\` and labels \`["on_time", "minor", "moderate", "severe"]\`.
4. Inspect the percentage of observations in each category using \`value_counts(normalize=True)\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_parquet("data/processed/clean_transit.parquet")

# 1. Temporal decomposition
df["hour"] = df["collected_at"].dt.hour
df["weekday"] = df["collected_at"].dt.day_name()
df["is_weekend"] = df["collected_at"].dt.weekday >= 5

# 2. Rush hour definition (Weekdays 07-09 and 16-18)
is_weekday = ~df["is_weekend"]
morning_rush = (df["hour"] >= 7) & (df["hour"] <= 9)
evening_rush = (df["hour"] >= 16) & (df["hour"] <= 18)
df["is_rush_hour"] = is_weekday & (morning_rush | evening_rush)

# 3. Delay Categorization
bins = [-np.inf, 60, 300, 900, np.inf]
labels = ["on_time", "minor", "moderate", "severe"]
df["delay_category"] = pd.cut(df["delay_s"], bins=bins, labels=labels)

print("Delay Category Distribution:")
print(df["delay_category"].value_counts(normalize=True).round(3) * 100)

df.to_parquet("data/processed/enriched_transit.parquet", index=False)
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Constructed `hour`, `weekday`, and `is_weekend` features',
            'Engineered `is_rush_hour` boolean flag',
            'Binned delay intervals into `delay_category` using `pd.cut()`',
          ],
        },
      ],
    },
    {
      id: '3.4',
      phaseId: 3,
      titleKey: '3.4 Merging Telemetry: Joining Transit & Weather by City and Time',
      estimatedMinutes: 50,
      deliverable: 'Unified master analytics table `data/processed/master_transit_weather.parquet`.',
      objectives: [
        'Understand time-based joins (`pd.merge_asof` vs. rounded timestamp matching).',
        'Join transit departures with corresponding city weather observations.',
        'Validate merged completeness and check for orphan records.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Joining Asynchronous Feeds: Time-Based Merges',
          contentKey: `Weather observations from DWD are recorded at specific station intervals (e.g. 18:00, 18:30, 19:00). Transit departures occur continuously.

If you attempt an exact inner join:
\`\`\`python
# THIS WILL FAIL - timestamps will never match to the millisecond!
df_merged = pd.merge(df_transit, df_weather, on=["city_slug", "collected_at"])
\`\`\`

Instead, professional analysts use one of two techniques:
1. **Timestamp Truncation / Rounding:** Round all timestamps to the nearest 15-minute or 30-minute window (\`dt.round("15min")\`).
2. **As-Of Merge (\`pd.merge_asof\`):** For each transit record, find the closest preceding weather record for that same city!`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Merge Datasets',
          contentKey: `Write \`src/transformers/03_merge_weather.py\`:
1. Load \`data/processed/enriched_transit.parquet\` and \`data/raw/weather_snapshots.jsonl\`.
2. Round \`collected_at\` to the nearest 15 minutes: \`df["time_window"] = df["collected_at"].dt.round("15min")\`.
3. Group weather by \`["city_slug", "time_window"]\` to ensure unique weather keys.
4. Left-join transit with weather on \`["city_slug", "time_window"]\`.
5. Check if any transit records have null weather (fill with sensible defaults or forward-fill).
6. Save the unified dataset to \`data/processed/master_transit_weather.parquet\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import os

transit_file = "data/processed/enriched_transit.parquet"
weather_file = "data/raw/weather_snapshots.jsonl"
output_file = "data/processed/master_transit_weather.parquet"

df_transit = pd.read_parquet(transit_file)
df_weather = pd.read_json(weather_file, lines=True)

df_weather["collected_at"] = pd.to_datetime(df_weather["collected_at"], utc=True)

# Round to nearest 15-minute window
df_transit["time_window"] = df_transit["collected_at"].dt.round("15min")
df_weather["time_window"] = df_weather["collected_at"].dt.round("15min")

# Deduplicate weather on city and window
weather_clean = df_weather.drop_duplicates(subset=["city_slug", "time_window"])
weather_cols = ["city_slug", "time_window", "temperature_c", "humidity", "wind_speed", "condition"]
weather_clean = weather_clean[weather_cols]

# Left join: preserve all transit records
df_master = pd.merge(df_transit, weather_clean, on=["city_slug", "time_window"], how="left")

# Forward fill missing weather per city
df_master = df_master.sort_values(["city_slug", "collected_at"])
df_master["temperature_c"] = df_master.groupby("city_slug")["temperature_c"].ffill().bfill()
df_master["condition"] = df_master.groupby("city_slug")["condition"].ffill().bfill()

print(f"Master dataset successfully created: {df_master.shape[0]} rows.")
df_master.to_parquet(output_file, index=False)
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Aligned asynchronous time streams using 15-minute rounded windows',
            'Executed Left Join to preserve all transit departure observations',
            'Saved unified analytical master dataset to `master_transit_weather.parquet`',
          ],
        },
      ],
    },
  ],
};
