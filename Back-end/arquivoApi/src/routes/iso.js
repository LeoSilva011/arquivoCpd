import fs from 'fs';
import path from 'path';
import multer from 'multer';
import axios from 'axios';  // Usando axios para baixar o arquivo da URL externa
import { createWriteStream } from 'fs';
import { log } from 'console';

// Caminho para o arquivo JSON
const dataFile = 'src/dados/dataIso.json';

const HOST = "http://10.139.0.15:3000"



// Configuração do multer para salvar o arquivo localmente
const upload = multer({
  dest: 'src/dados/uploads/isos', // Diretório onde as ISOs serão salvas
});

const addIso = (req, res) => {
  const { nome } = req.body;

  if (!req.file) {
    return res.status(400).send('Arquivo ISO é obrigatório.');
  }

  // Gera o link de download com a URL completa
  const linkDownload = `${HOST}/uploads/isos/${req.file.filename}`;

  const newIso = {
    idIso: null,
    nome,
    linkDownload,
  };

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo de ISOs.');
    }

    const isos = JSON.parse(data);

    // Gerar ID automático
    newIso.idIso = isos.length > 0 ? isos[isos.length - 1].idIso + 1 : 1;

    // Adicionar a nova ISO
    isos.push(newIso);

    // Salvar no arquivo JSON
    fs.writeFile(dataFile, JSON.stringify(isos, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erro ao salvar a ISO.');
      }
      res.status(201).json(newIso); // Retorna o objeto ISO completo
    });
  });
};

// Função para validar uma URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

// Função para buscar uma ISO pelo ID e permitir o download
const downloadIso = async (req, res) => {
  const { idIso } = req.params;

  fs.readFile(dataFile, 'utf8', async (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de ISOs:', err);
      return res.status(500).send('Erro ao ler o arquivo de ISOs.');
    }

    const isos = JSON.parse(data);
    const iso = isos.find((iso) => iso.idIso === parseInt(idIso));

    if (!iso) {
      return res.status(404).send('ISO não encontrada.');
    }

    const fileUrl = iso.linkDownload;

    // Valida a URL antes de tentar o download
    if (!isValidUrl(fileUrl)) {
      return res.status(400).send('A URL do arquivo é inválida.');
    }

    try {
      // Faz o download do arquivo usando axios
      const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
      });

      // Define o cabeçalho para download
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${iso.nome.replace(/\s+/g, '_')}.iso"`
      );

      // Transmite o arquivo baixado diretamente para o cliente
      response.data.pipe(res);
    } catch (downloadError) {
      console.error('Erro ao baixar o arquivo da URL:', downloadError.message);

      if (downloadError.response) {
        res
          .status(downloadError.response.status)
          .send(
            `Erro ao acessar o arquivo na URL. Código de status: ${downloadError.response.status}`
          );
      } else if (downloadError.request) {
        res
          .status(500)
          .send('Erro ao conectar ao servidor para baixar o arquivo.');
      } else {
        res
          .status(500)
          .send(`Erro inesperado ao tentar baixar o arquivo: ${downloadError.message}`);
      }
    }
  });
};


// Função para buscar todas as ISOs
const getIsos = (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo de ISOs.');
    }

    // Retorna o conteúdo do arquivo JSON
    const isos = JSON.parse(data);
    res.status(200).json(isos);
  });
};

import { fileURLToPath } from 'url';

// Obter o diretório atual do arquivo
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Função para apagar uma ISO pelo ID
const deleteIsoById = (req, res) => {
  const { idIso } = req.params;


 
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de ISOs:', err);
      return res.status(500).send('Erro ao ler o arquivo de ISOs.');
    }

    let isos = JSON.parse(data);
    const isoIndex = isos.findIndex((iso) => iso.idIso === parseInt(idIso));

    if (isoIndex === -1) {
      return res.status(404).send('ISO não encontrada.');
    }

    // Obter o caminho do arquivo para remover
    const isoToDelete = isos[isoIndex];

    // Converter a URL para o caminho físico no servidor
    const filePath = path.resolve(
      'src/dados/uploads/isos',
      isoToDelete.linkDownload.replace(`${HOST}/uploads/isos/`, '')
    );

    // Verificar se o arquivo existe antes de tentar apagá-lo
    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.error('Arquivo não encontrado:', accessErr);
        return res.status(404).send('Arquivo ISO não encontrado no servidor.');
      }

      // Remover o arquivo fisicamente
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erro ao apagar o arquivo ISO:', unlinkErr);
          return res.status(500).send('Erro ao apagar o arquivo ISO.');
        }

        // Remover a ISO da lista
        isos.splice(isoIndex, 1);

        // Salvar no arquivo JSON
        fs.writeFile(dataFile, JSON.stringify(isos, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Erro ao salvar o arquivo de ISOs:', writeErr);
            return res.status(500).send('Erro ao salvar o arquivo de ISOs.');
          }

          res.status(200).send('ISO apagada com sucesso!');
        });
      });
    });
  });
};


export { getIsos, upload, addIso, downloadIso, deleteIsoById };