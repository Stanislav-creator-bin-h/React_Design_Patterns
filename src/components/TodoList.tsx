import React from 'react';
import useTodos, { type Todo } from '../hooks/useTodos';import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';

const TodoList: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodoTitle,
    currentPage,
    limitPerPage,
    totalTodos,
    goToNextPage,
    goToPrevPage,
    setLimit,
    setSearchTerm,
  } = useTodos();

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>TODO LIST</h1>
      <input
        type="text"
        placeholder="Search todos..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <AddTodoForm onAddTodo={addTodo} />
      <ul>
        {todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodoTitle}
          />
        ))}
      </ul>
      {todos.length === 0 && <p>No tasks found. Add one or adjust your search!</p>}
      <div>
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(totalTodos / limitPerPage)}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage * limitPerPage >= totalTodos}
        >
          Next
        </button>
        <select onChange={(e) => setLimit(Number(e.target.value))} value={limitPerPage}>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>
    </div>
  );
};

export default TodoList;