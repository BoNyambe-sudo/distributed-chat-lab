import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const pkgDef = protoLoader.loadSync("chat.proto", {});
const chatProto = grpc.loadPackageDefinition(pkgDef).chat;

function liveChat(call) {
  console.log("New client connected to gRPC stream");

  call.on("data", (msg) => {
    console.log(`[${msg.user}]: ${msg.text}`);

    call.write({ user: "Server", text: `Echo: ${msg.text}` });
  });

  call.on("end", () => {
    console.log("Client disconnected");
    call.end();
  });
}

const server = new grpc.Server();
server.addService(chatProto.ChatService.service, { liveChat });

server.bindAsync(
  "0.0.0.0: 50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC server running on 0.0.0.0:50051");
  },
);
