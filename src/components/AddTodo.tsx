import dayjs from 'dayjs'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { FC, FormEvent, useState } from 'react'
import { db, storage } from '../api/firebase'

import '../styles/addTodo.css'


interface AddTodoProps {
    hideMenu: () => void
}

const AddTodo:FC<AddTodoProps> = ({hideMenu}) => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [file, setFile] = useState<any>(null)

    //минимальный день на выполнение задачи
    const minimumCompletionDate = dayjs().format('YYYY-MM-DD')

    // очищение полей после отправки данных
    const cleanInputs = () => {
        setTitle('')
        setDescription('')
        setDate('')
        setFile(null)
    }
    
    // отправка данных
    const submitHandler = async (e:FormEvent) => {
        e.preventDefault()
        if(!title.length || !description.length || !date.length){
            return alert('Заполните все поля')
        }
        
        const fileRef = ref(storage, `images/${file.name}`)
        await uploadBytes(fileRef, file)
        const fullFileUrl =  await getDownloadURL(fileRef)
           
        await addDoc(collection(db, 'todos'), {
            title,
            description,
            completed:false,
            date:dayjs(date).format('DD.MM.YYYY'),
            file:fullFileUrl,
        
        })
        cleanInputs()
        hideMenu()  
    }
    
    return (
        <form onSubmit={submitHandler}>
            <div className="form__header">
                <h3>Новая задача</h3>
                <span onClick={hideMenu}  className="material-symbols-outlined">close</span>
            </div>
            <div className='form__inner'>
                <div className='form__title'>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' />
                    <input value={description} onChange={(e) => setDescription(e.target.value)} type='text' placeholder='Description' />
                </div>
                <div>
                    <label htmlFor="date">Дата завершения: </label>
                    <input value={date} onChange={(e) => setDate(e.target.value)} id='date' type="date" placeholder='Date' min={minimumCompletionDate}/>
                </div>
                <div>
                    <label htmlFor="file">Закрепить файл</label>
                    <input onChange={(e:any) => setFile(e.target.files[0])} id='file' type="file"  />
                </div>
            </div>
            <button type='submit' className='add__button'>Добавить</button>
        </form>
    )
}

export default AddTodo