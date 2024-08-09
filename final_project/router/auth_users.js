const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};


const authenticatedUser = (username, password) => {
  // Check if the username and password match any user in the users array
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
      req.session.user = { username };
      return res.status(200).json({ message: "Login successful" });
  } else {
      return res.status(401).json({ message: "Invalid username or password" });
  }
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the request parameters
    const { review } = req.body; // Extract the review from the request body
    const username = req.session.user.username; // Get the username from the session

    // Check if the book exists
    if (books[isbn]) {
        // If the book exists, add or modify the review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review successfully added/modified" });
    } else {
        // If the book doesn't exist, return a 404 error
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const username = req.session.user.username; // Get the username from the session

  // Check if the book exists
  if (books[isbn]) {
      // Check if the user has a review for this book
      if (books[isbn].reviews[username]) {
          delete books[isbn].reviews[username]; // Delete the review
          return res.status(200).json({ message: "Review successfully deleted" });
      } else {
          return res.status(404).json({ message: "Review not found" });
      }
  } else {
      // If the book doesn't exist, return a 404 error
      return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
