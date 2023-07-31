import React, { useState } from 'react'
import './style.css'
import axios from 'axios'
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleShow = () => setShow(!show)
  const handleClick = async () => {
    const sendData = {
      email: email,
      password: password
    }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };

    try {
      const data = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, sendData, config);
      console.log(data)
      localStorage.setItem('loginData', JSON.stringify(data))
      toast.success("Login Successful!!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      setTimeout((

      ) => { navigate("/chats") }, 2000)

    } catch (error) {
      const { response } = error
      console.log("Error")
      console.log(response)
      if (response.status === 404) {
        toast.error("User Does not exist", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }
      else if (response.status === 401) {

        toast.error("Password is incorrect.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }
      else if (response.status === 400) {
        toast.warning("Please fill in the required field.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }
      else if (response.status === 500) {
        toast("Server error")
      }
    }
  }
  return (
    <div className='login'>
      <label htmlFor='emailinp'>Email Address <span style={{
        color: "red"
      }}>*</span></label>
      <InputGroup size='md'
        id='emailinp'
        mb={8}>
        <Input
          pr='4.5rem'
          type='email'
          placeholder='Enter Your Email Address'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </InputGroup>
      <label htmlFor='passinp'
        style={{
          marginBottom: "10px"
        }}
      >Password <span
        style={{
          color: 'red'
        }}
      >*</span></label>
      <InputGroup size='md'
        id='passinp'
      >
        <Input
          pr='4.5rem'
          type={show ? 'text' : 'password'}
          placeholder='Enter password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleShow}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button width={'100%'} mt={10} bg={'blue.400'} color={'white'} _hover={'white'} onClick={handleClick}>
        Login
      </Button>
      <Button width={'100%'} mt={5} bg={'red'} color={'white'} _hover={'white'}
        onClick={() => {
          setEmail("guest@gmail.com")
          setPassword("password123")
        }}
      >
        Get Guest User Credentials
      </Button>
      <ToastContainer />
    </div>
  )
}

export default Login