import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from './UploadBox.module.css'; // Ajuste o caminho se necessário

const UploadBox: React.FC<{ onFileSelect: (file: File) => void; handleUpload: () => void; isLoading: boolean; }> = ({ onFileSelect, handleUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      className={`${styles.uploadBox} ${isDragActive ? styles.active : ''}`}
      sx={{
        border: isLoading ? 'transparent' : '2px dashed #81b8ff',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: isLoading ? 'transparent' : (isDragActive ? '#f0f0f0' : '#fff'),
        pointerEvents: isLoading ? 'none' : 'auto', // Desativa a interação quando está carregando
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 50, color: '#81b8ff' }} />
          {selectedFile ? (
            <Typography variant="body1" sx={{ 
              display: 'flex',
              flexDirection: 'column', 
              marginTop: '10px', 
              color: '#81b8ff' 
              }}>
              {selectedFile.name}
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  handleUpload();
                }}
                variant="contained"
                color="primary"
                sx={{ marginTop: '10px' }}
              >
                Validar?
              </Button>
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ marginTop: '10px', color: '#81b8ff' }}>
              Clique aqui ou arraste os documentos para serem validados
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default UploadBox;
