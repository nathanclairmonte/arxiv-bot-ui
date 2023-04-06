import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <div className={styles.footer}>
            <p>
                Powered by{" "}
                <a href="https://github.com/hwchase17/langchain" target="_blank">
                    LangChain
                </a>
                . Built by{" "}
                <a href="https://twitter.com/cIairmonte" target="_blank">
                    Nathan Clairmonte
                </a>
                .
            </p>
        </div>
    );
};

export default Footer;
