import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/' || req.url === '/flappy-bird') {
        // Serve the flappy bird game
        const filePath = path.join(__dirname, 'flappy-bird.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Flappy Bird Not Found</h1>');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/health') {
        // Health check endpoint
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', message: 'Flappy Bird Server is running' }));
    } else {
        // Serve a simple index page with links
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Flappy Bird Demo</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .container {
                        text-align: center;
                        background: white;
                        padding: 50px;
                        border-radius: 15px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    }
                    h1 {
                        color: #333;
                        margin-bottom: 30px;
                    }
                    a {
                        display: inline-block;
                        padding: 15px 40px;
                        margin: 10px;
                        background: #667eea;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 18px;
                        transition: background 0.3s;
                    }
                    a:hover {
                        background: #764ba2;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🐦 Welcome to Flappy Bird Demo</h1>
                    <p>Click the link below to play:</p>
                    <a href="/flappy-bird">Play Flappy Bird</a>
                </div>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Flappy Bird Server is running!`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`🎮 Play at: http://localhost:${PORT}/flappy-bird`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
});
