import express from "express";
import fs from "fs";
import path from "path";
import multer from 'multer';
const router = express.Router();

// Caminho para o arquivo JSON
const dataPath = "src/dados/dataArquivos.json";

const HOST = "http://10.139.0.15:3000"


// Função auxiliar para ler o arquivo JSON com fs.promises
async function readData() {
  try {
      const data = await fs.promises.readFile(dataPath, "utf-8");
      return JSON.parse(data);
  } catch (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return [];
  }
}

// Função auxiliar para salvar no arquivo JSON usando fs.promises
async function writeData(data) {
  try {
      await fs.promises.writeFile(dataPath, JSON.stringify(data, null, 2));
  } catch (err) {
      console.error("Erro ao escrever no arquivo JSON:", err);
  }
}
//  Buscar todas as categorias
router.get("/", async (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo de ISOs.');
    }

    // Retorna o conteúdo do arquivo JSON
    const isos = JSON.parse(data);
    res.status(200).json(isos);
  });
});


// Buscar uma categoria pelo ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const categorias = await readData();
    const categoria = categorias.find(cat => cat.idCategoriaArquivo === parseInt(id));

    if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada!" });
    }

    res.json(categoria);
});


//  Criar uma nova categoria
router.post("/", async (req, res) => {
    const { idCategoriaArquivo, nome, programas } = req.body;

    const categorias = await readData();

    if (categorias.find(cat => cat.idCategoriaArquivo === idCategoriaArquivo)) {
        return res.status(400).json({ message: "Categoria já existe!" });
    }

    const novaCategoria = { idCategoriaArquivo, nome, programas: programas || [] };
    categorias.push(novaCategoria);

    await writeData(categorias);
    res.status(201).json(novaCategoria);
});
//==========================================
import { fileURLToPath } from 'url';  // Importando fileURLToPath
import { dirname } from 'path';  
// Obtém o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pastaDestino = file.fieldname === 'urlArquivo' ? 'programas' : 'imagens';
    cb(null, path.join(__dirname, `../dados/uploads/${pastaDestino}`)); // Caminho de destino
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  }
});

const upload = multer({ storage });

// Rota para adicionar programa
router.post('/adicionar-programa', upload.fields([
  { name: 'urlArquivo', maxCount: 1 },
  { name: 'urlImg', maxCount: 1 }
]), (req, res) => {
  try {
    const { idCategoriaArquivo, nome, idArquivo } = req.body;
    const arquivos = req.files;

    // Verificar se os arquivos foram enviados
    if (!arquivos || !arquivos.urlArquivo || !arquivos.urlImg) {
      console.log(arquivos.urlArquivo )
      console.log(arquivos.urlImg )
      return res.status(400).json({ error: 'Arquivos não enviados corretamente.' });
    }

    // Verificar se os dados do programa estão corretos
    if (!idCategoriaArquivo || !nome ) {

      return res.status(400).json({ error: 'Dados do programa não enviados corretamente.' });
    }

    // Localizar o arquivo JSON onde os dados das categorias estão armazenados
    const dataArquivoPath = 'src/dados/dataArquivos.json';

    // Ler os dados do arquivo JSON
    let dataArquivos = [];
    if (fs.existsSync(dataArquivoPath)) {
      dataArquivos = JSON.parse(fs.readFileSync(dataArquivoPath, 'utf-8'));
    }

    // Encontrar a categoria onde o programa será adicionado
    const categoria = dataArquivos.find(cat => cat.idCategoriaArquivo === parseInt(idCategoriaArquivo));
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    // Criar o novo programa
    const novoPrograma = {
      idArquivo: categoria.programas.length + 1,
      nome,
      idCategoriaArquivo: parseInt(idCategoriaArquivo),
      urlArquivo: `${HOST}/uploads/programas/` + arquivos.urlArquivo[0].filename, //http://localhost:3000/ host da api. Mudar caso mude de host
      urlImg: `${HOST}/uploads/imagens/` + arquivos.urlImg[0].filename
    };

    // Adicionar o programa ao array de programas da categoria
    categoria.programas.push(novoPrograma);

    // Salvar os dados atualizados no arquivo JSON
    fs.writeFileSync(dataArquivoPath, JSON.stringify(dataArquivos, null, 2));

    return res.status(201).json({ message: 'Programa adicionado com sucesso!', categoria });
  } catch (error) {
    console.error('Erro ao adicionar programa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota para apagar um programa pelo idArquivo
router.delete('/:idCategoriaArquivo/programas/:idArquivo', async (req, res) => {
  const { idCategoriaArquivo, idArquivo } = req.params;
  const { senha } = req.body;

  try {
    // Verificar a senha
    if (senha !== 'radeonrx580') {
      return res.status(403).json({ message: 'Acesso negado! Senha inválida.' });
    }

    // Ler os dados do arquivo JSON
    const categorias = await readData();

    // Encontrar a categoria pelo idCategoriaArquivo
    const categoria = categorias.find(cat => cat.idCategoriaArquivo === parseInt(idCategoriaArquivo));
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada!' });
    }

    // Encontrar o índice do programa a ser removido
    const programaIndex = categoria.programas.findIndex(prog => prog.idArquivo === parseInt(idArquivo));
    if (programaIndex === -1) {
      return res.status(404).json({ message: 'Programa não encontrado!' });
    }

    // Obter os dados do programa para excluir os arquivos
    const programaRemovido = categoria.programas[programaIndex];

    // Remover o programa do array de programas
    categoria.programas.splice(programaIndex, 1);

    // Excluir os arquivos do sistema de arquivos
    const caminhoArquivo = path.join(__dirname, `../dados/uploads/programas/${programaRemovido.urlArquivo.split('/').pop()}`);
    const caminhoImagem = path.join(__dirname, `../dados/uploads/imagens/${programaRemovido.urlImg.split('/').pop()}`);

    fs.unlinkSync(caminhoArquivo); // Deleta o arquivo de programa
    fs.unlinkSync(caminhoImagem);  // Deleta o arquivo de imagem

    // Salvar os dados atualizados no arquivo JSON
    await writeData(categorias);

    return res.status(200).json({ message: 'Programa removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover programa:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

 

export default router;