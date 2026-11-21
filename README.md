# Leitor QR - Peppe (v5.8)

Aplicação web estática (HTML, CSS e JavaScript, sem build) para **ler e gerar QR Codes, códigos de barras, boletos e Pix**, com **voz que guia a leitura**.

## Novidades da v5.8

- **Setas de direção**: onde o aparelho tem o leitor nativo (Chrome/Edge no Android e no computador), se o código estiver fora do centro a câmera pisca uma seta (👈 👉 👆 👇) e mostra/fala "Mova um pouco para a esquerda/direita/cima/baixo". Prioridade: "Segure firme" > direção > "Aproxime". No iPhone não há posição do código, então só valem as frases gerais. Respeita "reduzir movimento" do sistema (sem piscar).
- **Nova versão**: quando o service worker novo assume, aparece uma faixa "Nova versão disponível" com o botão "Atualizar agora". Evita conflito de versões antigas em cache.

## Novidades da v5.7

**Abrir o app do banco (Android)**: o botão copia o código e tenta abrir o aplicativo instalado pelo endereço `intent://#Intent;package=...` (pacotes conferidos em lista pública de apps; Itaú, Inter, C6, Mercado Pago e PagBank ainda não têm pacote conferido e abrem o site). Se a página continuar à vista depois de ~2 s, o app entende que não abriu e abre o site oficial. **Não testado em aparelho real**: o Chrome pode recusar abrir um app que não aceita esse tipo de chamada; nesse caso o site abre normalmente e o código continua copiado. Para incluir outro banco, adicione `pkg` em `BANK_SITES` (core.js) com o nome do pacote da Play Store. Em Configurações, "Abrir primeiro" escolhe app ou site. No iPhone sempre abre o site.

## Novidades da v5.6

- **Pix salvo**: depois da primeira cobrança, a chave, o nome e a cidade ficam só neste aparelho (nada é enviado). A chave aparece oculta (`ma•••@exemplo.com`) e o olhinho mostra/oculta. Quem cobra só digita o valor. "Editar dados" e "Apagar dados salvos" ficam no cartão.
- **Minhas cobranças**: cada Pix gerado com valor entra numa lista com descrição, prazo opcional e situação em texto (Pendente · conferir no banco, Prazo em..., Atrasada..., Recebido). O app **não confirma pagamentos**: você marca "Recebi" depois de conferir no extrato. O Pix estático não guarda data dentro do código, então o prazo é só um lembrete local.
- **WhatsApp**: botão por cobrança (e no Pix gerado) abre `wa.me` com mensagem pronta, código copia e cola e chave. Com o telefone do cliente abre a conversa; sem, o WhatsApp pede o contato.
- **Fala e avisos**: em Configurações, "Detalhe da fala" = Resumo (padrão) ou Completo (recebedor, cidade, tipo da chave, banco do boleto e dias para vencer). O aviso na tela mostra sempre os detalhes. O Pix estático não informa o banco nem vencimento, então o app não inventa.
- **Instalar app**: só em Configurações, com QR e link para instalar em outro celular (precisa do site em https).

## Novidades da v5.5

As bibliotecas de terceiros ficam em `vendor/` (html5-qrcode 2.3.8, qrcodejs 1.0.0, JsBarcode 3.11.6, jsPDF 2.5.1), com as licenças em `vendor/LICENSES.txt`. O app não faz mais nenhuma requisição externa para carregar código; depois da primeira abertura funciona inteiro sem internet, inclusive o PDF. Para atualizar uma biblioteca, troque o arquivo em `vendor/` e aumente o número do cache em `sw.js`.

## Novidades da v5.4

**Guia visual**: onde o navegador tem `BarcodeDetector` (Chrome/Edge no Android e computador), a câmera desenha o contorno e as bolinhas nos 4 cantos de cada código. A cor nunca é o único sinal: aparecem textos ("Lido", "Fora da lista", "Aproxime a câmera", "Segure firme"). Onde não existe (iPhone/Safari), aparece só uma mira fixa. Dá para desligar em Configurações.

