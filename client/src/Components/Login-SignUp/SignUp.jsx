import React, { useState } from 'react'
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import axios from 'axios'


const SignUp = () => {
  const [show, setShow] = useState(false)
  const [cshow, setCshow] = useState(false)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [file, setFile] = useState();
  const handleShow = () => setShow(!show)
  const handleCShow = () => setCshow(!cshow)
  const handleClick = async () => {
    if (password !== cpassword) {
      alert("Passwords entered does not match")
    }
    else {
      const formData = new FormData();
      formData.append('image', file)
      formData.append('name', name)

      formData.append('email', email)
      formData.append('password', password)
      console.log(...formData)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      const response = await axios.post("http://localhost:5000/api/auth/register", formData, config)
      if (response?.data?.status === 400) {
        alert("Fill in the details properly")
      }
      else if (response?.data?.status === 500) {
        alert("User already exists")
      }
      else if (response?.data?.status === 200) {
        alert("User registered successfully. Please login.")
      }
      else {
        alert("Some error occured")
      }


      console.log(response);
    }
  }


  return (
    <div className='login'>
      <label htmlFor='nameinp'>Name<span style={{
        color: "red"
      }}>*</span></label>
      <InputGroup size='md'
        id='nameinp'
        mb={3}>
        <Input
          pr='4.5rem'
          type='email'
          placeholder='Enter Your Name'
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </InputGroup>
      <label htmlFor='emailinp'>Email Address <span style={{
        color: "red"
      }}>*</span></label>
      <InputGroup size='md'
        id='emailinp'
        mb={3}>
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
      <label htmlFor='passinp'
        style={{
          marginBottom: "10px"
        }}
      >Confirm Password <span
        style={{
          color: 'red'
        }}
      >*</span></label>
      <InputGroup size='md'
        id='passinp'
        mb={3}
      >
        <Input
          pr='4.5rem'
          type={show ? 'text' : 'password'}
          placeholder='Reenter password'
          value={cpassword}
          onChange={(e) => {
            setCpassword(e.target.value)
          }}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleCShow}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
      <label htmlFor='passinp'
        style={{
          marginBottom: "10px"
        }}
      >Upload your Picture</label>
      <InputGroup size='md'

      >
        <Input
          pr='4.5rem'
          type='file'
          onChange={(event) => { setFile(event.target.files[0]) }}
        />

      </InputGroup>

      <Button width={'100%'} mt={10} bg={'blue.400'} color={'white'} _hover={'white'} onClick={handleClick}>
        Sign Up
      </Button>

    </div>
  )
}

export default SignUp