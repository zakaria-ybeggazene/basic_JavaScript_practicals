//import * as pg from 'pg'
const pg = require('pg');

const config = {
    user: "knguye10_a",
    host: "localhost",
    database: "knguye10_a",
    port: 5444,
    password: "knguye10_a"
};

const pool = new pg.Pool(config);

function queryMoviesByTitle(name, callback) {
    /*
    const n = '%' + name + '%';
    const p = pool.query("SELECT title FROM MOVIE_A WHERE title LIKE $1",[n]); //pour éviter les injection SQL
    */

    const n = name.replace("'", "''");
    const p = pool.query(`SELECT title FROM MOVIE_A WHERE title LIKE '%${n}%'`);
    p.then((res) => callback(res.rows));
}

module.exports = { queryMoviesByTitle };