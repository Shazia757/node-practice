process.env.NODE_ENV = "test";

import test, { after } from "node:test";
import request from "supertest";
import pool from "../db.js";
import app from "../express-server.js"
import assert from "node:assert";

test("GET /api/applications return 200", async () => {
    const response = await request(app).get("/api/applications");

    assert.strictEqual(response.status, 200);
});

test("PATCH with an invalid ID returns 400", async () => {
    const response = await request(app)
        .patch("/api/applications/abc")
        .send({ status: "Interview" });

    assert.strictEqual(response.status, 400);
});

test("PATCH updates only the status", async () => {
    const response = await request(app)
        .patch("/api/applications/3")
        .send({ status: "Interview" });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "Interview");
    assert.strictEqual(response.body.company, "Google");
    assert.strictEqual(response.body.position, "Software Developer");
});

test("PATCH with an invalid status returns 400", async () => {
    const response = await request(app)
        .patch("/api/applications/3")
        .send({ status: "banana" });

    assert.strictEqual(response.status, 400);
});

test("PATCH with a nonexistent ID returns 404", async () => {
    const response = await request(app)
        .patch("/api/applications/999999")
        .send({ status: "Interview" });

    assert.strictEqual(response.status, 404);
});

after(async () => {
    await pool.end();
});