import React, {useEffect, useRef, useState} from 'react'

const Home = () => {

    const url = 'http://localhost:8080/api/user'
    const [users, setUsers] = useState([])
    const openRef = useRef(null)
    const closeRef = useRef(null)
    const [user, setUser] = useState({id: '', email: '', name: ''})
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [totalResults, setTotalResults] = useState(0)
    const [maxPages, setMaxPages] = useState(0)

    // Fetches the data from the backend api
    const fetchData = async () => {
        const response = await fetch(`${url}/getAllUsers/${pageSize}/${pageNum}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await response.json()
        if(data.success){
            setUsers(data.result)
            setTotalResults(data.totalUsers)
            setMaxPages(Math.ceil(data.totalUsers / pageSize))
        }else
            alert(data.error)
    }

    // Run this function when the page renders for the 1st time
    useEffect(() => {
        fetchData()
    }, [])

    // Run this code when there is a change pageNum state
    useEffect(() => {
        fetchData()
    }, [pageNum])

    // Open the modal when user click view button
    const handleOnViewClick = (user_arg) => {
        openRef.current.click()
        setUser({id: user_arg._id,email: user_arg.email, name: user_arg.name})
    }

    // Maps form values inside modal to user state
    const onChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    // Update the User details and close the modal
    const updateUser = async () => {
        const response = await fetch(`${url}/updateUser/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: user.email, name: user.name})
        })
        const data = await response.json()
        if(data.success){
            fetchData()
            closeRef.current.click()
        }else{
            alert(data.error)
        }
    }

    const handlePreviousClick = () => {
        if(pageNum>0) {
            setPageNum(pageNum - 1)
        }
    }

    const handleNextClick = () => {
        if(pageNum < maxPages){
            setPageNum(pageNum + 1)
        }
    }

    const handle1Click = () => {
        setPageNum(1)
    }

    const handle2Click = () => {
        setPageNum(2)
    }

    return (
        <div>

            <button ref={openRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit User</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" name={"email"} required={true} value={user.email} onChange={onChange} aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" name={"name"} required={true} value={user.name} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={closeRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={updateUser}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className={"container my-5"}>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user)=>{
                        return <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.createdAt ? new Date(user.createdAt).toGMTString(): "Unknown"}</td>
                            <td>{user.createdAt ? new Date(user.updatedAt).toGMTString(): "Unknown"}</td>
                            <td><button className={"btn btn-primary"} onClick={() => {handleOnViewClick(user)}}>View</button></td>
                        </tr>
                    })}

                    </tbody>
                </table>

                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item"><button className="btn btn-default" style={{cursor: 'pointer'}} onClick={handlePreviousClick} disabled={pageNum <= 1 ? true : false}>Previous</button></li>
                        <li className="page-item"><button className="btn btn-default" style={{cursor: 'pointer', textDecoration: pageNum === 1 ? 'underline' : ''}} onClick={handle1Click} disabled={maxPages < 1 ? true : false}>1</button></li>
                        <li className="page-item"><button className="btn btn-default" style={{cursor: 'pointer', textDecoration: pageNum === 2 ? 'underline' : ''}} onClick={handle2Click} disabled={maxPages < 2 ? true : false}>2</button></li>
                        <li className="page-item"><button className="btn btn-default" disabled={true}>...</button></li>
                        <li className="page-item"><button className="btn btn-default" style={{cursor: 'pointer'}} onClick={handleNextClick} disabled={pageNum >= maxPages ? true : false}>Next</button></li>
                    </ul>
                </nav>

            </div>
        </div>
    )
}

export default Home