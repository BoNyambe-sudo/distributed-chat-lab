import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import fs from "fs"

const HISTORY_FILE = "./chat-history.json";

let history = [];
try {
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
    console.log(`Loaded ${history.length} messages from disk`);
  }
} catch (error) {
  history = [];
}

const pkgDef = protoLoader.loadSync("./chat.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chatProto = grpc.loadPackageDefinition(pkgDef).chat;

const clients = [];

function saveMessage(msg) {
  history.push(msg);
  fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), () => {});
}

function liveChat(call) {
  clients.push(call);
  console.log("New client connected, total:", clients.length);

  for (const oldMsg of history) {
    call.write(oldMsg);
  }

  call.on("data", (msg) => {
    console.log(`[${msg.user}]: ${msg.text}`);
    saveMessage(msg);

    for (const c of clients) {
      c.write(msg);
    }
  });

  call.on("end", () => {
    const idx = clients.indefOf(call);
    if (idx !== -1) clients.splice(idx, 1);
    console.log(`Client left. Total: ${clients.length}`);
    call.end();
  });

  call.on("error", (e) => {
    console.log("Call error:", e.message);
  });
}

const server = new grpc.Server();
server.addService(chatProto.ChatService.service, { LiveChat: liveChat });

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      throw err
    }
    console.log(`gRPC server running on 127.0.0.0:${port}`);
  },
);
