# Diagrama de Arquitetura - ATO Cultural Web

## 🏗️ Estrutura Modular

```mermaid
graph TB
    subgraph "ATO Cultural Web"
        subgraph "Core Layer"
            A[Auth Services] --> B[Guards]
            A --> C[Interceptors]
            A --> D[Models]
            A --> E[Base Services]
            A --> F[Utils]
        end
        
        subgraph "Feature Modules"
            G[Client Module] --> H[Account]
            G --> I[Common Pages]
            G --> J[Home]
            
            K[Gerencial Module] --> L[Dashboard]
            K --> M[Users]
            K --> N[Events]
            K --> O[Locations]
            K --> P[Financial]
            
            Q[Shared Module] --> R[Components]
            Q --> S[Directives]
            Q --> T[Pipes]
        end
        
        subgraph "Assets"
            U[Images]
            V[Map Icons]
            W[PNG Files]
        end
    end
    
    B --> G
    B --> K
    C --> G
    C --> K
    E --> G
    E --> K
    Q --> G
    Q --> K
```

## 🔄 Fluxo de Rotas

```mermaid
graph LR
    A[App Routes] --> B[Client Routes]
    A --> C[Gerencial Routes]
    A --> D[Home Routes]
    A --> E[Confirm Email Routes]
    
    B --> F[Account Routes]
    B --> G[Common Pages]
    B --> H[Auth Pages]
    
    C --> I[Dashboard]
    C --> J[Users Management]
    C --> K[Events Management]
    C --> L[Locations Management]
    C --> M[Financial]
    C --> N[Configuration]
```

## 🛡️ Sistema de Guards

```mermaid
graph TD
    A[Route Access] --> B{User Logged?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D{Is Admin?}
    D -->|No| E[Check User Permissions]
    D -->|Yes| F[Check Admin Permissions]
    E --> G{Has Permission?}
    F --> G
    G -->|Yes| H[Allow Access]
    G -->|No| I[Access Denied]
```

## 📦 Estrutura de Dependências

```mermaid
graph TB
    subgraph "External Dependencies"
        A[Angular 17]
        B[Angular Material]
        C[PrimeNG]
        D[Tailwind CSS]
        E[RxJS]
        F[Google Maps]
    end
    
    subgraph "Core Services"
        G[Auth Service]
        H[Storage Service]
        I[User Service]
        J[Base Service]
    end
    
    subgraph "Feature Modules"
        K[Client Module]
        L[Gerencial Module]
        M[Shared Module]
    end
    
    A --> G
    A --> H
    A --> I
    A --> J
    B --> K
    B --> L
    C --> K
    C --> L
    D --> K
    D --> L
    E --> G
    E --> H
    E --> I
    F --> K
    F --> L
    
    G --> K
    G --> L
    H --> K
    H --> L
    I --> K
    I --> L
    J --> K
    J --> L
    M --> K
    M --> L
```

## 🎯 Padrões de Desenvolvimento

### 1. **Separação de Responsabilidades**
- **Core**: Funcionalidades centrais e compartilhadas
- **Modules**: Funcionalidades específicas de negócio
- **Shared**: Componentes reutilizáveis

### 2. **Lazy Loading**
- Todos os módulos principais usam lazy loading
- Melhora a performance inicial da aplicação
- Reduz o bundle size

### 3. **Guards de Segurança**
- Verificação de autenticação
- Controle de permissões
- Proteção de rotas sensíveis

### 4. **Interceptors**
- Interceptação de requisições HTTP
- Tratamento de erros centralizado
- Adição automática de tokens de autenticação

### 5. **Serviços Base**
- Abstração de operações comuns
- Reutilização de código
- Facilita manutenção

---

*Estes diagramas ilustram a arquitetura e os padrões utilizados no projeto ATO Cultural Web.*
