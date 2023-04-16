import Link from "next/link";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { CgSoftwareUpload } from "react-icons/cg";
import { IoIosCloseCircle } from "react-icons/io";
import { Inter } from "next/font/google";
import styles from "./PDFInput.module.css";

const inter = Inter({ subsets: ["latin"] });

const PDFInput = ({ setDocs, setMessages }) => {
    const [file, setFile] = useState(null);
    const [currentFilename, setCurrentFilename] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        type: "neutral",
        message: "",
    });
    const [fileChosen, setFileChosen] = useState(false);

    // reference for the file input
    const fileInputRef = useRef(null);

    // select status styling based on message type
    const _statusStylingHelper = (type) => {
        if (type === "error") {
            return `${inter.className} ${styles.status_error}`;
        } else if (type === "success") {
            return `${inter.className} ${styles.status_success}`;
        } else {
            return `${inter.className} ${styles.status_neutral}`;
        }
    };

    // store an uploaded local PDF in state
    const storePDF = async (event) => {
        // prevent browser refresh
        event.preventDefault();

        // save file to state if it exists
        if (event.target.files && event.target.files[0]) {
            // update state with relevant info
            setFile(event.target.files[0]);
            setFileChosen(true);
        }
    };

    // handle closing of a chosen file
    const handleCloseFile = () => {
        // clear file input
        fileInputRef.current.value = null;
        fileInputRef.current.files = null;

        // reset all file-related pieces of state
        setFileChosen(false);
        setFile(null);
        setCurrentFilename("");
    };

    // handle loading of a PDF
    const handleLoadPDF = async (event) => {
        // prevent browser refresh
        event.preventDefault();

        // ensure a file is chosen
        if (!fileChosen) {
            setStatus({
                type: "error",
                message: "Please upload a PDF first!",
            });
            return;
        }

        // ensure we aren't re-loading the same PDF
        if (file.name === currentFilename) {
            setStatus({
                type: "success",
                message: "That PDF is already loaded!",
            });
            return;
        }

        // check file size
        const size = parseInt((file.size / 1024 / 1024).toFixed(4));
        const maxMB = 16;
        if (size > maxMB) {
            setStatus({
                type: "error",
                message: "File too large :(",
            });
            return;
        }

        // save current filename and start file load process
        setCurrentFilename(file.name);
        setLoading(true);

        // give status update
        setStatus({
            type: "neutral",
            message: `Loading ${file.name}...`,
        });

        // get info to upload file to S3
        const fileName = encodeURIComponent(file.name);
        const fileType = encodeURIComponent(file.type);
        const response = await fetch(`/api/upload-to-s3?fileName=${fileName}&fileType=${fileType}`);
        const { url, fields } = await response.json();

        // use info received to upload file
        const formData = new FormData();
        Object.entries({ ...fields, file }).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const upload = await fetch(url, {
                method: "POST",
                body: formData,
            });

            // // check this response now
            // if (upload.ok) {
            //     setStatus({
            //         type: "success",
            //         message: `Success! ${file.name} uploaded.`,
            //     });
            // } else {
            //     const errorMsg = await upload.text();
            //     setStatus({
            //         type: "error",
            //         message: `Upload failed :( \n ${upload.status} ${errorMsg}`,
            //     });
            // }
        } catch (error) {
            const errorMsg = await upload.text();
            setStatus({
                type: "error",
                message: `Upload failed :( \n ${upload.status} ${errorMsg}`,
            });
        }

        // split PDF into chunks
        const response2 = await fetch(`api/split?fileName=${file.name}`);
        // const response2 = await fetch(`api/split?fileName=Nathan Clairmonte CV.pdf`);
        const data = await response2.json();

        // update status message with result
        setStatus({
            type: data.result.type,
            message: data.result.message,
        });

        // update docs state with returned docs (if they are returned)
        if (data.result.docs.length !== 0) {
            setDocs(data.result.docs);
        }

        // reset messages list if load was successful
        if (data.result.type === "success") {
            setMessages([
                {
                    text: "Ask a question about the paper :)",
                    type: "response",
                },
            ]);
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <p className={`${inter.className} ${styles.pdf_input_text}`}>
                Please select a local PDF:
            </p>
            <div className={styles.pdf_input_container}>
                <form onSubmit={handleLoadPDF} className={styles.pdf_form}>
                    <input
                        accept="application/pdf"
                        ref={fileInputRef}
                        disabled={loading}
                        autoFocus={false}
                        type="file"
                        id="localPdf"
                        name="localPdf"
                        onChange={storePDF}
                        className={styles.pdf_input}
                    />
                    {fileChosen ? (
                        <button className={styles.close_file_button} onClick={handleCloseFile}>
                            <IoIosCloseCircle className={styles.close_file_icon} />
                        </button>
                    ) : null}
                    <button type="submit" disabled={loading} className={styles.load_pdf_button}>
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
                                <p className={`${inter.className} ${styles.load_text}`}>Load PDF</p>
                            </div>
                        )}
                    </button>
                </form>
                {status.message ? (
                    <div className={styles.status_container}>
                        <p className={_statusStylingHelper(status.type)}>{status.message}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PDFInput;
