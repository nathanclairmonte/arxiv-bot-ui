// import { setTimeout as sleep } from "timers/promises";
import { useState } from "react";
import styles from "./ArxivInput.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { CgSoftwareUpload } from "react-icons/cg";

const ArxivInput = () => {
    const [arxivId, setArxivId] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        type: "neutral",
        message: "",
    });

    // handle loading of the inputted paper
    const handleLoadPaper = (event) => {
        // prevent browser refresh
        event.preventDefault();

        // if (arxivId.trim() === "") {
        //     return;
        // }

        // clear text input and set loading to true
        setArxivId("");
        setLoading(true);

        // give status update
        setStatus({
            type: "neutral",
            message: `Loading https://arxiv.org/pdf/${arxivId}.pdf...`,
        });

        //load the paper into vectorstore. emulating this with a timeout
        setTimeout(_setLoadingToFalse, 2000);
    };

    const _setLoadingToFalse = () => {
        // remember to move this stuff up into the handler
        // just here right now to emulate an API call with setTimeout()
        const data = {
            response: {
                type: "success",
            },
        };

        // update status message
        setStatus({
            type: data.response.type,
            message:
                data.response.type === "success"
                    ? "Succes! Paper loaded."
                    : "Something went wrong :(",
        });
        setLoading(false);
    };

    // select status styling based on message type
    const _statusHelper = (type) => {
        if (type === "error") {
            return styles.status_error;
        } else if (type === "success") {
            return styles.status_success;
        } else {
            return styles.status_neutral;
        }
    };

    // handle pressing of the enter key, want to load paper when this happens
    const handleEnterKeyPress = () => {};

    return (
        <div className={styles.container}>
            <p className={styles.arxiv_input_text}>Please enter an ArXiv ID:</p>
            <div className={styles.arxiv_input_container}>
                <form onSubmit={handleLoadPaper} className={styles.arxiv_form}>
                    <textarea
                        disabled={loading}
                        onKeyDown={handleEnterKeyPress}
                        autoFocus={false}
                        rows={1}
                        maxLength={512}
                        type="text"
                        id="arxivId"
                        name="arxivId"
                        placeholder={loading ? "Loading..." : "E.g. 1706.03762"}
                        value={arxivId}
                        onChange={(e) => setArxivId(e.target.value)}
                        className={styles.arxiv_input}
                    />
                    <button type="submit" disabled={loading} className={styles.load_paper_button}>
                        {loading ? (
                            <div className={styles.button_content_container}>
                                <CircularProgress
                                    color="inherit"
                                    size={20}
                                    className={styles.load_icon}
                                />{" "}
                                <p className={styles.load_text}>Loading...</p>
                            </div>
                        ) : (
                            <div className={styles.button_content_container}>
                                <CgSoftwareUpload className={styles.load_icon} />
                                <p className={styles.load_text}>Load paper</p>
                            </div>
                        )}
                    </button>
                </form>
                {status.message ? (
                    <div className={styles.status_container}>
                        <p className={_statusHelper(status.type)}>{status.message}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ArxivInput;
