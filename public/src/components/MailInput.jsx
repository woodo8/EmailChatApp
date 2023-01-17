import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import { IoMdSend } from 'react-icons/io'
import { BsEmojiSmileFill } from 'react-icons/bs'

export default function ChatInput({ handleSendMsg, currentChat }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");
    const [title, setTitle] = useState("")

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (e, emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    }

    const sendChat = (e) => {
        // e.preventDefault();
        if (msg.length > 0) {
            handleSendMsg({ msg, title });
            setMsg('');
            setTitle('')
        }
    }
    useEffect(() => {
        setMsg('');
        setTitle('')
    }, [currentChat])

    return (
        <div>
            <Container>
                <div className='input-container'>
                    <input type="text" placeholder='Title' value={title} onChange={(e) => { setTitle(e.target.value) }} />
                </div>
            </Container>
            <Container>
                <div className='input-container'>
                    <input type="text" placeholder='Type your message here!' value={msg} onChange={(e) => { setMsg(e.target.value) }} />
                </div>
                <div className="button-container">
                    <div className="emoji" >
                        <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                        {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                    </div>
                </div>
            </Container>
            <Container>
                <div>
                    <button onClick={(e) => sendChat(e)} className="submit">
                        <IoMdSend />
                    </button>
                </div>
            </Container>
        </div>

    )
}

const Container = styled.div`
display: grid;
grid-template-columns: 95% 5%;
align-items: center;
background-color: #080420;
padding: 0 2rem;
gap:1rem;
padding-bottom: 0.3rem;
margin: 10px 0;
@media screen and (min-width: 720px) and (max-width: 1080px){
    padding: 0 1rem;
    gap: 1rem;
}
.submit{
    width: auto !important;
    padding: 0.3rem 2rem;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #9a86f3;
    border: none;
    cursor: pointer;
    @media screen and (min-width: 720px) and (max-width: 1080px){
        padding: 0.3rem 1rem;
        svg{
        font-size: 1rem;
        color: white;
    }
    }
    svg{
        font-size: 2rem;
        color: white;
    }
}
.button-container{
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji{
        position: relative;
        svg{
            font-size: 1.5rem;
            color: #ffff00c8;
            cursor: pointer;
        }
        .emoji-picker-react{
            position: absolute;
            top: 0px;
            left: -290px;
            background-color: #080420;
            box-shadow: 0 5px 10px #9a86f3;
            border-color: #9186f3;
            .emoji-scroll-wrapper::-webkit-scrollbar{
                background-color: #080420;
                width: 5px;
                &-thumb {
                    background-color: #9a86f3;
                }
            }
            .emoji-categories{
                button{
                    filter: contrast(0);
                }
            }
            .emoji-search{
                background-color: transparent;
                border-color: #9186f3;
                color: white;
            }
            .emoji-group:before {
                background-color: #080420;
            }
        }
    }
}

.input-container{
    width: 100%;
    border-radius:10px;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    padding: 0.7rem 1rem;
    input{
        width: 90%;
        height: 60%;
        background-color: transparent;
        color: white;
        border: none;
        font-size: 1.2rem;
        &::selection{
            background-color: #9186f3;
        }
        &:focus{
            outline: none;
        }
    }
   
}
`;
