// Book constructor
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }   
}

class UI{
    //add book to list
    addBookToList(book){
        const list = document.getElementById('book-list');
        //create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="delete">x</a></td>
        `;      
        list.appendChild(row); 
    }

     //show alert
     showAlert(message, className){
        //create div
        const div = document.createElement('div');
        //add classes
        div.className = `alert ${className}`;
        //add text
        div.appendChild(document.createTextNode(message));
        //get parent
        const container = document.querySelector('.container');
        //get form
        const form = document.querySelector('#book-form');
        //insert alert
        container.insertBefore(div,form);

        //timeout after 3s
        setTimeout(function() {
           document.querySelector('.alert').remove(); 
        }, 3000);
    }
    //delete book
    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}
//local storage class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(book => {
            const ui = new UI();

            //add book to ui
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book,index) =>{
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function(e){
    //get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
    //instantiating book
    const book = new Book(title,author,isbn);

    //instantiate UI
    const ui = new UI();

    //validation
    if(title === '' || author === '' || isbn === ''){
        // error alert
        ui.showAlert('please fill in all fields!', 'error');
    }else{
        //show alert
        ui.showAlert('Book added to List!', 'success');
        //add new book to list
        ui.addBookToList(book);

        //add to ls
        Store.addBook(book);

        //clear fields
        ui.clearFields();
    }
    

    e.preventDefault();
});

//event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    const ui = new UI();
    ui.deleteBook(e.target);
//remove from localstorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    ui.showAlert('book removed!', 'success'); 

    e.preventDefault();
});