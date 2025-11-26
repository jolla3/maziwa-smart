
// ============================================
// src/superadmin/components/Button.jsx
// ============================================
import React from 'react';
import styles from './Button.module.css';

export const Button = ({ children, onClick, variant = 'primary', icon: Icon, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${className || ''}`}
    >
      {Icon && <Icon size={16} className={styles.icon} />}
      {children}
    </button>
  );
};