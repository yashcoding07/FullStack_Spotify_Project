import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import Authroutes from "./routes/auth.routes.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', Authroutes);

export default app;