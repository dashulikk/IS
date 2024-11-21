import { Text, Anchor,Container, Title, Paper, TextInput, PasswordInput, Button, Center } from '@mantine/core';
import { useState } from 'react';
import { loginUser } from './brokerRequests';
import { useNavigate } from 'react-router-dom';
import {notifications} from "@mantine/notifications";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Event handlers to update state when input changes
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(username, password)
        .then((response) => response.json())
        .then(({access_token}) => {
            if (access_token === undefined || access_token === null) {
                console.error("Error login:", "Wrong Credentials");
                      notifications.show({
                          title: 'Error login',
                          message: 'Wrong credentials',
                          color: 'red'
                      });
            } else {
                localStorage.setItem('token', access_token);
                localStorage.setItem('username', username);
                navigate("/");
            }
        })
        .catch((error) => {
                      console.error("Error login:", error);
                      notifications.show({
                          title: 'Error login',
                          message: 'Wrong credentials',
                          color: 'red'
                      });
        });
  };




  return (
    <Center
      style={{
        height: '100vh',
      }}
    >
      <Container size={500} style={{ minWidth: 500 }} >
      {/* Center the form and add a title */}
      <Title align="center" style={{ marginBottom: 30 }}>
        Login
      </Title>
      
      {/* Paper component provides a card-like form container */}
      <Paper radius="md" p="xl" withBorder>
        <form>
          {/* Username field */}
          <TextInput 
            label="Username" 
            placeholder="Enter your username" 
            required 
            size="md"
            style={{ marginBottom: 20 }}
            onChange={handleUsernameChange}
          />
          
          {/* Password field */}
          <PasswordInput 
            label="Password" 
            placeholder="Enter your password" 
            required 
            size="md" 
            style={{ marginBottom: 20 }}
            onChange={handlePasswordChange}
          />
          
          {/* Login button */}
          <Button color='yellow' fullWidth size="md" type="submit" onClick={handleSubmit}>
            Login
          </Button>
        </form>
      </Paper>
      <Center style={{ marginBottom: 10 }}>
           <Text>Don't have an account? &nbsp;</Text>
            <Anchor target="_blank" underline="hover" onClick={() => {navigate("/signup")}}>
                Sign up
            </Anchor>
        </Center>
    </Container>
    </Center>
  );
}

export default Login;
