const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const validateIsUuid = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send();
  }

  return next();
}

app.use('/repositories/:id', validateIsUuid);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  const repository = repositories[repositoryIndex];
  const repositoryUpdated = { ...repository, title, url, techs };
  repositories[repositoryIndex] = repositoryUpdated;

  return response.status(200).send(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }
  
  const repository = repositories[repositoryIndex];
  const likes = repository.likes + 1;
  
  const repositoryUpdated = { ...repository, likes };
  repositories[repositoryIndex] = repositoryUpdated;

  return response.status(200).send({ likes });  
});

module.exports = app;
