"use client";
import { useState } from "react";
import styles from "./raiox.module.css"; // Ajuste o caminho se necessário
import UploadBox from '@/components/UploadBox/UploadBox';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Typography, Button } from '@mui/material';
import ResultDisplay from '@/components/Result/ResultDisplay'; // Importando o novo componente

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Novo estado para controlar o carregamento
  const [result, setResult] = useState<{ class: string, confidence: number }[] | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null); // Novo estado para o tempo de execução
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Novo estado para armazenar a URL da imagem

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImageUrl(url); // Armazena a URL da imagem selecionada
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true); // Inicia o estado de carregamento

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar a imagem");
      }

      const resultData = await response.json();
      setResult(resultData.result); // Atualiza o estado com os resultados da API
      setExecutionTime(resultData.execution_time * 1000); // Atualiza o estado com o tempo de execução em milissegundos
      console.log("Imagem enviada com sucesso:", resultData);

    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
    } finally {
      setIsLoading(false); // Termina o estado de carregamento
    }
  };

  const handleReset = () => {
    setFile(null);
    setIsLoading(false);
    setResult(null);
    setExecutionTime(null); // Redefine o tempo de execução
    setImageUrl(null); // Redefine a URL da imagem
  };

  return (
    <main className={styles.main}>
      <div className={styles.navbar}>
        <img src="/raio-x.svg" className={styles.logo} />
        <MenuIcon />
      </div>
      <div style={{ display: 'flex', width: '100%', margin: '30px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {result === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <UploadBox onFileSelect={handleFileSelect} handleUpload={handleUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '70vh' }}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: '70%', maxHeight: '70%', marginRight: '10px' }}
                />
              )}
              <div style={{ display: 'flex', width: '100%', margin: '30px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {result.length > 0 ? (
                  <ResultDisplay result={result} />
                ) : (
                  <Typography variant="h6" sx={{ marginTop: '10px', color: '#000000' }}>
                    Documento não identificado
                  </Typography>
                )}
                {executionTime && (
                  <Typography variant="h6" sx={{ marginTop: '10px', color: '#000000' }}>
                    Tempo de execução: {(executionTime / 1000).toFixed(2)} s
                  </Typography>
                )}
              </div>
            </div>

            <Button
              onClick={handleReset}
              variant="contained"
              color="primary"
              sx={{ marginTop: '10px' }}
            >
              Enviar novo documento?
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
