<p style="text-align: center;" align="center">
 <img src="logo.png" style="max-width: 100%;" width="300" alt="Recommendation"/>
</p>

# recommendation
Open source recommendation system based on time-series data and statistical analysis. Written in TypeScript and Node.js using Redis for storage.

### Features
* Use tag score and Jaccard index
* Content based filtering
* Event-driven powered engine
* Suitable for product and content recommendation
* Fine-tuning of tag weights
* Minimalist and lightweight
* Written in TypeScript and Node.js

<p style="text-align: center;" align="center">
 <img src="architecture.png" style="max-width: 100%;" width="500" alt="Recommendation Architecture"/>
</p>

### Getting started
```sh
# clone repository with the source code
git clone

# install dependencies
yarn

# build the application from ts to js
yarn build

# start the application
yarn start

# alternatively use ts-node in the developer mode
yarn dev
```

### Environment variables
```sh
# redis host
REDIS_HOST="localhost"

# redis port
REDIS_PORT="6379"

# redis password
REDIS_PASSWORD="mysecretpassword"

# write additional logs to stdout
VERBOSE="true"

# do not check if actor exists when adding event
DO_NOT_CHECK_ACTOR_EXISTENCE="true"

# maximum number of items to calculate recommendation positions
ITEMS_LIMIT="100000"

# maximum number of events to use for recommendation calculation
EVENTS_LIMIT="100000"
```

### API
Set (add or replace) actor
```ts
POST /api/actors
{
    "externalId": "string"
}
```

Get specific actor by actorId
```ts
GET /api/actors/:actorId
```

Get recommendation for actor
```ts
GET /api/actors/:actorId/recommendation
```

Delete specific actor
```ts
DELETE /api/actors/:actorId
```

Add new event to an actor
```ts
POST /api/actors/:actorId/events
{
    "tag": "tag1",
    "score": 3,
    "ttl": 60
}
```

Set (add or replace) item
```ts
POST /api/items
{
    "externalId": "string",
    "tags": ["tag1", "tag2", "..."]
}
```

Get specific item by itemId
```ts
GET /api/items/:itemId
```

Delete specific item
```ts
DELETE /api/items/:itemId
```

### License
```
MIT
```
