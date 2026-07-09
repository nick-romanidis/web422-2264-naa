const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  fullName: String,
  role: String,
});

let User; // This will happen on first connect

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    const db = mongoose.createConnection(process.env.MONGODB_CONNECTION_STRING);

    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password != userData.password2) {
      reject("Passwords do not match.");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;

          const newUser = new User(userData);

          newUser
            .save()
            .then(() => {
              resolve(
                "User " + userData.userName + " successfully registered.",
              );
            })
            .catch((err) => {
              if (err.code == 11000) {
                reject("User name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            });
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName })
      .limit(1)
      .exec()
      .then((users) => {
        if (users.length == 0) {
          reject("Unable to find user " + userData.userName);
        } else {
          bcrypt.compare(userData.password, users[0].password).then((res) => {
            if (res === true) {
              resolve(users[0]);
            } else {
              reject("Incorrect password for user " + userData.userName);
            }
          });
        }
      })
      .catch((err) => {
        reject("Unable to find user " + userData.userName);
      });
  });
};
