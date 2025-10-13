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
  currentPage: number;
  limitPerPage: number;
  totalTodos: number;
  searchTerm: string;
  addTodo: (text: string) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  editTodoTitle: (id: number, newTitle: string) => Promise<void>;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
}

const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const [totalTodos, setTotalTodos] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const skip = (currentPage - 1) * limitPerPage;
      const response = await fetch(`https://dummyjson.com/todos?limit=${limitPerPage}&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setAllTodos(data.todos);
      setTotalTodos(data.total);
      setTodos(
        data.todos.filter((todo: Todo) =>
          todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred during fetching.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [currentPage, limitPerPage]);

  useEffect(() => {
    setTodos(
      allTodos.filter((todo) =>
        todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const addTodo = async (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      todo: text,
      completed: false,
      userId: 1,
    };
    setTodos((prev) => [...prev, newTodo]);
    setAllTodos((prev) => [...prev, newTodo]);
    try {
      await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
    } catch  {
      setError('Failed to add todo (API error).');
      setTodos((prev) => prev.filter((t) => t.id !== newTodo.id));
      setAllTodos((prev) => prev.filter((t) => t.id !== newTodo.id));
    }
  };

  const deleteTodo = async (id: number) => {
    const todoToDelete = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setAllTodos((prev) => prev.filter((todo) => todo.id !== id));
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('API delete failed');
      }
    } catch  {
      setError('Failed to delete todo.');
      if (todoToDelete) {
        setTodos((prev) => [...prev, todoToDelete].sort((a, b) => a.id - b.id));
        setAllTodos((prev) => [...prev, todoToDelete].sort((a, b) => a.id - b.id));
      }
    }
  };

  const toggleTodo = async (id: number) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    setAllTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todoToToggle.completed }),
      });
      if (!response.ok) {
        throw new Error('API toggle failed');
      }
    } catch  {
      setError('Failed to toggle todo status.');
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      setAllTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const editTodoTitle = async (id: number, newTitle: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, todo: newTitle } : todo))
    );
    setAllTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, todo: newTitle } : todo))
    );
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: newTitle }),
      });
      if (!response.ok) {
        throw new Error('API edit failed');
      }
    } catch  {
      setError('Failed to edit todo title.');
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, todo: todo.todo } : todo
        )
      );
      setAllTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, todo: todo.todo } : todo
        )
      );
    }
  };

  const goToNextPage = () => {
    if (currentPage * limitPerPage < totalTodos) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const setLimit = (limit: number) => {
    setLimitPerPage(limit);
    setCurrentPage(1);
  };

  return {
    todos,
    isLoading,
    error,
    currentPage,
    limitPerPage,
    totalTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodoTitle,
    goToNextPage,
    goToPrevPage,
    setLimit,
    setSearchTerm,
    searchTerm
  };
};

export default useTodos;