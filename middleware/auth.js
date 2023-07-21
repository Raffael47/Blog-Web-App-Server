const jwt = require('jsonwebtoken')

module.exports = {
    verifyToken: (req, res, next) => {
        try {
            let token = req.headers.authorization;
            if (!token) res.status(401).send({message: 'Unauthorized Request'});
            token = token.split(' ')[1];

            let verifiedUser = jwt.verify(token, process.env.KEY_JWT);
            req.token = token;
            req.user = verifiedUser;
            next();

        } catch (err) {
            res.status(400).send({message: 'Invalid Token'});
        }
    }
}