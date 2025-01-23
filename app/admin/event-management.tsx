"use client";

import { useState, useEffect } from "react";
import { View, Heading, TextField, TextAreaField, Button, Flex, SelectField } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "./../../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function EventManagement() {
  const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");

  useEffect(() => {
    client.models.Event.list().then((response) => setEvents(response.data));
  }, []);

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventItem = events.find((e) => e.id === event.target.value);
    if (eventItem) {
      setSelectedEvent(eventItem.id);
      setTitle(eventItem.title ?? "");
      setDate(eventItem.date ?? "");
      setTime(eventItem.time ?? "");
      setDescription(eventItem.description ?? "");
      setMaterials(eventItem.materials ?? "");
    }
  };

  const handleSave = () => {
    const eventItem = events.find((e) => e.id === selectedEvent);
    if (eventItem) {
      client.models.Event.update({
        id: eventItem.id,
        title,
        date,
        time,
        description,
        materials,
      }).then(() => {
        // Update the local state to reflect the new version
        setEvents(events.map(e => e.id === eventItem.id ? { ...e, title, date, time, description, materials } : e));
      });
    } else {
      client.models.Event.create({
        title,
        date,
        time,
        description,
        materials,
        organizerId: "organizer-id", // Replace with actual organizer ID
      }).then((response) => {
        const newEvent = response.data;
        if (newEvent) {
          setEvents([...events, newEvent]);
        }
      });
    }
  };

  const handleDelete = () => {
    const eventItem = events.find((e) => e.id === selectedEvent);
    if (eventItem) {
      client.models.Event.delete({
        id: eventItem.id,
      }).then(() => {
        setEvents(events.filter(e => e.id !== eventItem.id));
        setSelectedEvent("");
        setTitle("");
        setDate("");
        setTime("");
        setDescription("");
        setMaterials("");
      });
    }
  };

  return (
    <View>
      <Heading level={1}>Event Management</Heading>
      <SelectField
        label="Select Event"
        placeholder="Choose an event to edit"
        onChange={handleEventChange}
      >
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </SelectField>
      <TextField
        label="Title"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Date"
        placeholder="Event date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
      />
      <TextField
        label="Time"
        placeholder="Event time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        type="time"
      />
      <TextAreaField
        label="Description"
        placeholder="Event description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        label="Materials"
        placeholder="URL to related materials"
        value={materials}
        onChange={(e) => setMaterials(e.target.value)}
      />
      <Flex direction="row" gap="1rem">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleDelete} variation="destructive">Delete</Button>
      </Flex>
    </View>
  );
}
