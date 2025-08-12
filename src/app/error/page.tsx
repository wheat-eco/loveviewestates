
import styles from './error.module.css';

export const metadata = {
    title: "Service Unavailable",
    description: "This site is currently down for maintenance.",
}

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Service Unavailable</h1>
        <p className={styles.message}>
            The server is temporarily unable to handle your request. Please try again later.
        </p>
      </div>
    </div>
  );
}
