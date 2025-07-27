import Link from 'next/link';
import { AlertTriangle, Home, Search } from 'lucide-react';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={64} className={styles.icon} />
        </div>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.buttonPrimary}>
            <Home size={16} />
            Go to Homepage
          </Link>
          <Link href="/available-properties" className={styles.buttonSecondary}>
            <Search size={16} />
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
