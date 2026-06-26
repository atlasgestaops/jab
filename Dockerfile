# Usar imagem estável e leve do Node
FROM node:20-alpine

# Definir diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./

# Instalar dependências dentro do contêiner
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta padrão do Vite dev server
EXPOSE 5173

# Iniciar o servidor de desenvolvimento do Vite escutando em todas as interfaces do contêiner
CMD ["npm", "run", "dev", "--", "--host"]
