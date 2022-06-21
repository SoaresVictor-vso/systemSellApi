operaçãos da API

op <0, 99>      OPERAÇÕES COMUNS                                                                ROLES PERMITIDAS

op <0, 9>       OPERAÇÕES SIMPLES COM PRODUTOS

op=0            GET     Produtos simplificados no banco de dados [defasado]                     *TODOS*
op=1            POST    Puxa produtos do banco de dados por codigo de barras                    admin, editor, caixa





op <20, 29>     AUTENTICAÇÃO E AUTORIZAÇÃO

op=20           POST    Login, passando user e senha e recebendo um JWT                         *TODOS*
op=21           POST    Validação de JWT, respondendo status *logged* ou *unlogged*             *TODOS*
op=22           POST    Responde a role referente a um JWT ou erro caso seja invalida           *TODOS*




op <100+>       OPERAÇÕES DE CONFIGURAÇÃO E MANUTENÇÃO;

op = 101        GET     Cadastra produtos de um .json no banco de dados;                        Admin
op = 102        GET     Puxa a lista de todos os produtos do banco de dados                     Admin
op = 199        GET     Roda os comandos responsáveis por criar o banco de dados                Admin
