# Specs

## Formato

Cada spec é um arquivo `{feature}.md` com:

1. **Nome** - Nome da feature
2. **Problema** - O que resolve (1-2 frases)
3. **Solução** - Como resolve (brief)
4. **Critérios** - O que precisa funcionar

## Exemplo

```md
# Nome: Autenticação por email

## Problema
Usuários precisam de alternativa ao login social.

## Solução
Implementar login/password com JWT e cookies httpOnly.

## Critérios
- [ ] Registro com validação de email
- [ ] Login com senha hasheada (bcrypt)
- [ ] Logout invalida token
- [ ] Session persiste em refresh
```

## Regras

- 1 arquivo por feature
- Antes de codar, spec deve estar approved
- Manter conciso, máximo 1 página