const express = require("express");
const app = express();
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const { isLoggedIn } = require("./middleware");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const educationRoutes = require("./routes/education");
const experienceRoutes = require("./routes/experience");
const projectRoutes = require("./routes/projects");

mongoose.connect("mongodb://localhost:27017/portfolio", {
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

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "rats",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 30,
        maxAge: 1000 * 60 * 30
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/test", async (req, res) => {
//     const user = new User({username: "chicken"});
//     const newUser = await User.register(user, "nugget");
//     res.send(newUser);

// });

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/education", educationRoutes);
app.use("/experience", experienceRoutes);
app.use("/projects", projectRoutes);


// LOGIN
app.get("/login", (req, res ) => {
    res.render("login");
})
app.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

app.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    res.redirect("/");
})
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
    if(!err.message) err.message = "Something went wrong.";
    res.status(statusCode).render("error", { err });

})
app.listen(3000, () => {
    console.log("Serving on port 3000");
});