

import dayjs from 'dayjs'

import { FC, useState } from 'react'
import {updateHandler} from '../api/firebase'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import '../styles/addTodo.css'
import { ITodo } from '../types/todo'


interface ChangeTodoProps {
    hideMenu: () => void,
    todo:ITodo
}

const ChangeTodo:FC<ChangeTodoProps> = ({hideMenu, todo}) => {
    
    dayjs.extend(customParseFormat)
    const parsedDate = dayjs(todo.date, 'DD.MM.YYYY', true).format('YYYY-MM-DD')
    
    const [title, setTitle] = useState<string>(todo.title)
    const [description, setDescription] = useState<string>(todo.description)
    const [date, setDate] = useState<string>(parsedDate)
    const [file, setFile] = useState<any>('')
    
    // очищение полей после отправки данных
    const cleanInputs = () => {
        setTitle('')
        setDescription('')
        setDate('')
        setFile('')
    }
    
    // отправка данных
    const update = async (e:any) => {
        e.preventDefault()
        if(!title.length || !description.length || !date.length){
            return alert('Заполните все поля')
        }
        updateHandler({title, description, date, file}, todo.id)
        cleanInputs()
        hideMenu()
        
    }
   const minimumCompletionDate = dayjs().format('YYYY-MM-DD')
  return (
    <form onSubmit={update}>
        <div className="form__header">
            <h3>Изменение задачи</h3>
            <span onClick={hideMenu}  className="material-symbols-outlined">close</span>
        </div>
        <div className='form__inner'>
            <div className='form__title'>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' />
                <input value={description} onChange={(e) => setDescription(e.target.value)} type='text' placeholder='Description' />
            </div>
            <div>
                <label htmlFor="date">Дата завершения: </label>
                <input  value={date} onChange={(e) => setDate(e.target.value)} id='date' type="date" placeholder='Date' min={minimumCompletionDate}/>
            </div>
            <div>
                <label htmlFor="file">Закрепить файл</label>
                <input onChange={(e:any) => setFile(e.target.files[0])} id='file' type="file"  />
            </div>
        </div>
        <button className='add__button'>Добавить</button>
    </form>
  )
}



export default ChangeTodo