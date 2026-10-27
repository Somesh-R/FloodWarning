# main.py

from backend.websocket_server import main


if __name__ == "__main__":
    import asyncio

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nPython backend stopped.")