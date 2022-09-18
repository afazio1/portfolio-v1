if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const { isLoggedIn } = require("./middleware");
const mongoSanitize = require('express-mongo-sanitize');

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");

const educationRoutes = require("./routes/education");
const experienceRoutes = require("./routes/experience");
const projectRoutes = require("./routes/projects");
const userRoutes = require('./routes/users');

const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/portfolio";

mongoose.connect(dbUrl, {
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const secret = process.env.SECRET || "rats";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
        expires: Date.now() + 1000 * 60 * 30,
        maxAge: 1000 * 60 * 30
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// HELMET SECURITY
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com/typeit@8.2.0/dist/index.umd.js",
    "https://fonts.googleapis.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com",
    "https://cdnjs.cloudflare.com/"

];
const connectSrcUrls = [
    "https://stackpath.bootstrapcdn.com"
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com",
    "https://cdnjs.cloudflare.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'unsafe-eval'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/education", educationRoutes);
app.use("/experience", experienceRoutes);
app.use("/projects", projectRoutes);
app.use("/", userRoutes);

// HOME
app.get("/", (req, res) => {
    res.render("home");
});

// ABOUT
app.get("/about", (req, res) => {
    res.render("about");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong.";
    res.status(statusCode).render("error", { err });

})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});

// keep awake
const https = require("https");
setInterval(function () {
    https.get("https://fast-ocean-50650.herokuapp.com/about");
}, 1500000); // every 25 minutes