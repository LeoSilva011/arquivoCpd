import multer from 'multer';
import path from 'path';

// Configuração do multer para salvar o arquivo com extensão original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/dados/uploads'); // Diretório onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    // Mantém o nome original do arquivo, incluindo a extensão
    const originalName = file.originalname;
    cb(null, originalName);
  },
});

const upload = multer({ storage });
