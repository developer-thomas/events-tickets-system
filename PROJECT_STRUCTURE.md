# Estrutura do Projeto ATO Cultural Web

## 📋 Visão Geral
Este é um projeto Angular 17 com arquitetura modular, seguindo as melhores práticas de organização de código e separação de responsabilidades.

## 🏗️ Arquitetura do Projeto

```
ato_cultural-web/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 app.component.ts          # Componente raiz da aplicação
│   │   ├── 📄 app.config.ts             # Configuração da aplicação
│   │   ├── 📄 app.routes.ts             # Rotas principais
│   │   │
│   │   ├── 📁 core/                     # 🎯 CORE - Funcionalidades centrais
│   │   │   ├── 📁 auth/                 # Autenticação e autorização
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   └── user.service.ts
│   │   │   │
│   │   │   ├── 📁 guards/               # Guards de rota
│   │   │   │   ├── logged-admin.guard.ts
│   │   │   │   ├── logged-user.guard.ts
│   │   │   │   └── permission.guard.ts
│   │   │   │
│   │   │   ├── 📁 helpers/              # Funções auxiliares
│   │   │   │   └── regex-email.ts
│   │   │   │
│   │   │   ├── 📁 interceptors/         # Interceptors HTTP
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── http-error.interceptor.ts
│   │   │   │
│   │   │   ├── 📁 models/               # Interfaces e tipos
│   │   │   │   ├── address.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── register.ts
│   │   │   │
│   │   │   ├── 📁 services/             # Serviços base
│   │   │   │   ├── address.service.ts
│   │   │   │   ├── base.service.ts
│   │   │   │   └── upload.service.ts
│   │   │   │
│   │   │   └── 📁 utils/                # Utilitários
│   │   │       └── snackbar.utils.ts
│   │   │
│   │   └── 📁 modules/                  # 🎯 MODULES - Módulos de funcionalidade
│   │       │
│   │       ├── 📁 client/               # Módulo do Cliente
│   │       │   ├── client.component.ts
│   │       │   ├── client.routes.ts
│   │       │   │
│   │       │   ├── 📁 account/          # Área do usuário logado
│   │       │   │   ├── [114 arquivos]  # 70 *.ts, 22 *.html, 22 *.scss
│   │       │   │   └── account.routes.ts
│   │       │   │
│   │       │   ├── 📁 common-pages/     # Páginas comuns
│   │       │   │   ├── [12 arquivos]   # 6 *.ts, 3 *.html, 3 *.scss
│   │       │   │   └── about/, use-terms/, privacy-policy/
│   │       │   │
│   │       │   └── 📁 home/             # Páginas iniciais
│   │       │       ├── [20 arquivos]   # 10 *.ts, 5 *.html, 5 *.scss
│   │       │       └── signin/, sign-up/, forgot-password/
│   │       │
│   │       ├── 📁 confirm-email-code/   # Confirmação de email
│   │       │   ├── confirm-email-code.component.ts
│   │       │   ├── confirm-email-code.routes.ts
│   │       │   ├── 📁 error/
│   │       │   └── 📁 success/
│   │       │
│   │       ├── 📁 gerencial/            # Módulo Administrativo
│   │       │   ├── gerencial.component.ts
│   │       │   ├── gerencial.routes.ts
│   │       │   └── 📁 pages/            # Páginas administrativas
│   │       │       ├── [220 arquivos]  # 138 *.ts, 41 *.html, 41 *.scss
│   │       │       └── dashboard/, users/, location/, event/, 
│   │       │           banners/, categories/, tickets/, coupons/,
│   │       │           financial/, config/
│   │       │
│   │       ├── 📁 home/                 # Módulo Home Admin
│   │       │   └── [25 arquivos]       # 13 *.ts, 6 *.html, 6 *.scss
│   │       │
│   │       └── 📁 shared/               # Componentes compartilhados
│   │           └── [98 arquivos]       # 62 *.ts, 18 *.html, 18 *.scss
│   │
│   ├── 📁 assets/                       # 🎯 ASSETS - Recursos estáticos
│   │   ├── 📁 images/                   # Imagens da aplicação
│   │   │   ├── logo-header.png
│   │   │   ├── logo-home.png
│   │   │   ├── no-image.jpg
│   │   │   └── [outras imagens...]
│   │   │
│   │   ├── 📁 map-icons/                # Ícones para mapas
│   │   │   ├── arena-icon.png
│   │   │   ├── arte-icon.png
│   │   │   └── [outros ícones...]
│   │   │
│   │   └── 📁 png/                      # Imagens PNG
│   │       ├── default-user.png
│   │       ├── home-bg.jpg
│   │       └── [outras imagens...]
│   │
│   ├── 📁 environments/                 # Configurações de ambiente
│   │   ├── environment.ts               # Produção
│   │   └── environment.development.ts   # Desenvolvimento
│   │
│   ├── 📄 index.html                    # HTML principal
│   ├── 📄 main.ts                       # Ponto de entrada
│   └── 📄 styles.scss                   # Estilos globais
│
├── 📁 dist/                             # Build de produção
├── 📁 node_modules/                     # Dependências
├── 📄 angular.json                      # Configuração do Angular CLI
├── 📄 package.json                      # Dependências e scripts
├── 📄 tailwind.config.js                # Configuração do Tailwind CSS
├── 📄 postcss.config.js                 # Configuração do PostCSS
└── 📄 tsconfig.json                     # Configuração do TypeScript
```

