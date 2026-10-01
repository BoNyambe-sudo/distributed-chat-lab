import protobuf from "protobufjs";

const user = { id: 42, name: "Frank" };
console.log("JSON bytes", Buffer.from(JSON.stringify(user)).length, "bytes");
console.log("JSON:", JSON.stringify(user));

const protoStr = `syntax = "proto3"; message User {int32 id = 1; string name = 2}`;
const root = protobuf.parse(protoStr).root;
const User = root.lookupType("User");
const buf = User.encode(user).finish();
console.log("Protobuf bytes:", buf.length, "bytes -", buf);
