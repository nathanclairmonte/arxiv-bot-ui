import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Navbar, Footer, ChatBox, TextInput, ArxivInput } from "@/components/list";
import { useState, useRef, useEffect } from "react";

export default function Home() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "Hi there! How can I help?",
            type: "response",
        },
    ]);
    const [docs, setDocs] = useState(null);
    const [apiKey, setApiKey] = useState("");

    const messageListRef = useRef(null);
    const textAreaRef = useRef(null);

    // auto scroll chat to bottom
    useEffect(() => {
        const messageList = messageListRef.current;
        messageList.scrollTop = messageList.scrollHeight;
    }, [messages]);

    // focus on text input whenever messages state changes
    useEffect(() => {
        textAreaRef.current.focus();
    }, [messages]);

    // ensure that history keeps up to date and never exceeds 2 messages
    useEffect(() => {
        if (messages.length > 2) {
            setHistory([messages[messages.length - 2].text, messages[messages.length - 1].text]);
        }
    });

    return (
        <>
            <Head>
                <title>ArXiv ChatBot</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar apiKey={apiKey} setApiKey={setApiKey} />

            <main className={styles.main}>
                <ArxivInput setDocs={setDocs} setMessages={setMessages} />
                <ChatBox messages={messages} messageListRef={messageListRef} loading={loading} />
                <br />
                <TextInput
                    loading={loading}
                    textAreaRef={textAreaRef}
                    history={history}
                    docs={docs}
                    apiKey={apiKey}
                    setLoading={setLoading}
                    setMessages={setMessages}
                />
                <Footer />
            </main>
        </>
    );
}
