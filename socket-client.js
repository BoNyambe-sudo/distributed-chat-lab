import net from "net";

const clientId = process.argv[2] || "1";

const client = net.createConnection({ port: 3000 }, () => {
  console.log(`Client ${clientId} connection`);
  client.write(`Hello from client ${clientId}`);
});

client.on("data", (data) => {
  console.log(`Client ${clientId} got: ${data}`);
  client.end();
});

client.on("error", (e) => {
  console.log("Error - is server running?", e.message);
});
