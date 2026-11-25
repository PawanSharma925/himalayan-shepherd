import type { RoomId } from "@/lib/rooms";
import type { Messages } from "./messages";

export function roomCopy(messages: Messages, id: RoomId) {
  return messages.rooms[id];
}
