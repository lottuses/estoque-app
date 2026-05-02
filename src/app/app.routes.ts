import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
        path: 'login',
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component')
                .then(m => m.DashboardComponent),

        children: [
            {
                path: 'infos',
                loadComponent: () =>
                    import('./pages/dashboard/infos/infos.component')
                        .then(m => m.InfosComponent)
            },
            {
                path: 'estoque',
                loadComponent: () =>
                    import('./pages/dashboard/estoque/estoque.component')
                        .then(m => m.EstoqueComponent)
            },
            {
                path: 'financeiro',
                loadComponent: () =>
                    import('./pages/dashboard/financeiro/financeiro.component')
                        .then(m => m.FinanceiroComponent)
            },
            {
                path: 'pedidos',
                loadComponent: () =>
                    import('./pages/dashboard/pedidos/pedidos.component')
                        .then(m => m.PedidosComponent)
            },
            {
                path: 'orcamento',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./pages/dashboard/orcamento/orcamento.component')
                                .then(m => m.OrcamentoComponent)
                    },
                    {
                        path: ':id',
                        loadComponent: () =>
                            import('./pages/dashboard/orcamento/orcamento-item/orcamento-item.component')
                                .then(m => m.OrcamentoItemComponent)
                    }
                ]
            }
        ]
    }
];
