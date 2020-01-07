const express = require("express");
let cors = require("cors");
let db = require("./data/db");

const server = express();
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Hello World");
});
// Add's new user
server.post("/users", (req, res) => {
  const user = req.body;
  const { name, bio } = user;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else if (name & bio) {
    db.insert(req.body)
      .then(user => {
        db.findById(user.id)
          .then(found => {
            res.status(200).json(found);
          })
          .catch(() => {
            json
              .status(500)
              .json({ message: "There was an error retrieving the user" });
          });
      })
      .catch(() => {
        json.status(500).json({
          message: "There was an error while saving the user to the database"
        });
      });
  }
});
// Fetch all users
server.get("/users", (req, res) => {
  db.find()
    .then(users => res.send(users))
    .catch(err =>
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." })
    );
});
// Fetch specific user
server.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    });
});
// Delete user
server.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(removed => {
      if (!removed) {
        res.status(200).json({ message: "user removed sucessfully", removed });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});
// Update specific user
server.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const { name, bio } = user;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  }
  db.update(id, user)
    .then(updatedUser => {
      if (!updatedUser) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res
          .status(200)
          .json({ message: "The user information was updated successfully" });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The user information could not be modified" });
    });
});

server.listen(5000, () => console.log(`Server running on port 5000`));
