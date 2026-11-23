import type { Phase } from '@/types';

export const phase4: Phase = {
  id: 4,
  titleKey: 'phases.phase4.title',
  descriptionKey: 'phases.phase4.description',
  icon: 'BarChart2',
  color: 'violet',
  lessons: [
    {
      id: '4.1',
      phaseId: 4,
      titleKey: '4.1 Statistical Distributions of Transit Delays: The Right-Skew Reality',
      estimatedMinutes: 45,
      deliverable: 'Jupyter notebook `notebooks/01_eda_distributions.ipynb` with statistical analysis.',
      objectives: [
        'Understand why transit delay distributions are heavily right-skewed and non-normal.',
        'Calculate and contrast mean, median, IQR (Interquartile Range), and standard deviation.',
        'Interpret percentiles (p50, p90, p95, p99) for SLA (Service Level Agreement) reporting.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Why Mean Delay is a Misleading Metric',
          contentKey: `In transit analytics, **mean delay is fundamentally misleading**.
Most trains arrive within 0 to 2 minutes of schedule. However, a small number of severe incidents cause delays of 30, 45, or 60 minutes.

Because the mean is sensitive to extreme values, a single 60-minute delay pulls up the average of twenty on-time trains significantly!

### Key Industry Metrics:
- **Median Delay (p50):** The true typical passenger experience.
- **90th Percentile (p90):** The delay experienced in the worst 10% of journeys.
- **On-Time Rate (Punctuality):** Percentage of departures with \`delay_s <= 180\` (under 3 minutes) or \`delay_s <= 360\` (under 6 minutes, standard DB definition).`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Calculate Quantiles and Skewness',
          contentKey: `Using \`master_transit_weather.parquet\`:
1. Calculate overall mean, median, standard deviation, and skewness of \`delay_min\`.
2. Compute the 50th, 75th, 90th, 95th, and 99th percentiles of \`delay_min\`.
3. Calculate the official punctuality rate (\`% delay_s <= 360\`).
4. Generate a histogram with a vertical line marking the median vs. mean.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_parquet("data/processed/master_transit_weather.parquet")

delays = df["delay_min"]
mean_val = delays.mean()
median_val = delays.median()
std_val = delays.std()
skew_val = delays.skew()

p50, p75, p90, p95, p99 = np.percentile(delays.dropna(), [50, 75, 90, 95, 99])
punctuality_6min = (df["delay_s"] <= 360).mean() * 100

print(f"Mean Delay:        {mean_val:.2f} min")
print(f"Median Delay:      {median_val:.2f} min")
print(f"Std Deviation:     {std_val:.2f} min")
print(f"Distribution Skew: {skew_val:.2f} (Positive = Right-Skewed)")
print("-" * 35)
print(f"P50: {p50:.1f}m | P75: {p75:.1f}m | P90: {p90:.1f}m | P95: {p95:.1f}m | P99: {p99:.1f}m")
print(f"Official Punctuality (<= 6m): {punctuality_6min:.1f}%")
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Computed mean vs. median and verified right-skewness',
            'Calculated 90th and 95th percentiles for SLA insights',
            'Determined the overall system punctuality percentage',
          ],
        },
      ],
    },
    {
      id: '4.2',
      phaseId: 4,
      titleKey: '4.2 Cross-City Reliability Benchmarking',
      estimatedMinutes: 50,
      deliverable: 'City benchmark ranking report and visualization `reports/city_reliability_ranking.png`.',
      objectives: [
        'Compare public transport reliability across German metropolitan regions.',
        'Normalize comparisons by observation volume to avoid sample size bias.',
        'Calculate city-level punctuality scores, average delays, and failure rates.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Normalizing City Comparisons',
          contentKey: `Directly comparing raw delay counts across cities creates serious analytical distortion. Frankfurt Hauptbahnhof handles vastly different vehicle volumes compared to Essen or Dortmund.

### Fair Comparison Metrics:
1. **Punctuality %:** \`(on_time_trips / total_trips) * 100\`
2. **Median Delay:** Robust against single outlier incidents.
3. **Severe Delay Rate %:** \`(trips_with_delay_over_15min / total_trips) * 100\`
4. **Observation Support:** Documenting the \`N\` count for each city to avoid making strong claims on small samples.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: City Ranking Table',
          contentKey: `Write \`src/transformers/04_city_benchmarks.py\`:
1. Group by \`city_slug\`.
2. Aggregate:
   - Total observations (\`count\`)
   - Median delay in minutes
   - Mean delay in minutes
   - Punctuality rate (% <= 3 min)
   - Severe delay rate (% >= 15 min)
3. Sort the resulting table by Punctuality descending.
4. Export the ranking to \`data/processed/city_benchmark.csv\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd

df = pd.read_parquet("data/processed/master_transit_weather.parquet")

def punctuality(s):
    return (s <= 180).mean() * 100

def severe_delay(s):
    return (s >= 900).mean() * 100

city_summary = df.groupby("city_slug").agg(
    total_trips=("delay_s", "count"),
    median_delay_min=("delay_min", "median"),
    mean_delay_min=("delay_min", "mean"),
    punctuality_pct=("delay_s", punctuality),
    severe_delay_pct=("delay_s", severe_delay)
).reset_index()

city_summary = city_summary.sort_values("punctuality_pct", ascending=False).round(2)
print("=== GERMAN CITY RELIABILITY RANKING ===")
print(city_summary.to_string(index=False))

city_summary.to_csv("data/processed/city_benchmark.csv", index=False)
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Aggregated city performance using both median and punctuality percentages',
            'Included observation volume (`N`) to ensure statistical transparency',
            'Exported `city_benchmark.csv` for downstream Excel and Power BI modules',
          ],
        },
      ],
    },
    {
      id: '4.3',
      phaseId: 4,
      titleKey: '4.3 Weather vs. Transport Performance: Correlation and Causation',
      estimatedMinutes: 50,
      deliverable: 'Weather impact analysis report and correlation heatmap `reports/weather_transit_correlation.png`.',
      objectives: [
        'Analyze transit delays across weather conditions (`rain`, `snow`, `dry`, `fog`).',
        'Compute Pearson and Spearman rank correlation between `delay_min` and temperature/wind.',
        'Articulate the difference between correlation, confounding variables, and causation.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Analyst\'s Burden: Disentangling Confounders',
          contentKey: `Does rain cause train delays?
If you simply run \`df.groupby("condition")["delay_min"].mean()\`, you might find that rainy periods show a 1.8-minute higher average delay.

**Is rain the cause?**
What if rain disproportionately occurred on Friday at 17:00 (peak rush hour)?
In that scenario, rush hour is a **confounding variable**.
A thorough analyst stratifies their analysis:
\`df.groupby(["is_rush_hour", "condition"])["delay_min"].mean()\`
This controls for time of day before attributing delays to weather!`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Weather Interaction Study',
          contentKey: `In your analysis script:
1. Compare mean and median delays grouped by \`condition\`.
2. Segment by \`is_rush_hour\` and \`condition\` simultaneously.
3. Compute Pearson correlation between \`temperature_c\`, \`wind_speed\`, \`humidity\`, and \`delay_s\`.
4. Plot a Seaborn barplot comparing delays in rain vs. dry conditions during rush hour vs. off-peak.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_parquet("data/processed/master_transit_weather.parquet")

# Stratified comparison
stratified = df.groupby(["is_rush_hour", "condition"])["delay_min"].agg(["count", "mean", "median"]).round(2)
print("Stratified Delay Analysis (Rush Hour vs Weather Condition):")
print(stratified)

# Correlation Matrix
num_cols = ["delay_s", "temperature_c", "humidity", "wind_speed", "hour"]
corr_matrix = df[num_cols].corr()
print("\\nCorrelation Matrix:")
print(corr_matrix.round(3))

# Visualization
plt.figure(figsize=(8, 5))
sns.barplot(data=df, x="condition", y="delay_min", hue="is_rush_hour", ci=None, palette="Blues_d")
plt.title("Transit Delays by Weather Condition (Controlled for Rush Hour)")
plt.ylabel("Average Delay (Minutes)")
plt.xlabel("Weather Condition")
plt.tight_layout()
plt.savefig("reports/weather_transit_impact.png", dpi=300)
print("Saved visualization to reports/weather_transit_impact.png")
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Calculated stratified delay aggregates controlling for rush hour',
            'Evaluated correlation coefficients between weather metrics and delays',
            'Generated clean visualization saved to `reports/`',
          ],
        },
      ],
    },
  ],
};
