# flood_detection/risk_engine.py

from simulator.config import FLOOD_THRESHOLD


WARNING_LEVEL = 3.20
CRITICAL_LEVEL = 3.70

RISING_RATE = 0.05
WARNING_RATE = 0.10
CRITICAL_RATE = 0.15


class FloodRiskEngine:

    def __init__(self):
        self.previous_levels = {}

    def calculate_risk(self, event):

        sensor_id = event["sensor_id"]
        water_level = event["water_level"]
        rate = event.get("rate_of_rise", event.get("rate", 0.0))

        # Critical:
        # Water level is very close to or above
        # the flood threshold.
        if water_level >= CRITICAL_LEVEL:

            status = "CRITICAL"

        # Warning:
        # Either the water level is elevated,
        # or the water level is rising rapidly.
        elif (
            water_level >= WARNING_LEVEL
            or rate >= CRITICAL_RATE
        ):

            status = "WARNING"

        # Rising:
        # Water level is increasing noticeably.
        elif rate >= RISING_RATE:

            status = "RISING"

        # Normal:
        # Water level is stable or decreasing.
        else:

            status = "NORMAL"

        # Estimate time until flood threshold.
        if rate > 0:

            remaining = (
                FLOOD_THRESHOLD - water_level
            )

            if remaining <= 0:

                time_to_threshold = 0.0

            else:

                time_to_threshold = (
                    remaining / rate
                )

        else:

            time_to_threshold = None

        self.previous_levels[sensor_id] = (
            water_level
        )

        return {
            "sensor_id": sensor_id,
            "status": status,
            "water_level": water_level,
            "rate_of_rise": rate,
            "time_to_threshold": time_to_threshold
        }