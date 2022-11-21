import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import { useEffect, useState } from 'react';

import  './styles/app.css'


import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './api/firebase';
import { ITodo } from './types/todo';
import ChangeTodo from './components/ChangeTodo';


function App() {
  const [todos, setTodos] = useState<ITodo[]>([])
  const [addMenu, setAddMenu] = useState<boolean>(false)
  const [changeMenu, setChangeMenu] = useState<any>({show: false, todo:{id:'', title:'', description:'', completed:false, date:'', file:''}})

  
  useEffect(() => {
    const q=query(collection(db,'todos'),orderBy('completed','desc'));
    onSnapshot(q,(snapshot)=>{
      setTodos(snapshot.docs.map((el) => {
        return {
          id:el.id, 
          title:el.data().title,
          description:el.data().description,
          completed:el.data().completed,
          date:el.data().date,
          file: el.data().file

        }
      }))
      
    })  
  }, [])

  const showAddMenu = ():void => {
    setAddMenu(true)
    setChangeMenu({show:false, todo:{id:'', title:'', description:'', completed:false, date:'', file:''}})
  }

  const hideAddMenu = ():void => {
    setAddMenu(false)
  }
  const showChangeMenu = async (id:string) => {
    setAddMenu(false)
    const docRef = doc(db, 'todos', id)
    const todo = await getDoc(docRef)
    const data:any = todo.data()
    setChangeMenu({show:true, todo:{id:todo.id, title:data.title, description:data.description, completed:data.completed, date:data.date, file:data.file}})
    
  }
  const hideChangeMenu = () => {
    setChangeMenu({show:false, todo:{id:'', title:'', description:'', completed:false, date:'', file:''}})
    
  }

  
  return (
    <div className='container'>
      {addMenu && <AddTodo hideMenu={hideAddMenu}/>}
      {changeMenu.show && <ChangeTodo hideMenu={hideChangeMenu} todo={changeMenu.todo}/>}
      {!addMenu && !changeMenu.show && <button onClick={showAddMenu} className='add__toggler'>Добавить</button>}

      <TodoList changeMenuHandler={showChangeMenu}  todos={todos} />
    </div>
  );
}

export default App;
