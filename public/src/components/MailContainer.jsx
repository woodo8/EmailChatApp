import React, { useState, useEffect, useRef } from 'react'
import styled from "styled-components"
import ChatInput from './MailInput';
import Logout from './Logout';
import axios from "axios";
import { getAllMessagesRoute, sendCloudMessageRoute, sendMessageRoute } from '../utils/APIRoutes'
import { v4 as uuidv4 } from "uuid";
import moment from 'moment';

export default function ChatContainer({ currentChat, currentUser, socket, setCurrentChat }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [currentUserToggle, setcurrentUserToggle] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (currentChat) {
        if (currentChat.username !== currentUser.username) {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } else {
          setMessages(currentUser.cloud);
        }
      }
    }
    fetchData();
    setcurrentUserToggle(!currentUserToggle)
  }, [currentChat]);

  const handleSendMsg = async ({ msg, title }) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
      title: title
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
      title: title,
      // time: Date.now()
    });
    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
      title: title,
      time: Date.now(),
    });
    setMessages(msgs);
  };

  const handleSendCloudMsg = async ({ msg, title }) => {
    await axios.post(sendCloudMessageRoute,
      {
        id: currentUser._id,
        message: msg,
        title,
      }).then(res => {
        console.log(res)
        localStorage.setItem('chat-app-user', JSON.stringify(res.data.data));
        setMessages(res.data.data.cloud);

      }).catch(err => console.log(err))
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieved", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
        });
      })
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messages)
  }, [messages]);

  return (
    <>
      {
        currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="username">
                  <h3>@{currentChat.username.toLowerCase()} {currentChat.username === currentUser.username && "(me)"}</h3>
                </div>
              </div>
              <Logout setCurrentChat={setCurrentChat} />
            </div>
            <ChatInput currentChat={currentChat} handleSendMsg={currentChat.username === currentUser.username ? handleSendCloudMsg : handleSendMsg} />
            <div className="chat-messages">
              {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message ${message.fromSelf ?
                        "sended" :
                        "recieved"
                        }`}
                    >
                      <div className="content ">
                        <h2>{message.title}</h2>
                        <p>{message.message}</p>
                        <h6>{message.time && moment(message.time).format('lll')}</h6>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        )
      }
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 24% 66%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 30% 55% ;
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
        p{
          color:"white"
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;

      }

     
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }

    }
  }
`;