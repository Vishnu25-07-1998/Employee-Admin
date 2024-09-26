import "./table.scss";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';


const Table = () => {

    const [employee, setEmployee] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    return (
        <div className="table_data">
            <div className="heading">
                <h3>Employees</h3>
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Employee Name</th>
                        <th>Email ID</th>
                        <th>Mobile Number</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map((item, index) => (
                        item.id === (selectedEmployee?.id) ? (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td><input type="text" name="name" value={selectedEmployee.name} onChange={handleInputChange} /></td>
                                <td><input type="text" name="email" value={selectedEmployee.email} onChange={handleInputChange} /></td>
                                <td><input type="text" name="mobile" value={selectedEmployee.mobile} onChange={handleInputChange} /></td>
                                <td><input type="text" name="designation" value={selectedEmployee.designation} onChange={handleInputChange} /></td>
                                <td><input type="text" name="gender" value={selectedEmployee.gender} onChange={handleInputChange} /></td>
                                <td><input type="text" name="course" value={selectedEmployee.course} onChange={handleInputChange} /></td>
                                <td>
                                    <button onClick={handleUpdate}>Save</button>
                                    <button onClick={() => setSelectedEmployee(null)}>Cancel</button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.mobile}</td>
                                <td>{item.designation}</td>
                                <td>{item.gender}</td>
                                <td>{item.course}</td>
                                <td>
                                    <FaEdit
                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                        onClick={() => handleEdit(item)}
                                    />
                                    <FaTrash
                                        style={{ cursor: 'pointer', color: 'red' }}
                                        onClick={() => handleDelete(item.id)}
                                    />
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table
