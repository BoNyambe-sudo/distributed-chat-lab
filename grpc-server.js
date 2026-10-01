import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const pkgDef = protoLoader.loadSync("./chat.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
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
    if(err){
      console.error("Bind error:",err)
      return
    }
    console.log(`gRPC server running on 127.0.0.0:${port}`);
  },
);

