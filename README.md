# 🟢 n8n Random Connector

Conector customizado do **n8n** que gera números aleatórios entre um mínimo e um máximo utilizando a API [Random.org](https://www.random.org/).

---

## 🚀 Funcionalidades

- **Nome do conector:** Random  
- **Operação disponível:** True Random Number Generator  

**Inputs:**

| Nome | Tipo | Obrigatório | Descrição |
|------|------|------------|-----------|
| Min  | inteiro | Sim | Valor mínimo permitido |
| Max  | inteiro | Sim | Valor máximo permitido |

**Output:** número aleatório inteiro entre Min e Max

**Fonte do número:** Random.org

---

## 🔧 Pré-requisitos

- Docker + Docker Compose  

---

## ⚙️ Instalação e configuração

### 1️⃣ Clonar o repositório

```
git clone https://github.com/isaacsamurai/Random-n8n.git
```

```
cd Random-n8n/custom/n8n-nodes-random
```


### 2️⃣ Build do conector Random

```
npm install
```

```
npm run build
```


### 3️⃣ Subir os containers

```
docker compose up -d
```

Isso vai subir: 

- n8n (porta 5678)
- PostgreSQL (porta 5432)
  
Acesse o n8n no navegador: http://localhost:5678

O conector Random estará disponível na seção de nodes customizados.


### 4️⃣ Configurar o ambiente

O projeto já vem configurado via docker-compose.yml. As principais informações são:

Variáveis de ambiente do n8n:

``DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=n8npassword
N8N_BASIC_AUTH_ACTIVE=false
N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
GENERIC_TIMEZONE=America/Sao_Paulo
TZ=America/Sao_Paulo
N8N_LOG_LEVEL=debug``

Variáveis do Postgres:

``POSTGRES_USER=n8n
POSTGRES_PASSWORD=n8npassword
POSTGRES_DB=n8n``

Esses dados são usados pelo container do n8n para se conectar ao banco de dados.

Volumes do Docker:

./n8n-data → armazena workflows, credenciais e histórico do n8n

./custom → armazena o conector Random

Ao clonar o repositório, o n8n começará vazio, sem workflows. Sendo assim, será necessário criar ou importar o workflow manualmente.


### 5️⃣ Testar o conector manualmente

1. Abra o n8n no navegador: http://localhost:5678
2. Crie um novo workflow
3. Adicione o node Random
4. Configure os inputs Min e Max
5. Execute o node e verifique se o número retornado está dentro do intervalo definido
