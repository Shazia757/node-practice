import cors from "cors";
import express, { application, json } from "express";

const app = express();
app.use(cors());
app.use(express.json());
const applications = [
    {
        id: 1,
        company: 'Google',
        position: 'Software Developer',
        status: 'Applied'
    },
    {
        id: 2,
        company: 'Microsoft',
        position: 'Full-stack Developer',
        status: 'Interview'
    },
]
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

app.get("/api/applications", (req, res) => {
    res.json(applications)
})
console.log(applications);

app.post("/api/applications", (req, res) => {
    if (!req.body.company || !req.body.position || !req.body.status) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const application = { id: applications[applications.length - 1].id + 1, company: req.body.company, position: req.body.position, status: req.body.status }
    applications.push(application)
    res.json(application)
})

app.patch("/api/applications/:id", (req, res) => {
    const id = Number(req.params.id);
    const application = applications.find((application) =>
        application.id === id
    );

    if (!application) {
        return res.status(404).json({ message: 'Application does not exist' })
    }
    if (!req.body) {
        return res.status(400).json({ message: "Request body is required" })
    }
    if (!req.body.status) {
        return res.status(400).json({ message: "Status is required" })

    }
    application.company = req.body.company;
    application.position = req.body.position;
    application.status = req.body.status;
    res.json(application);

})
app.delete("/api/applications/:id", (req, res) => {
    const id = Number(req.params.id);
    const application = applications.find((application) => application.id === id);
    if (!application) {
        return res.status(404).json({ message: 'Application does not exist' })
    }
    const filteredApplication = applications.filter((application) => application.id !== id);
    applications.length = 0;
    applications.push(...filteredApplication);
    res.json({ message: "Application deleted successfully" });
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})

