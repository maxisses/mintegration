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
let indexRoutes = require("./routes/index"),
    lernboxenRoutes = require("./routes/lernboxen");

//mongo db
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

if (process.env.MONGOURL) {
    mongoose.connect("mongodb+srv://maxisses:"+process.env.MONGOPW+"@"+process.env.MONGOURL"/"process.env.MONGODB).then(() => {
        console.log('successfully connected to the local database');
    }).catch(err => {
        console.log('--- error connecting to the remote database ---');
        // process.exit()
    });
    }else{
    mongoose.connect("mongodb://maxisses:051213@mongodb:27017/submissions", options).then(() => {
        console.log('successfully connected to the local database');
    }).catch(err => {
        console.log('--- error connecting to container database; are you running with docker compose? ---');
        // process.exit()
    });
    }

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


//to pass the user to every!!! route 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// using express router to split up code
app.use(indexRoutes);

app.use("/lernboxen", lernboxenRoutes);



// start a web server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

