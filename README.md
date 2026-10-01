# Distributed Chat Lab - gRPC + Protobuf BiDi Streaming 

Mini WhatsAPP-style chat built with Node.js gRPC bidirectional streaming over HTTP/2. Survives restarts via file persistance.

> Built on Node v24.18.0 - documents real-world gotchas with new grpc-js.

## Stack
- **Tranport:** `@grpc/grpc-js` (HTTP/2)
- **Serialization:** Potocol Buffers `chat.proto`
- **Pattern:** Pub/Sub with broadcast + history replay
- **Persistance:** `chat-history.json` (swapable to binary Protobuf / Redis)

## Files
`chat.proto` -> Service + Message defintion
`grpc.server.js` -> Server with persitence & broadcast
`grpc-client.js` -> CLI client: node
`chat-history.json` -> Auto-created message log


## Setup (Windows / Git Bash)
```bash
npm init -y
npm install @grpc/grpc-js @grpc/proto-loader protobufjs
# Note: npm v22+ may ask: "approve-scrips"? -> allow @grpc packages