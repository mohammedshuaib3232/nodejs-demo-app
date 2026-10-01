# Node.js CI/CD Demo

A tiny web app for learning a GitHub Actions CI/CD pipeline. Every push to `main` runs automated tests and builds a Docker image. When Docker Hub secrets are configured, the workflow also publishes the image to Docker Hub.

## Run locally

Requires Node.js 20 or newer. No third-party npm packages are needed.

```sh
npm test
npm start
```

Open <http://localhost:3000>. The health check is at <http://localhost:3000/health>.

## Build and run with Docker

```sh
docker build -t nodejs-demo-app .
docker run --rm -p 3000:3000 nodejs-demo-app
```

## GitHub Actions pipeline

The workflow is in `.github/workflows/main.yml`.

1. On a pull request or push to `main`, the **test** job checks out the code, sets up Node.js 22, runs `npm test`, and builds the Docker image.
2. After a successful test job, a push to `main` starts **publish**. It logs into Docker Hub and pushes `latest` and a commit-specific image tag.
3. Publishing is skipped cleanly until both Docker Hub secrets exist. To enable it, open the repository's **Settings → Secrets and variables → Actions → New repository secret** and add:
   - `DOCKERHUB_USERNAME`: your Docker Hub username
   - `DOCKERHUB_TOKEN`: a Docker Hub access token (keep it private)

Pull requests run checks but never publish an image. No secret is needed to run or test the sample app.

## What CI/CD means

**Continuous Integration (CI)** automatically checks changes as they are proposed. Here that means running the Node.js tests and checking that a Docker image can be built. **Continuous Delivery/Deployment (CD)** automates preparing or publishing that checked app. Here, a successful push to `main` can publish the container image.

A GitHub Actions **runner** is a temporary machine that runs a workflow. A **job** is a group of work assigned to a runner; its **steps** run in order. `needs: test` makes publishing wait for tests to pass. Secrets keep the Docker Hub login out of the repository files.

## Interview quick notes

- **What is CI/CD?** Automation for integrating, checking, and delivering software changes.
- **How do GitHub Actions work?** GitHub reads workflow YAML files in `.github/workflows` and starts jobs when configured events occur.
- **What is a runner?** The machine that executes a job, such as `ubuntu-latest`.
- **Jobs vs. steps?** Jobs can run on separate runners and have dependencies; steps run sequentially inside a job.
- **How are secrets secured?** Store credentials in repository or organization Actions secrets and reference them as `${{ secrets.NAME }}`.
- **How should deployment errors be handled?** A failed step fails the job; inspect its logs, fix the cause, and rerun. Deployment here is gated behind tests.
- **What does Docker build-push do?** It packages the app and its runtime into an image, then uploads that image to a registry.
- **How can the pipeline be tested locally?** Run `npm test` and `docker build` locally; the hosted GitHub runner itself is exercised by pushing a branch or opening a pull request.

## Files

- `app/server.js`: HTTP app and health endpoint
- `app/server.test.js`: built-in Node.js tests
- `Dockerfile`: container image instructions
- `.github/workflows/main.yml`: CI and optional Docker Hub publishing
