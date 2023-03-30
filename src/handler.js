/* eslint-disable linebreak-style */
/* eslint-disable max-len */

const nanoId = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const {title, tags, body} = request.payload;
  const id = nanoId.nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  console.log(createdAt);

  const newNote = {title, tags, body, id, createdAt, updatedAt};
  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil disimpan',
      data: {
        noteid: id,
      },
    });
    response.code(201);
    /* response.header('Access-Control-Allow-Origin', '*'); untuk memberikan akses ke origin yang berbeda*/

    return response;
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);

  return response;
};

const getNoteHandler = () => ({
  status: 'success',
  data: {notes},
});

const getNoteByIdHandler = (request, h) => {
  const {id} = request.params;
  const note = notes.filter((note) => note.id === id)[0];

  if (note !== undefined) {
    const response = h.response({
      status: 'success',
      data: {note},
    });
    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);

  return response;
};

const editNoteByIdHandler = (request, h) => {
  const {id} = request.params;
  const {title, tags, body} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan gagal diperbaharui, Id tidak ditemukan',
  });
  response.code(400);

  return response;
};

const deleteNotesByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(400);

  return response;
};

module.exports = {
  addNoteHandler,
  getNoteHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNotesByIdHandler,
};
