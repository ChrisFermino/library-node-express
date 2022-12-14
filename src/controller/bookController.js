import books from "../models/book.js";

class BookController {
    static getBooks = (req, res) => {
        books.find().populate('author')
            .exec((err, books) => {
                res.status(200).json(books);
            });
    };

    static getBookById = (req, res) => {
        const id = req.params.id;
        books.findById(id)
            .populate('author', 'name')
            .exec((err, books) => {
                if (err) {
                    res.status(400).send({message: `${err.message} - Book Id not found`})
                } else {
                    res.status(200).send(books)
                }
            })
    }

    static getBookSearch = (req, res) => {
        if (req.query.name) {
            const tittle = req.query.name
            books.find({'tittle': {$regex: `(.*)${tittle}(.*)`}}, {}, (err, books) => {
                res.status(200).send(books);
            })

        } else if (req.query.publishing) {
            const publishing = req.query.publishing
            books.find({'publishing': {$regex: `(.*)${publishing}(.*)`}}, {}, (err, books) => {
                res.status(200).send(books);
            })
        } else res.status(404).send({message: `Search Not Found`})
    }

    static saveBook = (req, res) => {
        let book = new books(req.body)
        book.save((err) => {

            if (err) {
                res.status(500).send({message: `${err.message} - failed to save book`})
            } else {
                res.status(201).send(book.toJSON())
            }
        })
    }

    static editBook = (req, res) => {
        const id = req.params.id;

        books.findByIdAndUpdate(id, {$set: req.body}, (err) => {
            if (!err) {
                res.status(200).send({message: `Book updated with success`})
            } else {
                res.status(500).send({message: err.message})
            }
        })
    }

    static deleteBook = (req, res) => {
        const id = req.params.id;
        books.findByIdAndDelete(id, (err) => {
            if (!err) {
                res.status(200).send({message: `Book deleted with success`})
            } else {
                res.status(500).send({message: err.message})
            }
        })
    }
}

export default BookController;
