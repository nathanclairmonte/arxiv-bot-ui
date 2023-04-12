import Link from "next/link";
import styles from "./Navbar.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Navbar = ({ apiKey, setApiKey }) => {
    return (
        <div className={styles.nav_container}>
            <div className={styles.nav_logo}>
                <Link className={inter.className} href="/">
                    ArXiv ChatBot
                </Link>
            </div>
            <input
                autoFocus={false}
                rows={1}
                type="password"
                id="apiKey"
                name="apiKey"
                placeholder="Enter your OpenAI API key here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`${inter.className} ${styles.apikey_input}`}
            />
            <div className={styles.nav_links}>
                <Link
                    className={inter.className}
                    href="https://github.com/nathanclairmonte/arxiv-bot-ui"
                    target="_blank"
                >
                    Repo
                </Link>
                {/* <Link
                    className={inter.className}
                    href="https://github.com/nathanclairmonte"
                    target="_blank"
                >
                    My Github
                </Link> */}
            </div>
        </div>
    );
};

export default Navbar;
