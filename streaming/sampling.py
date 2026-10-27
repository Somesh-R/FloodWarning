# streaming/sampling.py

import random


def sample_event(event, probability=0.10):
    return random.random() < probability


def sample_stream(events, probability=0.10):

    sampled_events = []

    for event in events:

        if sample_event(event, probability):
            sampled_events.append(event)

    return sampled_events