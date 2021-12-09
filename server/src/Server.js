let express = require("express");
let cors = require('cors');
let path = require('path');
let MongoClient = require("mongodb").MongoClient;
let sanitizer = require('express-sanitizer');
let ObjectId = require('mongodb').ObjectId;

// MongoDB constants
const URL = "mongodb://mongo:27017/";
const DB_NAME = "dbTechs";

// construct application object via express
let app = express();
// add cors as middleware to handle CORs errors while developing
app.use(cors());

// add middleware to work with incoming JSON
app.use(express.json());
app.use(sanitizer());

// get absolute path to /build folder (production build of react web app)
const CLIENT_BUILD_PATH = path.join(__dirname, "./../../client/build");
// adding middleware to define static files location
app.use("/", express.static(CLIENT_BUILD_PATH));

app.get("/get", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        // get reference to database via name
        let db = mongoClient.db(DB_NAME);
        let techArray = await db.collection("technologies").find().sort("name",1).toArray();
        let courseArray = await db.collection("courses").find().sort("code",1).toArray();
        let json = { "technologies": techArray, "courses": courseArray };
        // serializes sampleJSON to string format
        response.status(200);
        response.send(json);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;    
    } finally {
        mongoClient.close();
    }
});

app.post("/tech/post", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        // get reference to desired collection in DB
        let techCollection = mongoClient.db(DB_NAME).collection("technologies");

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.description = request.sanitize(request.body.description);
        request.body.difficulty = request.sanitize(request.body.difficulty);
        request.body.courses.forEach(course => {
            course.code = request.sanitize(course.code);
            course.name = request.sanitize(course.name);
        });

        // add new document into DB collection
        let result = await techCollection.insertOne(request.body);

        // status code for created
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});


app.put("/tech/put", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        // get reference to desired collection in DB
        let techCollection = mongoClient.db(DB_NAME).collection("technologies");

        // isolating route parameter
        let id = new ObjectId(request.sanitize(request.body.id));

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.description = request.sanitize(request.body.description);
        request.body.difficulty = request.sanitize(request.body.difficulty);
        request.body.courses.forEach(course => {
            course.code = request.sanitize(course.code);
            course.name = request.sanitize(course.name);
        });

        // add new document into DB collection
        let selector = { "_id": id };
        let newValues = { $set: {"name": request.body.name, "description": request.body.description, "difficulty": request.body.difficulty, "courses": request.body.courses } };
        let result = await techCollection.updateOne(selector, newValues);

        if (result.matchedCount <= 0) {
            response.status(404);
            response.send({error: "No technology documents found with ID"});
            mongoClient.close();
            return;
        }
        
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.delete("/tech/delete", async (request, response) => {
    // construct MongoClient object for working with MongoDB
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect();
        // get reference to desired collection in DB
        let techCollection = mongoClient.db(DB_NAME).collection("technologies");
        // isolate route parameter
        let id = new ObjectId(request.sanitize(request.body.id));
        
        let selector = { "_id": id };
        let result = await techCollection.deleteOne(selector); 
        // status code for created
        if (result.deletedCount <= 0) {
            response.status(404);
            response.send({error: 'No technology documents found with ID'});
            return;
        }
        response.status(200);
        response.send(result);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.post("/course/post", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        // get reference to desired collection in DB
        let courseCollection = mongoClient.db(DB_NAME).collection("courses");

        // Check if course code exists
        let courseCodeExists = await courseCollection.find({code: request.body.code}).toArray();

        if(courseCodeExists.length > 0) {
            response.status(409);
            response.send("Course code already exists.");
            return;
        }

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.code = request.sanitize(request.body.code);

        // add new document into DB collection
        let result = await courseCollection.insertOne(request.body);

        // status code for created
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});


app.put("/course/put", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 

        // get reference to desired collection in DB
        let courseCollection = mongoClient.db(DB_NAME).collection("courses");
        let technologyCollection = mongoClient.db(DB_NAME).collection("technologies");

        // isolating route parameter
        let id = new ObjectId(request.sanitize(request.body.id));

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.code = request.sanitize(request.body.code);

        // add new document into DB collection
        let selector = { "_id": id };
        let oldValues = await courseCollection.findOne(selector);
        let newValues = { $set: {"name": request.body.name, "code": request.body.code} };
        let result = await courseCollection.updateOne(selector, newValues);

        if (result.matchedCount <= 0) {
            response.status(404);
            response.send({error: "No course documents found with ID"});
            mongoClient.close();
            return;
        }

        await technologyCollection.updateMany(
            {courses: {$elemMatch: {code: oldValues.code, name: oldValues.name}}},
            {$set: {'courses.$[element].name': request.body.name}},
            {multi: true, arrayFilters: [{"element.code": oldValues.code}]}
        );
        
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.delete("/course/delete", async (request, response) => {
    // construct MongoClient object for working with MongoDB
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect();
        // get reference to desired collection in DB
        let courseCollection = mongoClient.db(DB_NAME).collection("courses");
        let technologyCollection = mongoClient.db(DB_NAME).collection("technologies");

        // isolate route parameter
        let id = new ObjectId(request.sanitize(request.body.id));
        
        let selector = { "_id": id };
        let result = await courseCollection.deleteOne(selector); 
        
        // status code for created
        if (result.deletedCount <= 0) {
            response.status(404);
            response.send({error: 'No course documents found with ID'});
            return;
        }

        await technologyCollection.updateMany(
            {courses: {$elemMatch: {code: request.body.code, name: request.body.name}}},
            {$pull: {'courses': {code: request.body.code, name: request.body.name}}}
        );

        response.status(200);
        response.send(result);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});
    
// wildcard to handle all other non-api URL routings and point to index.html
app.use((request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(8080, () => console.log("Listening on port 8080"));