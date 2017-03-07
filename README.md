# Flow Check

An npm module that checks and adds:
```
/* @flow */
```
To all your projects javascript files. Thereby automating the adding of Flow Type support to your new files.

Install it in you project with:
```
npm i flow-check --save-dev
```
Create 2 new scipts in your package.json file:
```
{
  ...
  "scripts": {
    "flow": "flowcheck",
    "flow:skip": "flowcheck --skip-check"
  },
  ...
}
```

Now you can run 'npm run flow', which will check for any new files that should have flow support, will ask you to confirm if you want to add the @flow header to all the files, and wil lthen run flow.

## --flow-skip
If you run 'npm run flow:skip' it will just run flow normally, without checking for flow support.

After the 'flowcheck' command you can add all your normal flow arguments, which will get passed on when flow is run. e.g:
```
{
  ...
  "scripts": {
    "flow": "flowcheck check",
    "flow:skip": "flowcheck check --skip-check"
  },
  ...
}
```
Will pass the 'check' parameter to flow, which prevents flow from running the flow server in the background.

## Config
You can add a .flowcheck file in the root of your project directory (where package.json lives) which is a JSON file you can use to specify which files you want flow check to look for and add flow support. Currently the only paramter is 'include', which accepts an array of [minimatch patterns](https://github.com/isaacs/minimatch).
```
{
  "include": [
    "**/*.js", // Get all javascript files
    "!node_modules/**/*", // Except from node_modules
    "!**/*.min.js", // Except minified files
    "!public/**/*", // Not in the public folder
    "!dist/**/*" // Not in a dist folder
  ]
}
```
