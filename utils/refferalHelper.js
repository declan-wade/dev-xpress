"use server";

import { MongoClient, ServerApiVersion } from "mongodb";
import { ReferralTemplate } from "@/components/referral-template";
import { Resend } from "resend";
import dayjs from "dayjs";
import {logActivity} from '@/utils/activityHelper'

const resend = new Resend(process.env.RESEND_API_KEY);

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function createReferral(data) {
  console.log(data)
  try {
    const result = await sendInitialEmail(data);
    console.log(result)
    data.email_id = result.response.data.id
    const database = client.db("easy-assess-prev");
    const referrals = database.collection("referrals");
    const options = { upsert: true };
    const outcome = await referrals.insertOne(data, options);
    console.log("Upserted referral record...", outcome);
    logActivity(data.officer, data._id, "Created referral")
    return { body: "success" };
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}

async function sendInitialEmail(data) {
  console.log("Sending email....");
  try {
    const result = await resend.emails.send({
      from: `${data.org} Referrals <referrals@mail.easy-assess.com>`,
      to: [`${data.destination}`],
      subject: `[Action Required] New Referral - ${data.app_ref_friendly}`,
      react: ReferralTemplate({ data }),
    });

    if (result.error) {
      console.error("Error sending email:", result.error);
      await logActivity("SYSTEM", data._id, "Error sending email: " + result.error.message);
      return { success: false, error: result.error };
    }

    console.log("Email sent successfully:", result);
    await logActivity("SYSTEM", data._id, "Email sent successfully");
    return { success: true, response: result };
  } catch (error) {
    console.error("Exception occurred while sending email:", error);
    await logActivity("SYSTEM", data._id, "Exception occurred while sending email: " + error.message);
    return { success: false, error: error };
  }
}

async function fetchDocumentsByQuery(collection, query) {
  const cursor = collection.find(query);
  const payload = [];
  for await (const doc of cursor) {
    payload.push(doc);
  }
  return payload;
}

export async function getReferrals(userid) {
  try {
    const database = client.db("easy-assess-prev");
    const referrals = database.collection("referrals");
    const query = { user_id: userid };
    return fetchDocumentsByQuery(referrals, query);
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}

export async function getReferralsByRef(id) {
  try {
    const database = client.db("easy-assess-prev");
    const referrals = database.collection("referrals");
    const query = { app_ref: id };
    return fetchDocumentsByQuery(referrals, query);
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}

export async function getReferralById(id) {
  try {
    const database = client.db("easy-assess-prev");
    const referrals = database.collection("referrals");
    const query = { _id: id };
    return fetchDocumentsByQuery(referrals, query);
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}

export async function getReferralEmailLog(id) {
  try {
    const database = client.db("easy-assess-prev");
    const referrals = database.collection("email-log");
    const query = { app_ref: id };
    return fetchDocumentsByQuery(referrals, query);
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}

export async function validateReferral(pin,id) {
  console.log("recieved", pin, id)
  try {
    const database = client.db("easy-assess-prev");
    const referrals = database.collection("referrals");
    const query = { _id: id };
    const response = await fetchDocumentsByQuery(referrals, query);
    console.log(response)
    if (response[0].pin == pin){
      logActivity("EXTERNAL", id, "Referral opened by external user")
      return response
    }
    else{
      logActivity("EXTERNAL", id, "Failed PIN validation by external user")
      return ("Validation failed!")
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}

export async function updateReferral(responseStatus,responseDetails,responseFiles,id){
  try {
    const database = client.db("easy-assess-prev");
    const referrals = database.collection("referrals");
    const updateDoc = {
        $set: {
            status: responseStatus,
            responseDetails: responseDetails,
            responseFiles: responseFiles,
            responseTime: dayjs()
        },
    };
    const query = { _id: id };
    const response = await referrals.updateOne(query, updateDoc);
    logActivity("EXTERNAL", id, "Referral response modified by external user")
    console.log(response)
    return (response)
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}

export async function getEmailLog(id){
  try {
    const database = client.db("easy-assess-prev");
    const emailLog = database.collection("email_log");
    const query = { email_id: id };
    const response = await fetchDocumentsByQuery(emailLog, query);
    return response
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
}
