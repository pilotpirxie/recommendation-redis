<p style="text-align: center;" align="center">
 <img src="logo.png" style="max-width: 100%;" width="300" alt="Recommendation"/>
</p>

# recommendation
Open source recommendation system based on time-series data and statistical analysis. Written in TypeScript and Node.js using Redis for storage.

### Features
* Use tag score and Jaccard index
* Content based filtering
* Event-driven powered engine
* Naive exploration of new tags
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

# maximum size of candidate pool of items to calculate recommendation positions
ITEMS_LIMIT="100000"

# maximum number of events to use for recommendation calculation
EVENTS_LIMIT="100000"

# maximum number of recommendations to return
RECOMMENDATIONS_LIMIT=100

# wait to finish event insertion before http response
WAIT_FOR_EVENT_INSERTION="false"

# chance of recommending irrelevant item, used for exploration of new tags
# to minimize the recommendation bubble effect
EXPLORATION_NOISE="0.1"

# max sum of events score set per tag
# e.g. 1 (view event) + 2 (like event) + 5 (lead event) = 8 
JACCARD_MAX_TAG_SCORE="8"

# clamp the recommendation results between 0 and 1
JACCARD_CLAMP_RESULT_RECOMMENDATIONS="true"
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
