// Firestore security rules: who can join, start and play a room, and whose stats can be read.
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, writeBatch, deleteField } from "firebase/firestore";
import { readFileSync } from "node:fs";
import { test, report } from "./harness.mjs";

const env = await initializeTestEnvironment({
  projectId: "demo-tenaball",
  firestore: { rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8"), host: "127.0.0.1", port: 8080 },
});
const db = uid => env.authenticatedContext(uid).firestore();
const anon = () => env.unauthenticatedContext().firestore();
const lobby = (host = "host") => ({ host, status: "lobby", seq: 0, game: 1, ver: "t", settings: { rounds: 3 }, players: { [host]: { name: "Craig", n: 0 } } });
const reset = async (room = lobby()) => { await env.clearFirestore(); await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), "rooms/ABCDE"), room)); };
const playing = { ...lobby(), status: "playing", seq: 1, order: ["host", "p2"], players: { host: { name: "Craig", n: 0 }, p2: { name: "Aiden", n: 1 } } };

await test("rules: signed-out visitors can't read rooms", async () => { await reset(); await assertFails(getDoc(doc(anon(), "rooms/ABCDE"))); });
await test("rules: a signed-in player can read a room", async () => { await reset(); await assertSucceeds(getDoc(doc(db("p2"), "rooms/ABCDE"))); });
await test("rules: a host can open a room with only themselves in it", async () => {
  await env.clearFirestore(); await assertSucceeds(setDoc(doc(db("host"), "rooms/NEW01"), lobby()));
});
await test("rules: nobody can open a room in someone else's name", async () => {
  await env.clearFirestore(); await assertFails(setDoc(doc(db("p2"), "rooms/NEW02"), lobby("host")));
});
await test("rules: a room can't be opened already full of other players", async () => {
  await env.clearFirestore(); const r = lobby(); r.players.p9 = { name: "X", n: 1 };
  await assertFails(setDoc(doc(db("host"), "rooms/NEW03"), r));
});
await test("rules: a player can join the lobby", async () => {
  await reset(); await assertSucceeds(updateDoc(doc(db("p2"), "rooms/ABCDE"), { "players.p2": { name: "Aiden", n: 1 } }));
});
await test("rules: a player can't add someone else", async () => {
  await reset(); await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE"), { "players.p3": { name: "Emma", n: 1 } }));
});
await test("rules: a player can't remove the host", async () => {
  await reset(); await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE"), { "players.host": deleteField() }));
});
await test("rules: a player can leave the lobby", async () => {
  const r = lobby(); r.players.p2 = { name: "Aiden", n: 1 }; await reset(r);
  await assertSucceeds(updateDoc(doc(db("p2"), "rooms/ABCDE"), { "players.p2": deleteField() }));
});
await test("rules: names must be 1 to 20 characters", async () => {
  await reset(); await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE"), { "players.p2": { name: "x".repeat(21), n: 1 } }));
});
await test("rules: a fifth player can't join", async () => {
  const r = lobby(); ["p2", "p3", "p4"].forEach((u, i) => r.players[u] = { name: u, n: i + 1 }); await reset(r);
  await assertFails(updateDoc(doc(db("p5"), "rooms/ABCDE"), { "players.p5": { name: "Late", n: 4 } }));
});
await test("rules: only the host can start the game", async () => {
  const r = lobby(); r.players.p2 = { name: "Aiden", n: 1 }; await reset(r);
  await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE"), { status: "playing" }));
  const h = db("host"), b = writeBatch(h);
  b.update(doc(h, "rooms/ABCDE"), { status: "playing", seq: 1, order: ["host", "p2"] });
  b.set(doc(h, "rooms/ABCDE/actions/1_1"), { seq: 1, game: 1, uid: "host", type: "round", data: { qid: "x" } });
  await assertSucceeds(b.commit());
});
await test("rules: nobody can join once the game has started", async () => {
  await reset(playing); await assertFails(updateDoc(doc(db("p3"), "rooms/ABCDE"), { "players.p3": { name: "Emma", n: 2 } }));
});
const move = (uid, seq, type = "guess") => {
  const d = db(uid), b = writeBatch(d);
  b.update(doc(d, "rooms/ABCDE"), { seq });
  b.set(doc(d, `rooms/ABCDE/actions/1_${seq}`), { seq, game: 1, uid, type, data: { name: "Arsenal" } });
  return b.commit();
};
await test("rules: a player in the game can add the next move", async () => { await reset(playing); await assertSucceeds(move("p2", 2)); });
await test("rules: moves must follow on from the last one", async () => { await reset(playing); await assertFails(move("p2", 5)); });
await test("rules: moves can't be sent as another player", async () => {
  await reset(playing); const d = db("p2"), b = writeBatch(d);
  b.update(doc(d, "rooms/ABCDE"), { seq: 2 }); b.set(doc(d, "rooms/ABCDE/actions/1_2"), { seq: 2, game: 1, uid: "host", type: "guess", data: {} });
  await assertFails(b.commit());
});
await test("rules: someone outside the game can't add moves", async () => { await reset(playing); await assertFails(move("p9", 2)); });
await test("rules: only the host can send host moves (next round, reveal)", async () => {
  await reset(playing); await assertFails(move("p2", 2, "next")); await assertSucceeds(move("host", 2, "next"));
});
await test("rules: moves can't be edited or deleted", async () => {
  await reset(playing); await move("p2", 2);
  await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE/actions/1_2"), { type: "pass" }));
  await assertFails(deleteDoc(doc(db("p2"), "rooms/ABCDE/actions/1_2")));
});
await test("rules: players can't change the host or the settings mid-game", async () => {
  await reset(playing);
  await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE"), { host: "p2" }));
  await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE"), { settings: { rounds: 7 } }));
});
await test("rules: move ids must match their game and number", async () => {
  await reset(playing); const d = db("p2"), b = writeBatch(d);
  b.update(doc(d, "rooms/ABCDE"), { seq: 2 }); b.set(doc(d, "rooms/ABCDE/actions/9_2"), { seq: 2, game: 1, uid: "p2", type: "guess", data: {} });
  await assertFails(b.commit());
});
await test("rules: moves for an old game are refused", async () => {
  await reset({ ...playing, game: 2 }); const d = db("p2"), b = writeBatch(d);
  b.update(doc(d, "rooms/ABCDE"), { seq: 2 }); b.set(doc(d, "rooms/ABCDE/actions/1_2"), { seq: 2, game: 1, uid: "p2", type: "guess", data: {} });
  await assertFails(b.commit());
});
await test("rules: the host can send everyone back to the lobby to play again", async () => {
  await reset({ ...playing, seq: 40 });
  await assertFails(updateDoc(doc(db("p2"), "rooms/ABCDE"), { status: "lobby", seq: 0, game: 2 }));
  await assertFails(updateDoc(doc(db("host"), "rooms/ABCDE"), { status: "lobby", seq: 0, game: 1 }));
  await assertSucceeds(updateDoc(doc(db("host"), "rooms/ABCDE"), { status: "lobby", seq: 0, game: 2 }));
});
await test("rules: only the host can delete a room", async () => {
  await reset(); await assertFails(deleteDoc(doc(db("p2"), "rooms/ABCDE"))); await assertSucceeds(deleteDoc(doc(db("host"), "rooms/ABCDE")));
});
await test("rules: players can read and write only their own stats", async () => {
  await env.clearFirestore();
  await assertSucceeds(setDoc(doc(db("craig"), "users/craig"), { name: "Craig", stats: { played: 1 } }));
  await assertSucceeds(getDoc(doc(db("craig"), "users/craig")));
  await assertFails(getDoc(doc(db("aiden"), "users/craig")));
  await assertFails(setDoc(doc(db("aiden"), "users/craig"), { name: "Hacked" }));
});

await env.cleanup();
report();
