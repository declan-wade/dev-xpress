"use server"
import dayjs from 'dayjs';
import { MongoClient, ServerApiVersion } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function logActivity(user, guid, desc){
  try {
      const database = client.db("dev-xpress-prev");
      const activity = database.collection("activity");
      console.log("logging activity...")
      const outcome = await activity.insertOne({
          username: user,
          record_id: guid,
          activity: desc,
          timestamp: dayjs()
      });
      return outcome;
  }
  catch (err) {
      console.error(err)
      return err;
  }
}

export async function getActivity(guid){
  try {
      const database = client.db("dev-xpress-prev");
      const activity = database.collection("activity");
      const query = { record_id: guid};
      const cursor = activity.find(query);
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
