from __future__ import annotations

import asyncio
import io
from email.message import Message
from http import HTTPStatus
from urllib.parse import parse_qs, urlencode

import server


class VercelRequestHandler(server.MedLensHandler):
    def __init__(self, method: str, path: str, headers: list[tuple[bytes, bytes]], body: bytes, client_ip: str):
        self.command = method
        self.path = path
        self.request_version = "HTTP/1.1"
        self.headers = Message()
        for name, value in headers:
            self.headers.add_header(name.decode("latin-1"), value.decode("latin-1"))
        self.rfile = io.BytesIO(body)
        self.wfile = io.BytesIO()
        self.client_address = (client_ip, 0)
        self.response_status = HTTPStatus.OK
        self.response_headers: list[tuple[str, str]] = []

    def send_response(self, code: int, message: str | None = None) -> None:
        self.response_status = HTTPStatus(code)

    def send_header(self, keyword: str, value: str) -> None:
        self.response_headers.append((keyword, value))

    def end_headers(self) -> None:
        return

    def send_error(self, code: int, message: str | None = None, explain: str | None = None) -> None:
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write((message or HTTPStatus(code).phrase).encode("utf-8"))


class MedLensASGI:
    async def __call__(self, scope, receive, send) -> None:
        if scope["type"] != "http":
            return

        content = bytearray()
        max_body = server.MAX_UPLOAD_BYTES + 1024 * 1024
        while True:
            event = await receive()
            if event["type"] == "http.disconnect":
                return
            content.extend(event.get("body", b""))
            if len(content) > max_body:
                await send(
                    {
                        "type": "http.response.start",
                        "status": 413,
                        "headers": [(b"content-type", b"application/json; charset=utf-8")],
                    }
                )
                await send(
                    {
                        "type": "http.response.body",
                        "body": b'{"error":"Request body is too large."}',
                    }
                )
                return
            if not event.get("more_body", False):
                break

        query = parse_qs(scope.get("query_string", b"").decode("latin-1"), keep_blank_values=True)
        routed_path = query.pop("__path", [scope.get("path", "/")])[0]
        remaining_query = urlencode(query, doseq=True)
        request_path = f"{routed_path}?{remaining_query}" if remaining_query else routed_path
        handler = VercelRequestHandler(
            scope["method"].upper(),
            request_path,
            scope.get("headers", []),
            bytes(content),
            scope.get("client", ("", 0))[0],
        )

        method = getattr(handler, f"do_{scope['method'].upper()}", None)
        if method is None:
            handler.send_error(405, "Method not allowed.")
        else:
            await asyncio.to_thread(method)

        response_body = handler.wfile.getvalue()
        response_headers = [
            (name.lower().encode("latin-1"), value.encode("latin-1"))
            for name, value in handler.response_headers
        ]
        await send({"type": "http.response.start", "status": handler.response_status, "headers": response_headers})
        await send({"type": "http.response.body", "body": response_body})


_initialized = False
_initialization_lock = asyncio.Lock()


async def initialize() -> None:
    global _initialized
    if _initialized:
        return
    async with _initialization_lock:
        if not _initialized:
            await asyncio.to_thread(server.seed_database)
            _initialized = True


class InitializedMedLensASGI:
    async def __call__(self, scope, receive, send) -> None:
        await initialize()
        await MedLensASGI()(scope, receive, send)


app = InitializedMedLensASGI()
