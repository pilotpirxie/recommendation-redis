<p style="text-align: center;" align="center">
 <img src="raccoon2.png" style="max-width: 100%;" width="600" alt="Raccoon"/>
</p>

# 🦝 recommendation
Simple and open source recommendation system based on time-series data and statistical analysis. Written in TypeScript and Node.js using Redis for storage.

### Features
* Use tag score and Jaccard index
* Content based filtering
* Event-driven powered engine
* Suitable for product and content recommendation
* Fine-tuning of tag weights
* GPU accelerated with gpu.js
* Minimalist and lightweight
* Written in TypeScript and Node.js

<p style="text-align: center;" align="center">
 <img src="architecture.png" style="max-width: 100%;" width="600" alt="Raccoon Architecture"/>
</p>

### Getting started
```sh
git clone
yarn
yarn start
```

### API
Add new actor
```
POST /api/actors
```

Get specific actor by actorId
```
GET /api/actors/:actorId
```

Get recommendation for actor
```
GET /api/actors/:actorId/recommendation
```

Delete specific actor
```
DELETE /api/actors/:actorId
```

Replace specific actor
```
PUT /api/actors/:actorId
```

Add new event to an actor
```
POST /api/actors/:actorId/events
```

Delete specific actor event by eventId
```
DELETE /api/actors/:actorId/events/:eventId
```

Add new item
```
POST /api/items
```

Get specific item by itemId
```
GET /api/items/:itemId
```

Delete specific item
```
DELETE /api/items/:itemId
```

Replace specific item
```
PUT /api/items/:itemId
```

### License
```
MIT
```
