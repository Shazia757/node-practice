process.env.NODE_ENV = "test";

import test, { after } from "node:test";
import request from "supertest";
import pool from "../db.js";
import app from "../express-server.js"
import assert from "node:assert";
import { application } from "express";

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
    const application = await request(app)
        .post("/api/applications")
        .send({
            company: "Test",
            position: "Junior Developer",
            status: "Applied"
        });
    assert.strictEqual(application.status, 201);
    const id = application.body.id;

    const response = await request(app)
        .patch(`/api/applications/${id}`)
        .send({ status: "Interview" });


    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "Interview");
    assert.strictEqual(response.body.company, "Test");
    assert.strictEqual(response.body.position, "Junior Developer");

    const deleteResponse = await request(app)
        .delete(`/api/applications/${id}`);

    assert.strictEqual(deleteResponse.status, 200);
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

test("POST returns 201", async () => {
    const response = await request(app)
        .post("/api/applications")
        .send({
            company: "Test Company",
            position: "Junior Developer",
            status: "Applied"
        });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.company, "Test Company");
    assert.strictEqual(response.body.position, "Junior Developer");
    assert.strictEqual(response.body.status, "Applied");
    assert.strictEqual(typeof response.body.id, "number");

});

test("DELETE returns 200", async () => {
    const response = await request(app)
        .post("/api/applications")
        .send({
            company: "Test Company",
            position: "Junior Developer",
            status: "Applied"
        });

    const id = Number(response.body.id);
    const res = await request(app)
        .delete(`/api/applications/${id}`);
    const getRes = await request(app).get("/api/applications");

    assert.strictEqual(res.status, 200);
    assert.strictEqual(getRes.body.some((application) => application.id === id), false);
});

test("POST with no company name returns 400", async () => {
    const response = await request(app)
        .post("/api/applications")
        .send({
            company: "",
            position: "Junior Developer",
            status: "Applied"
        });

    assert.strictEqual(response.status, 400);

});
test("POST with no company name has no unintended side effects", async () => {
    const initialRes = await request(app).get("/api/applications");

    const response = await request(app)
        .post("/api/applications")
        .send({
            company: "",
            position: "Junior Developer",
            status: "Applied"
        });
    assert.strictEqual(response.status, 400);

    const finalRes = await request(app).get("/api/applications");


    assert.strictEqual(initialRes.body.length, finalRes.body.length);

});

test("POST trims whitespace from company and position", async () => {
    const response = await request(app)
        .post("/api/applications")
        .send({
            company: "  Acme Technologies  ",
            position: "  Junior Developer  ",
            status: "Applied"
        });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.company, "Acme Technologies");
    assert.strictEqual(response.body.position, "Junior Developer");

    await request(app).delete(`/api/applications/${response.body.id}`);
});

test("PATCH trims whitespace from company and position", async () => {
    const createResponse = await request(app)
        .post("/api/applications")
        .send({
            company: "Original Company",
            position: "Original Position",
            status: "Applied"
        });

    const id = createResponse.body.id;

    const updateResponse = await request(app)
        .patch(`/api/applications/${id}`)
        .send({
            company: "  Acme Technologies  ",
            position: "  Junior Developer  "
        });

    assert.strictEqual(updateResponse.status, 200);
    assert.strictEqual(updateResponse.body.company, "Acme Technologies");
    assert.strictEqual(updateResponse.body.position, "Junior Developer");

    await request(app).delete(`/api/applications/${id}`);
});

test("PATCH rejects unsupported fields", async () => {
    const response = await request(app)
        .patch("/api/applications/3")
        .send({ unknownField: "something" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "Invalid items");
});

after(async () => {
    await pool.end();
});