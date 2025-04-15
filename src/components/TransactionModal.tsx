// src/components/TransactionModal.tsx

export const TransactionModal = ({ status }: { status: string }) => {
    return (
      <div style={styles.container}>
        <p style={styles.text}>Transaction Status: {status}</p>
      </div>
    );
  };
  
  const styles = {
    container: {
      marginTop: '20px',
      padding: '10px',
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
      textAlign: 'center' as const,
    },
    text: {
      fontSize: '1rem',
      color: '#333',
    },
  };
  