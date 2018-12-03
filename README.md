# Beefstore
Beefboard's post storage api

## Development
Development is done with typescript, jest, and postgres.

`npm install` to start developing

## Running
`npm start` will run the server in development mode.

## Production
`npm run build` will build the source from typescript. Where it can then be
launched with `node build/app.js`

`source-map-support` is used to map ts source to js, so that stacktraces in
javascript make sense

## Linting
For linting we use the airbnb's config (`tslint-airbnb-config`), with some rule changes.

There are custom git-hooks in place, which do not allow commiting without a linting pass.
It is highly recommeded that vscode and the tslint extension are installed, which allows
for automatic lint fixes.

`npm run lint` will test linting

## Testing
Testing is completed using `ts-jest`. Unit-tests use sqlite as a database, which
means that tests can be completed without any pre-requisets.

Before pushing to the development or master branches tests will be expected to pass.

`npm test` will run test suites
