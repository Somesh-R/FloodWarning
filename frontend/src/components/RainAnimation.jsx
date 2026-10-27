import { motion } from "framer-motion";

import {
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSun,
  Droplets,
} from "lucide-react";


const RAIN_CONFIG = {
  NO_RAIN: {
    label: "No Rain",
    description: "Clear atmospheric conditions",
    icon: CloudSun,
    drops: 0,
    intensity: "LOW",
    level: 0,
  },

  LOW: {
    label: "Low Rainfall",
    description: "Light rainfall across the selected area",
    icon: CloudDrizzle,
    drops: 24,
    intensity: "LOW",
    level: 1,
  },

  MODERATE: {
    label: "Moderate Rainfall",
    description: "Steady rainfall affecting river conditions",
    icon: CloudRain,
    drops: 55,
    intensity: "MODERATE",
    level: 3,
  },

  HEAVY: {
    label: "Heavy Rainfall",
    description: "Intense rainfall with strong flood impact",
    icon: CloudRainWind,
    drops: 105,
    intensity: "HEAVY",
    level: 4,
  },
};


function RainAnimation({
  condition = "NO_RAIN",
}) {

  const config =
    RAIN_CONFIG[condition] ||
    RAIN_CONFIG.NO_RAIN;

  const Icon = config.icon;


  const drops = Array.from({
    length: config.drops,
  });


  return (
    <section className="glass-card relative overflow-hidden rounded-3xl border border-white/10">

      {/* ==================================================
          TOP BORDER ACCENT
      ================================================== */}

      <div
        className={`
          absolute
          left-0
          right-0
          top-0
          h-[3px]
          ${
            condition === "HEAVY"
              ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
              : "bg-gradient-to-r from-sky-400 to-cyan-400"
          }
        `}
      />


      {/* ==================================================
          WEATHER AREA
      ================================================== */}

      <div
        className={`
          relative
          min-h-[210px]
          overflow-hidden

          ${
            condition === "HEAVY"
              ? "bg-gradient-to-br from-[#07182d] via-[#0b2848] to-[#123b67]"
              : condition === "MODERATE"
                ? "bg-gradient-to-br from-[#0a1d32] via-[#10385a] to-[#15527d]"
                : condition === "LOW"
                  ? "bg-gradient-to-br from-[#0a1d32] via-[#123753] to-[#16496b]"
                  : "bg-gradient-to-br from-[#081a2d] via-[#102c47] to-[#164061]"
          }
        `}
      >

        {/* Atmospheric glow */}

        <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />


        {/* ==================================================
            CLOUDS
        ================================================== */}

        <motion.div
          animate={{
            x: [
              "-3%",
              "3%",
              "-3%",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-0 right-0 top-8"
        >

          <div className="mx-auto flex max-w-4xl items-center justify-center gap-5 opacity-40">

            <div className="h-10 w-28 rounded-full bg-white/20 blur-md" />

            <div className="h-16 w-48 rounded-full bg-white/20 blur-md" />

            <div className="h-9 w-24 rounded-full bg-white/15 blur-md" />

          </div>

        </motion.div>


        {/* ==================================================
            RAIN
        ================================================== */}

        {config.drops > 0 && (
          <div className="rain-container">

            {drops.map(
              (_, index) => {

                const left =
                  (index * 37) % 100;

                const delay =
                  (index * 0.13) % 3;

                const duration =
                  condition === "HEAVY"
                    ? 0.45 +
                      ((index * 0.05) %
                        0.3)
                    : condition ===
                        "MODERATE"
                      ? 0.65 +
                        ((index * 0.07) %
                          0.4)
                      : 0.9 +
                        ((index * 0.09) %
                          0.5);


                return (
                  <span
                    key={index}
                    className="rain-drop"
                    style={{
                      left: `${left}%`,
                      top: `${
                        -20 -
                        (index % 50)
                      }px`,
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                );

              }
            )}

          </div>
        )}


        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="relative z-10 flex min-h-[210px] items-center justify-between gap-6 px-6 py-7 sm:px-8">

          <div className="flex items-center gap-4">

            <motion.div
              animate={{
                y:
                  condition ===
                  "NO_RAIN"
                    ? 0
                    : [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat:
                  condition ===
                  "NO_RAIN"
                    ? 0
                    : Infinity,
                ease: "easeInOut",
              }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur"
            >

              <Icon
                size={28}
                strokeWidth={1.8}
                className="text-cyan-300"
              />

            </motion.div>


            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">

                Current Weather Simulation

              </p>


              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">

                {config.label}

              </h2>


              <p className="mt-1 max-w-lg text-sm text-slate-300">

                {config.description}

              </p>

            </div>

          </div>


          {/* ==================================================
              INTENSITY INDICATOR
          ================================================== */}

          <div className="hidden min-w-[180px] text-right sm:block">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">

              Rainfall Intensity

            </p>


            <p className="mt-2 text-2xl font-bold text-white">

              {config.intensity}

            </p>


            <div className="mt-3 flex justify-end gap-1.5">

              {[1, 2, 3, 4].map(
                (level) => {

                  const active =
                    level <=
                    config.level;


                  return (
                    <span
                      key={level}
                      className={`
                        h-1.5
                        w-7
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          active
                            ? "bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.5)]"
                            : "bg-white/10"
                        }
                      `}
                    />
                  );

                }
              )}

            </div>

          </div>

        </div>


        {/* ==================================================
            BOTTOM STATUS STRIP
        ================================================== */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/10 px-6 py-2.5 backdrop-blur sm:px-8">

          <div className="flex items-center gap-2">

            <Droplets
              size={13}
              className="text-cyan-300"
            />

            <span className="text-[10px] font-medium text-slate-300">

              Rainfall conditions dynamically affect
              simulated river levels

            </span>

          </div>

        </div>

      </div>

    </section>
  );
}


export default RainAnimation;