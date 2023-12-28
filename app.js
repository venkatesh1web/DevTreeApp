const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const { connectToDB } = require('./db'); // Import connectToDB

const app = express();

// Connect to the database
connectToDB()
    .then(() => {
        console.log('Database connected...');
        
        // Setup session options after the database is connected
        const router = require('./router');
        const sessionOptions = session({
            secret: "Js is cool",
            store: MongoStore.create({
                mongoUrl: process.env.URL,
                ttl: 60 * 60 * 24,
                autoRemove: 'native',
            }),
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 1000 * 60 * 60 * 10, httpOnly: true },
        });

        app.use(sessionOptions);
        app.use(flash());

        app.use(function(req, res, next) {
            res.locals.errors = req.flash("errors");
            res.locals.success = req.flash("success");

            if(req.session.user){
                req.visitorId = req.session.user._id;
            } else {
                req.visitorId = 0;
            }
            res.locals.user = req.session.user;
            next();
        });

        app.use(express.static('public'));
        app.use(express.urlencoded({extended: false}));
        app.use(express.json());

        app.set('view engine', 'ejs');

        app.use('/', router);

        const server = require('http').createServer(app);
        const io = require('socket.io')(server);

        // make expression session data available from socket
        io.use(function(socket, next) {
            // Wrap the sessionOptions middleware to handle errors
            sessionOptions(socket.request, socket.request.res, function(err) {
                if (err) {
                    return next(err);
                }
        
                // Now you can access session data
                if (socket.request.session.user) {
                    let user = socket.request.session.user;
                    socket.emit('welcome', { username: user.username, avatar: user.avatar });
        
                    socket.on('chatMessageFromBrowser', function(data) {
                        socket.broadcast.emit('chatMessageFromServer', { message: data.message, username: user.username, avatar: user.avatar });
                    });
                }
        
                next(); // Call next to proceed with the regular socket.io middleware
            });
        });

        io.on('connection', (socket) => {
            if(socket.request.session.user){
                let user = socket.request.session.user;
                socket.emit('welcome', {username: user.username, avatar: user.avatar});

                socket.on('chatMessageFromBrowser', function(data){
                    socket.broadcast.emit('chatMessageFromServer', {message: data.message, username: user.username, avatar: user.avatar});
                });
            }
        });

        // Error handling middleware
        app.use(function (err, req, res, next) {
            if (err.name === 'UnauthorizedError') {
                // Handle unauthorized access (session expired, etc.)
                req.session.destroy(); // Destroy the session to clear any potentially corrupted state
                return res.redirect('/login'); // Redirect to login page or handle as needed
            }
        
            // Handle other errors or pass them to the default error handler
            next(err);
        });

        const port = process.env.PORT || 8000; // Default to port 3000 if not provided
        server.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process if database connection fails
    });
