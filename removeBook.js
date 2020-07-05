const {addBook, addChapter, removeBook} = require('./wx')

console.log(process.argv)

removeBook(process.argv[2])