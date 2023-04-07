import styles from "./ChatBox.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

const ChatBox = ({ messages, messageListRef, loading }) => {
    const classNameHelper = (type, length, index) => {
        if (type === "query" && loading && index === length - 1) {
            return styles.query_message_loading;
        } else {
            if (type === "response") {
                return styles.response_message;
            } else {
                return styles.query_message;
            }
        }
    };

    return (
        <div className={styles.chatbox_container}>
            <div ref={messageListRef} className={styles.message_list}>
                {messages.map((message, index) => (
                    // The latest message sent by the user will be animated
                    // while response loads
                    <div
                        key={index}
                        className={classNameHelper(message.type, messages.length, index)}
                    >
                        {/* Display icon based on message type */}
                        {message.type === "query" ? (
                            <Image
                                src="/user-icon.png"
                                alt="You"
                                width="30"
                                height="30"
                                className={styles.chat_icon}
                                priority={true}
                            />
                        ) : (
                            <Image
                                src="/bot-icon.png"
                                alt="AI"
                                width="30"
                                height="30"
                                className={styles.chat_icon}
                                priority={true}
                            />
                        )}
                        <div className={styles.markdown_output}>
                            {/* Messages are rendered in Markdown format */}
                            <ReactMarkdown linkTarget={"_blank"}>{message.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatBox;
