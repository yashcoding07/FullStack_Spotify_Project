import { subscribeToQueue } from "./rabbit.js";
import sendEmail from "../utils/email.js";

function startListener(){
    subscribeToQueue("user_created", async (msg) => {
        const {email, role, fullName: {firstName, lastName}} = msg;

        const template = `
        <h1>Welcome to Spotify Piper</h1>
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for registering with spotify piper. We are excited to have you on board!</p>
        <p>Your role is: ${role}</p>
        <p>We hope you enjoy our services.</p>
        </br>
        <p>Best regrads,</p>
        <p>Spotify team piper</p>
        `

        await sendEmail(email, "Welcome to Spotify piper", "Thank you for registering with spotify piper.", template);
    });
}

export default startListener;