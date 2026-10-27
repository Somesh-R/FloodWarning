import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  Clock3,
  TrendingUp,
} from "lucide-react";


function WaterLevelChart({
  history = [],
  selectedStation = "S001",
}) {

  const stationHistory = history
    .filter(
      (item) =>
        item.sensor_id === selectedStation
    )
    .slice(-60)
    .map((item, index) => {

      const rawTime =
        item.time ||
        item.timestamp ||
        "";

      let formattedTime =
        `${index + 1}`;

      if (rawTime) {
        const date = new Date(rawTime);

        if (!Number.isNaN(date.getTime())) {
          formattedTime =
            date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
        } else {
          formattedTime =
            String(rawTime).slice(-8);
        }
      }

      return {
        ...item,
        time: formattedTime,
        level: Number(
          item.water_level ?? 0
        ),
      };
    });


  return (
    <section className="glass-card overflow-hidden rounded-3xl border border-white/10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/10">

            <TrendingUp
              size={20}
              className="text-sky-300"
            />

          </div>


          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">

              Streaming History

            </p>


            <h2 className="mt-1 text-lg font-bold text-white">

              Water Level Trend

            </h2>


            <p className="mt-1 text-xs text-slate-400">

              Real-time level history for{" "}

              <span className="font-semibold text-sky-300">

                {selectedStation}

              </span>

            </p>

          </div>

        </div>


        <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">

          <Clock3
            size={13}
            className="text-sky-300"
          />

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

            Last 60 readings

          </span>

        </div>

      </div>


      {/* ==================================================
          CHART
      ================================================== */}

      <div className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6">

        <div className="h-[320px] w-full">

          {stationHistory.length === 0 ? (

            <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025]">

              <div className="text-center">

                <Activity
                  size={30}
                  className="mx-auto text-slate-600"
                />

                <p className="mt-3 text-sm font-semibold text-slate-300">

                  Waiting for water-level data

                </p>

                <p className="mt-1 text-xs text-slate-500">

                  Streaming readings will appear here

                </p>

              </div>

            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={stationHistory}
                margin={{
                  top: 15,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >

                <defs>

                  <linearGradient
                    id="waterLevelFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#22d3ee"
                      stopOpacity={0.32}
                    />

                    <stop
                      offset="55%"
                      stopColor="#0ea5e9"
                      stopOpacity={0.14}
                    />

                    <stop
                      offset="100%"
                      stopColor="#0f172a"
                      stopOpacity={0.02}
                    />

                  </linearGradient>

                </defs>


                <CartesianGrid
                  stroke="#294056"
                  strokeDasharray="4 5"
                  vertical={false}
                />


                <XAxis
                  dataKey="time"
                  tick={{
                    fill: "#64748b",
                    fontSize: 9,
                  }}
                  tickLine={false}
                  axisLine={{
                    stroke: "#23384e",
                  }}
                  minTickGap={35}
                />


                <YAxis
                  domain={[0, 4.5]}
                  ticks={[
                    0,
                    1,
                    2,
                    3,
                    4,
                  ]}
                  tick={{
                    fill: "#64748b",
                    fontSize: 9,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                  tickFormatter={(value) =>
                    `${Number(value).toFixed(0)}m`
                  }
                />


                <ReferenceLine
                  y={4}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="7 5"
                  label={{
                    value: "FLOOD THRESHOLD",
                    position:
                      "insideTopRight",
                    fill: "#f87171",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                />


                <Tooltip
                  cursor={{
                    stroke:
                      "#38bdf8",
                    strokeWidth: 1,
                    strokeDasharray:
                      "4 4",
                  }}
                  contentStyle={{
                    background:
                      "#0b1b2d",
                    border:
                      "1px solid rgba(125,211,252,0.18)",
                    borderRadius:
                      "12px",
                    boxShadow:
                      "0 15px 40px rgba(0,0,0,0.35)",
                    padding:
                      "10px 12px",
                  }}
                  labelStyle={{
                    color: "#94a3b8",
                    fontSize: 10,
                    marginBottom: 5,
                  }}
                  itemStyle={{
                    color: "#67e8f9",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  formatter={(value) => [
                    `${Number(value).toFixed(2)} m`,
                    "Water Level",
                  ]}
                />


                <Area
                  type="monotone"
                  dataKey="level"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fill="url(#waterLevelFill)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#22d3ee",
                    stroke:
                      "#082238",
                    strokeWidth: 3,
                  }}
                  isAnimationActive
                  animationDuration={450}
                />

              </AreaChart>

            </ResponsiveContainer>

          )}

        </div>


        {/* ==================================================
            CHART LEGEND
        ================================================== */}

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4">

          <div className="flex items-center gap-2">

            <span className="h-2 w-7 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />

            <span className="text-[10px] font-medium text-slate-500">

              Water level

            </span>

          </div>


          <div className="flex items-center gap-2">

            <span className="w-7 border-t-2 border-dashed border-red-400" />

            <span className="text-[10px] font-medium text-slate-500">

              Flood threshold

            </span>

          </div>


          <div className="ml-auto flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">

              Live stream

            </span>

          </div>

        </div>

      </div>

    </section>
  );
}


export default WaterLevelChart;