import type { MiniChallenge } from '@/types';

export const allChallenges: MiniChallenge[] = [
  {
    id: 'ch_py_01',
    titleKey: 'Find 5 Cities with Highest Delay Variance',
    descriptionKey: 'Using Pandas on your master transit dataset, group by `city_slug`, calculate the standard deviation of `delay_min`, and return the top 5 cities with at least 20 observations.',
    phaseId: 3,
    difficulty: 'intermediate',
    tool: 'python',
    expectedOutputKey: 'A Pandas DataFrame with columns `city_slug`, `count`, and `delay_std` sorted in descending order of `delay_std`.',
    hintsKeys: [
      'Use `df.groupby("city_slug")["delay_min"].agg(["count", "std"])`',
      'Filter with `.query("count >= 20")`',
      'Sort by `std` descending: `.sort_values("std", ascending=False).head(5)`'
    ],
    solutionKey: `import pandas as pd

df = pd.read_parquet("data/processed/master_transit_weather.parquet")
top_variance = (
    df.groupby("city_slug")["delay_min"]
    .agg(count="count", delay_std="std")
    .query("count >= 20")
    .sort_values("delay_std", ascending=False)
    .head(5)
    .round(2)
)
print(top_variance)`
  },
  {
    id: 'ch_sql_01',
    titleKey: 'Window Function: Dense Rank Transport Lines',
    descriptionKey: 'Write an SQL query on `fact_transit_departures` that calculates average delay per line in Stuttgart and Frankfurt, ranking each line within its city using `DENSE_RANK()`. Only consider lines with at least 10 departures.',
    phaseId: 5,
    difficulty: 'intermediate',
    tool: 'sql',
    expectedOutputKey: 'Table with columns `city_slug`, `line_name`, `avg_delay`, `trip_count`, `rank` where rank resets to 1 for each city.',
    hintsKeys: [
      'Use a CTE to calculate the averages first with `GROUP BY city_slug, line_name` and `HAVING count(*) >= 10`',
      'In the outer query, use `DENSE_RANK() OVER (PARTITION BY city_slug ORDER BY avg_delay DESC)`'
    ],
    solutionKey: `WITH LineAverages AS (
    SELECT
        city_slug,
        line_name,
        ROUND(AVG(delay_min), 2) AS avg_delay,
        COUNT(*) AS trip_count
    FROM fact_transit_departures
    WHERE city_slug IN ('stuttgart', 'frankfurt-am-main')
    GROUP BY city_slug, line_name
    HAVING COUNT(*) >= 10
)
SELECT
    city_slug,
    line_name,
    avg_delay,
    trip_count,
    DENSE_RANK() OVER (PARTITION BY city_slug ORDER BY avg_delay DESC) AS line_rank
FROM LineAverages
ORDER BY city_slug, line_rank;`
  },
  {
    id: 'ch_py_02',
    titleKey: 'Detect Duplicate Departures Across Overlapping Polling Windows',
    descriptionKey: 'Write a Python function that accepts a raw DataFrame and identifies all duplicate departure events that were captured across adjacent 15-minute polling snapshots.',
    phaseId: 3,
    difficulty: 'beginner',
    tool: 'python',
    expectedOutputKey: 'Integer count of duplicate records and the deduplicated DataFrame.',
    hintsKeys: [
      'Identify the composite key: `["city_slug", "line", "direction", "collected_at"]`',
      'Use `df.duplicated(subset=..., keep="first").sum()`'
    ],
    solutionKey: `import pandas as pd

def deduplicate_transit(df):
    subset_keys = ["city_slug", "line", "direction", "collected_at"]
    duplicates_count = df.duplicated(subset=subset_keys).sum()
    print(f"Detected {duplicates_count} duplicate snapshot rows.")
    clean_df = df.drop_duplicates(subset=subset_keys, keep="first")
    return clean_df`
  },
  {
    id: 'ch_excel_01',
    titleKey: 'Dynamic Multi-Condition Delay Lookup',
    descriptionKey: 'In Excel, construct an `=AVERAGEIFS()` formula that returns the average delay for transit lines in Munich that have the word "S" in their line name and were recorded during rain.',
    phaseId: 6,
    difficulty: 'intermediate',
    tool: 'excel',
    expectedOutputKey: 'A single Excel formula referencing structured table columns `TransitData[delay_min]`, `TransitData[city_slug]`, `TransitData[line]`, and `TransitData[condition]`.',
    hintsKeys: [
      'Wildcards like `"S*"` work in `AVERAGEIFS` criterion arguments',
      'Syntax: `=AVERAGEIFS(avg_range, criteria_range1, criteria1, criteria_range2, criteria2...)`'
    ],
    solutionKey: `=AVERAGEIFS(TransitData[delay_min], TransitData[city_slug], "muenchen", TransitData[line], "S*", TransitData[condition], "rain")`
  },
  {
    id: 'ch_bi_01',
    titleKey: 'DAX: Punctuality Rate by Weather Condition',
    descriptionKey: 'Write a DAX measure `[Punctuality (Rain)]` that computes the on-time percentage (delay <= 180s) strictly for departures where the weather condition is "rain".',
    phaseId: 7,
    difficulty: 'intermediate',
    tool: 'powerbi',
    expectedOutputKey: 'DAX measure using `CALCULATE` and `DIVIDE`.',
    hintsKeys: [
      'Use `CALCULATE([Punctuality Rate], FactTransit[condition] = "rain")`',
      'Ensure safe division if there are no rainy observations'
    ],
    solutionKey: `Punctuality (Rain) = 
CALCULATE(
    DIVIDE(
        CALCULATE(COUNTROWS('FactTransit'), 'FactTransit'[delay_s] <= 180),
        COUNTROWS('FactTransit'),
        0
    ),
    'FactTransit'[condition] = "rain"
)`
  },
  {
    id: 'ch_ml_01',
    titleKey: 'Spot the Data Leakage Bug',
    descriptionKey: 'Review this Python snippet. Explain exactly why this feature engineering causes target leakage and how to fix it:\n\n```python\n# Calculating line average delay\ndf["line_avg_delay"] = df.groupby("line")["delay_min"].transform("mean")\nX_train, X_test, y_train, y_test = train_test_split(df.drop("delay_min", axis=1), df["delay_min"])\n```',
    phaseId: 8,
    difficulty: 'advanced',
    tool: 'general',
    expectedOutputKey: 'Detailed diagnosis explaining that test set future delays leaked into the training set via `.transform("mean")` prior to the split, and the proper split-then-map solution.',
    hintsKeys: [
      'Look at the order of operations: grouping is performed across the ENTIRE dataset before splitting',
      'The test set labels contaminated the feature calculation'
    ],
    solutionKey: `DIAGNOSIS:
Computing \`df.groupby("line")["delay_min"].transform("mean")\` across the entire dataset before splitting incorporates future test set delays into the training features. This is TARGET LEAKAGE.

CORRECT IMPLEMENTATION:
1. Split chronologically first:
   split_idx = int(len(df) * 0.8)
   train, test = df.iloc[:split_idx].copy(), df.iloc[split_idx:].copy()

2. Compute historical averages ONLY on training data:
   line_means = train.groupby("line")["delay_min"].mean()

3. Map the training means onto both train and test:
   train["line_avg_delay"] = train["line"].map(line_means)
   test["line_avg_delay"] = test["line"].map(line_means).fillna(train["delay_min"].mean())`
  }
];
