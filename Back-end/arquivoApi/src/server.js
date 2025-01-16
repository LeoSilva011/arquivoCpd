import express from 'express';
import { getLinks, addLink, deleteLinkById } from './routes/links.js';
import { upload, addIso, getIsos, downloadIso, deleteIsoById} from './routes/iso.js';
import categoriasRouter from "./routes/arquivo.js";
import cors from  'cors'


const app = express();
const PORT = 3000;

app.use(cors())



// Middleware para interpretar JSON
app.use(express.json());

// Rota para listar links
app.get('/links', getLinks);

// Rota para adicionar um link
app.post('/links', addLink);

app.delete('/links/:id', deleteLinkById);


// Rota para salvar uma nova ISO (usando multer)
app.post('/isos', upload.single('isoFile'), addIso);

// Rota para buscar todas as ISOs
app.get('/isos', getIsos);

// Servir arquivos de uploads
app.use('/uploads', express.static('src/dados/uploads'));

app.get('/isos/:idIso/download',downloadIso)

app.delete('/isos/:idIso', deleteIsoById );

// Rotas
app.use("/categorias", categoriasRouter);



// Subir o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});