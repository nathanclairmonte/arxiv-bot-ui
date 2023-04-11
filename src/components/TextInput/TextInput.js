import styles from "./TextInput.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
                    className={`${inter.className} ${styles.input}`}
                />
                <button type="submit" disabled={loading} className={styles.submit_button}>
                    {loading ? (
                        <div className={styles.loading_wheel}>
                            <CircularProgress color="inherit" size={20} />{" "}
                        </div>
                    ) : (
                        <IoIosSend className={styles.send_icon} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default TextInput;
