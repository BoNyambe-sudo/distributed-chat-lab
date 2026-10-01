import net from "net";

const server = net.createServer((socket) => {
  console.log("Client connected", socket.remoteAddress);

  socket.on("data", (data) => {
    console.log(`[Event loop] Got: ${data}`);

    //const end = Date.now() + 600000; while(Date.now() < end){}

    socket.write(`pong: ${data}`);
  });
});

server.listen(3000, () =>
  console.log("Server on 3000 - open 5 terminals"),
);
