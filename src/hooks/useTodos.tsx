import { useState, useEffect } from 'react';

export interface Todo {
 id: number;
 todo: string;
 completed: boolean;
 userId: number;
}

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
}

const useTodos = (): UseTodosReturn => {
 const [todos, setTodos] = useState<Todo[]>([]);
 const [isLoading, setIsLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchTodos = async () => {
    try {
      const response = await fetch('https://dummyjson.com/todos?limit=10'); 
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setTodos(data.todos);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred during fetching.'); 
      
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchTodos();
}, []);

 const addTodo = async (text: string) => {
  const newTodo: Todo = {
   id: Date.now(),
   todo: text,
   completed: false,
   userId: 1,
  };
  setTodos((prevTodos) => [...prevTodos, newTodo]);
  
    try {
        await fetch('https://dummyjson.com/todos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo),
        });
    } catch (_err) {
      void _err;
        setError('Failed to add todo (API error).');
        setTodos((prev) => prev.filter(t => t.id !== newTodo.id));
    }
 };

 const deleteTodo = async (id: number) => {
    const todoToDelete = todos.find(t => t.id === id);
    
  setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    
  try {
   const response = await fetch(`https://dummyjson.com/todos/${id}`, {
    method: 'DELETE',
   });
       if (!response.ok) {
           throw new Error('API delete failed');
       }
  } catch (_err) {
    void _err;
   setError('Failed to delete todo.');
       if (todoToDelete) setTodos((prev) => [...prev, todoToDelete].sort((a, b) => a.id - b.id)); 
  }
 };

 const toggleTodo = async (id: number) => {
  const todoToToggle = todos.find((todo) => todo.id === id);
  if (!todoToToggle) return;

  setTodos((prevTodos) =>
   prevTodos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
   )
  );

  try {
   const response = await fetch(`https://dummyjson.com/todos/${id}`, {
    method: 'PUT',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed: !todoToToggle.completed }),
   });
      
       if (!response.ok) {
           throw new Error('API toggle failed');
       }
       
  } catch (_err) {
    void _err;
   setError('Failed to toggle todo status.');
   setTodos((prevTodos) =>
    prevTodos.map((todo) =>
     todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
   );
  }
 };

 return { todos, isLoading, error, addTodo, deleteTodo, toggleTodo };
};

export default useTodos;