import cors from "cors";
import express from "express";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from Express!")
})
app.get("/users", (req, res) => {
    res.send("Users Page")

})

app.get("/api/users", (req, res) => {
    const json = [
        { id: 1, name: "Shazia" },
        { id: 2, name: "Amina" }
    ]
    res.json(json)
})

app.get("/api/not-found", (req, res) => {
    res.status(404).json({ message: "Resource not found" })

})
app.get("/api/users/:id", (req, res) => {

    res.json({ id: req.params.id, message: "User requested" })

})

app.get("/api/applications", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM applications");
        res.json(result.rows)
    } catch (error) {
        console.error("Failed to fetch applications:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

app.post("/api/applications", async (req, res) => {
    const { company, position, status } = req.body;
    if (!company || !position || !status) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    try {
        const result = await pool.query("INSERT INTO applications (company, position, status) VALUES ($1,$2,$3) RETURNING *", [company, position, status])
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error("Failed to add application:", error);
        res.status(500).json({ error: "Failed to add application" });
    }
})

app.patch("/api/applications/:id", async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required" })
    }
    const { company, position, status } = req.body;

    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid application ID" });
    }

    if (!company || !position || !status) {
        return res.status(400).json({ message: "Company, position, and status are required" })
    }
    try {
        const result = await pool.query("UPDATE applications SET company=$1,position=$2,status=$3 WHERE id=$4 RETURNING *;", [company, position, status, id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "ID not found" })
        }
        res.json(result.rows[0])
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to update application" });

    }
})

app.delete("/api/applications/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
       return res.status(400).json({ message: "Invalid application ID" })
    }
    try {
        const result =await pool.query("DELETE FROM applications WHERE id = $1 RETURNING *;",[id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "ID not found" })
        }
        res.json({ message: "Application deleted successfully" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to delete application" });

    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})

