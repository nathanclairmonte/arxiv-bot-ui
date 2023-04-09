// import { setTimeout as sleep } from "timers/promises";
import { useState } from "react";
import styles from "./ArxivInput.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { CgSoftwareUpload } from "react-icons/cg";

const ArxivInput = () => {
    const [arxivId, setArxivId] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState("testinggggg");

    // handle loading of the inputted paper
    const handleLoadPaper = (event) => {
        event.preventDefault();
        setArxivId("");
        setLoading(true);
        setTimeout(_setLoadingToFalse, 2000);
    };

    const _setLoadingToFalse = () => {
        setLoading(false);
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
                <div className={styles.status_container}>
                    <p className={styles.status_text}>{statusUpdate}</p>
                </div>
            </div>
        </div>
    );
};

export default ArxivInput;
