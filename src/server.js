const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const { STREAM_REFRESH_MS, getDashboardData } = require("./dashboard-data");
const { createPool } = require("./db");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const pool = createPool();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function publicFilePath(pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return resolvedPath;
}

async function serveStatic(pathname, res) {
  const filePath = publicFilePath(pathname);

  if (!filePath) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    res.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    res.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    throw error;
  }
}

function serialiseSse(eventName, payload) {
  return `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
}

function safeError(error) {
  return {
    message: error && error.message ? error.message : "Dashboard query failed"
  };
}

function streamDashboard(req, res) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    "x-accel-buffering": "no"
  });
  res.write(": connected\n\n");

  let sequence = 0;
  let inFlight = false;

  const sendUpdate = async () => {
    if (inFlight || res.destroyed) {
      return;
    }

    inFlight = true;

    try {
      const data = await getDashboardData(pool);
      sequence += 1;
      res.write(serialiseSse("dashboard", { ...data, sequence }));
    } catch (error) {
      res.write(serialiseSse("dashboard-error", safeError(error)));
    } finally {
      inFlight = false;
    }
  };

  sendUpdate();
  const interval = setInterval(sendUpdate, STREAM_REFRESH_MS);

  req.on("close", () => {
    clearInterval(interval);
  });
}

async function handleRequest(req, res) {
  if (!req.url) {
    sendJson(res, 400, { error: "Missing URL" });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/favicon.ico") {
    res.writeHead(204, { "cache-control": "public, max-age=86400" });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/dashboard") {
    try {
      sendJson(res, 200, await getDashboardData(pool));
    } catch (error) {
      sendJson(res, 500, safeError(error));
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/stream") {
    streamDashboard(req, res);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  await serveStatic(url.pathname, res);
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, 500, safeError(error));
  });
});

server.listen(PORT, HOST, () => {
  console.log(`SQL dashboard listening on http://${HOST}:${PORT}`);
});

async function shutdown() {
  server.close();
  await pool.end();
}

process.on("SIGTERM", () => {
  shutdown().finally(() => process.exit(0));
});

process.on("SIGINT", () => {
  shutdown().finally(() => process.exit(0));
});