**Motor alternativo**: se o leitor principal (ZXing) não decodifica um código que está à vista por 3 janelas de 4 segundos, o app passa a decodificar com o leitor nativo do aparelho e avisa por voz e texto. Não foi testado com câmera real.

## Novidades da v5.3

**Conferência de inventário** (Lote > "Conferir com lista esperada"): cole ou importe uma lista no formato `codigo;quantidade;descricao` (um item por linha; use "Modelo" para baixar um exemplo). A lista fica salva separada do lote e sobrevive a "Novo lote". O app mostra Completo, Falta, Sobra, Não lido e Fora da lista, e a voz avisa o progresso a cada leitura.

**Relatório em PDF**: botão "Baixar PDF" no Lote (A4, com totais, pagamentos, alertas e inventário). A biblioteca jsPDF é local (`vendor/`) e carrega só quando você pede o primeiro PDF; funciona sem internet.

**Testes**: `npm install` e depois `npm run test:all` (núcleo, PDF e interface). O PDF de exemplo vai para `tests/out/`.


## O que faz

**Leitura**
- Câmera ou imagem (arrastar, escolher ou colar). QR Code, EAN-13/8, UPC-A/E, Code 128/39/93, ITF, Codabar, GS1 DataBar, Data Matrix, PDF417 e Aztec.
- Três modos: *Tudo*, *Só QR* e *Só códigos de barras* (área de leitura retangular e formatos restritos, mais rápido e preciso para barras).
- Leitura contínua (vários códigos seguidos, ignorando repetições), zoom e troca de câmera quando o aparelho permite.
- **Lanterna**: botão sempre visível durante a leitura (Android/Chrome). iPhone/Safari não permitem controlar a lanterna pelo navegador; o app avisa.
- **Editar texto**: corrija o texto lido (o histórico e o veredito são atualizados) ou use **Gerar QR deste texto**.
- Na imagem, tenta primeiro o leitor nativo do navegador e depois várias correções (inclui QR de pontos arredondados).
- Imagens são tentadas automaticamente com várias correções (contraste, binarização, redimensionamento).

**Voz (Web Speech API)**
- Fala em PT-BR/EN/ES: avisa para centralizar o código (com dicas a cada ~7 s: aproximar/afastar, ligar a lanterna), diz quando leu e o que leu (valor do Pix/boleto, site do link) e quando vai abrir um link.
- Escolhe automaticamente a melhor voz do aparelho: no Microsoft Edge prefere **Thalita (pt-BR) Natural**, depois Francisca; no celular usa as vozes do sistema. Em **Ajustes** dá para escolher outra voz, velocidade e testar.
- Não depende de servidor: usa as vozes instaladas no navegador/sistema.

**Lote (vários códigos de uma vez)**
- Ative **Modo lote** na tela de leitura: a câmera fica ligada e cada código vira um item de um dicionário (repetidos aumentam a quantidade). Sai da vista e volta = nova leitura; ficar parado na frente não conta de novo.
- Boleto lido em barras e depois em linha digitável, ou produto em UPC-A e EAN-13, são reconhecidos como o **mesmo item**.
- Voz curta durante a leitura (só o número; "Repetido" e alarme falado para itens com alerta), sons e vibração diferentes para novo, repetido e alerta.
- Aba **Lote**: totais (itens, leituras, **total a pagar** de boletos e Pix conferidos, unidades de produtos, próximo vencimento), avisos de **risco de pagamento em duplicidade**, boletos vencidos e itens bloqueados (ficam fora dos totais), filtros (alertas, boletos e Pix, produtos), busca, ajuste de quantidade e remoção.
- Exportar **CSV** (com proteção contra injeção de fórmulas no Excel/Planilhas) e **JSON**, copiar tudo, compartilhar, salvar na Biblioteca e "Novo lote". Até 500 itens, salvo neste aparelho.
- Em imagem, navegadores com leitor nativo (ex.: Chrome no Android) leem **vários códigos da mesma foto** e os adicionam ao lote; nos demais, lê-se um código por vez.

