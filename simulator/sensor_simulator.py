"""
Real-Time River Sensor Simulator

River model:

S001 (Upstream)
      ↓
S002
      ↓
S003
      ↓
S004 (Downstream)

1 real second = 1 simulated minute.

The model is intentionally simplified for an academic
real-time streaming analytics project.
"""

from __future__ import annotations

import threading
import time
from collections import deque
from datetime import datetime
from typing import Callable, Dict, Optional


# ============================================================
# SIMULATION CONFIGURATION
# ============================================================

SENSOR_IDS = [
    "S001",
    "S002",
    "S003",
    "S004",
]


STATION_NAMES = {
    "S001": "Upstream",
    "S002": "Station 2",
    "S003": "Station 3",
    "S004": "Downstream",
}


# Initial river levels in metres.
INITIAL_LEVELS = {
    "S001": 2.50,
    "S002": 2.40,
    "S003": 2.30,
    "S004": 2.20,
}


# Rainfall contribution in metres per simulated minute.
RAIN_EFFECTS = {
    "NO_RAIN": 0.00,
    "LOW": 0.03,
    "MODERATE": 0.08,
    "HEAVY": 0.20,
}


# Only the upstream station has a natural falling level
# when there is no rainfall.
NATURAL_DECREASE = 0.01


# How strongly an upstream station influences the
# immediately downstream station.
#
# Example:
# upstream level = 2.80
# downstream level = 2.40
# difference = 0.40
# flow contribution = 0.40 * 0.25 = 0.10 m/min
FLOW_COUPLING = 0.25


# Prevent one station from receiving an unrealistically
# large single-minute change from upstream flow.
MAX_FLOW_CHANGE = 0.08


# Rain/flood propagation delay.
PROPAGATION_DELAY = 3


# Simulation speed.
REAL_SECONDS_PER_SIMULATED_MINUTE = 1.0


# Flood threshold used by the simulator display.
FLOOD_THRESHOLD = 4.0


# ============================================================
# SHARED STATE
# ============================================================

rain_conditions: Dict[str, str] = {
    sensor_id: "NO_RAIN"
    for sensor_id in SENSOR_IDS
}


water_levels: Dict[str, float] = {
    sensor_id: INITIAL_LEVELS[sensor_id]
    for sensor_id in SENSOR_IDS
}


rates: Dict[str, float] = {
    sensor_id: 0.0
    for sensor_id in SENSOR_IDS
}


running = True


state_lock = threading.Lock()


# ============================================================
# PROPAGATION HISTORY
# ============================================================
#
# Each station stores previous water levels.
#
# For S002, we use delayed S001 levels.
# For S003, we use delayed S002 levels.
# For S004, we use delayed S003 levels.
#
# This creates:
#
# S001 → 3 min → S002 → 3 min → S003 → 3 min → S004
#

propagation_history = {
    sensor_id: deque(
        [INITIAL_LEVELS[sensor_id]]
        * PROPAGATION_DELAY,
        maxlen=PROPAGATION_DELAY,
    )
    for sensor_id in SENSOR_IDS
}


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def clamp(
    value: float,
    minimum: float,
    maximum: float,
) -> float:
    """Clamp a value into a specified range."""

    return max(
        minimum,
        min(value, maximum),
    )


def get_rain_effect(
    sensor_id: str,
) -> float:
    """Return rainfall contribution for a station."""

    condition = rain_conditions.get(
        sensor_id,
        "NO_RAIN",
    )

    return RAIN_EFFECTS.get(
        condition,
        0.0,
    )


def calculate_risk(
    water_level: float,
    rate: float,
) -> str:
    """
    Lightweight local status used only for simulator display.

    The project's main risk_engine.py remains responsible
    for the official flood-risk calculation.
    """

    if water_level >= 3.70:
        return "CRITICAL"

    if water_level >= 3.20 or rate >= 0.15:
        return "WARNING"

    if rate >= 0.05:
        return "RISING"

    return "NORMAL"


def calculate_flood_eta(
    water_level: float,
    rate: float,
) -> Optional[float]:
    """Estimate simulated minutes until 4.0 m."""

    if water_level >= FLOOD_THRESHOLD:
        return 0.0

    if rate <= 0:
        return None

    return (
        FLOOD_THRESHOLD - water_level
    ) / rate


# ============================================================
# RAINFALL CONTROL
# ============================================================

def set_rainfall(
    sensor_id: str,
    condition: str,
) -> bool:
    """
    Change rainfall condition for one station.

    Valid:
        NO_RAIN
        LOW
        MODERATE
        HEAVY
    """

    normalized_sensor = (
        sensor_id.strip().upper()
    )

    normalized_condition = (
        condition.strip().upper()
    )


    if normalized_sensor not in SENSOR_IDS:
        return False


    if normalized_condition not in RAIN_EFFECTS:
        return False


    with state_lock:

        rain_conditions[
            normalized_sensor
        ] = normalized_condition


    print(
        f"\n{normalized_sensor} rainfall changed to "
        f"{normalized_condition}"
    )

    return True


# ============================================================
# RIVER UPDATE LOGIC
# ============================================================

