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
            text: "Hey! Load a paper and then ask a question :)",
            type: "response",
        },
    ]);
    const [docs, setDocs] = useState(null);
    const [apiKey, setApiKey] = useState("");

    const messageListRef = useRef(null);
    const textAreaRef = useRef(null);

    // auto scroll chat to bottom whenever messages state changes
    useEffect(() => {
        if (messages.length > -1) {
            const messageList = messageListRef.current;

            // save current window scroll position
            const prevWinScrollY = window.scrollY;

            // scroll chat to bottom
            messageList.scrollTop = messageList.scrollHeight;

            // refocus on the text input
            textAreaRef.current.focus();

            // restore window scroll position
            window.scrollTo(0, prevWinScrollY);
        }
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
                <meta name="description" content="Made by Nathan Clairmonte." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar apiKey={apiKey} setApiKey={setApiKey} />

            <main className={styles.main}>
                <ArxivInput messages={messages} setDocs={setDocs} setMessages={setMessages} />
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
