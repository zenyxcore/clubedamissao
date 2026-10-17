# Clube da Missão

Protótipo funcional de uma aventura familiar em casa. Next.js App Router, React, TypeScript, Tailwind CSS e Motion. Não usa login, pagamentos, publicidade nem serviços de backend.

## Executar

Node.js 24 e npm.

```sh
npm ci
npm run dev
```

`npm run lint`, `npm run typecheck`, `npm test` e `npm run build` verificam o projeto. A Vercel detecta o Next.js automaticamente. Não são necessárias variáveis de ambiente.

## Experimentar a missão completa

1. Entre no Clube e cadastre de um a três apelidos.
2. Abra a missão, selecione um aventureiro ou uma equipe e prepare a aventura.
3. O responsável imprime (ou copia) as seis pistas e prepara os esconderijos do guia. A confirmação de responsável é apenas uma pausa de interface, não autenticação.
4. Encontre cada cartão e digite o código no app antes de resolver seu desafio. Use as dicas quando precisar.
5. Registre cada descoberta para salvar o progresso. Ao completar as seis etapas, imprima o certificado personalizado.

A biblioteca abre documentos HTML completos, imprimíveis pelo navegador. Para PDF, escolha **Imprimir / Salvar como PDF**. O botão de download salva uma cópia HTML; não finge gerar um arquivo PDF. Os assets originais enviados estão em `public/assets`. A logo não foi redesenhada. Os objetos são exibidos por recortes SVG das pranchas originais.

## Arquitetura

- `src/lib/adventure.ts`: missão, validação, perfis, equipes, conquistas e recuperação dos dados locais.
- `src/lib/materials.ts`: materiais personalizados e impressão.
- `src/components/club-app.tsx`: telas, onboarding e jogo.
- `src/components/asset.tsx`: objetos ilustrados originais.
- `src/lib/avatars.ts` e `src/components/profile-avatar.tsx`: catálogo dos dez personagens, migração dos avatares anteriores e retratos reutilizáveis.
- `src/app/globals.css`: tokens visuais, responsividade e redução de movimento.
- `tests/`: validações da progressão e persistência.

O progresso é independente por aventureiro ou combinação de equipe e usa `localStorage` (`clube-da-missao:v1`). Não é sincronizado entre aparelhos e pode ser apagado pela limpeza do navegador. Uma nova equipe inicia do zero; voltar à mesma equipe recupera a expedição. O diário e o certificado são compartilhados pelos participantes da equipe ativa. Perfis podem ter o nome e o avatar editados pelo responsável. Há dez retratos ilustrados de personagens, gerados individualmente e otimizados para a interface. A exclusão de perfis tem confirmação, pode ser desfeita antes de salvar e remove somente as expedições que incluíam o perfil excluído. Excluir todos os perfis retorna à entrada do Clube. Os avatares da primeira versão são migrados automaticamente, mantendo nomes e progresso. Não há rankings entre crianças.

O mapa é narrativo; os esconderijos físicos são os do guia. Aventuras futuras aparecem como **Em breve**. Nenhuma funcionalidade de compra ou desbloqueio pago foi simulada.

## Prévia

![Interface do Clube da Missão](docs/clube-da-missao-preview.jpg)

## Kit de impressão

A preparação e a biblioteca oferecem PDFs A4 finais em `public/materiais`: seis pistas em três folhas, versão econômica, guia de três páginas, carta-convite e diário de quatro páginas. A carta é opcional; o cartão 1 começa o jogo. O certificado continua personalizado pelo navegador. Os cartões e o guia também são abertos pelos botões anteriores.

Para regenerar os PDFs: `python scripts/build-materials.py` (ReportLab e pypdf instalados; dependências npm instaladas). O script importa STEPS diretamente do jogo; não duplique os desafios em outro arquivo. A carta-convite original fica em `public/materiais/carta-convite.jpg`.

