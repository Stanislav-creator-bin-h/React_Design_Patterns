import React from 'react';
import useTodos, { type Todo } from '../hooks/useTodos';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';

const TodoList: React.FC = () => {
 const { todos, isLoading, error, addTodo, deleteTodo, toggleTodo } = useTodos();

 if (isLoading) {
  return <p>Loading tasks...</p>;
 }

 if (error) {
  return <p>Error: {error}</p>;
 }

 return (
  <div>
   <h1>TODO LIST</h1>
   <AddTodoForm onAddTodo={addTodo} />
   <ul>
    {todos.map((todo: Todo) => (
     <TodoItem
      key={todo.id}
      // Адаптація поля 'todo' з API до 'text' у компоненті
      todo={{
                  id: todo.id,
                  text: todo.todo, 
                  completed: todo.completed
              }}
      onToggleComplete={toggleTodo}
      onDeleteTodo={deleteTodo}
     />
    ))}
   </ul>
   {todos.length === 0 && <p>No tasks yet. Add one above!</p>}
  </div>
 );
}

export default TodoList;