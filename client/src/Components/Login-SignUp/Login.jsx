import React, { useState } from 'react'
import './style.css'
import axios from 'axios'
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const navigate=useNavigate();

  const [show, setShow] = useState(false)
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const handleShow = () => setShow(!show)
  const handleClick=async()=>{
    const sendData={
      email:email,
      password:password
    }
    const data=await axios.post("https://whisperescape-api.vercel.app//api/auth/login",sendData);
    console.log(data?.data?.status)
    if(data?.data?.status===404){
      alert("User Does not exist")
    }
    else if(data?.data?.status===400){
      alert("Password is incorrect")
    }
    else if(data?.status===500){
      alert("Server error")
    }
    else{
      localStorage.setItem('loginData',JSON.stringify(data))
      navigate("/chats")
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
          onChange={(e)=>{
            setEmail(e.target.value)
          }}
        />
      </InputGroup>
      <label htmlFor='passinp'
      style={{
        marginBottom:"10px"
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
          onChange={(e)=>{
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
      onClick={()=>{
        setEmail("guest@gmail.com")
        setPassword("password123")
      }}
      >
       Get Guest User Credentials
      </Button>
    </div>
  )
}

export default Login