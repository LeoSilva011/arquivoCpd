import fs from 'fs';

const dataFile = 'src/dados/dataLinks.json';

// Função para listar todos os links
const getLinks = (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo de links.');
    }
    res.json(JSON.parse(data));
  });
};

// Função para adicionar um novo link
const addLink = (req, res) => {
  const newLink = req.body;

  // Ler o arquivo atual
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo de links.');
    }

    // Parse do conteúdo atual
    const links = JSON.parse(data);

    // Gerar ID automático para o novo link
    newLink.idLink = links.length > 0 ? links[links.length - 1].idLink + 1 : 1;

    // Adicionar o novo link
    links.push(newLink);

    // Salvar no arquivo
    fs.writeFile(dataFile, JSON.stringify(links, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erro ao salvar o novo link.');
      }
      res.status(201).send('Link salvo com sucesso!');
    });
  });
};

// Função para apagar um link pelo ID
const deleteLinkById = (req, res) => {
  const { id } = req.params; // Obter o ID da URL

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo de links.');
    }

    let links = JSON.parse(data);
    const index = links.findIndex((l) => l.idLink === parseInt(id));

    if (index === -1) {
      return res.status(404).send('Link não encontrado.');
    }

    // Remover o link da lista
    links.splice(index, 1);

    // Salvar no arquivo
    fs.writeFile(dataFile, JSON.stringify(links, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Erro ao salvar o arquivo de links.');
      }
      res.send('Link apagado com sucesso!');
    });
  });
};

// Exportar as funções para uso no arquivo server.js
export { getLinks, addLink, deleteLinkById };