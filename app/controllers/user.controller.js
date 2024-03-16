const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const config = require('../config/auth.config');
const User = db.user;

const signup = async (req, res) => {
    try {
        // Kullanıcı şifresini hash'le
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);

        // Yeni kullanıcıyı oluştur
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "user",
        });

        // JWT oluştur
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400, // 24 saat
        });

        res.status(200).send({ auth: true, token: token, userid: user.id, role: user.role});
    } catch (error) { 
        res.status(500).send({error: error.message});
    }
};

const signin = async (req, res) => {
  // Kullanıcıyı bul
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res.status(404).send("No user found.");
  }

  // Şifre doğruluğunu kontrol et
  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({ auth: false, token: null });
  }

  // JWT oluştur
  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, // 24 saat
  });

  res.status(200).send({ auth: true, token: token, role: user.role });
};

const logout = (req, res) => {
  res.status(200).send({ auth: false, token: null });
};

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Kullanıcı adının benzersizliğini kontrol et
  let user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (user) {
    return res
      .status(400)
      .send({ message: "Failed! Username is already in use!" });
  }

  // E-posta adresinin benzersizliğini kontrol et
  user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    return res
      .status(400)
      .send({ message: "Failed! Email is already in use!" });
  }

  next();
};

module.exports = {
  signup,
  signin,
  logout,
  verifyToken: (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  },
  isAdmin: async (req, res, next) => {
    const user = await User.findByPk(req.userId);
    if (user && user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
  },
  checkDuplicateUsernameOrEmail,
};
