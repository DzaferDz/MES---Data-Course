import type { Phase } from '@/types';

export const phase6: Phase = {
  id: 6,
  titleKey: 'phases.phase6.title',
  descriptionKey: 'phases.phase6.description',
  icon: 'FileSpreadsheet',
  color: 'emerald',
  lessons: [
    {
      id: '6.1',
      phaseId: 6,
      titleKey: '6.1 Modern Excel Tables & Dynamic Data Ingestion',
      estimatedMinutes: 40,
      deliverable: 'Clean structured workbook `reports/German_Mobility_Analytics.xlsx`.',
      objectives: [
        'Import CSV/Parquet exports into Excel without character encoding or timestamp corruption.',
        'Convert raw ranges to dynamic Excel Tables (`Ctrl + T`) using structured references.',
        'Audit data hygiene, column headers, and data formats in a corporate workbook.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Why Modern Data Analysts Use Structured Tables',
          contentKey: `In corporate business intelligence, Excel is used to present insights directly to department heads and directors.
Amateur analysts use unstructured ranges (\`A2:E500\`). If new rows are pasted, their formulas fail to expand.

### Structured Reference Benefits:
When you convert a range to an official Excel Table (\`Ctrl + T\` or \`Cmd + T\`), Excel gives it a name: e.g. \`TransitData\`.
Formulas become readable and automatically expand:
\`\`\`excel
=AVERAGE(TransitData[delay_min])
=COUNTIFS(TransitData[city_slug], "frankfurt-am-main", TransitData[delay_s], "<=180")
\`\`\`
This eliminates broken formula references when refreshing data.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Set Up Workbook',
          contentKey: `1. Open Excel and import \`data/processed/city_benchmark.csv\` or export from SQLite.
2. Format as Table (\`Ctrl + T\`), named \`TransitData\`.
3. Set proper formatting:
   - \`delay_min\` formatted as Number with 1 decimal place.
   - Punctuality columns formatted as Percentage (\`0.0%\`).
   - Population formatted with thousand separators.`,
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Imported benchmark dataset into Excel',
            'Converted range to Table named `TransitData`',
            'Verified all numeric and percentage formats',
          ],
        },
      ],
    },
    {
      id: '6.2',
      phaseId: 6,
      titleKey: '6.2 Advanced Analytical Formulas: XLOOKUP, SUMIFS & Logic',
      estimatedMinutes: 45,
      deliverable: 'Executive summary worksheet using dynamic formulas.',
      objectives: [
        'Replace legacy `VLOOKUP` with resilient, modern `XLOOKUP`.',
        'Calculate multi-condition metrics using `COUNTIFS` and `AVERAGEIFS`.',
        'Handle missing values gracefully with `=IFNA()` and structured error traps.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Power of XLOOKUP over VLOOKUP',
          contentKey: `Why did Microsoft introduce \`XLOOKUP\`?
- \`VLOOKUP\` breaks if a column is inserted or reordered.
- \`VLOOKUP\` defaults to approximate match (a major risk for financial/operational data).
- \`VLOOKUP\` cannot look to the left.

Syntax:
\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
\`\`\`

Example:
\`\`\`excel
=XLOOKUP("frankfurt-am-main", DimCities[city_slug], DimCities[population], "Unknown")
\`\`\``,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Formula Building',
          contentKey: `In your \`German_Mobility_Analytics.xlsx\` workbook:
1. Create a tab \`Executive_KPIs\`.
2. Use \`XLOOKUP\` to bring population from \`dim_city\` into the main table.
3. Calculate:
   - Average delay for cities with population > 1,000,000 using \`AVERAGEIFS\`.
   - Total number of severe delays across the entire dataset using \`COUNTIF\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Formulas',
          contentKey: `\`\`\`excel
-- Population Lookup:
=XLOOKUP([@[city_slug]], DimCities[city_slug], DimCities[population], 0)

-- Metropolis Average Delay:
=AVERAGEIFS(TransitData[delay_min], TransitData[population], ">1000000")

-- Punctuality Rate:
=COUNTIFS(TransitData[delay_s], "<=180") / COUNT(TransitData[delay_s])
\`\`\``,
          language: 'excel',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Built functional `XLOOKUP` formulas referencing dimensional tables',
            'Calculated multi-criteria aggregates with `AVERAGEIFS` and `COUNTIFS`',
            'Constructed corporate KPI block on `Executive_KPIs` worksheet',
          ],
        },
      ],
    },
    {
      id: '6.3',
      phaseId: 6,
      titleKey: '6.3 Multi-Dimensional PivotTables, Slicers & Interactive Dashboard',
      estimatedMinutes: 50,
      deliverable: 'Complete interactive Excel analytical dashboard with PivotCharts and Slicers.',
      objectives: [
        'Construct multi-dimensional PivotTables slicing delays by City, Line, and Time of Day.',
        'Insert timeline Slicers connected across multiple PivotTables simultaneously.',
        'Design a polished executive visual layout adhering to professional styling standards.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Executive Dashboard Architecture in Excel',
          contentKey: `A professional Excel dashboard does NOT show raw tables.
It consists of:
1. **Top KPI Cards:** Overall Punctuality, Median Delay, Total Trips Observed.
2. **Interactive Slicers:** Filter by Federal State, City, or Rush Hour.
3. **PivotChart 1:** City Reliability Comparison Bar Chart (sorted descending).
4. **PivotChart 2:** Delay Trends by Hour of the Day (06:00 to 22:00).`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Build Interactive Dashboard',
          contentKey: `1. Insert a PivotTable on a new sheet \`Dashboard\`.
2. Rows: \`city_slug\`. Values: \`Average of delay_min\` and \`Count of departure_id\`.
3. Add a second PivotTable: Rows: \`hour\`. Values: \`Average of delay_min\`.
4. Insert Slicers for \`state\` and \`is_rush_hour\`.
5. Connect both Slicers to **both** PivotTables via \`Report Connections\`.
6. Add clean bar charts, remove gridline clutter, and format with dark navy accents.`,
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Built multi-dimensional PivotTables from structured data',
            'Connected universal Slicers across all dashboard PivotViews',
            'Designed clean, uncluttered visual dashboard ready for executive review',
          ],
        },
      ],
    },
  ],
};
