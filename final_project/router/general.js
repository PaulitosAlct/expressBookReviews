const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exists
        if (!isValid(username)) {
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
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Reviews not found for this book"})
  }
});

// Task 10 - get book list with promise callbacks
function getBookList() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books availabe");
        }
    });
}

public_users.get('/books', (req, res) => {
    getBookList()
    .then(bookList => {
        res.status(200).json(bookList);
    })
    .catch(error => {
        res.status(500).json({message: error});
    });
});

// Task 11 - get book details  based on ISBN with promises callbacks
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(`Book with the ISBN ${isbn} not found`);
        }
    });
}

public_users.get('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    getBookByISBN(isbn)
    .then(book => {
        res.status(200).json(book);
    })
    .catch(error => {
        res.status(404).json({message: error});
    });
});

// Task 12 - get book details based on author with promises callbacks
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) =>{
        const filteredBooks = Object.values(books).filter(book => book.author === author);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject(`No books found for author: ${author}`);
        }
    } );
}

public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author;

    getBooksByAuthor(author)
    .then(booksByAuthor => {
        res.status(200).json(booksByAuthor);
    })
    .catch( error => {
        res.status(404).json({message: error})
    })
})

module.exports.general = public_users;
