import { useRef, useState, useEffect, useContext } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import './login.scss';



const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;



const Login = () => {

    const { login } = useContext(AuthContext)
    const navigate = useNavigate();

    const userRef = useRef();
    useEffect(() => {
        userRef.current.focus();
    }, [])
    const errRef = useRef();

    const [username, setUser] = useState('');
    const [validuser, setValiduser] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    useEffect(() => {
        setValiduser(USER_REGEX.test(username));
    }, [username])

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password])

    const [errMsg, setErrMsg] = useState('');
    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post("http://localhost:3000/auth/login",
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            console.log(response?.data?.token);
            login(response?.data.token);
            setUser('');
            setPassword('');
            navigate('/');
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 400) {
                setErrMsg('Username Not Found');
                console.log("not found username");
            } else if (error.response?.status === 401) {
                setErrMsg("Doesn't Recognize password");
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }


    return (
        <div className="login-container">
            <section>
                <h2>Login</h2>
                <small ref={errRef} className={`error ${errMsg ? "show" : ""}`}>{errMsg}</small>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username:
                            <FontAwesomeIcon icon={faCheck} className={validuser ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validuser || !username ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validuser ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <small id="uidnote" className={`usererror ${userFocus && username && !validuser ? "show" : ""}`}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
                        </small>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <small id="pwdnote" className={`passworderror ${passwordFocus && !validPassword ? "error" : ""}`}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </small>
                    </div>
                    <button disabled={!validuser || !validPassword ? true : false}>Sign In</button>
                </form>
                <p>
                    Need an Account?
                    <span className="line">
                        <Link to="/register">Sign Up</Link>
                    </span>
                </p>
            </section>
        </div>
    )
}

export default Login
