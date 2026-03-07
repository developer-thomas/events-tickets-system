# Sistema de compras de ingressos e gestão de eventos e locais dos eventos

Aplicação web desenvolvida em Angular para gerenciamento e visualização de eventos, com funcionalidades para clientes e administradores.

## 🚀 Tecnologias

- **Angular 17** - Framework principal
- **TypeScript** - Linguagem de programação
- **Angular Material** - Componentes de UI
- **RxJS** - Programação reativa
- **Tailwind CSS** - Framework CSS
- **Google Maps API** - Integração com mapas

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                    # Serviços e funcionalidades core
│   │   ├── auth/               # Autenticação e autorização
│   │   ├── guards/             # Guards de rota
│   │   ├── interceptors/       # Interceptadores HTTP
│   │   ├── models/             # Modelos de dados
│   │   ├── services/           # Serviços base
│   │   └── utils/              # Utilitários
│   ├── modules/
│   │   ├── client/             # Módulo do cliente
│   │   │   ├── account/        # Área da conta do usuário
│   │   │   ├── home/           # Página inicial
│   │   │   └── common-pages/   # Páginas comuns
│   │   ├── gerencial/          # Módulo administrativo
│   │   │   ├── dashboard/      # Dashboard
│   │   │   ├── event/          # Gerenciamento de eventos
│   │   │   ├── location/       # Gerenciamento de locais
│   │   │   ├── categories/     # Gerenciamento de categorias
│   │   │   ├── users/          # Gerenciamento de usuários
│   │   │   ├── tickets/        # Gerenciamento de ingressos
│   │   │   ├── financial/      # Relatórios financeiros
│   │   │   ├── banners/        # Gerenciamento de banners
│   │   │   ├── coupons/        # Gerenciamento de cupons
│   │   │   └── config/         # Configurações do sistema
│   │   └── shared/             # Componentes compartilhados
│   │       ├── components/     # Componentes reutilizáveis
│   │       ├── services/       # Serviços compartilhados
│   │       ├── models/         # Modelos compartilhados
│   │       ├── pipes/          # Pipes customizados
│   │       └── utils/          # Utilitários compartilhados
│   └── assets/                 # Recursos estáticos
│       ├── images/             # Imagens
│       ├── map-icons/          # Ícones do mapa
│       └── png/                # Imagens PNG
```

## 🎯 Funcionalidades Principais

### 👤 Cliente
- **Visualização de Eventos**: Lista e mapa de eventos culturais
- **Filtros Avançados**: Por categoria, data e proximidade
- **Filtro por Proximidade**: Casa, trabalho e localização atual
- **Área da Conta**: Gerenciamento de perfil e ingressos
- **Favoritos**: Marcar eventos como favoritos
- **Agenda**: Visualizar eventos agendados
- **Ingressos**: Histórico e detalhes de ingressos

### 🛠️ Administrador
- **Dashboard**: Visão geral do sistema
- **Gestão de Eventos**: CRUD completo de eventos
- **Gestão de Locais**: Cadastro e edição de locais
- **Gestão de Categorias**: Categorização de eventos
- **Gestão de Usuários**: Administração de clientes
- **Relatórios Financeiros**: Análise de vendas
- **Gestão de Banners**: Promoções e publicidade
- **Gestão de Cupons**: Descontos e promoções
- **Configurações**: Parâmetros do sistema

## 🗺️ Funcionalidade de Mapa

### Filtro por Proximidade
O sistema implementa um filtro inteligente que permite encontrar eventos próximos a:

1. **🏠 Casa**: Usa as coordenadas do endereço com `type: "Home"`
2. **💼 Trabalho**: Usa as coordenadas do endereço com `type: "Job"`  
3. **📍 Localização Atual**: Usa coordenadas do localStorage (`userLat`/`userLng`)

### Cálculo de Distância
- Utiliza a **fórmula de Haversine** para cálculo preciso
- Raio de busca configurável (padrão: 3000km)
- Retorna o local mais próximo da referência selecionada

### Filtro Múltiplo
- **Categoria**: Filtra por tipo de evento
- **Data**: Filtra por período específico
- **Proximidade**: Combina com outros filtros

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd ato_cultural-web

# Instale as dependências
npm install

# Execute o projeto
npm start
```

### Variáveis de Ambiente
Configure o arquivo `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  api: 'https://sua-api.com',
};
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Gera build de produção
npm run test       # Executa testes unitários
npm run lint       # Executa o linter
```

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops

## 🔐 Autenticação e Autorização

### Guards Implementados
- `LoggedUserGuard`: Protege rotas que requerem usuário logado
- `LoggedAdminGuard`: Protege rotas administrativas
- `PermissionGuard`: Verifica permissões específicas

### Interceptors
- `AuthInterceptor`: Adiciona token de autenticação
- `HttpErrorInterceptor`: Tratamento global de erros

## 🎨 Design System

### Componentes Reutilizáveis
- `BaseButton`: Botão base customizável
- `CommonTable`: Tabela reutilizável
- `FilterTable`: Filtro de busca
- `EventDetails`: Detalhes de evento
- `ProductCard`: Card de produto/evento
- `UserCard`: Card de usuário
- `Loading`: Componente de carregamento

### Pipes Customizados
- `BooleanStatus`: Converte boolean para status
- `CapitalizePipe`: Capitaliza texto
- `ImagePreview`: Preview de imagens

## 📊 Estrutura de Dados

### Principais Interfaces
```typescript
// Usuário logado
interface LoggedUser {
  id: number;
  name: string;
  email: string;
  addresses: LoggedUserAddress[];
  favorites: LoggedUserFavorites[];
}

// Local/Evento
interface GetAllLocation {
  id: number;
  name: string;
  addressLocation: AddressLocation;
  categories: LocationCategory[];
  event: EventItem[];
}

// Categoria
interface GetAllCategories {
  id: number;
  name: string;
  imageIcon: string;
}
```

## 🔄 Fluxo de Dados

1. **Carregamento Inicial**: Dados do usuário, locais e categorias
2. **Filtros**: Aplicação de filtros múltiplos
3. **Cálculo de Proximidade**: Distância entre pontos geográficos
4. **Renderização**: Exibição no mapa ou lista

## 🛠️ Manutenção

### Adicionando Novos Filtros
1. Crie o método no `FilterModalComponent`
2. Adicione a lógica no `MapComponent.applyFilters()`
3. Atualize as interfaces conforme necessário

### Modificando o Raio de Busca
Altere a constante `maxDistance` no método `filterByProximity()`:
```typescript
const maxDistance = 3000; // km
```



