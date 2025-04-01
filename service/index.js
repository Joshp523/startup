const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const port = 4000;

const authCookieName = 'token';

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = [];
let budgetData = {};
let goalData = {};


// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (user = await findUser('name', req.body.name)) {
        const familyMatch = await bcrypt.compare(req.body.familyId, user.family);
        if (familyMatch) {
            res.status(409).send({ msg: 'Existing user' });
        }
    } else {
        const user = await createUser(req.body.name, req.body.password, req.body.familyId);
        if (!budgetData[familyId]) {
            budgetData[familyId] = [];
            console.log(`Initialized budgetData for familyId: ${familyId}`);
          }
          if (!goalData[familyId]) {
            goalData[familyId] = [];
            console.log(`Initialized goalData for familyId: ${familyId}`);
          }
        setAuthCookie(res, user.token);
        res.send({ name: user.name });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('name', req.body.name);
    if (user) {
        const familyMatch = await bcrypt.compare(req.body.familyId, user.family);
        if (familyMatch) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                user.token = uuid.v4();
                setAuthCookie(res, user.token);
                res.send({ name: user.name });
                return;
            }
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// GetfamilyData returns the family data
apiRouter.get('/budgetData', verifyAuth, (_req, res) => {
    res.send(budgetData[req.query.familyId]);
});

apiRouter.get('/goalData', verifyAuth, (_req, res) => {
    res.send(goalData[req.query.familyId]);
});

// PostfamilyData updates the family data
apiRouter.post('/budgetData', verifyAuth, (req, res) => {
    budgetData[req.body.familyId].push(req.body.transaction);
    res.send(budgetData);
});

apiRouter.post('/goalData', verifyAuth, (req, res) => {
    goalData[req.data.familyId].push(req.body.goal);
    res.send(goalData);
});


// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

async function createUser(name, password, familyId) {
    const passwordHash = await bcrypt.hash(password, 10);
    const familyIdHash = await bcrypt.hash(familyId, 10);

    const user = {
        name: name,
        family: familyIdHash,
        password: passwordHash,
        token: uuid.v4(),
    };
    users.push(user);

    return user;
}

async function findUser(field, value) {
    if (!value) return null;

    return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
