"use client";

import { useState, useEffect } from "react";
import { View, Heading, TextField, TextAreaField, Button, Flex, SelectField } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function CMS() {
  const [pages, setPages] = useState<Array<Schema["StaticPage"]["type"]>>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    client.models.StaticPage.list().then((response) => setPages(response.data));
  }, []);

  interface Page {
    id: string;
    title: string;
    content: string;
    version: number;
  }

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const page = pages.find((p) => p.id === event.target.value);
    if (page) {
      setSelectedPage(page.id);
      setContent(page.content ?? "");
    }
  };

  const handleSave = () => {
    const page = pages.find((p) => p.id === selectedPage);
    if (page) {
      client.models.StaticPage.update({
        id: page.id,
        content,
        version: (page.version ?? 0) + 1,
      }).then(() => {
        // Update the local state to reflect the new version
        setPages(pages.map(p => p.id === page.id ? { ...p, content, version: (p.version ?? 0) + 1 } : p));
      });
    }
  };

  return (
    <View>
      <Heading level={1}>Content Management System</Heading>
      <SelectField
        label="Select Page"
        placeholder="Choose a page to edit"
        onChange={handlePageChange}
      >
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.title}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        label="Content"
        placeholder="Edit content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </View>
  );
}
