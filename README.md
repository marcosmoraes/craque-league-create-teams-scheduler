# League Create Teams Scheduler

Este serviço é responsável por criar times com base nos dados estatísticos dos jogadores na temporada e enviar essas informações para uma fila SQS para processamento posterior.

## 🏗️ Arquitetura

O projeto é construído como uma função serverless na AWS Lambda, utilizando o Serverless Framework para gerenciamento da infraestrutura. A arquitetura inclui:

- **AWS Lambda**: Função serverless para processamento dos dados
- **Amazon SQS**: Fila para processamento assíncrono dos times criados
- **MongoDB**: Banco de dados para armazenamento dos dados dos jogadores e times
- **Serverless Framework**: Framework para gerenciamento da infraestrutura

## 🛠️ Tecnologias Utilizadas

- Node.js 18.x
- Serverless Framework
- MongoDB
- AWS Lambda
- Amazon SQS
- Express.js
- Axios

## 📦 Dependências Principais

- `axios`: ^1.5.1
- `dotenv`: ^16.3.1
- `express`: ^4.18.2
- `mongoose`: ^7.6.2
- `serverless-offline`: ^13.2.0 (dev)

## 🚀 Configuração do Ambiente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
MONGODB_USERNAME=seu_usuario
MONGODB_PASSWORD=sua_senha
DATABASE=nome_do_banco
```

3. Para desenvolvimento local:
```bash
npm run dev
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento Local
```bash
serverless offline
```

### Deploy
```bash
serverless deploy
```

## 📁 Estrutura do Projeto

```
├── config/             # Configurações do projeto
├── infrastructure/     # Configurações de infraestrutura
├── repositories/       # Camada de acesso a dados
├── services/          # Serviços e integrações
├── use-cases/         # Casos de uso da aplicação
├── utils/             # Utilitários
├── model/             # Modelos de dados
├── handler.js         # Ponto de entrada da função Lambda
└── serverless.yml     # Configuração do Serverless Framework
```

## 🔄 Fluxo de Processamento

1. A função Lambda é acionada via HTTP POST
2. Validação das variáveis de ambiente
3. Conexão com o MongoDB
4. Processamento das estatísticas dos jogadores
5. Envio dos dados para a fila SQS
6. Fechamento da conexão com o banco de dados

## 🔒 Segurança

- Credenciais do MongoDB são gerenciadas via variáveis de ambiente
- IAM roles configuradas para acesso mínimo necessário
- Timeout configurado para 600 segundos
- DLQ (Dead Letter Queue) configurada para mensagens com falha

## 📝 Notas Adicionais

- O serviço utiliza uma fila SQS para processamento assíncrono
- Implementa retry policy com máximo de 5 tentativas
- Possui tratamento de erros e logging
- Suporta CORS para integração com frontend

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request