O aplicativo ainda usa persistência local e não possui autenticação ou liberação de acesso vinculada à compra. Os PDFs publicados são acessíveis por URL; não representam controle de acesso ao order bump.

## Temporada de cinco aventuras

O mapa inclui cinco logos e cenários. As histórias e as 30 etapas ficam em `src/server/season-content.json`, servidas por `/api/temporada/missoes/[id]` apenas após validação de compra no servidor. O progresso é local e separado por missão e IDs da equipe. Os materiais são abertos em HTML imprimível (guia + seis cartões; certificado ao concluir), com opção de salvar PDF pelo navegador.

### Configuração comercial necessária

Na Vercel, configure `CAKTO_CLIENT_ID`, `CAKTO_CLIENT_SECRET` (chave com read + orders), `CAKTO_SEASON_PRODUCT_ID` (UUID do produto adicional) e `SEASON_SESSION_SECRET` (aleatório, mínimo 32 caracteres). Nunca envie segredos ao cliente nem os publique no GitHub. Credenciais não foram provisionadas nesta alteração. Sem elas, a ativação falha fechada e nenhuma missão extra é liberada.

A ativação atual pede e-mail e UUID completo do pedido do upsell. Consulta `GET https://api.cakto.com.br/public_api/orders/{id}/`, exige status paid, produto correto, e-mail correspondente e ausência de reembolso/chargeback/cancelamento. Sessão com jose, cookie HttpOnly, Secure em produção, SameSite=Lax, validade de sete dias. Cada abertura da missão consulta novamente a Cakto; falha do provedor bloqueia o conteúdo, não libera acesso. Nenhuma credencial da API nem dado pessoal do pedido retorna ao cliente.

Não há webhook nem associação automática pós-compra nesta versão. Não anuncie ativação automática antes de implementar esse vínculo e validar uma compra real. O botão no app abre `/upsell?origem=clube`, modo de checkout direto. Configure o checkout e os botões no repositório da LP. Um pedido pendente nunca é aceito como comprovante. Valide Pix e cartão, reembolso, produto errado e reativação em outro aparelho antes de ativar vendas do pacote.

Documentação consultada: https://docs.cakto.com.br/api-reference/orders/retrieve e https://docs.cakto.com.br/authentication .

## Experiência do Clube e instalação

- O manifesto em `/manifest.webmanifest` fornece instalação com ícones próprios, modo independente e área segura do celular. O convite aparece após 12 segundos na tela inicial; dispensá-lo adia nova sugestão por sete dias. Meu Clube mantém instruções acessíveis. A instalação depende do navegador e precisa ser confirmada pelo usuário.
- `/sw.js` mantém somente o aviso offline e os PDFs públicos da missão principal em cache. Ele nunca armazena respostas de APIs, sessões de compra ou histórias pagas. O jogo completo não é anunciado como offline.
- Equipe, progresso e preparação ficam no armazenamento deste navegador. Meu Clube permite exportar e restaurar um backup JSON validado, sem tokens de compra. A restauração exige confirmação; a temporada precisa ser ativada no outro aparelho.
- O passaporte preserva um carimbo por missão/equipe ao reiniciar a trilha. Em missões extras antigas já concluídas, abrir novamente a missão migra o carimbo (data de registro da migração, pois o formato antigo não guardava data).
- Sincronização automática entre dispositivos ainda não existe: exige autenticação do comprador e banco persistente. Não substitua isso por variáveis de memória de uma função Vercel.
- O kit único contém os 11 PDFs/páginas de guia, pistas coloridas, carta e diário. `scripts/build-materials.py` o recompõe usando pypdf. A versão econômica permanece separada.

Validação manual: criar apelido → preparar equipe → abrir kit → marcar checklist → jogar → pausar → continuar → concluir → conferir carimbo → reiniciar preservando carimbo → exportar backup → confirmar restauração. Testar instalação em Android/Chrome e iOS/Safari reais; o navegador automatizado não substitui essa confirmação nativa.
