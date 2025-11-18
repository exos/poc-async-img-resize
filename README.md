# Async infra PoC for image resize

## WTF is it? 📌

This is a PoC _(Proff of Concept)_ to learn about async infra implementations, in this case it's about an 
API for upload images and get it in different siezes.

## Getting Started 🚀

### Requirements 📋

* Node.js (>= 18.x.x)
* npm (>= 9.x.x)
* docker-compose

### Project setup 🔧

Install node dependencies

```bash
$ npm install
```

Start docker-compose project

```bash
$ docker compose up --build
```

### Test it ⚙️

Use `client.sh` for testing:

#### List images

```bash
$ ./client.sh list
```

#### Get image data

```bash
$ ./client.sh get <id>
```

#### Upload new image

```bash
$ ./client upload <name> <file>
```

## License 📄

WTFPLv2 - DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