**Verificação antes de pagar (anti-golpe)**
- Cada leitura recebe um **veredito** visível e falado: *Conferido*, *Atenção* ou *Não pague / não continue*, com os motivos.
- Pix com CRC inválido, boleto com dígito verificador errado e `javascript:`/`data:` ficam em vermelho e **sem botão de pagar**.
- Link que cita um banco (Nubank, Itaú, Bradesco, Santander, Banco do Brasil, C6, Inter, Mercado Pago, PagBank, PicPay, Caixa) mas não está no domínio oficial gera alerta de **possível imitação**.
- Conteúdos incomuns são explicados: `file://` (aponta para um arquivo do aparelho de quem gerou; navegadores não abrem), link de aplicativo, segredo 2FA (`otpauth://`) e criptomoeda.
- **Copiar e abrir meu banco**: em Ajustes escolha o banco. Depois da conferência o botão copia o Pix (ou a linha digitável do boleto) e abre **somente o site oficial** do banco. O app nunca pede nem vê senha, não envia dados ao banco e não executa pagamento.

**Reconhecimento inteligente do conteúdo**
- **Pix**: mostra chave, recebedor, cidade e valor, e **valida o CRC** (alerta "não pague" se estiver adulterado). Reconhece Pix dinâmico.
- **Boleto** (código de barras ITF de 44 dígitos ou linha digitável de 47): banco, valor, vencimento e **validação dos dígitos verificadores**. Reconhece também conta de consumo/convênio e chave de NF-e.
- **Produtos** (EAN/UPC/GTIN): valida o dígito verificador, indica prefixo Brasil (789/790) e consulta opcional no Open Food Facts. **Livros** (ISBN) via Open Library.
- **Links**: mostra o domínio e alerta para http, endereço IP, domínio com caracteres falsificados, encurtadores e usuário/senha embutidos.
- **Wi-Fi** (copiar senha), **contato vCard** (baixar .vcf), e-mail, telefone, SMS e localização.

**Gerar**
- QR Code com tamanho, correção de erro, cores e logotipo (usa correção máxima automaticamente com logotipo; a prévia já mostra o logotipo).
- Códigos de barras: Code 128, EAN-13, EAN-8, UPC-A, Code 39 e ITF.
- QR Pix estático com chave normalizada (CPF, CNPJ, telefone, e-mail, aleatória), nome/cidade sem acentos corrigidos automaticamente e autoverificação do CRC.

**Dados**
- Histórico (100 leituras), estatísticas por formato, exportar CSV.
- Biblioteca com notas editáveis, busca, exportar/importar JSON.
- Tudo fica no navegador. Interface PT-BR/EN/ES, tema claro/escuro, PWA instalável (ícones PNG, atalhos e funcionamento offline após a primeira carga).

## Publicar no GitHub Pages
1. Crie um repositório e envie **todo o conteúdo desta pasta** (incluindo `icons/`) para a raiz.
2. Settings → Pages → *Deploy from a branch* → `main` / `/ (root)` → Save.
3. Abra o endereço `https://SEU-USUARIO.github.io/NOME-DO-REPO/` (HTTPS é obrigatório para a câmera).

Depois de publicar uma nova versão, abra o site e recarregue uma vez para o service worker novo assumir.

## Estrutura
| Arquivo | Função |
|---|---|
| `index.html` | Estrutura das telas |
| `style.css` | Visual (tema claro/escuro) |
| `core.js` | Lógica pura: Pix, boleto, GTIN, Wi-Fi, vCard, análise de links |
| `i18n.js` | Textos e frases de voz em PT-BR/EN/ES |
| `app.js` | Câmera, voz, interface e armazenamento |
| `sw.js` | Cache/offline (páginas: rede primeiro) |
| `tests/core.test.js` | Testes da lógica (`npm test`) |
| `tests/ui.smoke.test.js` | Teste de interface simulada (`npm install` e depois `npm run test:ui`) |

