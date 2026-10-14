import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import Authroutes from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import _config from "./config/config.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: _config.CLIENT_ID,
    clientSecret: _config.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use('/api/auth', Authroutes);

export default app;