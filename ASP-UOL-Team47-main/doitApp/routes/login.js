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

/* POST /login page. */
router.post("/", (req, res) => {
  const { username, password } = req.body;

  var passwordHash = "";
  if (username == null) {
    return res.status(400).send("Can't find user.");
  } else {
    try {
      //DB request by username if user exists ,
      // DB will return username, password,userID in row variable
      users.VerifyPassword(username, async (err, row) => {
        if (err) {
          //If any error while DB user verification
          console.error(err);
          return res.status(500).send();
        }

        var dbPassword = row.password;
        var dbUserID = row.userID;

        if (await bcrypt.compare(password, dbPassword)) {
          //This Block is for successful validation of user and password
          console.log(row.userName);
          console.log("User:" + username + " has logged in.");
          const userSessionId = uuid();
          sessions[userSessionId] = { username, userId: 1 };

          //userId, sessionId,isValid,timer,createdTime Parameters are needed
          users.addUserSession(
            dbUserID,
            userSessionId,
            "true",
            1400,
            "2023-01-30 10:00:00",
            (err) => {
              if (err) {
                return;
              }
            }
          );
          res.set("Set-Cookie", `session=${userSessionId}`);
          return res.status(201).redirect("/dashboard");
        } else {
          return res
            .status(401)
            .render("login", {
              title: "Login",
              errMsg: "Invalid username or password!",
            });
        }
      });
    } catch {
      return res
        .status(401)
        .render("login", {
          title: "Login",
          errMsg: "Invalid username or password!",
        });
    }
  }
});

module.exports = router;
