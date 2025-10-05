import React, { useState } from "react"

interface AddTodoFormProps {
 onAddTodo: (newText: string) => Promise<void>;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
 const [newTodo, setNewTodo] = useState<string>("")

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (newTodo.trim()) {
   onAddTodo(newTodo) 
   setNewTodo("")
  }
 }

 return (
  <form onSubmit={handleSubmit}>
   <input 
            type="text" 
            placeholder="Add a new task..." 
            value={newTodo} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)} 
        />
   <button type="submit">Add Task</button>
  </form>
 )
}

export default AddTodoForm