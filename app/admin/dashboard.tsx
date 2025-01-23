"use client";

import { useState, useEffect } from "react";
import { View, Heading, Text, Flex, Card, Collection } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "./../../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function Dashboard() {
  const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);

  useEffect(() => {
    client.models.Event.list().then((response) => setEvents(response.data));
  }, []);

  const upcomingEvents = events.filter(event => event.date && new Date(event.date) >= new Date());
  const pastEvents = events.filter(event => event.date && new Date(event.date) < new Date());

  return (
    <View>
      <Heading level={1}>Dashboard</Heading>
      <section id="upcoming-events">
        <Heading level={2}>Upcoming Events</Heading>
        <Collection
          type="list"
          items={upcomingEvents}
          gap="1rem"
        >
          {(item, index) => (
            <Card key={index}>
              <Heading level={3}>{item.title}</Heading>
              <Text>Date: {item.date}</Text>
              <Text>Time: {item.time}</Text>
              <Text>Description: {item.description}</Text>
              <Text>Materials: {item.materials}</Text>
            </Card>
          )}
        </Collection>
      </section>
      <section id="past-events">
        <Heading level={2}>Past Events</Heading>
        <Collection
          type="list"
          items={pastEvents}
          gap="1rem"
        >
          {(item, index) => (
            <Card key={index}>
              <Heading level={3}>{item.title}</Heading>
              <Text>Date: {item.date}</Text>
              <Text>Time: {item.time}</Text>
              <Text>Description: {item.description}</Text>
              <Text>Materials: {item.materials}</Text>
            </Card>
          )}
        </Collection>
      </section>
    </View>
  );
}
