const STORAGE_KEY = "dataBooks";
const RENDER_EVENT = "render-books";
let arrayData = [];

function generateId() {
	return +new Date();
}

function generateObject(id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year,
		isComplete,
	};
}

function addData() {
	const valueTitle = document.querySelector("input[name='title']").value;
	const valueAuthor = document.querySelector("input[name='author']").value;
	const valueYear = parseInt(
		document.querySelector("input[name='year']").value
	);
	const valueIsComplete = document.querySelector(
		"input[name='isComplete']"
	).checked;

	const dataObject = generateObject(
		generateId(),
		valueTitle,
		valueAuthor,
		valueYear,
		valueIsComplete
	);

	arrayData.push(dataObject);

	saveToLocalStorage();
}

function makeFrontDataBooks(dataObject) {
	const { id, title, author, year, isComplete } = dataObject;

	const itemBook = document.createElement("div");
	itemBook.setAttribute("class", "item-book");
	itemBook.setAttribute("id", id);

	const descriptionBook = document.createElement("div");
	descriptionBook.setAttribute("class", "description-book");

	const titleBook = document.createElement("h1");
	titleBook.setAttribute("class", "title-book");
	titleBook.innerText = title;

	const authorBook = document.createElement("p");
	authorBook.setAttribute("class", "author-book");
	authorBook.innerText = `Author: ${author}`;

	const yearBook = document.createElement("p");
	yearBook.setAttribute("class", "year-book");
	yearBook.innerText = `Year: ${year}`;

	descriptionBook.append(titleBook, authorBook, yearBook);

	const buttonAction = document.createElement("div");
	buttonAction.setAttribute("class", "btn-action");

	const buttonActionMark = document.createElement("button");
	const buttonActionDelete = document.createElement("button");
	const imgAction = document.createElement("img");
	const spanAction = document.createElement("span");

	if (isComplete) {
		const imgAction = document.createElement("img");
		const spanAction = document.createElement("span");
		imgAction.setAttribute("src", "./assets/images/unread.svg");
		spanAction.innerText = "Mark As Unread";

		buttonActionMark.append(imgAction, spanAction);
		buttonActionMark.addEventListener("click", () => {
			markAsUnreadBook(id);
		});
	} else {
		const imgAction = document.createElement("img");
		const spanAction = document.createElement("span");
		imgAction.setAttribute("src", "./assets/images/readed.svg");
		spanAction.innerText = "Mark As Read";

		buttonActionMark.append(imgAction, spanAction);
		buttonActionMark.addEventListener("click", () => {
			markAsReadBook(id);
		});
	}

	imgAction.setAttribute("src", "./assets/images/trash.svg");
	spanAction.innerText = "Delate";
	buttonActionDelete.append(imgAction, spanAction);
	buttonActionDelete.addEventListener("click", () => {
		delateBook(id);
	});

	buttonAction.append(buttonActionMark, buttonActionDelete);

	itemBook.append(descriptionBook, buttonAction);

	return itemBook;
}

function findId(bookId) {
	for (const bookItem of arrayData) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}
}

function markAsUnreadBook(bookId) {
	const bookTarget = findId(bookId);

	if (bookTarget == null);
	bookTarget.isComplete = false;

	saveToLocalStorage();
}

function markAsReadBook(bookId) {
	const bookTarget = findId(bookId);

	if (bookTarget == null);
	bookTarget.isComplete = true;

	saveToLocalStorage();
}

function findBookIndex(bookId) {
	for (const index in arrayData) {
		if (arrayData[index].id === bookId) {
			return index;
		}
	}
	return -1;
}

function delateBook(bookId) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	arrayData.splice(bookTarget, 1);

	saveToLocalStorage();
}

function searchBook() {
	const searchInput = document
		.querySelector(".form-search input")
		.value.toLowerCase();

	const filteredBooks = arrayData.filter((book) => {
		const titleBook = book.title.toLowerCase();
		const authorBook = book.author.toLowerCase();

		return (
			titleBook.includes(searchInput) || authorBook.includes(searchInput)
		);
	});

	renderFilteredBooks(filteredBooks);
}

function renderFilteredBooks(filteredBooks) {
	const readedBooks = document.querySelector(
		".bookshelf-readed .container-books"
	);

	const unreadBooks = document.querySelector(
		".bookshelf-unread .container-books"
	);

	readedBooks.innerHTML = "";
	unreadBooks.innerHTML = "";

	for (const item of filteredBooks) {
		const frontItem = makeFrontDataBooks(item);
		if (item.isComplete === true) {
			readedBooks.append(frontItem);
		} else {
			unreadBooks.append(frontItem);
		}
	}
}

function saveToLocalStorage() {
	const parseData = JSON.stringify(arrayData);
	localStorage.setItem(STORAGE_KEY, parseData);
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function loadDataFromStorageToArray() {
	const localStorageData = localStorage.getItem(STORAGE_KEY);
	const parseData = JSON.parse(localStorageData);

	if (parseData !== null) {
		for (const itemData of parseData) {
			arrayData.push(itemData);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
	if (typeof Storage === undefined) {
		alert("Browser Tidak Didukung Local Storage");
		return false;
	}
	return true;
}

document.addEventListener("DOMContentLoaded", () => {
	if (isStorageExist()) {
		loadDataFromStorageToArray();
	}

	const saveForm = document.querySelector(".form-input-books form");
	saveForm.addEventListener("submit", (e) => {
		e.preventDefault();
		addData();
		document.dispatchEvent(new Event(RENDER_EVENT));
	});

	const searchBookForm = document.querySelector(".form-search form");
	searchBookForm.addEventListener("submit", (e) => {
		e.preventDefault();
		searchBook();
	});
});

document.addEventListener(RENDER_EVENT, () => {
	const readedBooks = document.querySelector(
		".bookshelf-readed .container-books"
	);

	const unreadBooks = document.querySelector(
		".bookshelf-unread .container-books"
	);

	readedBooks.innerHTML = "";
	unreadBooks.innerHTML = "";

	for (const item of arrayData) {
		const frontItem = makeFrontDataBooks(item);
		if (item.isComplete === true) {
			readedBooks.append(frontItem);
		} else {
			unreadBooks.append(frontItem);
		}
	}
});
