
import React from 'react'
import './homepage.css'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import Login from '../../Components/Login-SignUp/Login'
import SignUp from '../../Components/Login-SignUp/SignUp'
const Homepage = () => {
  return (
    <div className="container">
      <div className="title">
        <h2>WhisperScape</h2>
      </div>
      <div className="components">
        <Tabs variant='soft-rounded'>
          <TabList>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel height={'350px'}>
              <Login/>
            </TabPanel>
            <TabPanel height={'480px'}>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  )
}

export default Homepage