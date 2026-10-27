import {
  Activity,
  BarChart3,
  Database,
  Radio,
  Sigma,
  Zap,
} from "lucide-react";


function StreamingStats({
  stats = {},
}) {

  const {
    total_events = 0,
    distinct_stations = 0,
    rapid_rise_count = 0,
    mean_water_level = 0,
    standard_deviation = 0,
    sampled_events = 0,
  } = stats;


  const statCards = [
    {
      label: "Total Events",
      value: Number(
        total_events
      ).toLocaleString(),
      description:
        "Stream records processed",
      icon: Database,
      accent: "text-cyan-300",
      iconBg: "bg-cyan-400/10",
      border: "border-cyan-400/10",
    },

    {
      label: "Distinct Stations",
      value: Number(
        distinct_stations
      ).toLocaleString(),
      description:
        "Active sensor stations",
      icon: Radio,
      accent: "text-emerald-300",
      iconBg: "bg-emerald-400/10",
      border: "border-emerald-400/10",
    },

    {
      label: "Rapid-Rise Events",
      value: Number(
        rapid_rise_count
      ).toLocaleString(),
      description:
        "Rate above rise threshold",
      icon: Zap,
      accent: "text-amber-300",
      iconBg: "bg-amber-400/10",
      border: "border-amber-400/10",
    },

    {
      label: "Mean Water Level",
      value: `${Number(
        mean_water_level
      ).toFixed(3)} m`,
      description:
        "Streaming mean level",
      icon: Sigma,
      accent: "text-sky-300",
      iconBg: "bg-sky-400/10",
      border: "border-sky-400/10",
    },

    {
      label: "Standard Deviation",
      value: Number(
        standard_deviation
      ).toFixed(3),
      description:
        "Level variability",
      icon: BarChart3,
      accent: "text-violet-300",
      iconBg: "bg-violet-400/10",
      border: "border-violet-400/10",
    },

    {
      label: "Sampled Events",
      value: Number(
        sampled_events
      ).toLocaleString(),
      description:
        "Sampled stream records",
      icon: Activity,
      accent: "text-blue-300",
      iconBg: "bg-blue-400/10",
      border: "border-blue-400/10",
    },
  ];


  return (
    <section className="glass-card overflow-hidden rounded-3xl border border-white/10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10">

            <Activity
              size={20}
              className="text-violet-300"
            />

          </div>


          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">

              Stream Processing

            </p>


            <h2 className="mt-1 text-lg font-bold text-white">

              Streaming Analytics

            </h2>


            <p className="mt-1 text-xs text-slate-400">

              Live metrics from the river sensor stream

            </p>

          </div>

        </div>


        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5">

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">

            Processing

          </span>

        </div>

      </div>


      {/* ==================================================
          METRIC GRID
      ================================================== */}

      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

        {statCards.map(
          (stat) => {

            const Icon =
              stat.icon;


            return (
              <div
                key={stat.label}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  ${stat.border}
                  bg-white/[0.035]
                  p-4
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/[0.055]
                  hover:shadow-[0_14px_35px_rgba(0,0,0,0.18)]
                `}
              >

                {/* Glow */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8
                    h-20
                    w-20
                    rounded-full
                    blur-2xl
                    ${stat.iconBg}
                  `}
                />


                <div className="relative">

                  <div className="flex items-start justify-between">

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/10
                        ${stat.iconBg}
                      `}
                    >

                      <Icon
                        size={18}
                        className={stat.accent}
                      />

                    </div>


                    <div className="h-1.5 w-1.5 rounded-full bg-white/15 transition group-hover:bg-white/40" />

                  </div>


                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">

                    {stat.label}

                  </p>


                  <p className="mt-1 text-2xl font-bold tracking-tight text-white">

                    {stat.value}

                  </p>


                  <p className="mt-1.5 text-[10px] text-slate-500">

                    {stat.description}

                  </p>

                </div>

              </div>
            );
          }
        )}

      </div>


      {/* ==================================================
          ANALYTICS FOOTER
      ================================================== */}

      <div className="border-t border-white/10 px-5 py-4 sm:px-6">

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-cyan-400" />

            <span className="text-[10px] font-medium text-slate-500">

              Stream Model

            </span>

          </div>


          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-violet-400" />

            <span className="text-[10px] font-medium text-slate-500">

              Moments / Statistics

            </span>

          </div>


          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-amber-400" />

            <span className="text-[10px] font-medium text-slate-500">

              Rapid-Rise Detection

            </span>

          </div>


          <div className="ml-auto flex items-center gap-2">

            <Radio
              size={13}
              className="text-emerald-300"
            />

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">

              Live Stream

            </span>

          </div>

        </div>

      </div>

    </section>
  );
}


export default StreamingStats;