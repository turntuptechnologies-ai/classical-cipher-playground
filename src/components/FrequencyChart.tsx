import type { FrequencyEntry } from "../cryptanalysis/frequency";
import { sortByFrequencyDesc } from "../cryptanalysis/frequency";

interface FrequencyChartProps {
  title: string;
  entries: FrequencyEntry[];
}

export default function FrequencyChart({ title, entries }: FrequencyChartProps) {
  const sorted = sortByFrequencyDesc(entries);
  const maxPercent = Math.max(...sorted.map((e) => e.percent), 1);

  return (
    <div className="frequency-chart">
      <p className="frequency-chart-title">{title}</p>
      <div className="frequency-rows">
        {sorted.map((entry) => (
          <div className="frequency-row" key={entry.letter}>
            <span className="frequency-label">{entry.letter}</span>
            <span className="frequency-bar-track">
              <span
                className="frequency-bar-fill"
                style={{ width: `${(entry.percent / maxPercent) * 100}%` }}
              />
            </span>
            <span className="frequency-percent">{entry.percent.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
