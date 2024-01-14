import { createClient } from "redis";

const client = createClient();
await client.connect();

// @ts-ignore
client.on("error", (error) => {
    console.error(error);
});

export default client;
