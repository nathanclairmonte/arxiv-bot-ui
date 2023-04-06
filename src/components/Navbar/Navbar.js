import styles from "./Navbar.module.css";

const Navbar = () => {
    return (
        <div className={styles.nav_container}>
            <div className={styles.nav_logo}>
                <a href="/">ArXiv ChatBot</a>
            </div>
            <div className={styles.nav_links}>
                <a href="https://github.com/nathanclairmonte/arxiv-bot-ui" target="_blank">
                    Repo
                </a>
                <a href="https://github.com/nathanclairmonte" target="_blank">
                    My Github
                </a>
            </div>
        </div>
    );
};

export default Navbar;
