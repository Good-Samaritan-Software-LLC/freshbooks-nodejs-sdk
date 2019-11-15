# FreshBooks NodeJS SDK

![](https://github.com/freshbooks/api-sdk/workflows/Node%20CI/badge.svg)

The FreshBooks NodeJS SDK is a collection of single-purpose packages designed to easily build FreshBooks apps. Each package delivers part of the FreshBooks [REST API](https://www.freshbooks.com/api), so that you can choose the packages that fit your needs.

| Package              | What it's for |
| ---------------------|---------------|
| [`@freshbooks/api`](#freshbooksapi)    | Get/set data from FreshBooks using the REST API.
| `@freshbooks/events` | Register/listen for incoming events via webhooks.
| [`@freshbooks/app`](#freshbooksapp)    | Pre-configured [ExpressJS](https://expressjs.com/) app. Includes authentication via [PassportJS](http://www.passportjs.org/).

## Installation

Use your favorite package manager to install any of the packages and save to your `package.json`:

```shell
$ npm install @freshbooks/api @freshbooks/events @freshbooks/app

# Or, if you prefer yarn
$ yarn add @freshbooks/api @freshbooks/events @freshbooks/app
```

## Usage

### `@freshbooks/api`

Your app will interact with the REST API using the `Client` object, available from the `@freshbooks/api` package.
The client is instantiated with a valid OAuth token, which is used throughout the lifetime of the client to make API calls.

#### Configuring the API client

```typescript
import { Client } from '@freshbooks/api'

// Get token from authentication or configuration
const token = process.env.FRESHBOOKS_TOKEN

// Instantiate new FreshBooks API client
const client = new Client(token)
```

#### Get/set data from REST API

All REST API methods return a response in the shape of:

```typescript
{
  ok: boolean
  data?: T // model type of result
  error?: Error
}
```

Example API client call:
```typescript
try {
  // Get the current user
  const { data } = await client.users.me()
  
  console.log(`Hello, ${data.id}`)
} catch ({ code, message }) {
  // Handle error if API call failed
  console.error(`Error fetching user: ${code} - ${message}`)
}
```

##### Errors
If an API error occurs, the response object contains an `error` object, with the following shape:
```typescript
{
  code: string
  message?: string
}
```

##### Pagination
If the endpoint is enabled for pagination, the response `data` object contains the response model and a `pages` property, with the following shape:
```typescript
{
  page: number
  pages: number
  total: number
  size: number
}
```

Example request with pagination:
```typescript
// Get list of invoices for account
const { invoices, pages } = await client.invoices.list('xZNQ1X')

// Print invoices
invoices.map(invoice => console.log(JSON.stringify(invoice)))

// Print pagination
console.log(`Page ${pages.page} of ${pages.total} pages`)
console.log(`Showing ${pages.size} per page`)
console.log(`${pages.size} total invoices`)
```

### `@freshbooks/app`

The FreshBooks SDK provides a pre-configured `ExpressJS` app. This app provides OAuth2 authentication flow, a `PassportJS` middleware for authenticating requests, and session middleware to retrieve tokens for a session.

#### Using the ExpressJS app

Setting up the ExpressJS app requires a FreshBooks `client__id` and `client_secret`, as well as a callback URL to receive user authentication and refresh tokens. Once configured, routes can be configured as in any other `ExpressJS` app.

```typescript
import { Client } from '@freshbooks/api'
import createApp from '@freshbooks/app'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL

const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK)

// set up callback route
app.get('/auth/freshbooks/redirect', passport.authorize('freshbooks')

// set up an authenticated route
app.get('/settings', passport.authorize('freshbooks'), async (req, res) => {
  // get an API client
  const { token } = req.user
  const client = new Client(token)
  
  // fetch the current user
  try {
    const { data } = await client.users.me()
    res.send(data.id)
  } catch ({ code, message }) {
    res.status(500, `Error - ${code}: ${message}`)
  }
})
```
