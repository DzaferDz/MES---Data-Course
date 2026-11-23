import type { Phase } from '@/types';

export const phase8: Phase = {
  id: 8,
  titleKey: 'phases.phase8.title',
  descriptionKey: 'phases.phase8.description',
  icon: 'Cpu',
  color: 'rose',
  lessons: [
    {
      id: '8.1',
      phaseId: 8,
      titleKey: '8.1 Framing the Machine Learning Problem: Supervised Regression',
      estimatedMinutes: 45,
      deliverable: 'ML problem formulation document `docs/ML_FORMULATION.md`.',
      objectives: [
        'Formulate delay prediction as a supervised tabular regression problem.',
        'Define input feature vectors ($X$) and continuous prediction target ($y = \\text{delay\\_s}$).',
        'Distinguish between macro historical statistical behavior and unpredictable individual trip events.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Reality of Delay Prediction',
          contentKey: `Can machine learning predict whether your next train will be exactly 4 minutes late?

**Honest Answer:** No individual model can predict a sudden medical emergency, track obstruction, or signal failure.
However, machine learning **can** learn:
- Line S1 in Stuttgart on a rainy Tuesday morning at 08:15 has an expected delay distribution of $4.2 \\pm 1.5$ minutes.
- Line U9 in off-peak dry weather operates at $0.3 \\pm 0.4$ minutes.

We are estimating the **conditional expectation**:
$$\\mathbb{E}[\\text{delay} \\mid \\text{line}, \\text{city}, \\text{time}, \\text{weather}]$$

### Target Definition:
- Continuous target: \`delay_s\` (delay in seconds) or \`delay_min\`.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Problem Formulation',
          contentKey: `Write \`docs/ML_FORMULATION.md\`:
1. Define the modeling objective.
2. List available features ($X$):
   - Categorical: \`city_slug\`, \`line\`, \`condition\`, \`day_of_week\`.
   - Numerical: \`hour\`, \`temperature_c\`, \`humidity\`, \`wind_speed\`.
   - Historical aggregate: \`line_historical_avg_delay\`.
3. Define success metrics: **MAE** (Mean Absolute Error) in minutes.`,
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Articulated supervised regression scope and boundaries',
            'Selected MAE as primary business-interpretable metric',
            'Documented target variable and feature candidate list',
          ],
        },
      ],
    },
    {
      id: '8.2',
      phaseId: 8,
      titleKey: '8.2 Time-Series Validation: Preventing Data Leakage',
      estimatedMinutes: 50,
      deliverable: 'Data preparation and chronological split script `src/models/01_prepare_splits.py`.',
      objectives: [
        'Understand Data Leakage in time-series predictive modeling.',
        'Implement chronological train/test split (training on earlier dates, testing on future dates).',
        'Prevent future data from leaking into feature scaling or target encodings.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Cardinal Sin: Random Train/Test Splitting in Time-Series',
          contentKey: `If you use \`train_test_split(df, shuffle=True)\`, your training set contains data from 12:15, your test set contains data from 12:00, and your model "predicts" the past using the future!

This gives artificially high $R^2$ scores in your notebook that immediately crash in production.

### Chronological Splitting Rule:
Sort the dataset strictly by timestamp:
- **Train Set:** The first 80% of chronological observations.
- **Test Set:** The remaining 20% future observations.

Any feature engineering (e.g. historical average delay per line) must be computed **only** on the training data, then mapped onto the test data!`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Chronological Split Script',
          contentKey: `Write \`src/models/01_prepare_splits.py\`:
1. Load \`master_transit_weather.parquet\`.
2. Sort strictly by \`collected_at\` ascending.
3. Determine split index: \`split_idx = int(len(df) * 0.8)\`.
4. Split into \`df_train\` and \`df_test\`.
5. Verify that \`df_train["collected_at"].max() <= df_test["collected_at"].min()\`.
6. Save splits to \`data/processed/train.parquet\` and \`data/processed/test.parquet\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import os

df = pd.read_parquet("data/processed/master_transit_weather.parquet")

# 1. Strict Chronological Sort
df = df.sort_values("collected_at").reset_index(drop=True)

# 2. Split at 80%
split_idx = int(len(df) * 0.80)
df_train = df.iloc[:split_idx].copy()
df_test = df.iloc[split_idx:].copy()

print(f"Train set: {len(df_train)} rows | From {df_train['collected_at'].min()} to {df_train['collected_at'].max()}")
print(f"Test set:  {len(df_test)} rows  | From {df_test['collected_at'].min()} to {df_test['collected_at'].max()}")

assert df_train['collected_at'].max() <= df_test['collected_at'].min(), "DATA LEAKAGE DETECTED!"
print("Validation Check Passed: Zero temporal leakage.")

df_train.to_parquet("data/processed/train.parquet", index=False)
df_test.to_parquet("data/processed/test.parquet", index=False)
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Implemented strict chronological sorting by timestamp',
            'Split train and test sets without random shuffling',
            'Validated zero temporal overlap between train and test datasets',
          ],
        },
      ],
    },
    {
      id: '8.3',
      phaseId: 8,
      titleKey: '8.3 Building the Baseline & Training Machine Learning Regressors',
      estimatedMinutes: 60,
      deliverable: 'Trained model artifact and evaluation report `src/models/02_train_evaluate.py`.',
      objectives: [
        'Establish a baseline heuristic model (global median and line-level average).',
        'Encode categorical features using One-Hot Encoding and Target Encoding.',
        'Train Linear Regression and Random Forest Regressor models with scikit-learn.',
        'Evaluate models using MAE, RMSE, and $R^2$, and interpret feature importances.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Baselines & Model Progression',
          contentKey: `Never report ML results without a **Baseline**.
If a complex Random Forest achieves an MAE of 2.1 minutes, is that good?
What if simply predicting the line's historical mean delay gives an MAE of 2.2 minutes?
Your model only improved predictions by 6 seconds!

### Evaluation Metrics:
1. **MAE (Mean Absolute Error):** On average, how many minutes off is our prediction? (Linear penalty, highly interpretable).
2. **RMSE (Root Mean Squared Error):** Penalizes large prediction errors more severely.
3. **$R^2$ (Coefficient of Determination):** Proportion of delay variance explained by our model features.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Train and Benchmark Models',
          contentKey: `Write \`src/models/02_train_evaluate.py\`:
1. Compute the **Baseline**: Predict the training median delay for all test records. Compute MAE.
2. Prepare feature matrix using scikit-learn \`ColumnTransformer\`:
   - One-Hot Encode: \`city_slug\`, \`condition\`, \`weekday\`.
   - Scale / Pass-through: \`hour\`, \`is_rush_hour\`, \`temperature_c\`, \`humidity\`, \`wind_speed\`.
3. Train \`LinearRegression\` and \`RandomForestRegressor(n_estimators=100, max_depth=10)\`.
4. Print a comparative benchmark table comparing Baseline, Linear Regression, and Random Forest on the Test Set.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation',
          contentKey: `\`\`\`python
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

train = pd.read_parquet("data/processed/train.parquet")
test = pd.read_parquet("data/processed/test.parquet")

features = ["city_slug", "condition", "weekday", "hour", "is_rush_hour", "temperature_c", "humidity", "wind_speed"]
target = "delay_min"

X_train = train[features]
y_train = train[target]
X_test = test[features]
y_test = test[target]

# 1. Baseline: Predict Train Median
baseline_pred = np.full(shape=len(y_test), fill_value=y_train.median())
base_mae = mean_absolute_error(y_test, baseline_pred)

# 2. Pipeline Preprocessor
cat_cols = ["city_slug", "condition", "weekday"]
num_cols = ["hour", "is_rush_hour", "temperature_c", "humidity", "wind_speed"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ("num", StandardScaler(), num_cols)
    ]
)

X_train_proc = preprocessor.fit_transform(X_train)
X_test_proc = preprocessor.transform(X_test)

# 3. Linear Regression
lr = LinearRegression()
lr.fit(X_train_proc, y_train)
lr_preds = lr.predict(X_test_proc)

# 4. Random Forest
rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
rf.fit(X_train_proc, y_train)
rf_preds = rf.predict(X_test_proc)

# Evaluation Summary Table
results = [
    {"Model": "Baseline (Median)", "MAE (min)": base_mae, "RMSE (min)": root_mean_squared_error(y_test, baseline_pred), "R2": r2_score(y_test, baseline_pred)},
    {"Model": "Linear Regression", "MAE (min)": mean_absolute_error(y_test, lr_preds), "RMSE (min)": root_mean_squared_error(y_test, lr_preds), "R2": r2_score(y_test, lr_preds)},
    {"Model": "Random Forest", "MAE (min)": mean_absolute_error(y_test, rf_preds), "RMSE (min)": root_mean_squared_error(y_test, rf_preds), "R2": r2_score(y_test, rf_preds)}
]

df_results = pd.DataFrame(results).round(3)
print("=== MACHINE LEARNING DELAY PREDICTION BENCHMARK ===")
print(df_results.to_string(index=False))
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Built simple heuristic Baseline model for benchmark comparison',
            'Engineered preprocessing pipeline handling categorical and continuous variables',
            'Trained and evaluated Linear Regression and Random Forest Regressors',
            'Logged MAE, RMSE, and R2 performance metrics on unseen future test data',
          ],
        },
      ],
    },
  ],
};
