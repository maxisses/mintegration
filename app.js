let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"), // for not only having put and post
    User        = require("./models/user"),
    flash       = require("connect-flash");


// using express router to split up code, requiring routes
let commentRoutes = require("./routes/comments"),
    challengeRoutes = require("./routes/challenges"),
    indexRoutes = require("./routes/index"),
    teamRoutes = require("./routes/teams");

    //local DB
/* if (process.env.MONGOURL) {
    mongoose.connect("mongodb+srv://maxisses:"+process.env.MONGOPW+"@cluster0-tuynq.mongodb.net/test?retryWrites=true&w=majority").then(() => {
        console.log('successfully connected to the local database');
    }).catch(err => {
        console.log('error connecting to the database');
        process.exit();
    });;;
    }else{
    mongoose.connect("mongodb://localhost:27017/submission").then(() => {
        console.log('successfully connected to the local database');
    }).catch(err => {
        console.log('error connecting to the database');
        process.exit();
    });;
    } */

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// Passport configuration
app.use(require("express-session")({
    secret: "This could be anything I want and it is the secret",
    resave: false,
    saveUninitialized: false
}));

// required to make passport work
app.use(passport.initialize());
app.use(passport.session());

// thats the method to authenticate in the login route
passport.use(new LocalStrategy(User.authenticate()));

// this will manage the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


//to pass the user to every!!! route just like e.g. {challenge: foundchallenge}
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


// using express router to split up code
app.use(indexRoutes);
    // appends /challenges to all routes in front
app.use("/challenges", challengeRoutes);
    // appends ... to all routes in front
app.use("/challenges/:id/comments", commentRoutes);
    // appends ... to all routes in front
app.use("/challenges/:id/teams", teamRoutes);



// start a web server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

