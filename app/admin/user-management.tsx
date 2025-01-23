"use client";

import { useState, useEffect } from "react";
import { View, Heading, TextField, Button, Flex, SelectField } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "./../../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function UserManagement() {
  const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    client.models.User.list().then((response) => setUsers(response.data));
  }, []);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const user = users.find((u) => u.id === event.target.value);
    if (user) {
      setSelectedUser(user.id);
      setName(user.name ?? "");
    }
  };

  const handleSave = () => {
    const user = users.find((u) => u.id === selectedUser);
    if (user) {
      client.models.User.update({
        id: user.id,
        name,
      }).then(() => {
        // Update the local state to reflect the new version
        setUsers(users.map(u => u.id === user.id ? { ...u, name } : u));
      });
    }
  };

  return (
    <View>
      <Heading level={1}>User Management</Heading>
      <SelectField
        label="Select User"
        placeholder="Choose a user to edit"
        onChange={handleUserChange}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </SelectField>
      <TextField
        label="Name"
        placeholder="User name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </View>
  );
}
