// import Axios from 'axios'

// export async function getTodos(idToken) {
//   console.log('Fetching todos')

//   const response = await Axios.get(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
//   console.log('Todos:', response.data)
//   return response.data.items
// }

// export async function createTodo(idToken, newTodo) {
  
//   if (!newTodo.name || newTodo.name.trim() === '') {
//     throw new Error('Todo name is required');
//   }
//   if (!newTodo.dueDate) {
//     throw new Error('Due date is required');
//   }

//   const response = await Axios.post(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos`,
//     JSON.stringify(newTodo),
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
//   return response.data.item
// }

// export async function patchTodo(idToken, todoId, updatedTodo) {
//   await Axios.patch(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`,
//     JSON.stringify(updatedTodo),
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
// }

// export async function deleteTodo(idToken, todoId) {
//   await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${idToken}`
//       }
//     })
// }

// export async function getUploadUrl(idToken, todoId) {
//   const response = await Axios.post(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}/attachment`,
//     '',
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
//   return response.data.uploadUrl
// }

// export async function uploadFile(uploadUrl, file) {
//   await Axios.put(uploadUrl, file)
// }

// import Axios from 'axios'

// export async function getTodos(idToken) {
//   console.log('Fetching todos')

//   const response = await Axios.get(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
//   console.log('Todos:', response.data)
//   return response.data.items
// }

// export async function createTodo(idToken, newTodo) {
//   const response = await Axios.post(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos`,
//     JSON.stringify(newTodo),
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
//   return response.data.item
// }

// export async function patchTodo(idToken, todoId, updatedTodo) {
//   await Axios.patch(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`,
//     JSON.stringify(updatedTodo),
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
// }

// export async function deleteTodo(idToken, todoId) {
//   await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${idToken}`
//     }
//   })
// }

// export async function getUploadUrl(idToken, todoId) {
//   const response = await Axios.post(
//     `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}/attachment`,
//     '',
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${idToken}`
//       }
//     }
//   )
//   return response.data.uploadUrl
// }

// export async function uploadFile(uploadUrl, file) {
//   await Axios.put(uploadUrl, file)
// }

import Axios from 'axios';

export async function getTodos(idToken) {
  console.log('Fetching todos');
  try {
    const response = await Axios.get(`${process.env.REACT_APP_API_ENDPOINT}/todos`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    });
    console.log('Todos:', response.data);
    return response.data.items;
  } catch (error) {
    console.error('Error fetching todos:', error.response?.data || error.message);
    throw error;
  }
}

export async function createTodo(idToken, newTodo) {
  if (!newTodo.name || newTodo.name.trim() === '') {
    throw new Error('Todo name is required');
  }
  if (!newTodo.dueDate || newTodo.dueDate.trim() === '') {
    throw new Error('Due date is required');
  }
  try {
    const response = await Axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/todos`,
      newTodo, // Axios handles JSON.stringify
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data.item;
  } catch (error) {
    console.error('Error creating todo:', error.response?.data || error.message);
    throw error;
  }
}

export async function patchTodo(idToken, todoId, updatedTodo) {
  try {
    await Axios.patch(
      `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`,
      updatedTodo,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        }
      }
    );
  } catch (error) {
    console.error('Error updating todo:', error.response?.data || error.message);
    throw error;
  }
}

export async function deleteTodo(idToken, todoId) {
  try {
    await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    });
  } catch (error) {
    console.error('Error deleting todo:', error.response?.data || error.message);
    throw error;
  }
}

export async function getUploadUrl(idToken, todoId) {
  try {
    const response = await Axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/todos/${todoId}/attachment`,
      null, // No body needed
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data.uploadUrl;
  } catch (error) {
    console.error('Error getting upload URL:', error.response?.data || error.message);
    throw error;
  }
}

export async function uploadFile(uploadUrl, file) {
  try {
    await Axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream'
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error.response?.data || error.message);
    throw error;
  }
}
