const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const veryfiyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authorised");
  }
};

const veryfiyTokenAndAuthorization = (req, res, next) => {
  veryfiyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that");
    }
  });
};

const veryfiyTokenAndAdmin = (req, res, next) => {
    veryfiyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that");
      }
    });
  };

module.exports = { 
    veryfiyToken,
    veryfiyTokenAndAuthorization,
    veryfiyTokenAndAdmin };