## Importante
- Câmera e instalação PWA exigem **HTTPS** ou localhost.
- Bibliotecas locais em `vendor/`: nada é baixado de CDN. A busca de produto por código de barras (opcional) é a única função que usa internet.
- **Voz:** o navegador só libera a fala após um toque na página (por isso o botão *Iniciar câmera* já "destrava" a voz). Vozes naturais online do Edge precisam de internet.
- **Abrir links automaticamente** (Ajustes, desligado por padrão): só para links https sem alertas, com contagem de 3 s e botão Cancelar. Por segurança não funciona em leitura contínua. O navegador pode pedir confirmação ao sair da página.
- Consulta de produto/livro envia o código às bases públicas Open Food Facts / Open Library apenas quando você pede (ou ativa a consulta automática).
- O Pix gerado é **estático** e não processa pagamento; confira recebedor e valor no app do banco. A validação de boleto e de Pix é informativa: a conferência final é sempre no app do seu banco.
- QR com cores pouco contrastantes ou logotipo grande pode ficar ilegível: teste antes de imprimir.

## Histórico de versões
- **v5.8** — Setas de direção na câmera (👈 👉 👆 👇 piscando ~1,5 s, sempre com texto e voz "Mova um pouco para a esquerda") e aviso "Nova versão disponível · Atualizar agora".
- **v5.7** — Android: "Copiar e abrir meu banco" tenta abrir primeiro o app instalado (Nubank, Bradesco, Banco do Brasil, Caixa, Santander) e, se não abrir em ~2 s, abre o site oficial. Preferência "Abrir primeiro: app/site".
- **v5.6** — Pix com dados salvos (chave oculta com olhinho; só digita o valor), lista de cobranças (pendente/recebi, prazo, atraso) com envio por WhatsApp, fala "Resumo/Completo" e avisos na tela com recebedor, chave, banco e vencimento, e botão Instalar app só em Configurações (com QR para instalar em outro celular).
- **v5.5** — Bibliotecas copiadas para `vendor/` (sem CDN): sem avisos de Tracking Prevention e app 100% offline desde a primeira abertura; instalação do service worker mais robusta e diagnóstico no botão Instalar app.
- **v5.4** — Guia visual na câmera (cantos e bolinhas sobre o código, orientação em texto "Aproxime"/"Segure firme", verde = já lido, vermelho = fora da lista) e troca automática para o leitor nativo (BarcodeDetector) após 3 tentativas sem leitura; botão Instalar app.
- **v5.3** — Conferência de inventário (lista esperada × lote: falta, sobra, fora da lista), voz com progresso ("3 de 10", "Completo", "Fora da lista") e relatório em PDF para baixar.
- **v5.2** — Modo lote: leitura em sequência com dicionário sem duplicatas, totais de pagamentos e estoque, avisos de duplicidade, filtros, exportação CSV/JSON, vários códigos por foto, CSV do histórico protegido contra injeção de fórmulas.
- **v5.1** — Veredito de confiança (Pix, boleto, links, imitação de bancos), "Copiar e abrir meu banco", tratamento de `file://`/2FA/cripto/app, editar texto lido, lanterna sempre visível com plano B, leitura de QR de pontos arredondados, layout de celular corrigido (320–412 px), `.gitignore`, `package.json` e teste de interface.
- **v5.0** — Voz guiada (Thalita/Edge), modos de leitura por tipo, leitura contínua, lanterna/zoom/troca de câmera, reconhecimento de boleto/NF-e/GTIN/ISBN/Wi-Fi/vCard, validação de Pix, análise de segurança de links, gerador de códigos de barras, biblioteca com notas e JSON, ajustes, ícones PNG, atalhos PWA, interface 100% traduzida, código separado em arquivos e testes.
- **v4.2** — Correção da leitura pela câmera (tentativas em cascata, mensagens de erro específicas, service worker com rede primeiro).
- **v4.1** — Pausa após a primeira detecção, área de leitura quadrada, câmera traseira preferida.
