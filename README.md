# Static site generator for Simple Knowledge Management Systems (SKOS)

THIS IS A FORK OF THE SKOHUB-VOCABS-TOOL FROM THE [SKOHUB-PROJECT](http://skohub.io)!

This part of the [SkoHub](http://skohub.io) project covers the need to easily publish a controlled vocabulary as a SKOS file, with a basic lookup API and a nice HTML view including links to an inbox for each subject. It consists of two parts: the actual static site generator and a webhook server that allows to trigger a build from GitHub.

## Docker Setup

In order to serve this app via GitHub Pages a GitHub-action-workflow and a Dockerfile were created. The Dockerfile will build a `public`-dir from the `data`-dir. It has to be bind mounted to two volumes, e.g. the `data` and the `public`-dir. So in a direcotry with these two dirs (and some `ttl`-files in your data dir) you could do something like this (laocoon667 is my Docker-Hub username, where I pushed the image):

`docker run -v $(pwd)/public:/app/public -v $(pwd)/data:/app/data laocoon667/skohub-vocabs:latest`

This will spin up the container build `public` out of `data` and then shut down again.

Because we can use available infrastructure, why not use GitHub-Pages to serve our app?

For this to work a workflow file `.github/workflows/main.yml` was created, which will automatically deploy the `public`-dir to the `gh-pages`-branch. First it gets the vocabulary with a `git clone`, e.g. from a GitHub-repo like <https://github.com/sroertgen/oer-metadata-hub-vocab> and puts it to a `data` folder. Then it spins up the docker image and bind mounts just like mentioned above. It builds the public dir and afterward its deployed using another GitHub action.

In order for this to work you have to add `BASEURL` to the `.env`-file and add the name you want to serve your site from, e.g. `BASEURL=/your-repo-name` or maybe your vocab-repo so it always has the newest vocabs to display. You also have to adjust your `gatsby-config.js`-file and add the following:

    pathPrefix: `/your-repo-name`,

If you want to use a normal web-server like Apache or Nginx, just leave everything as is.

## Customization

The preferred displayed language can be set by modifying `/dist/build/index.html`, e.g.

```html
    <html lang="de">
```


## Set up

    $ git clone https://github.com/hbz/skohub-vocabs.git
    $ cd skohub-vocabs
    $ npm i
    $ cp .env.example .env
    $ cp test/data/systematik.ttl data/

The `.env` file contains configuration details used by the static site generator and the webhook server (like `PORT`, see below).

After changes to your `.env` or `data/*` files, make sure to delete the `.cache` directory:

    $ rm -rf .cache

## Running the static site generator

The static site generator will parse all turtle files in `./data` and build the vocabularies it finds:

    $ npm run build

The build can be found in `public/` and be served e.g. by Apache. The directory structure is derived from the URIs of the SKOS concepts, e.g. `https://w3id.org/class/hochschulfaecher/scheme` will be available from `public/w3id.org/class/hochschulfaecher/scheme(.html|.json)`.

You can also run the development web server:

    $ npm run develop

to serve the build from `http://localhost:8000/`. Again, the URL is based on the SKOS URIs, e.g. `http://localhost:8000/w3id.org/class/hochschulfaecher/scheme.html`

## Running the webhook server

The webhook server allows to trigger a build when vocabularies are updated (i.e. changes are merged into the `master` branch) on GitHub.

Running `npm run listen` will start the server on the defined `PORT` and expose a `build` endpoint. In order to wire this up with GitHub, this has to be available to the public. You can then configure the webhook in your GitHub repositories settings:

![image](https://user-images.githubusercontent.com/149825/62695510-c756b880-b9d6-11e9-86a9-0c4dcd6bc2cd.png)

## Connecting to our webhook server

Feel free to clone https://github.com/literarymachine/skos.git to poke around. Go to https://github.com/YOUR_GITHUB_USER/skos/settings/hooks/new to set up the web hook (get in touch to receive the secret). Edit https://github.com/YOUR_GITHUB_USER/skos/edit/master/hochschulfaecher.ttl and commit the changes to master. This will trigger a build and expose it at https://test.skohub.io/YOUR_GITHUB_USER/skos/w3id.org/class/hochschulfaecher/scheme.

## Use start scripts and monit
You may want to use the start scripts in `scripts/` to manage via init and to monitor with `monit`.
