# simulator/config.py

# 1 real second = 1 simulated minute
SIMULATION_INTERVAL = 1

# Initial water levels in meters
INITIAL_WATER_LEVELS = {
    "S001": 2.50,
    "S002": 2.40,
    "S003": 2.30,
    "S004": 2.20
}

# Rainfall levels
RAINFALL_LEVELS = {
    "NO_RAIN": 0.0,
    "LOW": 10.0,
    "MODERATE": 30.0,
    "HEAVY": 60.0
}

# Water-level increase caused by rainfall
RAIN_EFFECT = {
    "NO_RAIN": 0.00,
    "LOW": 0.03,
    "MODERATE": 0.08,
    "HEAVY": 0.20
}

# Natural decrease in water level
NATURAL_DECREASE = 0.01

# Upstream influence passed to downstream station
UPSTREAM_INFLUENCE = 0.30

# Propagation delay in simulated minutes
PROPAGATION_DELAY = 3

# Flood threshold
FLOOD_THRESHOLD = 4.0