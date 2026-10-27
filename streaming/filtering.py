# streaming/filtering.py

RAPID_RISE_THRESHOLD = 0.10


def is_rapid_rise(event):
    rate = event.get("rate_of_rise", event.get("rate", 0.0))
    return rate > RAPID_RISE_THRESHOLD


def filter_stream(events):
    return [
        event
        for event in events
        if is_rapid_rise(event)
    ]