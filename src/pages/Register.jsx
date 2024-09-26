import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './register.scss';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {

  const navigate = useNavigate();

  const userRef = useRef();
  useEffect(() => {
    userRef.current.focus();
  }, [])
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validuser, setValiduser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  useEffect(() => {
    setValiduser(USER_REGEX.test(user));
  }, [user])

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword])

  const [errMsg, setErrMsg] = useState('');
  useEffect(() => {
    setErrMsg('');
  }, [user, password, matchPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/auth/register",
        JSON.stringify({ user, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      console.log(response?.data);
      setUser('');
      setPassword('');
      setMatchPassword('');
      navigate('/login');
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No server response");
      } else if (error.response?.status === 409) {
        setErrMsg("Username already taken");
      } else {
        setErrMsg("Registration failed");
      }
      errRef.current.focus();  
    }
  }

  return (
    <div className="register-container">
      <section>
        <h2>Sign Up</h2>
        <small ref={errRef} className={`error ${errMsg ? "show" : ""}`} aria-live="assertive" >{errMsg}</small>
        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor="username">Username:
              <FontAwesomeIcon icon={faCheck} className={validuser ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validuser || !user ? "hide" : "invalid"} />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validuser ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <small id="uidnote" className={`usererror ${userFocus && user && !validuser ? "show" : ""}`}>
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
            <small id="pwdnote" className={`passworderror ${passwordFocus && password && !validPassword ? "show" : ""}`}>
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character. <br/> Allowed special characters: !,@,#,$,%.
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon icon={faCheck} className={validMatch && matchPassword ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? "hide" : "invalid"} />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPassword(e.target.value)}
              value={matchPassword}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <small id="confirmnote" className={`confirmpassword ${matchFocus && !validMatch ? "show" : ""}`}>
              <FontAwesomeIcon icon={faInfoCircle}  />
              Must match the first password input field.
            </small>
          </div>

          <button disabled={!validuser || !validPassword || !validMatch ? true : false}>Sign Up</button>
        </form>
        <p>Already registered?<span className="line"><Link to="/login">Sign In</Link></span></p>
      </section>
    </div>
  )
}

export default Register;

