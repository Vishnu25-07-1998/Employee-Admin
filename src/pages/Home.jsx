import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { faCheck, faCaretDown, faUpload, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './home.scss';
import axios from "axios";
import { FaEdit, FaTrash } from 'react-icons/fa';

const Home = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // State Variables
    const [employeeName, setEmployeeName] = useState('');
    const [validName, setValidName] = useState('');
    const [employeeMail, setEmployeeMail] = useState('');
    const [validMail, setValidMail] = useState('');
    const [employeeMobile, setEmployeeMobile] = useState('');
    const [mobileValid, setMobileValid] = useState('');
    const [nameFocused, setNameFocused] = useState(false);
    const [mailFocused, setMailFocused] = useState(false);
    const [mobileFocused, setMobileFocused] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState("Software Engineer");
    const [gender, setGender] = useState('Male');
    const [course, setCourse] = useState(["BTECH"]);
    const [image, setImage] = useState('');
    const [employee, setEmployee] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [dropDown, setDropdown] = useState(false);
    const [editdropDown, setEditDropdown] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [popUp, setPopup] = useState(false);


    // Validations
    const validateName = (name) => {
        if (name.trim() === "") {
            return "Name is required";
        } else if (name.length < 3) {
            return "Name must be at least 3 characters long.";
        }
        return "";
    };

    const validateEmail = (email) => {
        const MAIL_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
        if (email.trim() === "") {
            return "Field is Required";
        } else if (!MAIL_REGEX.test(email)) {
            return "Invalid Email Format";
        }
        return "";
    };

    const validateMobile = (mobile) => {
        const MOBILE_REGEX = /^[0-9]{10}$/;
        if (mobile.trim() === "") {
            return "Field is Required";
        } else if (!MOBILE_REGEX.test(mobile)) {
            return "Enter 10-digit valid mobile number.";
        }
        return "";
    };

    // Effect to handle validations
    useEffect(() => {
        if (nameFocused) {
            setValidName(validateName(employeeName));
        }
    }, [employeeName, nameFocused]);

    useEffect(() => {
        if (mailFocused) {
            setValidMail(validateEmail(employeeMail));
        }
    }, [employeeMail, mailFocused]);

    useEffect(() => {
        axios
            .post('http://localhost:3000/auth/api/check-email', { email: employeeMail })
            .then(response => {
                if (response.status === 201) {
                    setValidMail("Email Exists in Server");
                }
            })
            .catch(error => {
                console.error('Error checking email:', error);
            });
    }, [employeeMail])

    useEffect(() => {
        if (mobileFocused) {
            setMobileValid(validateMobile(employeeMobile));
        }
    }, [employeeMobile, mobileFocused]);

    const designations = [
        "Software Engineer",
        "Data Analyst",
        "Site Reliability Engineer",
        "Cybersecurity Analyst",
        "Business Analyst"
    ]
    const toggleSelectedRole = (designation) => {
        setSelectedDesignation(designation);
    }
    const toggleDropdown = () => {
        setDropdown(prev => !prev);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImage(file);
        } else {
            alert('Please upload a JPG or PNG file.');
        }
    };
    const [fileName, setFileName] = useState("")
    const handleEditImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setSelectedEmployee({ ...selectedEmployee, image: file });
            setFileName(file.name);
            console.log(selectedEmployee.image);
        } else {
            alert('Please upload a JPG or PNG file.');
        }
    }

    const fileInputRef = useRef(null);
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const editfileInputRef = useRef(null);
    const handleEditClick = () => {
        if (editfileInputRef.current) {
            editfileInputRef.current.click();
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/auth/delete/${id}`);
            setEmployee(response.data.employees);
            console.log('Deleted:', id);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/auth/api/update-employee/${selectedEmployee._id}`, selectedEmployee);
            const response = await axios.get('http://localhost:3000/auth/api/fetch-employee');
            setEmployee(response.data);
            setSelectedEmployee(null);
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };


    const qualifications = [
        "BTECH",
        "MTECH",
        "BCA",
        "MCA",
        "MBA"
    ];
    const toggleSelectedCourse = (qual) => {
        if (course.includes(qual)) {
            setCourse(course.filter(q => q !== qual));
        } else {
            setCourse([...course, qual]);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('employeeName', employeeName);
        formData.append('employeeMail', employeeMail);
        formData.append('employeeMobile', employeeMobile);
        formData.append('designation', selectedDesignation);
        formData.append('gender', gender);
        course.forEach((c) => formData.append('course[]', c));
        formData.append('image', image)
        try {
            const response = await axios.post('http://localhost:3000/auth/home', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
            alert('Added Employee to Database');
            // setEmployee(response.data.employee);
            setEmployeeName('');
            setEmployeeMobile('');
            setEmployeeMail('');
            setImage('');
            

        } catch (error) {
            if (!error?.response) {
                alert('No Server Response');
            } else if (error.response?.status === 401) {
                alert("Email ID Already Exist in Database");
            } else {
                alert('Failed to upload employee');
            }
        }
    }


    useEffect(() => {
        axios.get('http://localhost:3000/auth/api/fetch-employee')
            .then(response => {
                setEmployee(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const filteredItems = employee.filter(item => {
        return item.employeeName && item.employeeName.toLowerCase().includes(filterText.toLowerCase());
    });



    const handleEdit = (item) => {
        setSelectedEmployee(item);
        setPopup(!popUp);
        console.log(selectedEmployee);
    };

    const toggleDropdownEdit = () => {
        setEditDropdown(prev => !prev);
    };
    const handleDesignationChange = (designation) => {
        setSelectedEmployee({ ...selectedEmployee, designation });
        setEditDropdown(false);
    };

    const handleSelectedCourse = (qual) => {
        if (selectedEmployee.courses.includes(qual)) {
            setSelectedEmployee({
                ...selectedEmployee,
                courses: selectedEmployee.courses.filter((course) => course !== qual),
            });
        } else {
            setSelectedEmployee({
                ...selectedEmployee,
                courses: [...selectedEmployee.courses, qual],
            });
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setPopup(false);
    }



    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <div className="home-wrapper">
            <nav className="navbar">
                <a href="">Home</a>
                <a href="">Create Employee</a>
                <a href="">Employee List</a>
                <button onClick={handleLogout}>Logout</button>
            </nav>
            <div className="content">
                <div className="top">
                    <h1>Welcome Admin Panel</h1>
                </div>
                <div className="middle">
                    <div className="left">
                        <form onSubmit={handleSubmit}>
                            <div className="input-row">
                                <label htmlFor="name">Name</label>
                                <div className="row-item">
                                    <span className="input-text">
                                        <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Enter Name of Employee" id="employeeName" onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)} />
                                    </span>
                                    {validName && <small className="error"><FontAwesomeIcon icon={faInfoCircle} />{validName}</small>}
                                </div>
                            </div>
                            <div className="input-row">
                                <label htmlFor="employeemail">E-Mail</label>
                                <div className="row-item">
                                    <span className="input-text"><input type="email" id="employeemail" placeholder="Enter Mail ID of Employee" value={employeeMail} onChange={(e) => setEmployeeMail(e.target.value)} onFocus={() => setMailFocused(true)} onBlur={() => setMailFocused(false)} /></span>
                                    {validMail && <small className="error"><FontAwesomeIcon icon={faInfoCircle} />{validMail}</small>}
                                </div>
                            </div>
                            <div className="input-row">
                                <label htmlFor="employeemobile">Mobile</label>
                                <div className="row-item">
                                    <span className="input-text"><input type="text" id="employeemobile" placeholder="Enter Mobile Number of Employee" value={employeeMobile} onChange={(e) => setEmployeeMobile(e.target.value)} onFocus={() => setMobileFocused(true)} onBlur={() => setMobileFocused(false)} /></span>
                                    {mobileValid && <small className="error"><FontAwesomeIcon icon={faInfoCircle} />{mobileValid}</small>}
                                </div>
                            </div>
                            <div className="input-row">
                                <label htmlFor="role">Designation</label>
                                <div className="row-item">
                                    <span className="input-text" onClick={toggleDropdown} ><FontAwesomeIcon icon={faCaretDown} className="arrow-icon" />{selectedDesignation}</span>
                                    <ul className={`role-ul ${dropDown ? "show" : ""}`}>
                                        {designations.map((designation, index) => (
                                            <li className="role-li" key={index} onClick={() => toggleSelectedRole(designation)}>
                                                <span className={`checkbox ${selectedDesignation === designation ? "checked" : ""}`}><FontAwesomeIcon icon={faCheck} className="checkicon" /></span>
                                                <span className="option">{designation}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="input-row">
                                <label htmlFor="gender">Gender</label>
                                <div className="row-item gender">
                                    <div className="radio-button">
                                        <span className={`radio ${gender === "Male" ? "show" : ""}`} onClick={() => setGender("Male")}></span>
                                        <span className="gender-text">Male</span>
                                    </div>
                                    <div className="radio-button">
                                        <span className={`radio ${gender === "Female" ? "show" : ""}`} onClick={() => setGender("Female")}></span>
                                        <span className="gender-text">Female</span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-row">
                                <label htmlFor="qualification">Course</label>
                                <div className="row-item">
                                    <ul className="course-ul">
                                        {qualifications.map((qual, index) => (
                                            <li className="course-li" key={index} onClick={() => toggleSelectedCourse(qual)}>
                                                <span className={`checkbox ${course.includes(qual) ? "checked" : ""}`}><FontAwesomeIcon icon={faCheck} className="checkicon" /></span>
                                                <span className="option">{qual}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="input-row">
                                <label htmlFor="image">Image</label>
                                <div className="row-item img">
                                    <input type="file" id="image" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                                    <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px', color: 'blue' }} onClick={handleClick} />
                                    <span className="input-text">{image.name}</span>
                                </div>
                            </div>
                            <button>Add</button>
                        </form>
                    </div>
                </div>
                <div className="bottom">
                    <div className="employee_table">
                        <div className="heading">
                            <span className="input-text">
                                <input
                                    type="text"
                                    placeholder="Filter by name"
                                    value={filterText}
                                    onChange={e => setFilterText(e.target.value)}
                                />
                            </span>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>SI NO</th>
                                    {/* <th>ID</th> */}
                                    <th>Employee Name</th>
                                    <th>Email ID</th>
                                    <th>Mobile Number</th>
                                    <th>Designation</th>
                                    <th>Gender</th>
                                    <th>Course</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center' }}>No employees found</td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            {/* <td>{item._id}</td> */}
                                            <td style={{ display: "flex", alignItems: "center", gap: "4px" }}><img src={item.image} style={{ width: '25px', height: '25px', borderRadius: "14px" }} />{item.employeeName}</td>
                                            <td>{item.employeeMail}</td>
                                            <td>{item.employeeMobile}</td>
                                            <td>{item.designation}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.courses.join(', ')}</td>
                                            <td>
                                                {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: '2-digit'
                                                }).replace('.', '')}
                                            </td>

                                            <td>
                                                <FaEdit
                                                    style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }}
                                                    onClick={() => handleEdit(item)}
                                                />
                                                <FaTrash
                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                    onClick={() => handleDelete(item._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className={`popup ${popUp ? "show" : ""}`}>
                <div className="popupFields">
                    <form>
                        <div className="input_field">
                            <label htmlFor="editName">Name</label>
                            <div className="row-item">
                                <span className="input-text"><input
                                    type="text"
                                    id="editName"
                                    value={selectedEmployee ? selectedEmployee.employeeName : ''}
                                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employeeName: e.target.value })}
                                /></span>
                                <small></small>
                            </div>
                        </div>
                        <div className="input_field">
                            <label htmlFor="editMail">E-Mail</label>
                            <div className="row-item">
                                <span className="input-text"><input
                                    type="text"
                                    id="editMail"
                                    value={selectedEmployee ? selectedEmployee.employeeMail : ''}
                                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employeeMail: e.target.value })}
                                /></span>
                                <small></small>
                            </div>
                        </div>
                        <div className="input_field">
                            <label htmlFor="editMobile">Mobile</label>
                            <div className="row-item">
                                <span className="input-text"><input
                                    type="text"
                                    id="editMobile"
                                    value={selectedEmployee ? selectedEmployee.employeeMobile : ''}
                                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employeeMobile: e.target.value })}
                                /></span>
                                <small></small>
                            </div>
                        </div>
                        <div className="input_field">
                            <label htmlFor="editRole">Designation</label>
                            <div className="row-item">
                                <span id="editRole" className="input-text" onClick={toggleDropdownEdit} ><FontAwesomeIcon icon={faCaretDown} className="arrow-icon" />{selectedEmployee ? selectedEmployee.designation : ''}</span>
                                <ul className={`role-ul ${editdropDown ? "show" : ""}`}>
                                    {designations.map((designation, index) => (
                                        <li className="role-li" key={index} onClick={() => handleDesignationChange(designation)}>
                                            <span className={`checkbox ${selectedEmployee && selectedEmployee.designation === designation ? "checked" : ""}`}><FontAwesomeIcon icon={faCheck} className="checkicon" /></span>
                                            <span className="option">{designation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="input_field">
                            <label htmlFor="genderEdit">Gender</label>
                            <div className="row-item gender">
                                <div className="radio-button">
                                    <span
                                        className={`radio ${selectedEmployee && selectedEmployee.gender === "Male" ? "show" : ""}`}
                                        onClick={() => setSelectedEmployee({ ...selectedEmployee, gender: "Male" })}
                                    ></span>
                                    <span className="gender-text">Male</span>
                                </div>
                                <div className="radio-button">
                                    <span
                                        className={`radio ${selectedEmployee && selectedEmployee.gender === "Female" ? "show" : ""}`}
                                        onClick={() => setSelectedEmployee({ ...selectedEmployee, gender: "Female" })}
                                    ></span>
                                    <span className="gender-text">Female</span>
                                </div>
                            </div>
                        </div>
                        <div className="input_field">
                            <label htmlFor="qualificationEdit">Course</label>
                            <div className="row-item">
                                <ul className="course-ul">
                                    {qualifications.map((qual, index) => (
                                        <li className="course-li" key={index} onClick={() => handleSelectedCourse(qual)}>
                                            <span className={`checkbox ${selectedEmployee && selectedEmployee.courses.includes(qual) ? "checked" : ""}`}><FontAwesomeIcon icon={faCheck} className="checkicon" /></span>
                                            <span className="option">{qual}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="input_field">
                            <label htmlFor="imageEdit">Image</label>
                            <div className="row-item img">
                                <input type="file" id="imageEdit" ref={editfileInputRef} onChange={handleEditImageUpload} style={{ display: 'none' }} />
                                <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px', color: 'blue' }} onClick={handleEditClick} />
                                <span className="input-text">{fileName}</span>
                            </div>
                        </div>
                        <button style={{ background: "red" }} onClick={handleCancel}>Cancel</button>
                        <button style={{ background: "blue", marginLeft: "10px" }} onClick={handleUpdate} >Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Home
