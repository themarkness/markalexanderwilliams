---
title: Learning nix and nixOS
date: 2025-08-11
author: Mark Williams
summary: A practical journey exploring Nix and NixOS, from first expressions to deploying a real NixOS server, with lessons on reproducibility, flakes, and troubleshooting.
tags:
  - nlnet

## Introduction

As I had historic practical knowledge of Linux gained through systems admin roles, I already understood the approaches used for package management in Linux and Mac environments. I used AI assistance to explore how nix compares in a learn by doing approach. This introduction assumes you have some similar knowledge and want to do the same.

Whereas a typical package manager like [Homebrew](https://brew.sh/) on Mac installs software system-wide using imperative commands (`brew install foo`), Nix takes a declarative, functional approach; you describe the desired state of your environment in a config file, and Nix builds that exact environment in isolation. This means you can reproduce setups exactly, roll back changes, and avoid many of the versioning and dependency pitfalls common in traditional package management systems.

## Setup

Before diving into Nix expressions and flakes, I set up my development environment and explored some tools:

### Cursor

Opened a new project in [Cursor](https://cursor.sh/) as my code editor. Cursor is a fork of Microsoft's Visual Studio Code, but with a chat pane for conversing with your code. I find it incredibly useful as a non-developer to ask it to explain things and it can also suggest changes to your code, explaining those too as you go along.

Open a terminal instance and installed Nix via the official curl script and verified the installation.

```bash
curl -L https://nixos.org/nix/install | sh
nix --version
```

Cursor suggested I installed extensions for Nix, nix utilities, prettifying JSON and YAML.

Created my first example Nix file: `something.nix`

The rest that follows is where I initiated a GitHub rep and synced my exploration so I had a version history. Commits to show the process: [https://github.com/themarkness/nix-playground](https://github.com/themarkness/nix-playground)

## Exploring Nix Syntax

**Commit:** [eaf8214](https://github.com/themarkness/nix-playground/commit/eaf8214) create an example nix file to help understand how nix works

I started by generating a simple Nix file (`something.nix`), with the goal of understanding the way nix syntax is written and what you can do with it. Nix is not simply a package manager, but a functional programming language. I have some familiarity with Javascript, Python and C++, so wanted to explore the similarities.

After creating `something.nix`, I wanted to use nix commands to validate my code and use it in practice. `nix eval` lets you evaluate the file or expressions within to see if they return a valid result.

To evaluate the entire attribute set returned by `something.nix`, run:

```bash
nix eval -f something.nix
```

Output:
```
{ allNumbers = [ 1 2 3 4 5 ];
  currentTime = 1753694880;
  doubledNumbers = [ 2 4 6 8 10 ];
  firstNumber = 1;
  isEven = «error: attribute 'mod' missing»;
  message = "Hello, Nix!";
  projectName = "example";
  projectVersion = "1.0.0";
  sum = 8;
}
```

You can also evaluate just one attribute from the file, for example, the `sum`:

```bash
nix eval -f something.nix sum
```

Output:
```
8
```

Or the doubled numbers:

```bash
nix eval -f something.nix doubledNumbers
```

Output:
```
[ 2 4 6 8 10 ]
```

For more interactive experimentation, you can use the Nix REPL:

```bash
nix repl
```

Then, inside the REPL, load your file and explore its attributes:

```
:n ./something.nix
s.sum
s.doubledNumbers
s.add 10 20
```

This lets you quickly try out different expressions and see their results, making it a great way to learn Nix incrementally.

## Creating a Nix Flake for a Web App

**Commit:** [3aaa676](https://github.com/themarkness/nix-playground/commit/3aaa676) create a nix flake for a simple web application

With some syntax under my belt, I wanted to see how Nix could manage a real project.

The AI tool suggested I build a `configuration.nix` file and then a simple React app, learning how to manage its development environment using Nix flakes. I deployed the project to GitHub to serve as a practical playground for understanding Nix.

I created a `flake.nix` to define a reproducible environment for a web app. This was my first exposure to Nix flakes, a modern, more composable way to manage Nix projects.

**Commit:** [3499a81](https://github.com/themarkness/nix-playground/commit/3499a81) add package.json to declare dependancies for a simple web app

Next, I added a `package.json` to declare dependencies for a React app.

**Commit:** [29af60d](https://github.com/themarkness/nix-playground/commit/29af60d) create an html file for a simple web app

**Commit:** [a6f6644](https://github.com/themarkness/nix-playground/commit/a6f6644) create JSX for siimple web app

I created a basic HTML file and a simple React component. The goal was to keep things minimal, just enough to verify that the Nix-powered environment could run a modern frontend stack.

**Commit:** [e344f90](https://github.com/themarkness/nix-playground/commit/e344f90) create a config for Vite

To streamline development, I added [Vite](https://vitejs.dev/) as the build tool. Vite offers a fast way to redeploy changes to a web app, so that I could view the changes instantaneously. This meant creating a `vite.config.js` and updating scripts in `package.json`.

**Commit:** [35cfd6c](https://github.com/themarkness/nix-playground/commit/35cfd6c) seperate HTMl from react code

I refactored the project to separate the static HTML from the React code, following best practices and making the project structure clearer.

**Commit:** [fd4cff9](https://github.com/themarkness/nix-playground/commit/fd4cff9) rename something.nix to denote it is not being used for our web ap

As my focus shifted to the web app, I renamed my original Nix experiment file to `something.nix.old`, keeping it as a reference but clarifying that it wasn't part of the main build.

**Commit:** [663a7b5](https://github.com/themarkness/nix-playground/commit/663a7b5) add the required devShells attribute

I ran into an error: my flake was missing the `devShells` attribute, which is required for development environments. After some research and trial-and-error, I updated `flake.nix` to include a `devShells.default` that provides `nodejs_20` and `yarn`. This fixed the issue and made the environment work as expected.

**Commit:** [80b2916](https://github.com/themarkness/nix-playground/commit/80b2916) Initial commit: Nix-powered React app

With the environment and app in place, I made an initial commit of the working Nix-powered React app.

**Commit:** [55bd3f1](https://github.com/themarkness/nix-playground/commit/55bd3f1) add a readme

Finally, I wrote a README to document what I'd learned, how to use the project, and where to find more information about Nix and Vite.

This was a straightforward experiment that setup a reproducible development environment. Unlike something like [Homebrew](https://brew.sh/) (which by default installs dependencies globally) and NPM (which brings the ingredients that node uses), when anyone runs `nix develop` with this flake, no matter their OS, it will give them exactly Node.js 20 and Yarn in a clean shell, without touching their system-wide environment. Furthermore, you can include things like Python, Postgres etc which makes it suitable for configuring servers...enter NixOS.

## Deploying a NixOS Server

**Commits:**
- [73c5b3e](https://github.com/themarkness/nix-playground/commit/73c5b3e) Create nix-os folder
- [ec6054e](https://github.com/themarkness/nix-playground/commit/ec6054e) Delete nix-os
- [16f7b03](https://github.com/themarkness/nix-playground/commit/16f7b03) add flake.nix currently configured on Hetzner nixOS server
- [665c0d5](https://github.com/themarkness/nix-playground/commit/665c0d5) add current configuration nix files from nixOS on Hetzner

With the basics in place, I wanted to take things further and try deploying a real NixOS server. I created a new `nixos/` directory to hold my server configuration, including:

- **nixos/flake.nix**: A flake for deploying to a Hetzner Cloud server, pulling in the Bonfire federated social app as a package. I had already created a cloud server at Hetzner and used the [NixOS ISO](https://nixos.org/download.html) and was intending to SSH and rebuild the server with my flake.

- **nixos/configuration.nix**: The main NixOS system configuration, setting up users, SSH, Postgres, and the Bonfire service.

- **nixos/hardware-configuration.nix**: Hardware-specific settings for the VM.

I followed the process of running `nixos-rebuild switch --flake .#nixos-vm` from `/etc/nixos` on the server.

While deploying, I encountered an error related to the Bonfire package's dependencies:

```
error: undefined variable 'ex_aws'
at /nix/store/.../deps.nix:541:20:
beamDeps = [ ex_aws sweet_xml ];
```

Evaluating this with Cursor, I was informed that this was a packaging bug in the upstream Bonfire or ex_aws_s3 Nix expression, not in my own configuration. As such, I documented the issue and possible workarounds in `nixos/README.MD`, but this began to feel outside my comfort zone and the scope of learning Nix syntax.

This project started as a playground for learning Nix syntax and flakes, grew into a reproducible React app environment, and eventually became a real-world NixOS deployment experiment. Along the way, I learned not just the syntax, but also how to troubleshoot configuration issues, integrate Nix with modern JavaScript tooling, and debug upstream packaging problems.
