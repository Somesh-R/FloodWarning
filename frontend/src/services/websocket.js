// frontend/src/services/websocket.js


const WS_URL =
  "ws://localhost:8000/ws";


// ============================================================
// CREATE WEBSOCKET CONNECTION
// ============================================================

export function createWebSocket(
  onMessage,
  onConnectionChange
) {

  let socket = null;


  try {

    socket = new WebSocket(
      WS_URL
    );


    // --------------------------------------------------------
    // CONNECTED
    // --------------------------------------------------------

    socket.onopen = () => {

      console.log(
        "WebSocket connected:",
        WS_URL
      );

      if (onConnectionChange) {
        onConnectionChange(true);
      }
    };


    // --------------------------------------------------------
    // MESSAGE
    // --------------------------------------------------------

    socket.onmessage = (
      event
    ) => {

      try {

        const data =
          JSON.parse(
            event.data
          );

        if (onMessage) {
          onMessage(data);
        }

      } catch (error) {

        console.error(
          "WebSocket message parsing error:",
          error
        );
      }
    };


    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    socket.onerror = (
      error
    ) => {

      console.error(
        "WebSocket error:",
        error
      );

      if (onConnectionChange) {
        onConnectionChange(false);
      }
    };


    // --------------------------------------------------------
    // CLOSED
    // --------------------------------------------------------

    socket.onclose = () => {

      console.log(
        "WebSocket connection closed."
      );

      if (onConnectionChange) {
        onConnectionChange(false);
      }
    };


  } catch (error) {

    console.error(
      "Unable to create WebSocket:",
      error
    );

    if (onConnectionChange) {
      onConnectionChange(false);
    }
  }


  return {

    // ========================================================
    // SEND RAINFALL CONTROL
    // ========================================================

    setRainfall(
      sensorId,
      condition
    ) {

      if (
        !socket ||
        socket.readyState !==
          WebSocket.OPEN
      ) {

        console.warn(
          "WebSocket is not connected."
        );

        return false;
      }


      const message = {

        type:
          "rainfall_control",

        sensor_id:
          sensorId,

        condition:
          condition,
      };


      socket.send(
        JSON.stringify(message)
      );

      return true;
    },


    // ========================================================
    // SEND GENERIC MESSAGE
    // ========================================================

    send(message) {

      if (
        !socket ||
        socket.readyState !==
          WebSocket.OPEN
      ) {

        return false;
      }


      socket.send(
        JSON.stringify(message)
      );

      return true;
    },


    // ========================================================
    // CONNECTION STATUS
    // ========================================================

    isConnected() {

      return (
        socket &&
        socket.readyState ===
          WebSocket.OPEN
      );
    },


    // ========================================================
    // CLOSE
    // ========================================================

    close() {

      if (socket) {
        socket.close();
      }
    },
  };
}


export default createWebSocket;