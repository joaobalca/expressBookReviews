const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is already taken
  if (isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
async function getAllBooks() {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(books);
      }, 1000); // Simulate an asynchronous operation with a 1-second delay
  });
}

// Get all books (Async/Await)
public_users.get('/', async function (req, res) {
  try {
      const allBooks = await getAllBooks();
      return res.status(200).json(allBooks);
  } catch (err) {
      return res.status(500).json({ message: "Error fetching books" });
  }
});


// Get book details based on ISBN
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const book = books[isbn];
          if (book) {
              resolve(book);
          } else {
              reject("Book not found");
          }
      }, 1000); // Simulate an asynchronous operation with a 1-second delay
  });
}

// Get book details based on ISBN (Using Promises)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
      .then(book => {
          return res.status(200).json(book);
      })
      .catch(err => {
          return res.status(404).json({ message: err });
      });
});


  
// Get book details based on author
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const booksByAuthor = [];
          for (const isbn in books) {
              if (books[isbn].author === author) {
                  booksByAuthor.push({ isbn, ...books[isbn] });
              }
          }
          if (booksByAuthor.length > 0) {
              resolve(booksByAuthor);
          } else {
              reject("No books found for this author");
          }
      }, 1000); // Simulate an asynchronous operation with a 1-second delay
  });
}

// Get books based on author (Using Promises)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  getBooksByAuthor(author)
      .then(books => {
          return res.status(200).json(books);
      })
      .catch(err => {
          return res.status(404).json({ message: err });
      });
});



// Get all books based on title
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const booksByTitle = [];
          for (const isbn in books) {
              if (books[isbn].title === title) {
                  booksByTitle.push({ isbn, ...books[isbn] });
              }
          }
          if (booksByTitle.length > 0) {
              resolve(booksByTitle);
          } else {
              reject("No books found with this title");
          }
      }, 1000); // Simulate an asynchronous operation with a 1-second delay
  });
}
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  getBooksByTitle(title)
      .then(books => {
          return res.status(200).json(books);
      })
      .catch(err => {
          return res.status(404).json({ message: err });
      });
});



// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const book = books[isbn]; // Look up the book in the books object

  if (book && book.reviews) {
      res.status(200).json(book.reviews); // If the book is found, return the reviews
  } else {
      res.status(404).json({ message: "Book not found or no reviews available" }); // If the book is not found or no reviews, return a 404
  }
});


module.exports.general = public_users;
