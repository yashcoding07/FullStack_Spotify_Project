import app from "./src/app.js";
import startListener from "./src/broker/listener.js";
import { connect } from "./src/broker/rabbit.js";

connect().then(startListener);

app.listen("3001", () => {
    console.log("Notification service is running on port 3001");
});