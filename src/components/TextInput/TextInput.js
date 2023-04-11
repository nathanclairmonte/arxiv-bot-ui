import styles from "./TextInput.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";

const TextInput = ({ loading, textAreaRef, history, docs, setLoading, setMessages }) => {
    const [query, setQuery] = useState("");

    // error handler
    const errorHandler = (error_message) => {
        setMessages((prev) => [
            ...prev,
            {
                text: `Meep morp. Houston, we have a problem! \n\n${error_message}`,
                type: "response",
            },
        ]);
        setLoading(false);
        setQuery("");
    };

    // handle submission of query
    const handleSubmitQuery = async (event) => {
        // prevent browser refresh
        event.preventDefault();

        // return if input is empty
        if (query.trim() === "") {
            return;
        }

        // update messages list + reset query
        setLoading(true);
        setQuery("");
        setMessages((prev) => [...prev, { text: query, type: "query" }]);

        // send query to API
        const response = await fetch("api/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, history, docs }),
        });
        const data = await response.json();

        // error handling
        if (data.result.type === "error") {
            errorHandler(data.result.message);
            return;
        }

        // update message list with response
        setMessages((prev) => [...prev, { text: data.result.message, type: "response" }]);
        setLoading(false);
    };

    // facilitate multiline input
    // NB: worried about the logic with the else if here. make sure multiline
    // works, that might cause an issue (also might not who knows)
    const handleEnterKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey && query) {
            handleSubmitQuery(event);
        } else if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
        }
    };

    return (
        <div className={styles.input_container}>
            <form onSubmit={handleSubmitQuery}>
                <textarea
                    disabled={loading}
                    onKeyDown={handleEnterKeyPress}
                    ref={textAreaRef}
                    autoFocus={false}
                    rows={1} //unsure
                    maxLength={512}
                    type="text"
                    id="query"
                    name="query"
                    placeholder={
                        loading ? "Waiting for response..." : "E.g. What is this paper about?"
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" disabled={loading} className={styles.submit_button}>
                    {loading ? (
                        <div className={styles.loading_wheel}>
                            <CircularProgress color="inherit" size={20} />{" "}
                        </div>
                    ) : (
                        // // Send icon SVG in input field
                        // <svg
                        //     viewBox="0 0 20 20"
                        //     className={styles.svgicon}
                        //     xmlns="http://www.w3.org/2000/svg"
                        // >
                        //     <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        // </svg>
                        <IoIosSend className={styles.send_icon} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default TextInput;
