# backend/websocket_server.py

import asyncio
import json
import os
from datetime import datetime

import websockets

from simulator.sensor_simulator import (
    SENSOR_IDS,
    set_rainfall,
    update_river,
)

from streaming.streaming_engine import StreamingEngine


HOST = "localhost"
PORT = 8000

connected_clients = set()

streaming_engine = StreamingEngine()


# ============================================================
# FLUME INPUT
# ============================================================

FLUME_INPUT_DIRECTORY = os.path.join(
    "data",
    "flume_input",
)

FLUME_INPUT_FILE = os.path.join(
    FLUME_INPUT_DIRECTORY,
    "sensor_events.log",
)


def initialize_flume_input():
    """
    Create the local directory and input file
    used by Apache Flume.
    """

    os.makedirs(
        FLUME_INPUT_DIRECTORY,
        exist_ok=True,
    )

    if not os.path.exists(
        FLUME_INPUT_FILE
    ):
        with open(
            FLUME_INPUT_FILE,
            "a",
            encoding="utf-8",
        ):
            pass

    print(
        f"[Flume] Input stream: "
        f"{FLUME_INPUT_FILE}"
    )


def send_event_to_flume(event):
    """
    Write one processed sensor event as a
    JSON line for Apache Flume to consume.

    Python does NOT store the final historical
    data here. Flume reads this stream and
    writes it to the configured File Roll Sink.
    """

    try:
        with open(
            FLUME_INPUT_FILE,
            "a",
            encoding="utf-8",
        ) as file:

            file.write(
                json.dumps(
                    event,
                    default=str,
                )
                + "\n"
            )

            file.flush()

    except Exception as error:
        print(
            f"[Flume] Input error: {error}"
        )


# ============================================================
# STREAMING ANALYTICS
# ============================================================

def process_sensor_event(event):
    """
    Process one sensor event through the existing
    streaming analytics pipeline.

    Risk/status/flood ETA are already produced by
    the Python sensor simulation.
    """

    result = dict(event)

    try:
        streaming_result = (
            streaming_engine.process_event(
                event
            )
        )

        if isinstance(
            streaming_result,
            dict,
        ):
            result.update(
                streaming_result
            )

    except Exception as error:
        print(
            f"[Streaming] Processing error: "
            f"{error}"
        )

    return result


# ============================================================
# WEBSOCKET BROADCAST
# ============================================================

async def broadcast(event):
    """
    Send one processed event to every
    connected React client.
    """

    if not connected_clients:
        return

    message = json.dumps(
        event,
        default=str,
    )

    disconnected = set()

    for client in connected_clients:

        try:
            await client.send(
                message
            )

        except Exception:
            disconnected.add(
                client
            )

    connected_clients.difference_update(
        disconnected
    )


# ============================================================
# SENSOR SIMULATION LOOP
# ============================================================

async def simulation_loop():
    """
    Continuously generate sensor data from
    the Python simulator.
    """

    while True:

        try:

            events = update_river()

            if isinstance(
                events,
                dict,
            ):

                event_list = list(
                    events.values()
                )

            elif isinstance(
                events,
                list,
            ):

                event_list = events

            else:

                event_list = [
                    events
                ]

            for event in event_list:

                if not isinstance(
                    event,
                    dict,
                ):
                    continue

                # --------------------------------------------
                # 1. Streaming analytics
                # --------------------------------------------

                processed_event = (
                    process_sensor_event(
                        event
                    )
                )

                # --------------------------------------------
                # 2. Send event to Flume input
                # --------------------------------------------

                send_event_to_flume(
                    processed_event
                )

                # --------------------------------------------
                # 3. Send event to React
                # --------------------------------------------

                await broadcast(
                    processed_event
                )

                # --------------------------------------------
                # 4. Console output
                # --------------------------------------------

                status = (
                    processed_event.get(
                        "status",
                        processed_event.get(
                            "risk",
                            "NORMAL",
                        ),
                    )
                )

                print(
                    f"{event.get('sensor_id', 'UNKNOWN')} | "
                    f"Level: "
                    f"{event.get('water_level', 0):.2f} m | "
                    f"Rain: "
                    f"{event.get('rain_condition', 'NO_RAIN'):10} | "
                    f"Rate: "
                    f"{event.get('rate', 0):+.3f} m/min | "
                    f"Status: {status}"
                )

            await asyncio.sleep(1)

        except Exception as error:

            print(
                f"[WebSocket] Simulation error: "
                f"{error}"
            )

            await asyncio.sleep(1)


# ============================================================
# WEBSOCKET CLIENT HANDLER
# ============================================================

async def handle_client(websocket):
    """
    Handle communication with a React client.
    """

    connected_clients.add(
        websocket
    )

    print(
        f"[WebSocket] Client connected. "
        f"Clients: {len(connected_clients)}"
    )

    try:

        await websocket.send(
            json.dumps(
                {
                    "type": "connection",
                    "status": "connected",
                    "timestamp":
                        datetime.now().isoformat(),
                }
            )
        )

        async for message in websocket:

            try:

                data = json.loads(
                    message
                )

                if (
                    data.get("type")
                    == "rainfall_control"
                ):

                    sensor_id = data.get(
                        "sensor_id"
                    )

                    condition = data.get(
                        "condition"
                    )

                    if (
                        sensor_id
                        not in SENSOR_IDS
                    ):

                        await websocket.send(
                            json.dumps(
                                {
                                    "type":
                                        "error",
                                    "message":
                                        f"Unknown sensor: "
                                        f"{sensor_id}",
                                }
                            )
                        )

                        continue

                    set_rainfall(
                        sensor_id,
                        condition,
                    )

                    print(
                        f"[WebSocket] "
                        f"Rainfall changed: "
                        f"{sensor_id} = "
                        f"{condition}"
                    )

                    await websocket.send(
                        json.dumps(
                            {
                                "type":
                                    "rainfall_ack",
                                "sensor_id":
                                    sensor_id,
                                "condition":
                                    condition,
                            }
                        )
                    )

            except json.JSONDecodeError:

                await websocket.send(
                    json.dumps(
                        {
                            "type": "error",
                            "message":
                                "Invalid JSON message.",
                        }
                    )
                )

            except Exception as error:

                print(
                    f"[WebSocket] "
                    f"Client message error: "
                    f"{error}"
                )

    except websockets.exceptions.ConnectionClosed:
        pass

    finally:

        connected_clients.discard(
            websocket
        )

        print(
            f"[WebSocket] "
            f"Client disconnected. "
            f"Clients: {len(connected_clients)}"
        )


# ============================================================
# MAIN
# ============================================================

async def main():

    print("=" * 60)

    print(
        "REAL-TIME FLOOD WARNING WEBSOCKET SERVER"
    )

    print("=" * 60)

    print(
        f"WebSocket server: "
        f"ws://{HOST}:{PORT}"
    )

    print(
        "Python backend is now the data source."
    )

    initialize_flume_input()

    print(
        "Flume event streaming is enabled."
    )

    print("=" * 60)

    async with websockets.serve(
        handle_client,
        HOST,
        PORT,
    ):

        await simulation_loop()


if __name__ == "__main__":

    try:

        asyncio.run(
            main()
        )

    except KeyboardInterrupt:

        print(
            "\nWebSocket server stopped."
        )