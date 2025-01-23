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

export default function SpeakerSeriesAdmin() {
  const [series, setSeries] = useState<Array<Schema["SpeakerSeries"]["type"]>>([]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [numberOfSpeakers, setNumberOfSpeakers] = useState("");
  const [topicsCovered, setTopicsCovered] = useState("");

  useEffect(() => {
    client.models.SpeakerSeries.list().then((response) => setSeries(response.data));
  }, []);

  const handleSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seriesItem = series.find((s) => s.id === event.target.value);
    if (seriesItem) {
      setSelectedSeries(seriesItem.id);
      setTitle(seriesItem.title ?? "");
      setDescription(seriesItem.description ?? "");
      setDuration(seriesItem.duration ?? "");
      setNumberOfSpeakers(seriesItem.numberOfSpeakers?.toString() ?? "");
      setTopicsCovered(seriesItem.topicsCovered ?? "");
    }
  };

  const handleSave = () => {
    const seriesItem = series.find((s) => s.id === selectedSeries);
    if (seriesItem) {
      client.models.SpeakerSeries.update({
        id: seriesItem.id,
        title,
        description,
        duration,
        numberOfSpeakers: parseInt(numberOfSpeakers, 10),
        topicsCovered,
      }).then(() => {
        // Update the local state to reflect the new version
        setSeries(series.map(s => s.id === seriesItem.id ? { ...s, title, description, duration, numberOfSpeakers: parseInt(numberOfSpeakers, 10), topicsCovered } : s));
      });
    }
  };

  return (
    <View>
      <Heading level={1}>Speaker Series Management</Heading>
      <SelectField
        label="Select Series"
        placeholder="Choose a series to edit"
        onChange={handleSeriesChange}
      >
        {series.map((seriesItem) => (
          <option key={seriesItem.id} value={seriesItem.id}>
            {seriesItem.title}
          </option>
        ))}
      </SelectField>
      <TextField
        label="Title"
        placeholder="Series title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextAreaField
        label="Description"
        placeholder="Series description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        label="Duration"
        placeholder="Series duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <TextField
        label="Number of Speakers"
        placeholder="Number of speakers"
        value={numberOfSpeakers}
        onChange={(e) => setNumberOfSpeakers(e.target.value)}
      />
      <TextAreaField
        label="Topics Covered"
        placeholder="Topics covered"
        value={topicsCovered}
        onChange={(e) => setTopicsCovered(e.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </View>
  );
}