def update_river() -> Dict[str, dict]:
    """
    Update the complete river by one simulated minute.

    IMPORTANT:

    S001:
        rainfall - natural decrease

    S002-S004:
        rainfall + delayed upstream flow

    Therefore downstream stations do not independently
    fall simply because they have NO_RAIN.
    """

    global water_levels
    global rates
    global propagation_history


    with state_lock:

        previous_levels = {
            sensor_id: water_levels[
                sensor_id
            ]
            for sensor_id in SENSOR_IDS
        }


        new_levels: Dict[str, float] = {}


        # ====================================================
        # 1. UPSTREAM STATION
        # ====================================================
        #
        # S001 is the source of the river.
        #
        # When there is no rain:
        #
        #     level decreases slowly
        #
        # When rain exists:
        #
        #     rainfall raises the level
        #

        upstream = "S001"

        upstream_rain = get_rain_effect(
                upstream
            )

        upstream_change = (
            upstream_rain
            - NATURAL_DECREASE
        )

        new_levels[
            upstream
        ] = max(
            0.0,
            previous_levels[
                upstream
            ] + upstream_change,
        )


        # ====================================================
        # 2. DOWNSTREAM STATIONS
        # ====================================================
        #
        # Each station receives water from the immediately
        # upstream station.
        #
        # The upstream level used here is DELAYED.
        #
        # Therefore a rainfall event travels downstream.
        #

        for index in range(
            1,
            len(SENSOR_IDS),
        ):

            sensor_id = SENSOR_IDS[index]

            upstream_sensor = SENSOR_IDS[
                index - 1
            ]


            # ----------------------------------------------
            # Delayed upstream signal
            # ----------------------------------------------

            delayed_upstream_level = (
                propagation_history[
                    upstream_sensor
                ][0]
            )


            current_level = (
                previous_levels[
                    sensor_id
                ]
            )


            # ----------------------------------------------
            # River flow contribution
            # ----------------------------------------------
            #
            # Positive difference:
            #
            # upstream > downstream
            #
            # means water is moving into the station.
            #
            # Negative difference is also allowed so that
            # the model can eventually settle.
            #

            level_difference = (
                delayed_upstream_level
                - current_level
            )


            flow_change = (
                level_difference
                * FLOW_COUPLING
            )


            flow_change = clamp(
                flow_change,
                -MAX_FLOW_CHANGE,
                MAX_FLOW_CHANGE,
            )


            # ----------------------------------------------
            # Local rainfall
            # ----------------------------------------------

            local_rain = (
                get_rain_effect(
                    sensor_id
                )
            )


            # ----------------------------------------------
            # IMPORTANT:
            #
            # There is NO independent natural decrease
            # for downstream stations.
            #
            # Their level is determined by:
            #
            # local rainfall
            # +
            # upstream river flow
            # ----------------------------------------------

            total_change = (
                local_rain
                + flow_change
            )


            new_levels[
                sensor_id
            ] = max(
                0.0,
                current_level
                + total_change,
            )


        # ====================================================
        # 3. CALCULATE RATES
        # ====================================================

        for sensor_id in SENSOR_IDS:

            rates[
                sensor_id
            ] = (
                new_levels[
                    sensor_id
                ]
                - previous_levels[
                    sensor_id
                ]
            )


        # ====================================================
        # 4. COMMIT NEW LEVELS
        # ====================================================

        water_levels = new_levels


        # ====================================================
        # 5. UPDATE PROPAGATION HISTORY
        # ====================================================

        for sensor_id in SENSOR_IDS:

            propagation_history[
                sensor_id
            ].append(
                new_levels[
                    sensor_id
                ]
            )


        # ====================================================
        # 6. CREATE EVENTS
        # ====================================================

        timestamp = (
            datetime.now()
            .isoformat()
        )


        events = {}


        for sensor_id in SENSOR_IDS:

            level = new_levels[
                sensor_id
            ]

            rate = rates[
                sensor_id
            ]

            rain = rain_conditions[
                sensor_id
            ]


            events[
                sensor_id
            ] = {

                "timestamp":
                    timestamp,

                "sensor_id":
                    sensor_id,

                "station":
                    STATION_NAMES[
                        sensor_id
                    ],

                "water_level":
                    round(
                        level,
                        4,
                    ),

                "rain_condition":
                    rain,

                "rate_of_rise":
                    round(
                        rate,
                        4,
                    ),

                "rate":
                    round(
                        rate,
                        4,
                    ),

                "status":
                    calculate_risk(
                        level,
                        rate,
                    ),

                "flood_eta":
                    calculate_flood_eta(
                        level,
                        rate,
                    ),

            }


        return events


# ============================================================
# DISPLAY
# ============================================================

