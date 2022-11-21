import { ITodo } from './../types/todo';

import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'

import {getFirestore, updateDoc, doc, deleteDoc } from "firebase/firestore"; 
import dayjs from 'dayjs';

const firebaseConfig = {
  apiKey: "AIzaSyDDyECn9zNPXRvI_8pKJ_kEwQxxa-L0oHQ",
  authDomain: "todolist-fee30.firebaseapp.com",
  projectId: "todolist-fee30",
  storageBucket: "todolist-fee30.appspot.com",
  messagingSenderId: "141379711797",
  appId: "1:141379711797:web:11faccce897240838d527c",
  measurementId: "G-1RMJ4KJCX0"
};

interface IupdateData{

  title:string,
  description:string,
  file?:any,
  date:string
}


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)



export const completeHandler = async (todo:ITodo) => {
    await updateDoc(doc(db, 'todos', todo.id), {completed: !todo.completed})
}
export const deleteHandler = (id:string) => {
  deleteDoc(doc(db, 'todos', id))
}
export const updateHandler = async (data: IupdateData, id:string) => {
  const {title, description, date, file} = data
  if(file){
    const fileRef = ref(storage, `images/${file.name}`)
    await uploadBytes(fileRef, file)
    const fullFileUrl =  await getDownloadURL(fileRef)
    const todo = {
                title: title,
                description: description,
                date:dayjs(date).format('DD.MM.YYYY'),
                file:fullFileUrl
            };
    const docRef = doc(db, "todos", id);
    await updateDoc(docRef, todo)
  }else{
    const docRef = doc(db, "todos", id);
    const todo = {
        title: title,
        description: description,
        date:dayjs(date).format('DD.MM.YYYY')
        
    };
    await updateDoc(docRef, todo)
  }
}

