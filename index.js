const express = require("express");
const server = express();
server.use(express.json());

const projects = [];

let count = 0;

server.use((req, res, next) => {
  count += 1;
  next();
  console.log(count);
});

function checkProjectExists(req, res, next) {
  const id = req.params.id;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project id does not exists" });
  }
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
