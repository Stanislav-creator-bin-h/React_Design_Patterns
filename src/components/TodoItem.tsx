import type React from 'react';
import { useState } from 'react';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => Promise<void>;
  onDeleteTodo: (id: number) => Promise<void>;
  onEditTodo: (id: number, newTitle: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDeleteTodo, onEditTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.todo);

  const handleSave = async () => {
    if (editedText.trim()) {
      await onEditTodo(todo.id, editedText);
      setIsEditing(false);
    }
  };

  const itemClassName = todo.completed ? 'completed' : '';

  return (
    <li className={itemClassName}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
        aria-label={`Toggle completion for ${todo.todo}`}
      />
      {isEditing ? (
        <input
          type="text"
          className="todo-edit-input"
          value={editedText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
          autoFocus
          aria-label={`Edit ${todo.todo}`}
        />
      ) : (
        <span>{todo.todo}</span>
      )}
      <div>
        {isEditing ? (
          <button className="save-btn" onClick={handleSave} aria-label="Save todo">
            Save
          </button>
        ) : (
          <button
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${todo.todo}`}
          >
            Edit
          </button>
        )}
        <button
          className="delete-btn"
          onClick={() => onDeleteTodo(todo.id)}
          aria-label={`Delete ${todo.todo}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;