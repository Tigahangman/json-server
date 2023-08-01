import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {

    const url = "http://localhost:4000/colors"
    const [data, setData] = useState([])
    const array = []
    const [add, setAdd] = useState(array)
    const [txt, setTxt] = useState('')
    const [editTxt, setEditTxt] = useState('')
    const [editId, setEditId] = useState(0)
    console.log(add);
    useEffect(() => {
        axios.get(url).then((res) => setData(res.data)) // для получения с сервера
    }, [])
    return (
        <div className="global">
            <div className="todo">
                <input value={txt} type="text" className="inp" onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                        let id2 = Math.random()
                        if (txt.trim()) {
                            setAdd([...add, { id: id2, text: txt, cheked: false }])
                            setTxt('')
                            axios.post(url, { //для добавления в сервер
                                id: id2,
                                text: txt,
                                cheked: false
                            }).then((res) => setData([...data, res.data]))
                        }
                    }
                }} onChange={(e) => {
                    setTxt(e.target.value)

                }} />
                <button className="bth" onClick={() => {
                    let id1 = Math.random()
                    if (txt.trim()) {
                        setAdd([...add, { id: id1, text: txt, cheked: false }])
                        setTxt('')
                        axios.post(url, { //для добавления в сервер
                            id: id1,
                            text: txt,
                            cheked: false
                        }).then((res) => setData([...data, res.data]))
                    }

                }}>Add</button>
            </div>
            <div>
                {
                    add.map((obj) => {
                        return (
                            <div className="line" key={obj.id}>
                                {
                                    obj.id === editId ? (<div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
                                        <input id={obj.id} value={editTxt} onChange={(e) => {
                                            setEditTxt(e.target.value)
                                        }} type="text" onKeyDown={(e) => {
                                            if (e.key == 'Enter') {
                                                setEditId(0)
                                                setAdd([...add.map(val => {
                                                    if (val.id == obj.id) {
                                                        return {
                                                            ...val, text: editTxt
                                                        }
                                                    } else {
                                                        setEditId(0)
                                                        return {
                                                            ...val
                                                        }
                                                    }
                                                })])
                                                axios.patch(url + '/' + obj.id, { // для едита в сервере
                                                    ...obj,
                                                    text: editTxt
                                                  }).then(res => setData([...data.map(val => {
                                                    if(val.id !== res.data.id)
                                                      return val
                                                    return res.data
                                                  })]))
                                            }
                                        }} />
                                        <h5 onClick={() => {
                                            setAdd([...add.map(val => {
                                                if (val.id === obj.id) {
                                                    return {
                                                        ...val, text: editTxt

                                                    }
                                                } else {
                                                    return {
                                                        ...val
                                                    }
                                                }
                                            })])
                                            setEditId(0)
                                            axios.patch(url + '/' + obj.id, { // для едита в сервере
                                                ...obj,
                                                text: editTxt
                                              }).then(res => setData([...data.map(val => {
                                                if(val.id !== res.data.id)
                                                  return val
                                                return res.data
                                              })]))
                                        }}>Save</h5>
                                    </div>) : (<div style={{ display: 'flex', justifyContent: 'space-between', gap: '50px' }}> <h3 style={{ textDecoration: obj.cheked ? 'line-through' : 'none', width: '300px', overflow: 'auto' }} onClick={() => {
                                        axios.patch(url + '/' + obj.id, { // для едита в сервере
                                            ...obj,
                                            cheked: !obj.cheked
                                          }).then(res => setData([...data.map(val => {
                                            if(val.id !== res.data.id)
                                              return val
                                            return res.data
                                          })]))
                                        setAdd(add.map((val) => {
                                            if (val.id == obj.id) {
                                                return {
                                                    ...val,
                                                    cheked: !val.cheked
                                                }
                                            } else {
                                                return {
                                                    ...val
                                                }
                                            }
                                        }))
                                    }}>{obj.text}</h3>
                                        <h5 onClick={() => {
                                            setEditId(obj.id)
                                            setEditTxt(obj.text)
                                        }}>EDIT</h5>

                                    </div>)
                                }
                                <h3 onClick={() => {
                                    if (!obj.cheked) {
                                        setAdd([...add.filter(val => {
                                            return obj.id !== val.id
                                        })])
                                        axios.delete(url + '/' + obj.id).then(res => { //для удаления в сервере
                                            setData([...data.filter(val => val.id !== obj.id)])
                                        })
                                    }
                                }} className="delete">X</h3>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default App;



