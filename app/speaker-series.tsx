"use client";

import { useState, useEffect } from "react";
import { View, Heading, Text, Button, Flex, Link, Card, Collection } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function SpeakerSeries() {
  const [series, setSeries] = useState<Array<Schema["SpeakerSeries"]["type"]>>([]);

  useEffect(() => {
    client.models.SpeakerSeries.list().then((response) => setSeries(response.data));
  }, []);

  return (
    <View>
      <Flex as="nav" direction="row" justifyContent="space-around" padding="1rem">
        <Link href="#about">About Us</Link>
        <Link href="#series">Speaker Series</Link>
        <Link href="#how-it-works">How It Works</Link>
        <Link href="#contact">Contact</Link>
      </Flex>
      <Heading level={1}>Speaker Series Program</Heading>
      <Text>Join our Speaker Series to gain insights from top experts in various fields.</Text>
      <section id="program-details">
        <Heading level={2}>Program Details</Heading>
        {series.map((seriesItem) => (
          <Card key={seriesItem.id}>
            <Heading level={3}>{seriesItem.title}</Heading>
            <Text>{seriesItem.description}</Text>
            <Text>Duration: {seriesItem.duration}</Text>
            <Text>Number of Speakers: {seriesItem.numberOfSpeakers}</Text>
            <Text>Topics Covered: {seriesItem.topicsCovered}</Text>
          </Card>
        ))}
      </section>
      <section id="booking-information">
        <Heading level={2}>Booking Information</Heading>
        <Text>To book the series, please contact us at:</Text>
        <Text>Email: info@example.com</Text>
        <Text>Phone: (123) 456-7890</Text>
      </section>
      <Flex direction="row" justifyContent="center" gap="1rem" padding="1rem">
        <Button>Sign Up for Series</Button>
        <Button>Contact Us</Button>
      </Flex>
    </View>
  );
}