## 🎯 Princípios de Organização

### 1. **Core Module** (`src/app/core/`)
- **Propósito**: Funcionalidades centrais e compartilhadas
- **Conteúdo**: Serviços base, guards, interceptors, modelos, utilitários
- **Regra**: Não deve depender de outros módulos da aplicação

### 2. **Feature Modules** (`src/app/modules/`)
- **Propósito**: Módulos de funcionalidade específica
- **Estrutura**: Cada módulo tem sua própria estrutura de pastas
- **Lazy Loading**: Todos os módulos são carregados sob demanda

### 3. **Shared Module** (`src/app/modules/shared/`)
- **Propósito**: Componentes, diretivas e pipes reutilizáveis
- **Uso**: Importado por outros módulos quando necessário

## 🚀 Módulos Principais

### **Client Module**
- **Rota**: `/client`
- **Funcionalidades**: Área do usuário, autenticação, páginas públicas
- **Submódulos**: account, common-pages, home

### **Gerencial Module**
- **Rota**: `/gerencial`
- **Funcionalidades**: Painel administrativo
- **Submódulos**: dashboard, users, location, event, banners, categories, tickets, coupons, financial, config

### **Home Module**
- **Rota**: `/admin`
- **Funcionalidades**: Home do administrador

### **Confirm Email Module**
- **Rota**: `/confirm`
- **Funcionalidades**: Confirmação de email

## 🛡️ Segurança e Guards

- **loggedAdminGuard**: Verifica se o usuário é admin logado
- **loggedUserGuard**: Verifica se o usuário está logado
- **permissionGuard**: Verifica permissões específicas

## 🎨 Tecnologias Utilizadas

- **Angular 17**: Framework principal
- **Angular Material**: Componentes UI
- **PrimeNG**: Biblioteca de componentes
- **Tailwind CSS**: Framework CSS
- **TypeScript**: Linguagem principal
- **RxJS**: Programação reativa
- **SweetAlert2**: Alertas e modais
- **ngx-toastr**: Notificações
- **Google Maps**: Integração com mapas

## 📝 Convenções de Nomenclatura

- **Componentes**: PascalCase (ex: `UserComponent`)
- **Serviços**: PascalCase + Service (ex: `AuthService`)
- **Interfaces**: PascalCase (ex: `UserInterface`)
- **Arquivos**: kebab-case (ex: `user-profile.component.ts`)
- **Pastas**: kebab-case (ex: `user-profile/`)

## 🔧 Scripts Disponíveis

```bash
npm start          # Servidor de desenvolvimento
npm run build      # Build de produção
npm run watch      # Build com watch mode
npm test           # Executar testes
npm run lint       # Linting com correção automática
```

## 📋 Checklist para Novos Desenvolvedores

- [ ] Entender a estrutura modular do projeto
- [ ] Conhecer os guards de autenticação e permissão
- [ ] Seguir as convenções de nomenclatura
- [ ] Usar lazy loading para novos módulos
- [ ] Manter a separação entre core e feature modules
- [ ] Documentar novos componentes e serviços
- [ ] Seguir os padrões de roteamento estabelecidos

---

*Este documento serve como referência para manter a consistência arquitetural do projeto.*


