import { ReactNode } from 'react';
import styles from './DeveloperTools.module.css';

interface DevToolCardProps {
  title: string;
  tag?: string;
  children: ReactNode;
  buttons: {
    label: string;
    onClick: () => void;
    isPrimary?: boolean;
    icon?: string;
    disabled?: boolean;
  }[];
}

export function DevToolCard({ title, tag, children, buttons }: DevToolCardProps) {
  return (
    <div className={styles.toolCard}>
      <div className={styles.toolHeader}>
        <h3 className={styles.toolTitle}>{title}</h3>
        {tag && <span className={styles.toolTag}>{tag}</span>}
      </div>
      
      <div className={styles.toolContent}>
        {children}
      </div>
      
      <div className={styles.buttonGroup}>
        {buttons.map((button, index) => (
          <button
            key={index}
            className={button.isPrimary ? styles.actionButton : styles.secondaryButton}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.icon && <span>{button.icon}</span>}
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}