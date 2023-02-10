const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
  const validOutput = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
  suite('Sudoku Tests Route: /app/solve', () => {
    const apiRoute = '/api/solve'
    test('Solve a puzzle with valid puzzle string', function (done) {
      const puzzle = validPuzzle
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, validOutput)
          done();
        });
    });
    test('Solve a puzzle with missing puzzle string', function (done) {
      chai.request(server)
        .post(apiRoute)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing')
          done();
        });
    });
    test('Solve a puzzle with invalid characters', function (done) {
      const puzzle =
        'ABC..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done();
        });
    });
    test('Solve a puzzle with incorrect length', function (done) {
      const puzzle =
        '..5.1.85.4....2';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done();
        });
    });
    test('Solve a puzzle that cannot be solved', function (done) {
      const puzzle =
        '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved')
          done();
        });
    });
  })
  suite('Sudoku Tests Route: /app/check', () => {
    const apiRoute = '/api/check'
    test('Check a puzzle placement with all fields', function (done) {
      const puzzle = validPuzzle
      const coordinate = 'A1';
      const value = '7';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });
    test('Check a puzzle placement with single placement conflict', function (done) {
      const puzzle = validPuzzle
      const coordinate = 'A5';
      const value = '9';
      const conflict = ['row'];
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid)
          assert.deepEqual(res.body.conflict, conflict)
          done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts', function (done) {
      const puzzle = validPuzzle
      const coordinate = 'A1';
      const value = '1';
      const conflict = ['row', 'column'];
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid)
          assert.deepEqual(res.body.conflict, conflict)
          done();
        });
    });
    test('Check a puzzle placement with all placement conflicts', function (done) {
      const puzzle = validPuzzle
      const coordinate = 'A1';
      const value = '5';
      const conflict = ['row', 'column', 'region'];
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid)
          assert.deepEqual(res.body.conflict, conflict)
          done();
        });
    });
    test('Check a puzzle placement with missing required fields', function (done) {
      const puzzle = validPuzzle
      const value = '1';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing')
          done();
        });
    });
    test('Check a puzzle placement with invalid characters', function (done) {
      const puzzle = validPuzzle.replace('.', 'S')
      const coordinate = 'A1';
      const value = '1';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done();
        });
    });
    test('Check a puzzle placement with incorrect length', function (done) {
      const puzzle = '1.4.3'
      const coordinate = 'A1';
      const value = '1';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done();
        });
    });
    test('Check a puzzle placement with invalid placement coordinate', function (done) {
      const puzzle = validPuzzle
      const coordinate = 'a1';
      const value = '1';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate')
          done();
        });
    });
    test('Check a puzzle placement with invalid placement value', function (done) {
      const puzzle = validPuzzle
      const coordinate = 'A1';
      const value = 'X';
      chai.request(server)
        .post(apiRoute)
        .send({ puzzle, coordinate, value })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value')
          done();
        });
    });
  })
});
