const express = require('express');
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 1790;

server.listen(port, () => {
    console.log(`[server] Listening on port ${port}...`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(__dirname + "/node_modules/socket.io-client/dist"));
app.use("/css", express.static(__dirname + "/css"));

function generateRandomCode() {
    let code = '';
    for (let i = 0; i < 5; i++)
        code += String.fromCharCode(Math.floor(Math.random() * 25) + 65);
    return code;
}

let clients = [];

io.on("connection", socket => {
    const KEY = generateRandomCode();
    clients.push({socket: socket, key: KEY});
    socket.emit("code", KEY);
});

app.get('/key/:key', (req, res) => {
    for (const s of clients) {
        console.log(s.key, req.params.key.toUpperCase());
        if (s.key == req.params.key.toUpperCase()) {
            console.log("VIBRATE SENT");
            s.socket.emit("vibrate", {});
        }
    }
    res.send(200);
});