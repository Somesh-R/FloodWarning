# streaming/stream_model.py

from datetime import datetime


def create_event(
    sensor_id,
    water_level,
    rainfall,
    rain_condition,
    rate_of_rise
):
    return {
        "sensor_id": sensor_id,
        "timestamp": datetime.now().isoformat(),
        "water_level": round(water_level, 3),
        "rainfall": rainfall,
        "rain_condition": rain_condition,
        "rate_of_rise": round(rate_of_rise, 3)
    }