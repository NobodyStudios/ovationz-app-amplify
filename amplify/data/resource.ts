import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a database schema. Modify as needed.
=========================================================================*/
const schema = a.schema({
  StaticPage: a
    .model({
      title: a.string(),
      content: a.string(),
      version: a.integer(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  SpeakerSeries: a
    .model({
      title: a.string(),
      description: a.string(),
      duration: a.string(),
      numberOfSpeakers: a.integer(),
      topicsCovered: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  User: a
    .model({
      name: a.string(),
      role: a.string(), // 'organizer' or 'talent'
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Event: a
    .model({
      title: a.string(),
      date: a.string(),
      time: a.string(),
      description: a.string(),
      materials: a.string(), // URL to uploaded materials
      organizerId: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  TalentProfile: a
    .model({
      biography: a.string(),
      expertise: a.string(),
      contactInfo: a.string(),
      availability: a.string(), // JSON string of available dates
      pricing: a.string(), // JSON string of pricing details
      media: a.string(), // URL to uploaded media
      userId: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: records } = await client.models.StaticPage.list()

// return <ul>{records.map(record => <li key={record.id}>{record.title}</li>)}</ul>
