import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Robot from "../assets/robot.gif"
import TextInput from 'react-autocomplete-input';
import Logout from './Logout';
import { useNavigate } from 'react-router';
// import 'react-autocomplete-input/dist/bundle.css'
export default function Welcome({ currentUser, contacts, setCurrentChat, currentChat }) {
  const [contactUserName, setcontactUserName] = useState()
  const navigate = useNavigate()
  useEffect(() => {
    if (contactUserName) {
      var contact = contacts.filter(item => item.username === contactUserName.replace(" ", ""))[0]
      if (contact) {
        setCurrentChat(contact)
      } else if (contactUserName.replace(" ", "") === currentUser.username) {
        setCurrentChat(currentUser)
        console.log(currentChat)
      }
    }
    console.log(contacts)
  }, [contactUserName])
  return (
    <Container>
      <div style={{ width: "100%", textAlign: "right", marginBottom: "30px", padding: "20px" }}>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          style={{ cursor: "pointer", padding: "15px", backgroundColor: "transparent", color: "white" }}>
          Logout
        </button>
      </div>
      <label htmlFor="searchie">Select user</label>
      <TextInput id="searchie" placeholder="type name of your friend e.g:jerry" onSelect={(e) => { setcontactUserName(e) }} className="textarea" trigger={[""]} matchAny={true} maxOptions={10} options={[...contacts, currentUser].map(contacts => contacts.username)} />
      <img src={Robot} alt="welcome" />
      <h1>
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please choose user to send mails</h3>
    </Container>
  )
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
.textarea{
  max-width: 40%;
  min-width: 40%;
  max-height: 40px !important;
  min-height: 40px !important;
  padding: 10px !important;
}
.react-autocomplete-input{
  width: 40%;
  background-color: white;
  color: black;
  list-style: none;
  position: absolute;
  padding: 15px;
  li{
    padding: 10px;
    &.active{
      background-color: #3b15d5;
      color: white;
    }
  }
}
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
          text-transform: capitalize;
        }
      }
    }
  }
img{
    height: 20rem;
}
span{
    color: #4e00ff;
    text-transform: capitalize;
}
`;