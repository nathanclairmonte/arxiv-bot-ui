import Link from "next/link";
import styles from "./Navbar.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Navbar = () => {
    return (
        <div className={styles.nav_container}>
            <div className={styles.nav_logo}>
                <Link className={inter.className} href="/">
                    ArXiv ChatBot
                </Link>
            </div>
            <div className={styles.nav_links}>
                <Link
                    className={inter.className}
                    href="https://github.com/nathanclairmonte/arxiv-bot-ui"
                    target="_blank"
                >
                    Repo
                </Link>
                <Link
                    className={inter.className}
                    href="https://github.com/nathanclairmonte"
                    target="_blank"
                >
                    Nathan's Github
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
