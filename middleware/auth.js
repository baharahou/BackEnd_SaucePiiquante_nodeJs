const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.Token);
        const userId = decodedToken.userId;
        if (userId) {
            req.auth = {
                userId: userId
            };
            next();
        } else{
            throw "Invalid userId";
        }
    } catch (error) {
        res.status(401).json({ error : new Error('Invalid Token')});
    }
}