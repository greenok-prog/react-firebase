import  { FC } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'


import { completeHandler, deleteHandler } from '../api/firebase'

import { ITodo } from '../types/todo'
import '../styles/todoItem.css'


interface TodoItemProps{
  todo:ITodo,
  changeMenuHandler:(id:string) => void
  
}

const TodoItem:FC<TodoItemProps> = ({todo, changeMenuHandler}) => {
  dayjs.extend(customParseFormat)
  
  const daysToComplete = dayjs(todo.date, 'DD.MM.YYYY', true).diff(dayjs(), "day")
  const uncompletedTodo = daysToComplete < 0
  
  
  return (
    <li className={`${todo.completed ? 'completed' : uncompletedTodo ? 'uncompleted' : ''} todo`}>
      <div className='todo__header'>
        <span className='todo__title'>
          <input disabled={uncompletedTodo} checked={todo.completed} onChange={() => completeHandler(todo)} type="checkbox" />{todo.title}
        </span>
        <sub>{uncompletedTodo ? 'задание не выполнено до: ': 'завершить до: '} {todo.date} </sub> 
      </div>
      <div className='todo__description'>
        <span>{todo.description}</span>
        <div className='todo__actions'>
          <a href={todo.file} download target="_blank" rel="noreferrer" className='todo__action action-file'>
            <span className="material-symbols-outlined">description</span>
          </a>
          {!todo.completed &&  
          <button onClick={() => changeMenuHandler(todo.id)}  className='todo__action action-edit'>
              <span className="material-symbols-outlined">edit</span>
          </button>
          }
          <button onClick={() => deleteHandler(todo.id)} className='todo__action action-delete'>
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoItem