
import { HardHat } from 'lucide-react';
import styles from './maintenance.module.css';

export const metadata = {
    title: "Service Unavailable",
    description: "This site is currently down for maintenance.",
}

export default function MaintenancePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
            <HardHat size={64} className={styles.icon} />
        </div>
        <h1 className={styles.title}>Under Maintenance</h1>
        <p className={styles.message}>
            We are currently performing essential maintenance and will be back online shortly.
            We apologize for any inconvenience.
        </p>
      </div>
    </div>
  );
}
