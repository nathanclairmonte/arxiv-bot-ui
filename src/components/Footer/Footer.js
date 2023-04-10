import Link from "next/link";
import { Inter } from "next/font/google";
import { BsLinkedin, BsTwitter, BsGithub } from "react-icons/bs";
import styles from "./Footer.module.css";

const inter = Inter({ subsets: ["latin"] });

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footer_text}>
                <p className={inter.className}>
                    Built by{" "}
                    <Link href="https://www.linkedin.com/in/nathanclairmonte/" target="_blank">
                        Nathan Clairmonte
                    </Link>
                    . Powered by{" "}
                    <Link href="https://github.com/hwchase17/langchain" target="_blank">
                        LangChain
                    </Link>
                    .
                </p>
            </div>
            <div className={styles.footer_icons_container}>
                <Link href="https://www.linkedin.com/in/nathanclairmonte/" target="_blank">
                    <BsLinkedin className={styles.footer_icon} />
                </Link>
                <Link href="https://github.com/nathanclairmonte" target="_blank">
                    <BsGithub className={styles.footer_icon} />
                </Link>
                <Link href="https://twitter.com/cIairmonte" target="_blank">
                    <BsTwitter className={styles.footer_icon} />
                </Link>
            </div>
        </div>
    );
};

export default Footer;
