"use server"
import { MongoClient, BSON, ServerApiVersion } from 'mongodb'
import {logActivity} from '@/utils/activityHelper'

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function createTask(data, user) {
    try {
        data.clockState = "Running"
        const database = client.db("dev-xpress-prev");
        const task = database.collection("tasks");
        const outcome = await task.insertOne({
          ...data
        });
        console.log("created record")
        logActivity(user, outcome.insertedId, "Task created")
        return outcome;
    }
    catch (err) {
        console.error(err)
        return err;
    }
}

export async function getTasks(user) {
    try {
        const database = client.db("dev-xpress-prev");
        const task = database.collection("tasks");
        const query = { 'assignedOfficer': user };
        const cursor =  task.find(query);
        const payload = [];
        for await (const doc of cursor) {
            payload.push(doc);
        }
        return payload
    }
    catch (err) {
        console.error(err)
        return err;
    }
}

export async function getTask(id) {
    try {
        const database = client.db("dev-xpress-prev");
        const task = database.collection("tasks");
        const obj = new BSON.ObjectId(id)
        const query = { _id: obj };
        const payload =  task.findOne(query);
        return payload
    }
    catch (err) {
        console.error(err)
        return err;
    }
}

export async function updateTask(id, data, user) {
    try {
        const database = client.db("dev-xpress-prev");
        const task = database.collection("tasks");
        const obj = new BSON.ObjectId(id)
        const query = { _id: obj };
        const updateDoc = {
            $set: {
              ...data,
            },
        };
        const payload =  task.updateOne(query, updateDoc);
        logActivity(user, outcome.insertedId, "Task modified by user")
        return payload
    }
    catch (err) {
        console.error(err)
        return err;
    }
}
