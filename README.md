# DO-APP-UPDATER

Digitalocean app, deployment tag updater. I personally used in my project. Useful when we want to quickly update digitalocean app tag from github action after building docker image

## Usage


```sh
export DO_ACCESS_TOKEN=your-access-token
deno run --allow-env --allow-net https://cdn.jsdelivr.net/gh/ball6847/do-app-updater@main/cli.ts --id APP_ID --tag DOCKER_TAG --service COMPONENT_NAME
```

Or install as CLI

```sh
deno install -n do-app-updater --allow-env --allow-net https://cdn.jsdelivr.net/gh/ball6847/do-app-updater@main/cli.ts

export DO_ACCESS_TOKEN=your-access-token

# then simply call to do-app-updater bin
do-app-updater --id APP_ID --tag DOCKER_TAG --service COMPONENT_NAME
```

To use on github action

```yml
name: Build and Push Docker Image

on:
  push:
    tags:
      - "*"

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          submodules: recursive

      - name: Define tag
        run: echo "TAG=${GITHUB_REF#refs/tags/v}" >> $GITHUB_ENV

      - uses: denoland/setup-deno@v1
        with:
          deno-version: "1.37.1"

      # setup docker , build and push docker image as usual here

      - name: Update deployment tag
        run: deno run --allow-env --allow-net https://cdn.jsdelivr.net/gh/ball6847/do-app-updater@main/cli.ts --id ${{ vars.APP_ID }} --tag ${{ env.TAG }} --service ${{ vars.SERVICE_NAME }}
        env:
          DO_ACCESS_TOKEN: ${{ secrets.DO_ACCESS_TOKEN }}

```
