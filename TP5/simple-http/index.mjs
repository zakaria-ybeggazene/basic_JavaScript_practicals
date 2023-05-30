import * as http from 'http'
import * as http_utils from './modules/http_utils.mjs'
import * as movies_db from './modules/movies_db.js'

const server = http.createServer((req, resp) => {
    const url = req.url;
    const fields = url.split("?");
    const url_path = fields[0];
    const params = fields.length > 1 ? fields[1] : "";
    
    if (url_path == "/movies") {
        const p = params.split("=");
        if (p.length == 2 && p[0] == 'title') {
            movies_db.queryMoviesByTitle(p[1], (res) => {
                resp.setHeader("Content-Type", "application/json");
                resp.write(JSON.stringify(res));
                resp.end();
            });
            return;
        }
    }
    http_utils.serve_static_file(req, resp, ".", url_path);
});

server.listen(9000);