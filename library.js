class Book {

  constructor(title, author, pages, status) {
    this.title  = title;
    this.author = author;
    this.pages  = pages;
    this.status = status;
  }

  changeStatus() {

  }

}

class UI {

  addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td><button class="status button-primary">${book.status}</button></td>
      <td><a href="#" class="delete"><i class="fa fa-trash" aria-hidden="true"></i>
      <a></td>
    `;
    list.appendChild(row);
  }

  showAlert(msg, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.parentElement.className === 'delete') {
      target.parentElement.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.querySelectorAll("input[type=text]").forEach((field) => {
      field.value = '';
    });
  }

}

class Store {
  
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => {
      const ui = new UI;
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(author, title, index) {
    const books = Store.getBooks();
    books.forEach((book) => {
      if (book.title === title && book.author === author) {
        books.splice(index, 1)
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }

}

// Event listener for page load
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// book form submit event listener
document.querySelector('#book-form').addEventListener('submit', (e) => {
  const title   = document.querySelector('#title').value,
        author  = document.querySelector('#author').value,
        pages   = document.querySelector('#pages').value,
        status  = document.querySelector('#status').value;

  const book = new Book(title, author, pages, status);
  const ui   = new UI();

  if (title === '' || author === '' || pages === '') {
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    ui.addBookToList(book);
    Store.addBook(book);
    ui.showAlert('Book added to list', 'success');
    ui.clearFields();
  }

  e.preventDefault();
});

// booklist event listener
document.querySelector('#book-list').addEventListener('click', (e) => {
  const ui = new UI();
  if (e.target.parentElement.className === 'delete') {
    ui.showAlert('Book removed', 'success');
    ui.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent, e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
  }
  if (e.target.textContent === 'Read') {
    e.target.textContent = 'Not Read';
  } else if (e.target.textContent === 'Not Read') {
    e.target.textContent = 'Read';
  }
  e.preventDefault();
});
