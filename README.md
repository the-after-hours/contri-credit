# Contri-credit

Contribution credit where contribution credit is due.
Automatically build and update your CONTRIBUTORS file.

# Installation
```
npm install --global contri-credit
```

Add the configuration object to your package.json

```
"contri-credit": {
    "file": "CONTRIBUTORS.md"    // Or your own markdown file to write to
    "owner": "the-after-hours"   // Probably your user name
    "repo": "contri-credit"      // Your repository name
}
```

# Usage

Contri-credit can be used as global cli to generate a contributors file for any github project.

If you installed contri-credit globally, from your project root, run `credit` to generate the CONTRIBUTORS.md file

# Contributors

Project maintained by [The After Hours](https://github.com/the-after-hours)
For a full list of contributors, please see [CONTRIBUTORS.md](./CONTRIBUTORS.md)
