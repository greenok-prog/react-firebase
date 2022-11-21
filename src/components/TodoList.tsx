import React, { FC } from 'react'
import { ITodo } from '../types/todo'
import TodoItem from './TodoItem'
import '../styles/todolist.css'

interface TodoListProps {
    todos:ITodo[],
    changeMenuHandler: (id:string) => void
    
}

const TodoList:FC<TodoListProps> = ({todos, changeMenuHandler}) => {
  
  return (
   <ul className='list'>
     {todos && todos.map(todo => (
        <TodoItem 
         key={todo.id} 
         todo={todo} 
         changeMenuHandler={changeMenuHandler}
        />
    ))}
   </ul>
  )
}

export default TodoList