def print_event(
    event: dict,
) -> None:
    """Print one simulated sensor event."""

    sensor_id = event[
        "sensor_id"
    ]

    level = event[
        "water_level"
    ]

    rain = event[
        "rain_condition"
    ]

    rate = event[
        "rate"
    ]

    status = event[
        "status"
    ]


    sign = "+" if rate >= 0 else ""


    print(
        f"{sensor_id} | "
        f"Level: {level:.2f} m | "
        f"Rain: {rain:<9} | "
        f"Rate: {sign}{rate:.3f} m/min | "
        f"Risk: {status}"
    )


    eta = event.get(
        "flood_eta"
    )


    if eta is not None:
        print(
            f"    Flood threshold ETA: "
            f"{eta:.1f} simulated minutes"
        )


def show_current_state() -> None:
    """Print the current state of all stations."""

    with state_lock:

        print(
            "\n"
            + "-" * 78
        )

        for sensor_id in SENSOR_IDS:

            print(
                f"{sensor_id} | "
                f"Level: "
                f"{water_levels[sensor_id]:.2f} m | "
                f"Rain: "
                f"{rain_conditions[sensor_id]:<9} | "
                f"Rate: "
                f"{rates[sensor_id]:+.3f} m/min"
            )

        print(
            "-" * 78
        )


def print_help() -> None:
    """Display simulator controls."""

    print(
        """
============================================================
RAINFALL CONTROL
============================================================

Examples:

S001 HEAVY
S001 MODERATE
S001 LOW
S001 NO_RAIN

S002 HEAVY
S003 MODERATE
S004 LOW

Other commands:

SHOW
HELP
EXIT

Available rainfall:

NO_RAIN
LOW
MODERATE
HEAVY

============================================================
"""
    )


# ============================================================
# COMMAND THREAD
# ============================================================

def command_loop() -> None:
    """
    Read rainfall commands without stopping the simulator.

    The simulation itself continues in the main thread.
    """

    global running


    print_help()


    while running:

        try:
            command = input(
                "Rain control > "
            ).strip()

        except (
            EOFError,
            KeyboardInterrupt,
        ):
            running = False
            break


        if not command:
            continue


        parts = command.upper().split()


        # ----------------------------------------------------
        # EXIT
        # ----------------------------------------------------

        if parts[0] == "EXIT":

            running = False

            print(
                "Stopping river simulation..."
            )

            break


        # ----------------------------------------------------
        # SHOW
        # ----------------------------------------------------

        if parts[0] == "SHOW":

            show_current_state()

            continue


        # ----------------------------------------------------
        # HELP
        # ----------------------------------------------------

        if parts[0] == "HELP":

            print_help()

            continue


        # ----------------------------------------------------
        # RAINFALL COMMAND
        # ----------------------------------------------------

        if len(parts) == 2:

            sensor_id = parts[0]

            condition = parts[1]


            if set_rainfall(
                sensor_id,
                condition,
            ):
                continue


        print(
            "Invalid command. "
            "Example: S001 HEAVY"
        )


# ============================================================
# MAIN SIMULATION LOOP
# ============================================================

def run_simulation(
    event_callback: Optional[
        Callable[[dict], None]
    ] = None,
) -> None:
    """
    Run the continuous river simulation.

    event_callback is used by main.py so the streaming
    engine and risk engine can process every sensor event.
    """

    global running


    running = True


    # Reset state for a clean simulation run.

    with state_lock:

        for sensor_id in SENSOR_IDS:

            water_levels[
                sensor_id
            ] = INITIAL_LEVELS[
                sensor_id
            ]

            rates[
                sensor_id
            ] = 0.0

            rain_conditions[
                sensor_id
            ] = "NO_RAIN"


            propagation_history[
                sensor_id
            ].clear()


            propagation_history[
                sensor_id
            ].extend(
                [INITIAL_LEVELS[sensor_id]]
                * PROPAGATION_DELAY
            )


    print(
        "\n"
        + "=" * 62
    )

    print(
        "REAL-TIME RIVER SENSOR SIMULATOR"
    )

    print(
        "=" * 62
    )

    print(
        "Stations:"
    )

    for sensor_id in SENSOR_IDS:

        print(
            f"{sensor_id} - "
            f"{STATION_NAMES[sensor_id]}"
        )

    print()

    print(
        "Simulation started..."
    )

    print(
        "1 real second = "
        "1 simulated minute"
    )

    print(
        "River direction: "
        "S001 → S002 → S003 → S004"
    )

    print(
        f"Propagation delay: "
        f"{PROPAGATION_DELAY} simulated minutes"
    )

    print(
        "=" * 62
    )


    # Start interactive rainfall controller.

    command_thread = threading.Thread(
        target=command_loop,
        daemon=True,
    )

    command_thread.start()


    try:

        while running:

            events = update_river()


            # Send each station event to the
            # streaming/risk-processing pipeline.

            for sensor_id in SENSOR_IDS:

                event = events[
                    sensor_id
                ]


                if event_callback:

                    event_callback(
                        event
                    )


                else:

                    print_event(
                        event
                    )


            time.sleep(
                REAL_SECONDS_PER_SIMULATED_MINUTE
            )


    except KeyboardInterrupt:

        print(
            "\nSimulation stopped by user."
        )

    finally:

        running = False

        print(
            "\nSimulation stopped."
        )


# ============================================================
# DIRECT EXECUTION
# ============================================================

if __name__ == "__main__":

    run_simulation()