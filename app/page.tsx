"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { View, Heading, TextField, Button, Flex, Link, Card, Collection, Text } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [talent, setTalent] = useState<Array<Schema["TalentProfile"]["type"]>>([]);

  useEffect(() => {
    client.models.TalentProfile.list().then((response) => setTalent(response.data));
  }, []);

  const filteredTalent = talent.filter(t => 
    (t.biography ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.expertise ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View>
      <Flex as="nav" direction="row" justifyContent="space-around" padding="1rem">
        <Link href="#about">About Us</Link>
        <Link href="#series">Speaker Series</Link>
        <Link href="#how-it-works">How It Works</Link>
        <Link href="#contact">Contact</Link>
      </Flex>
      <Heading level={1}>Search Talent</Heading>
      <TextField
        label="Search"
        placeholder="Search talent..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <section id="featured-talent">
        <Heading level={2}>Featured Talent</Heading>
        <Collection
          type="list"
          items={filteredTalent}
          gap="1rem"
        >
          {(item, index) => (
            <Card key={index}>
              <Heading level={3}>{item.biography}</Heading>
              <Text>{item.expertise}</Text>
              <Text>{item.contactInfo}</Text>
            </Card>
          )}
        </Collection>
      </section>
      <Flex direction="row" justifyContent="center" gap="1rem" padding="1rem">
        <Button>Sign Up as Talent</Button>
        <Button>Book Talent for Events</Button>
      </Flex>
    </View>
  );
}
