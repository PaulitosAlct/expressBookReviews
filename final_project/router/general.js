const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let users = []


//Check if a user with the given username already exists
const doesExist = (username) => {
    //Filter the users array for any user with the same username
    let userWithSameName = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exists
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the ISBN parameter from the request URL and send the corresponding book details
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn]);
    } else {
        res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];
    for (const bookId in books) {
        if (books[bookId].author === author) {
            booksByAuthor.push(books[bookId]);
        }
    }
    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({message: "No books found by Author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];
    for (const bookId in books) {
        if (books[bookId].title === title) {
            booksByTitle.push(books[bookId]);
        }
    }
    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({message: "No books found by title"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Reviews not found for this book"})
  }
});

module.exports.general = public_users;
