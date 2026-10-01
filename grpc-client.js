import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import readline from "readline";

const pkgDef = protoLoader.loadSync("chat.proto", {});
const chatProto = grpc.loadPackageDefinition(pkgDef).chat;
const client = new chatProto.ChatService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const user = process.argv[2] || "Frank";

const call = client.LiveChat();

call.on("data", (msg) => {
  console.log(`\n[${msg.user}]: ${msg.text}`);
  process.stdout.write(`${user}> `);
});

call.on("end", () => console.log("Disconnected"));

console.log(`Connected as ${user}. Type messages:`);
rl.on("line", (line) => {
  if (line === "quit") {
    call.end();
    process.exit(0);
  }
  call.write({ user: user, text: line });
  process.stdout.write(`${user}> `);
});

process.stdout.write(`${user}> `);
