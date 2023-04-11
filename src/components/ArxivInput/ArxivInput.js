import Link from "next/link";
import { useState } from "react";
import styles from "./ArxivInput.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { CgSoftwareUpload } from "react-icons/cg";
import { FiExternalLink } from "react-icons/fi";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const ArxivInput = ({ setDocs }) => {
    const [arxivId, setArxivId] = useState("");
    const [currentPaper, setCurrentPaper] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        type: "neutral",
        message: "",
    });

    // validate the arxiv ID
    const _validateId = (id) => {
        // if there's no period, it's already invalid
        if (!id.includes(".")) {
            return false;
        }

        // split the ID by the period in the middle
        const id_split = id.split(".");

        // make sure of the following:
        // 1. Only one period in the ID
        // 2. Before period is a string of exactly 4 digits
        // 3. After period is a string of exactly 5 digits
        if (id_split.length !== 2) {
            console.log("invalid");
        } else {
            const isAllNums0 = /^\d+$/.test(id_split[0]);
            const isAllNums1 = /^\d+$/.test(id_split[1]);
            if (id_split[0].length !== 4 || !isAllNums0) {
                return false;
            } else if (id_split[1].length !== 5 || !isAllNums1) {
                return false;
            } else {
                return true;
            }
        }
    };

    // handle loading of the inputted paper
    const handleLoadPaper = async (event) => {
        // prevent browser refresh
        event.preventDefault();

        // do nothing if field is empty
        if (arxivId.trim() === "") {
            return;
        }

        // validate ID
        if (!_validateId(arxivId)) {
            setStatus({
                type: "error",
                message: "Please enter a valid ArXiv ID!",
            });
            return;
        }

        // ensure we aren't re-loading the same paper
        if (arxivId === currentPaper) {
            setStatus({
                type: "success",
                message: "That paper is already loaded!",
            });
            return;
        }

        // save curr paper, clear text input and set loading to true
        setCurrentPaper(arxivId);
        setArxivId("");
        setLoading(true);

        // give status update
        setStatus({
            type: "neutral",
            message: `Loading https://arxiv.org/pdf/${arxivId}.pdf...`,
        });

        // send ID to API to load paper
        const response = await fetch("api/load", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ arxivId }),
        });
        const data = await response.json();

        // update status message with result
        setStatus({
            type: data.result.type,
            message: data.result.message,
        });

        // update docs state with returned docs (if they are returned)
        if (data.result.docs.length !== 0) {
            setDocs(data.result.docs);
        }
        setLoading(false);
    };

    // select status styling based on message type
    const _statusHelper = (type) => {
        if (type === "error") {
            return `${inter.className} ${styles.status_error}`;
        } else if (type === "success") {
            return `${inter.className} ${styles.status_success}`;
        } else {
            return `${inter.className} ${styles.status_neutral}`;
        }
    };

    // handle pressing of the enter key, want to load paper when this happens
    const handleEnterKeyPress = (event) => {
        if (event.key === "Enter" && arxivId) {
            handleLoadPaper(event);
        }
    };

    return (
        <div className={styles.container}>
            <p className={`${inter.className} ${styles.arxiv_input_text}`}>
                Please enter an ArXiv ID:
            </p>
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
                                <p className={`${inter.className} ${styles.load_text}`}>
                                    Loading...
                                </p>
                            </div>
                        ) : (
                            <div className={styles.button_content_container}>
                                <CgSoftwareUpload className={styles.load_icon} />
                                <p className={`${inter.className} ${styles.load_text}`}>
                                    Load paper
                                </p>
                            </div>
                        )}
                    </button>
                </form>
                {status.message ? (
                    <div className={styles.status_container}>
                        <p className={_statusHelper(status.type)}>{status.message}</p>
                        {status.message && status.type === "success" ? (
                            <Link
                                href={`https://arxiv.org/pdf/${currentPaper}.pdf`}
                                target="_blank"
                                className={styles.paper_link_container}
                            >
                                <p className={`${inter.className} ${styles.paper_link_text}`}>
                                    Open paper
                                </p>
                                <FiExternalLink className={styles.paper_link_icon} />
                            </Link>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ArxivInput;
