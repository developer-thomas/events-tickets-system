# Guia do Desenvolvedor - ATO Cultural Web

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- Angular CLI 17+
- Git

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

## 📁 Estrutura de Pastas - Guia Detalhado

### 🎯 Core Module (`src/app/core/`)

#### **auth/**
- **auth.service.ts**: Gerencia autenticação, login, logout
- **storage.service.ts**: Gerencia localStorage, sessionStorage
- **user.service.ts**: Operações relacionadas ao usuário

#### **guards/**
- **logged-admin.guard.ts**: Verifica se usuário é admin logado
- **logged-user.guard.ts**: Verifica se usuário está logado
- **permission.guard.ts**: Verifica permissões específicas

#### **interceptors/**
- **auth.interceptor.ts**: Adiciona token nas requisições
- **http-error.interceptor.ts**: Trata erros HTTP globalmente

#### **models/**
- **auth.ts**: Interfaces de autenticação
- **address.ts**: Interfaces de endereço
- **register.ts**: Interfaces de registro

#### **services/**
- **base.service.ts**: Serviço base com operações CRUD
- **address.service.ts**: Operações de endereço
- **upload.service.ts**: Upload de arquivos

### 🎯 Feature Modules (`src/app/modules/`)

#### **client/** - Módulo do Cliente
```
client/
├── account/           # Área do usuário logado
│   ├── profile/       # Perfil do usuário
│   ├── events/        # Eventos do usuário
│   ├── tickets/       # Ingressos do usuário
│   └── settings/      # Configurações
├── common-pages/      # Páginas públicas
│   ├── about/         # Sobre nós
│   ├── use-terms/     # Termos de uso
│   └── privacy-policy/ # Política de privacidade
└── home/              # Páginas iniciais
    ├── signin/        # Login
    ├── sign-up/       # Cadastro
    └── forgot-password/ # Recuperar senha
```

#### **gerencial/** - Módulo Administrativo
```
gerencial/
└── pages/
    ├── dashboard/     # Dashboard principal
    ├── users/         # Gestão de usuários
    ├── location/      # Gestão de locais
    ├── event/         # Gestão de eventos
    ├── banners/       # Gestão de banners
    ├── categories/    # Gestão de categorias
    ├── tickets/       # Gestão de ingressos
    ├── coupons/       # Gestão de cupons
    ├── financial/     # Gestão financeira
    └── config/        # Configurações do sistema
```

## 🛠️ Padrões de Desenvolvimento

### 1. **Criação de Componentes**

```typescript
// Estrutura padrão de um componente
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  standalone: false // ou true para componentes standalone
})
export class ExampleComponent implements OnInit {
  // Propriedades
  data: any[] = [];
  
  // Construtor com injeção de dependência
  constructor(
    private service: ExampleService,
    private router: Router
  ) {}
  
  // Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  // Métodos públicos
  loadData(): void {
    // Implementação
  }
}
```

### 2. **Criação de Serviços**

```typescript
// Estrutura padrão de um serviço
@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  // Métodos CRUD
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/examples`);
  }
  
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/examples/${id}`);
  }
  
  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/examples`, data);
  }
  
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/examples/${id}`, data);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/examples/${id}`);
  }
}
```

### 3. **Configuração de Rotas**

```typescript
// Estrutura padrão de rotas
export const routes: Routes = [
  {
    path: '',
    component: ExampleComponent,
    canActivate: [permissionGuard], // Se necessário
    data: { permission: 'EXAMPLE_PERMISSION' }
  },
  {
    path: 'create',
    component: CreateExampleComponent,
    canActivate: [permissionGuard],
    data: { permission: 'CREATE_EXAMPLE' }
  },
  {
    path: 'edit/:id',
    component: EditExampleComponent,
    canActivate: [permissionGuard],
    data: { permission: 'EDIT_EXAMPLE' }
  }
];
```

### 4. **Uso de Guards**

```typescript
// Aplicação de guards nas rotas
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [loggedAdminGuard, permissionGuard],
  data: { permission: 'ADMIN_ACCESS' }
}
```

## 🎨 Estilização

### Tailwind CSS
```html
<!-- Classes utilitárias do Tailwind -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-xl font-semibold text-gray-800">Título</h2>
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Botão
  </button>
</div>
```

### SCSS Customizado
```scss
// Exemplo de estilos customizados
.example-component {
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    border-radius: 0.5rem;
    
    h1 {
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
  
  .content {
    padding: 1.5rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

## 🔧 Ferramentas e Bibliotecas

### Angular Material
```typescript
// Importação de módulos
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
```

### PrimeNG
```typescript
// Importação de componentes
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
```

### SweetAlert2
```typescript
// Uso do SweetAlert2
import Swal from 'sweetalert2';

// Exemplo de confirmação
Swal.fire({
  title: 'Tem certeza?',
  text: 'Esta ação não pode ser desfeita!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sim, deletar!'
}).then((result) => {
  if (result.isConfirmed) {
    // Ação de confirmação
  }
});
```

## 📝 Convenções de Código

### 1. **Nomenclatura**
- **Componentes**: PascalCase (`UserProfileComponent`)
- **Serviços**: PascalCase + Service (`UserService`)
- **Interfaces**: PascalCase (`UserInterface`)
- **Arquivos**: kebab-case (`user-profile.component.ts`)
- **Variáveis**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)

### 2. **Estrutura de Arquivos**
```
feature/
├── feature.component.ts
├── feature.component.html
├── feature.component.scss
├── feature.component.spec.ts
├── feature.routes.ts
└── feature.service.ts
```

### 3. **Imports**
```typescript
// Ordem dos imports
// 1. Angular core
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// 2. Angular common
import { CommonModule } from '@angular/common';

// 3. Third-party libraries
import { MatButtonModule } from '@angular/material/button';

// 4. Application modules
import { SharedModule } from '../shared/shared.module';

// 5. Services
import { ExampleService } from './example.service';

// 6. Models/Interfaces
import { ExampleInterface } from '../models/example.interface';
```

## 🧪 Testes

### Estrutura de Testes
```typescript
describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleComponent],
      imports: [CommonModule, MatButtonModule]
    });
    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 🚀 Deploy

### Build de Produção
```bash
# Build otimizado para produção
npm run build

# Build com análise de bundle
npm run build -- --stats-json
```

### Variáveis de Ambiente
```typescript
// environment.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.ato-cultural.com',
  googleMapsApiKey: 'your-api-key'
};
```

## 📋 Checklist de Desenvolvimento

### Antes de Commitar
- [ ] Código segue as convenções estabelecidas
- [ ] Testes passando
- [ ] Linting sem erros
- [ ] Documentação atualizada
- [ ] Build funcionando

### Code Review
- [ ] Lógica de negócio correta
- [ ] Performance adequada
- [ ] Segurança implementada
- [ ] Tratamento de erros
- [ ] Acessibilidade considerada

---

*Este guia deve ser seguido por todos os desenvolvedores do projeto para manter a consistência e qualidade do código.*
