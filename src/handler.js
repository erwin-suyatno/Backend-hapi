/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = Boolean(pageCount === readPage);
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);
  const isSuccess = books.filter((b) => b.id === id).length > 0;
  if (request.payload.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getAllBooks = (request, h) => {
  const getBook = books.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher }));
  const Bookname = books.filter((n) => n.name.toLowerCase() === String(request.query.name).toLowerCase());
  const Reading = books.filter((r) => r.reading === true);
  const NotReading = books.filter((nr) => nr.reading === false);
  const Finish = books.filter((f) => f.finished === true);
  const NotFinish = books.filter((nf) => nf.finished === false);
  if (Number(request.query.finished) === 1) {
    const response = h.response({
      status: 'success',
      data: {
        books: Finish.map((b) => (({ id: b.id, name: b.name, publisher: b.publisher }))),
      },
    });
    response.code(200);
    return response;
  }
  if (Number(request.query.finished) === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: NotFinish.map((b) => (({ id: b.id, name: b.name, publisher: b.publisher }))),
      },
    });
    response.code(200);
    return response;
  }
  if (Number(request.query.reading) === 1) {
    const response = h.response({
      status: 'success',
      data: {
        books: Reading.map((b) => (({ id: b.id, name: b.name, publisher: b.publisher }))),
      },
    });
    response.code(200);
    return response;
  }
  if (Number(request.query.reading) === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: NotReading.map((b) => (({ id: b.id, name: b.name, publisher: b.publisher }))),
      },
    });
    response.code(200);
    return response;
  }
  if (request.query.name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: Bookname.map((b) => (({ id: b.id, name: b.name, publisher: b.publisher }))),
      },
    });
    response.code(200);
    return response;
  }
  if (getBook !== undefined) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        books: getBook,
      },
    });
    response.code(200);
    return response;
  }
  return {
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      books,
    },
  };
};
const getDetailBook = (request, h) => {
  const { id } = request.params;
  const getDetail = books.filter((n) => n.id === id)[0];
  if (getDetail !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: getDetail,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBook = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteBook = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addBook, getAllBooks, getDetailBook, editBook, deleteBook,
};
