import { useAuth0 } from '@auth0/auth0-react';
import dateFormat from 'dateformat';
import React, { useState } from 'react';
import { Divider, Grid, Input } from 'semantic-ui-react';
import { createTodo } from '../api/todos-api';

export function NewTodoInput({ onNewTodo }) {
  const [newTodoName, setNewTodoName] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  const onTodoCreate = async (event) => {
    event.preventDefault();
    console.log('Attempting to create todo with name:', newTodoName);

    if (!newTodoName.trim()) {
      alert('Todo name is required');
      console.log('Validation failed: Todo name is empty');
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
        scope: 'write:todos'
      });
      const dueDate = calculateDueDate();
      const createdTodo = await createTodo(accessToken, {
        name: newTodoName.trim(),
        dueDate,
        done: false
      });
      console.log('Todo created successfully:', createdTodo);
      setNewTodoName('');
      onNewTodo(createdTodo);
    } catch (e) {
      console.error('Failed to create a new TODO:', e);
      alert('Todo creation failed: ' + e.message);
    }
  };

  return (
    <Grid.Row>
      <Grid.Column width={16}>
        <Input
          action={{
            color: 'teal',
            labelPosition: 'left',
            icon: 'add',
            content: 'New task',
            onClick: onTodoCreate,
            disabled: !newTodoName.trim()
          }}
          fluid
          actionPosition="left"
          placeholder="To change the world..."
          value={newTodoName}
          onChange={(event) => {
            setNewTodoName(event.target.value);
            console.log('Input changed, newTodoName:', event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter' && newTodoName.trim()) {
              console.log('Enter key pressed, triggering onTodoCreate');
              onTodoCreate(event);
            }
          }}
        />
      </Grid.Column>
      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>
    </Grid.Row>
  );
}

function calculateDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return dateFormat(date, 'yyyy-mm-dd');
}