const express = require("express");
const uuid = require("uuid").v4;
const router = express.Router();
const users = require("./users");
const bcrypt = require("bcrypt");

const sessions = {};
/* GET login page. */
router.get("/", (req, res, next) => {
  res.render("login", { title: "Login" });
});

router.post("/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashPasswordStr = await bcrypt.hash(password, 10);
    console.log(hashPasswordStr);
    var isValid = false;
    console.log("Test isValid user:" + isValid);
    users
      .VerifyUser(username)
      .then((exists) => {
        console.log(`User exists: ${exists}`);
        if (exists == 0) {
          users.AddUser(email, username, hashPasswordStr);
          return res.status(201).redirect("/login");
        } else {
          console.log("Warning:Username already exists");
          return res
            .status(401)
            .render("index", {
              title: "Doit",
              errMsg: "Username is already exists",
            });
        }
      })
      .catch((err) => {
        return res.status(500).send();
      });
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
