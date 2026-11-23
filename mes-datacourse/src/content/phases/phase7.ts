import type { Phase } from '@/types';

export const phase7: Phase = {
  id: 7,
  titleKey: 'phases.phase7.title',
  descriptionKey: 'phases.phase7.description',
  icon: 'PieChart',
  color: 'indigo',
  lessons: [
    {
      id: '7.1',
      phaseId: 7,
      titleKey: '7.1 Power Query ETL & Star Schema Relationship Modeling',
      estimatedMinutes: 45,
      deliverable: 'Power BI data model `.pbix` with clean Star Schema relationships.',
      objectives: [
        'Import Parquet/CSV or SQLite data into Power BI Desktop via Power Query.',
        'Clean, rename, and verify column types using Power Query M transformations.',
        'Model 1-to-Many single-directional relationships between Dimension and Fact tables.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Power BI Data Engine: Tabular & VertiPaq',
          contentKey: `Power BI is powered by the VertiPaq in-memory columnar database engine.
To achieve sub-second visual rendering, you must respect the Star Schema:
- **Dimension Tables:** \`DimCity\` (Unique city list).
- **Fact Tables:** \`FactTransit\` (Departure records).

### Relationship Golden Rules:
1. Relationships must connect Primary Key in Dimension (1) to Foreign Key in Fact (*).
2. Cardinality: **1 to Many (1:*)**.
3. Cross-filter direction: **Single** (Dimension filters Fact, never bidirectional unless strictly required).`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Set Up Data Model',
          contentKey: `In Power BI Desktop:
1. Get Data -> Text/CSV or Folder -> Load \`city_benchmark.csv\` and \`master_transit_weather.parquet\`.
2. In Power Query:
   - Ensure \`collected_at\` is typed as \`Date/Time/Timezone\`.
   - Ensure \`delay_s\` is typed as \`Whole Number\`.
3. Switch to the **Model View**:
   - Drag \`city_slug\` from \`DimCity\` to \`FactTransit\`.
   - Confirm \`1:*\` relationship.`,
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Configured Power Query imports with explicit data typing',
            'Structured Model View into clean Star Schema layout',
            'Confirmed 1:* single-directional relationship',
          ],
        },
      ],
    },
    {
      id: '7.2',
      phaseId: 7,
      titleKey: '7.2 DAX Mastery: Measures, CALCULATE & Filter Context',
      estimatedMinutes: 55,
      deliverable: 'Key measures table `_Measures` with production DAX formulas.',
      objectives: [
        'Understand the critical difference between Calculated Columns and DAX Measures.',
        'Master `CALCULATE()` to alter and override visual filter contexts.',
        'Write production DAX measures for Total Departures, Average Delay, and Punctuality %.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Measures vs Calculated Columns & Filter Context',
          contentKey: `A Calculated Column is evaluated row-by-row during data refresh and consumes RAM.
A **DAX Measure** is calculated dynamically on-the-fly depending on what the user clicks in slicers and charts!

### The King of DAX: \`CALCULATE\`
\`\`\`dax
CALCULATE(<expression>, <filter1>, <filter2>...)
\`\`\`
\`CALCULATE\` evaluates an expression under modified filter context.

For example, to calculate total on-time departures:
\`\`\`dax
OnTimeDepartures = 
CALCULATE(
    COUNTROWS(FactTransit),
    FactTransit[delay_s] <= 180
)
\`\`\``,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Author Core DAX Measures',
          contentKey: `In Power BI:
1. Create a dedicated measures table: Home -> Enter Data -> Name it \`_Measures\`.
2. Author:
   - \`[Total Departures]\`: Count of all trips.
   - \`[Average Delay Min]\`: Average delay in minutes.
   - \`[Punctuality Rate]\`: Percentage with \`delay_s <= 180\`.
   - \`[Severe Delay Rate]\`: Percentage with \`delay_s >= 900\`.
   - \`[Rush Hour Punctuality]\`: Punctuality strictly during rush hour.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference DAX Formulas',
          contentKey: `\`\`\`dax
Total Departures = COUNTROWS('FactTransit')

Average Delay Min = AVERAGE('FactTransit'[delay_min])

Punctuality Rate = 
DIVIDE(
    CALCULATE(COUNTROWS('FactTransit'), 'FactTransit'[delay_s] <= 180),
    [Total Departures],
    0
)

Severe Delay Rate = 
DIVIDE(
    CALCULATE(COUNTROWS('FactTransit'), 'FactTransit'[delay_s] >= 900),
    [Total Departures],
    0
)

Rush Hour Punctuality = 
CALCULATE(
    [Punctuality Rate],
    'FactTransit'[is_rush_hour] = TRUE()
)
\`\`\``,
          language: 'dax',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Created dedicated `_Measures` table',
            'Implemented safe division with `DIVIDE(..., 0)`',
            'Authored context-modified measures using `CALCULATE`',
          ],
        },
      ],
    },
    {
      id: '7.3',
      phaseId: 7,
      titleKey: '7.3 Building the Interactive Portfolio Dashboard',
      estimatedMinutes: 60,
      deliverable: 'Multi-page Power BI portfolio report `.pbix` ready for job interviews.',
      objectives: [
        'Design a 3-page interactive dashboard: Executive Overview, City Deep-Dive, Line Reliability.',
        'Implement drill-through navigation from city summary to individual line performance.',
        'Apply color theory, typography hierarchy, and accessible data storytelling.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Dashboard Layout & Data Storytelling',
          contentKey: `A hiring manager spends under 60 seconds reviewing a portfolio dashboard.
Your dashboard must immediately convey clarity:

### The 3 Core Views:
1. **Executive Overview:**
   - Top KPI cards: System Punctuality, Average Delay, Observation Count.
   - Map Visual: German cities colored by punctuality score.
   - Delay trend by hour of day.
2. **City Benchmark Deep Dive:**
   - Matrix comparing Frankfurt, Stuttgart, Hamburg, Ruhrgebiet.
   - Weather condition impact slicers.
3. **Line Fragility Drill-Through:**
   - Right-click any city -> Drill-through to see individual S-Bahn / U-Bahn lines ranked from best to worst.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Build & Style Dashboard',
          contentKey: `In Power BI Desktop:
1. Build Page 1: \`Overview\`. Add KPI Cards, Clustered Bar Chart for cities, Area Chart for hourly delay progression.
2. Build Page 2: \`Weather & Transit\`. Scatter plot comparing temperature vs. average delay, segmented by weather condition.
3. Configure Drill-Through on \`city_slug\`.
4. Export high-resolution screenshots to \`reports/dashboard_overview.png\`.`,
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Constructed Executive Overview with KPI cards and city rankings',
            'Configured drill-through navigation across pages',
            'Exported screenshots for inclusion in final portfolio README',
          ],
        },
      ],
    },
  ],
};
