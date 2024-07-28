import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import styles from './ResultDisplay.module.css'; // Estilos personalizados

const ResultDisplay: React.FC<{ result: { class: string, confidence: number }[] }> = ({ result }) => {
  return (
    <Box className={styles.resultContainer}>
      {result.map((item, index) => (
        <Box key={index} className={styles.resultItem}>
          <Box className={styles.circularProgressContainer}>
            <CircularProgress
              variant="determinate"
              value={item.confidence * 100}
              size={100}
              thickness={4}
              className={styles.circularProgress}
            />
            <Typography variant="h6" className={styles.circularProgressText}>
              {(item.confidence * 100).toFixed(0)}%
            </Typography>
          </Box>
          <Typography variant="h6" className={styles.resultText}>
            {item.class}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ResultDisplay;
