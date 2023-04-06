import styles from "./Navbar.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Navbar = () => {
    return (
        <div className={styles.nav_container}>
            <div className={styles.nav_logo}>
                <a className={inter.className} href="/">
                    ArXiv ChatBot
                </a>
            </div>
            <div className={styles.nav_links}>
                <a
                    className={inter.className}
                    href="https://github.com/nathanclairmonte/arxiv-bot-ui"
                    target="_blank"
                >
                    Repo
                </a>
                <a
                    className={inter.className}
                    href="https://github.com/nathanclairmonte"
                    target="_blank"
                >
                    My Github
                </a>
            </div>
        </div>
    );
};

export default Navbar;
