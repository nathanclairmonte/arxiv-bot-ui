import styles from "./Footer.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Footer = () => {
    return (
        <div className={styles.footer}>
            <p className={inter.className}>
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
