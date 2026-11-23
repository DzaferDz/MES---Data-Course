import type { Phase } from '@/types';

export const phase2: Phase = {
  id: 2,
  titleKey: 'phases.phase2.title',
  descriptionKey: 'phases.phase2.description',
  icon: 'Terminal',
  color: 'emerald',
  lessons: [
    {
      id: '2.1',
      phaseId: 2,
      titleKey: '2.1 Python HTTP Architecture: Requests, Timeouts & Error Trapping',
      estimatedMinutes: 40,
      deliverable: 'Reusable HTTP client module `src/collectors/http_client.py` with retries and exponential backoff.',
      objectives: [
        'Master `requests.get` with explicit timeouts and query parameter serialization.',
        'Handle HTTP errors (404, 429, 500, 503) and network connection drops gracefully.',
        'Implement exponential backoff retry logic without third-party bloat.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Robust Networking for Data Pipelines',
          contentKey: `A production data engineer never writes bare \`requests.get(url)\`. Why?
1. **Unbounded Hangs:** If an upstream server hangs, your script hangs indefinitely without a timeout.
2. **Rate Limits & Jitter:** Hitting endpoints repeatedly can trigger HTTP 429 (Too Many Requests).
3. **Transient Failures:** High-load transit APIs occasionally yield 502/503 for a split second. A single failed request should never crash an automated 24/7 collection run.

### Core Architecture: Custom Session & Retry Loop
We wrap our requests inside a dedicated utility that retries up to 3 times with exponential backoff (\`delay = base_delay * (2 ** attempt)\`).`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Write `http_client.py`',
          contentKey: `In \`src/collectors/http_client.py\`, implement:
- Function \`fetch_json(url: str, params: dict = None, max_retries: int = 3, timeout: int = 10) -> dict\`.
- Raise custom or catch \`requests.exceptions.RequestException\`.
- Log warnings on retry attempts.
- Return the decoded JSON dict or \`None\` on permanent failure.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation: `src/collectors/http_client.py`',
          contentKey: `\`\`\`python
import time
import requests
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def fetch_json(url: str, params: dict = None, max_retries: int = 3, timeout: int = 10) -> dict | None:
    headers = {"User-Agent": "GermanMobilityAnalytics-Learner/1.0"}
    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, headers=headers, timeout=timeout)
            if response.status_code == 200:
                return response.json()
            elif response.status_code in (429, 500, 502, 503, 504):
                wait = (2 ** attempt) + 0.5
                logging.warning(f"HTTP {response.status_code} for {url}. Retrying in {wait:.1f}s...")
                time.sleep(wait)
            else:
                logging.error(f"Permanent HTTP {response.status_code} for {url}: {response.text[:100]}")
                return None
        except requests.exceptions.RequestException as e:
            wait = (2 ** attempt) + 1.0
            logging.warning(f"Network error on attempt {attempt+1}/{max_retries} for {url}: {e}. Retrying in {wait:.1f}s...")
            time.sleep(wait)
    logging.error(f"Failed to fetch {url} after {max_retries} retries.")
    return None

if __name__ == "__main__":
    test_data = fetch_json("https://infranode.dev/api/v1/cities")
    print("Fetched cities count:", len(test_data.get("data", [])) if test_data else 0)
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Implemented `fetch_json` with explicit 10-second timeout',
            'Implemented exponential backoff on HTTP 429 and 5xx errors',
            'Tested script against Infranode `/cities` endpoint successfully',
          ],
        },
      ],
    },
    {
      id: '2.2',
      phaseId: 2,
      titleKey: '2.2 Weather Harvester: Polling Multi-City Meteorological Feeds',
      estimatedMinutes: 45,
      deliverable: 'Executable weather collector script `src/collectors/collect_weather.py`.',
      objectives: [
        'Collect live weather metrics across target German metropolitan areas.',
        'Extract `temperature_c`, `humidity`, `wind_speed`, and `condition`.',
        'Append observations with ISO collection timestamps to `data/raw/weather_snapshots.jsonl`.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Weather Data Schema & Snapshot Normalization',
          contentKey: `Infranode provides weather from Deutscher Wetterdienst (DWD).
Endpoint: \`/api/v1/cities/{city}/weather\`
Returns:
\`\`\`json
{
  "city_slug": "berlin",
  "observed_at": "2026-11-21T18:00:00Z",
  "payload": {
    "temperature_c": 5.8,
    "humidity": 88.0,
    "wind_speed": 17.3,
    "condition": "rain"
  }
}
\`\`\`

Notice the timestamp difference:
- \`observed_at\`: When DWD weather station measured the data (e.g. 18:00:00Z).
- \`collected_at\`: When your Python collector made the API call.
Always record both! This prevents timestamp confusion during analytical joins.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Weather Collector',
          contentKey: `Write \`src/collectors/collect_weather.py\`:
1. Target the top 10 German cities:
   \`["berlin", "hamburg", "muenchen", "koeln", "frankfurt-am-main", "stuttgart", "duesseldorf", "dortmund", "essen", "leipzig"]\`.
2. For each city, fetch weather via \`fetch_json\`.
3. Normalize the record into a clean dictionary:
   - \`city_slug\`
   - \`temperature_c\`
   - \`humidity\`
   - \`wind_speed\`
   - \`condition\`
   - \`observed_at\`
   - \`collected_at\` (UTC ISO string)
4. Append each record as one line in \`data/raw/weather_snapshots.jsonl\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation: `collect_weather.py`',
          contentKey: `\`\`\`python
import json
import os
from datetime import datetime, timezone
from http_client import fetch_json

TARGET_CITIES = [
    "berlin", "hamburg", "muenchen", "koeln", "frankfurt-am-main",
    "stuttgart", "duesseldorf", "dortmund", "essen", "leipzig"
]

OUTPUT_FILE = os.path.join("data", "raw", "weather_snapshots.jsonl")

def collect_all_weather():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    now_utc = datetime.now(timezone.utc).isoformat()
    count = 0

    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        for city in TARGET_CITIES:
            url = f"https://infranode.dev/api/v1/cities/{city}/weather"
            res = fetch_json(url)
            if not res or "data" not in res:
                continue

            data = res["data"]
            payload = data.get("payload", {})

            record = {
                "city_slug": city,
                "temperature_c": payload.get("temperature_c"),
                "humidity": payload.get("humidity"),
                "wind_speed": payload.get("wind_speed"),
                "condition": payload.get("condition"),
                "observed_at": data.get("observed_at"),
                "collected_at": now_utc,
                "record_id": data.get("record_id")
            }

            f.write(json.dumps(record) + "\\n")
            count += 1

    print(f"[{now_utc}] Appended {count} weather observations to {OUTPUT_FILE}")

if __name__ == "__main__":
    collect_all_weather()
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Wrote `collect_weather.py` supporting top German metropolitan cities',
            'Saved output to append-only `data/raw/weather_snapshots.jsonl`',
            'Confirmed non-empty output with proper numeric temperature and condition',
          ],
        },
      ],
    },
    {
      id: '2.3',
      phaseId: 2,
      titleKey: '2.3 Live Transit Harvester: Polling Regional Departure Boards',
      estimatedMinutes: 50,
      deliverable: 'Transit harvester script `src/collectors/collect_transit.py` generating `data/raw/transit_snapshots.jsonl`.',
      objectives: [
        'Poll regional live departure boards across major German transit hubs.',
        'Extract departure details: `line`, `direction`, `delay_s`, `in_minutes`, and `alerts`.',
        'Filter out duplicate observations using composite hashing keys.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'Extracting Transport Telemetry at Scale',
          contentKey: `Regional live departure endpoints provide direct human-readable line names:
- Frankfurt: \`/api/v1/live/frankfurt-am-main/departures\` (RMV)
- Stuttgart: \`/api/v1/live/stuttgart/departures\` (VVS)
- Hamburg: \`/api/v1/live/hamburg/departures\` (HVV Geofox)
- Düsseldorf, Dortmund, Essen: \`/api/v1/live/{city}/departures\` (VRR)

Each return an array of \`departures\`:
\`\`\`json
{
  "line": "S3",
  "direction": "Backnang",
  "in_minutes": 2,
  "delay_s": 180,
  "alerts": []
}
\`\`\`

Here \`delay_s = 180\` means the vehicle is running **3 minutes late**.
A \`delay_s = 0\` means exact on-time performance.
If \`delay_s\` is negative (e.g. \`-60\`), the vehicle is running 1 minute ahead of schedule!`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Write `collect_transit.py`',
          contentKey: `In \`src/collectors/collect_transit.py\`:
1. Iterate over regional cities: \`["frankfurt-am-main", "stuttgart", "hamburg", "duesseldorf", "dortmund", "essen"]\`.
2. Fetch live departures via \`fetch_json\`.
3. Normalize each individual departure into an operational record:
   - \`city_slug\`
   - \`line\`
   - \`direction\`
   - \`delay_s\`
   - \`delay_min\` (\`delay_s / 60\`)
   - \`in_minutes\`
   - \`collected_at\`
4. Append each departure into \`data/raw/transit_snapshots.jsonl\`.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation: `collect_transit.py`',
          contentKey: `\`\`\`python
import json
import os
from datetime import datetime, timezone
from http_client import fetch_json

TRANSIT_CITIES = [
    "frankfurt-am-main", "stuttgart", "hamburg",
    "duesseldorf", "dortmund", "essen"
]

OUTPUT_FILE = os.path.join("data", "raw", "transit_snapshots.jsonl")

def collect_all_transit():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    now_utc = datetime.now(timezone.utc).isoformat()
    total_deps = 0

    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        for city in TRANSIT_CITIES:
            url = f"https://infranode.dev/api/v1/live/{city}/departures"
            res = fetch_json(url)
            if not res or "data" not in res:
                continue

            deps = res["data"].get("payload", {}).get("departures", [])
            for d in deps:
                delay_s = d.get("delay_s", 0)
                record = {
                    "city_slug": city,
                    "line": d.get("line"),
                    "direction": d.get("direction"),
                    "delay_s": delay_s,
                    "delay_min": round(delay_s / 60.0, 2) if delay_s is not None else 0.0,
                    "in_minutes": d.get("in_minutes"),
                    "has_alerts": len(d.get("alerts", [])) > 0,
                    "collected_at": now_utc
                }
                f.write(json.dumps(record) + "\\n")
                total_deps += 1

    print(f"[{now_utc}] Appended {total_deps} departures across {len(TRANSIT_CITIES)} cities.")

if __name__ == "__main__":
    collect_all_transit()
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Tested regional endpoints for Frankfurt, Stuttgart, Hamburg, Düsseldorf, etc.',
            'Calculated `delay_min` accurately from `delay_s`',
            'Verified append mode outputs newline-delimited JSON (`.jsonl`)',
          ],
        },
      ],
    },
    {
      id: '2.4',
      phaseId: 2,
      titleKey: '2.4 Automated Orchestration: Building a Resilient Collection Pipeline',
      estimatedMinutes: 45,
      deliverable: 'Master pipeline runner script `src/collectors/run_pipeline.py` with continuous interval execution.',
      objectives: [
        'Orchestrate weather and transit collection in a coordinated single cycle.',
        'Implement interval scheduling with Python `time.sleep` or background task scheduler.',
        'Add file size auditing and graceful keyboard interrupt (`SIGINT`) handling.',
      ],
      sections: [
        {
          type: 'theory',
          titleKey: 'The Anatomy of a Continuous Harvester',
          contentKey: `In an enterprise environment, data collection runs on tools like Apache Airflow, cron jobs, or lightweight daemon processes.

To build our historical database, we want our pipeline to run every 15 minutes:
\`\`\`
12:00:00 -> Run Weather Collector -> Run Transit Collector -> Sleep 900s
12:15:00 -> Run Weather Collector -> Run Transit Collector -> Sleep 900s
...
\`\`\`

### Data Growth & Safety:
Every run appends ~50–150 transit records and 10 weather records.
In 24 hours (96 cycles): ~10,000 transit observations!
This gives us a real, rich empirical dataset for exploratory statistics, SQL queries, and ML training.`,
        },
        {
          type: 'exercise',
          titleKey: 'Independent Task: Master Pipeline Orchestrator',
          contentKey: `Write \`src/collectors/run_pipeline.py\`:
- Support a single-run mode: \`python run_pipeline.py --once\`.
- Support continuous mode: \`python run_pipeline.py --interval 900\` (default 15 minutes).
- Wrap loop in \`try...except KeyboardInterrupt\` so you can cleanly stop it in terminal with Ctrl+C.
- Print progress metrics and disk usage summary after each cycle.`,
        },
        {
          type: 'solution',
          titleKey: 'Reference Implementation: `run_pipeline.py`',
          contentKey: `\`\`\`python
import time
import argparse
import os
from collect_weather import collect_all_weather
from collect_transit import collect_all_transit

def run_cycle():
    print("\\n" + "="*50)
    print(f"Starting Data Harvester Cycle at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*50)
    collect_all_weather()
    collect_all_transit()

    # Check file sizes
    for f in ["weather_snapshots.jsonl", "transit_snapshots.jsonl"]:
        path = os.path.join("data", "raw", f)
        if os.path.exists(path):
            size_kb = os.path.getsize(path) / 1024
            print(f"File status: {f:<26} {size_kb:>8.1f} KB")

def main():
    parser = argparse.ArgumentParser(description="German Urban Mobility Data Collector")
    parser.add_argument("--once", action="store_true", help="Execute single collection cycle and exit")
    parser.add_argument("--interval", type=int, default=900, help="Interval in seconds between runs (default: 900s / 15m)")
    args = parser.parse_args()

    if args.once:
        run_cycle()
        return

    print(f"Continuous harvesting started. Polling every {args.interval} seconds (Press Ctrl+C to stop)...")
    try:
        while True:
            run_cycle()
            print(f"Sleeping for {args.interval}s until next cycle...")
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\\n[!] Harvester stopped gracefully by user. Data preserved.")

if __name__ == "__main__":
    main()
\`\`\``,
          language: 'python',
        },
        {
          type: 'checklist',
          titleKey: 'Checklist',
          contentKey: '',
          checklistItems: [
            'Created master runner `run_pipeline.py` with argument parsing',
            'Verified `--once` executes weather and transit collectors sequentially',
            'Confirmed file sizes in `data/raw/` increase as expected',
          ],
        },
      ],
    },
  ],
};
