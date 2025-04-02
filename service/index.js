const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const DB = require('./database.js');

const authCookieName = 'token';

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
    try {
        const { name, password, familyId } = req.body;
        if (!name || !password || !familyId) {
            return res.status(400).send({ msg: 'Name, password, and familyId are required' });
        }
        const user = await findUser('name', name);
        if (user) {
            const familyMatch = await bcrypt.compare(familyId, user.family);
            if (familyMatch) {
                return res.status(409).send({ msg: 'Existing user' });
            }
        }
        const newUser = await createUser(name, password, familyId);
        setAuthCookie(res, newUser.token);
        res.send({ name: newUser.name });
    } catch (error) {
        console.error('Error in /api/auth/create:', error);
        res.status(500).send({ msg: 'Server error', error: error.message });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('name', req.body.name);
    if (user) {
        const familyMatch = await bcrypt.compare(req.body.familyId, user.family);
        if (familyMatch) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                user.token = uuid.v4();
                await DB.updateUser(user);
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
        await DB.updateUser(user);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

const verifyAuth = async (req, res, next) => {
    const token = req.cookies[authCookieName];
    const user = await findUser('token', token);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// GetfamilyData returns the family data
apiRouter.get('/budgetData', verifyAuth, async (req, res) => {
    const budgetData = await DB.getTransactions(req.query.familyId);
    res.send(budgetData);
});

apiRouter.get('/goalData', verifyAuth, async (req, res) => {
    console.log('goalData endpoint reached', req.query.familyId);
    const family = req.user.familyId || req.user.family;
    const goalData = await DB.getGoals(family);
    console.log('completed getGoals call to DB', goalData);
    res.send(goalData);
});

// PostfamilyData updates the family data
apiRouter.post('/budgetData', verifyAuth, async (req, res) => {
    const transactionWithId = { ...req.body.transaction, id: uuid.v4(), family: req.user.familyId };
    const result = await DB.addTransaction(transactionWithId);
    res.send(result);
});

apiRouter.post('/goalData', verifyAuth, async (req, res) => {
    const goal = {
        ...req.body.goal,
        familyId: req.user.familyId,
    };
    const result = await DB.addGoal(goal);
    res.send(result);
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
    if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('Name must be a non-empty string');
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
        throw new Error('Password must be a non-empty string');
    }
    if (!familyId || typeof familyId !== 'string' || familyId.trim() === '') {
        throw new Error('FamilyId must be a non-empty string');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const familyIdHash = await bcrypt.hash(familyId, 10);

    const user = {
        name: name,
        family: familyIdHash,
        password: passwordHash,
        token: uuid.v4(),
        familyId: familyId,
    };
    await DB.addUser(user);

    return user;
}

async function findUser(field, value) {
    if (!value) return null;

    if (field === 'token') {
        return DB.getUserByToken(value);
    }
    return DB.getUser(value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: false,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
