import * as http from 'http';
import path from 'path';
import * as fs from 'fs';

/**
 * 
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} resp 
 * @param {Number} code 
 * @param {String} msg 
 */
function http_error(req, resp, code, msg) {
    resp.statusCode = code;
    resp.setHeader("Content-Type", "text/html");
    resp.write(`
<!DOCTYPE html>
<html>
    <head>
        <title>Error ${code}</title>
    </head>
    <bode>
        <h1>${req.url}</h1>
        <h1>Error ${code} : ${msg}</h1>
    </body>
</html>
    `);
    resp.end(); //il faut mettre ça pour dire qu'on a fini d'écrire la requête et qu'elle est prête à être envoyée au client
}

export function error_404(req, resp) {
    http_error(req, resp, 404, "Not found");
}

export function error_403(req, resp) {
    http_error(req, resp, 403, "Permission denied");
}

export function error_500(req, resp, msg) {
    http_error(req, resp, 500, msg);
}

const MIME_TYPES = {
    ".htm" : "text/html",
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "text/javascript",
    ".json" : "application/json",
    ".jpeg" : "image/jpeg",
    ".jpg" : "image/jpeg",
    ".png" : "image/png",
    ".ico" : "image/vnd.microsoft.icon",
    ".gif" : "image/gif"
};

export function serve_static_file(req, resp, base, file) {
    const p = path.join(base, file);
    fs.readFile(p, (err, data) => {
        if (err) {
            if (err.code == "ENOENT") {
                error_404(req, resp);
            }
            else if (err.code == "EACCES") {
                error_403(req, resp);
            } else {
                error_500(req, resp, err.toString());
            }
        } else {
            const res = p.match(/[.][^.]*$/);
            let type = "application/octet-stream";
            if (res != null && res[0] in MIME_TYPES) {
                type = MIME_TYPES[res[0]];
            }
            resp.setHeader("Content-Type", type);
            resp.write(data);
            resp.end();
        }
    })
}