# Vídeo Atletas

App inicial (celular + navegador no PC) para **buscar vídeos no Google Drive** e **organizá-los por atleta**.

Construído com [Expo](https://expo.dev) e [Expo Router](https://docs.expo.dev/router/introduction/) — um único código para **Android**, **iOS** e **web**.

## O que já funciona

- **Início** — resumo de atletas, vídeos e pendências
- **Atletas** — cadastro, detalhe e remoção (dados salvos no aparelho)
- **Vídeos** — biblioteca, filtro “sem atleta”, associação a atletas, player integrado
- **Configurações** — login Google (Drive somente leitura), ID da pasta e sincronização
- **Modo demo** — atletas e vídeos de exemplo sem configurar Google

## Rodar localmente

```bash
npm install
npm run web      # PC / navegador
npm run android  # emulador ou dispositivo
npm run ios      # macOS + simulador ou Expo Go
```

## Publicar na Vercel (web / PC no navegador)

O repositório já inclui `vercel.json` e `api/index.js` (adapter oficial do Expo Router).

1. Acesse [vercel.com/new](https://vercel.com/new) e importe este repositório GitHub.
2. A Vercel detecta o `buildCommand` (`npm run build` → `expo export -p web`).
3. Em **Settings → Environment Variables**, adicione:
   - `EXPO_PUBLIC_GOOGLE_CLIENT_ID` — mesmo valor do `.env` local (se for usar Drive).
4. Faça o deploy. A URL será algo como `https://seu-projeto.vercel.app`.
5. No **Google Cloud Console**, inclua essa URL (e `https://seu-projeto.vercel.app/*` se pedido) nos **URIs de redirecionamento OAuth** autorizados.

Arquivos relevantes:

| Arquivo | Função |
|---------|--------|
| `vercel.json` | Build, pasta estática `dist/client`, função serverless e rewrites |
| `api/index.js` | Handler `expo-server/adapter/vercel` apontando para `dist/server` |

Deploy manual (opcional):

```bash
npx vercel --prod
```

Requer Node **22+** (compatível com `expo-server`).

## Mini app (instalável na tela inicial)

Depois do deploy na Vercel, você pode tratar o site como **mini app** (PWA):

| Plataforma | Como instalar |
|------------|----------------|
| **Android (Chrome)** | Menu → *Instalar app* — ou use o banner em **Config** |
| **iPhone (Safari)** | Compartilhar → *Adicionar à Tela de Início* |
| **PC (Chrome/Edge)** | Ícone de instalação na barra de endereço |

O `app.json` já define `display: "standalone"` (abre sem barra do navegador, como app).

### App “de verdade” na loja (opcional)

Se quiser APK/IPA na Play Store / App Store (não só atalho web):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android   # ou ios
```

Mesmo código Expo; o build nativo é maior, mas funciona offline com mais controle (cache de vídeo, push, etc.).

### Mini app só para atletas (produto)

Hoje o app é “completo” (treinador + demo). Para um mini app **só leitura para atletas**, o caminho usual é:

1. Publicar a URL/PWA para atletas.
2. Adicionar **login por atleta** (código ou e-mail) e esconder abas de admin.
3. Opcional: **baixar vídeos** no aparelho (`expo-file-system`) para assistir offline.

## Conectar o Google Drive

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/).
2. Ative a **Google Drive API**.
3. Crie credenciais **OAuth 2.0** (cliente Web para `npm run web`; inclua também Android/iOS se for publicar nativo).
4. Copie `.env.example` para `.env` e defina:

   ```env
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
   ```

5. No app, abra **Config** → **Conectar Google**. Anote o **redirect URI** que o Expo usa e cadastre-o nas credenciais OAuth autorizadas.
6. Informe o **ID da pasta** do Drive onde estão os vídeos (ou `root`) e toque em **Sincronizar vídeos**.

Escopo usado: `drive.readonly` (apenas listar e reproduzir).

## Estrutura do projeto

| Caminho | Descrição |
|---------|-----------|
| `app/(tabs)/` | Telas principais (Início, Atletas, Vídeos, Config) |
| `app/athlete/[id].tsx` | Detalhe do atleta |
| `app/video/[id].tsx` | Player e metadados |
| `context/AppProvider.tsx` | Estado global + persistência |
| `lib/googleDrive.ts` | Listagem de vídeos na API do Drive |
| `lib/googleAuth.ts` | OAuth com PKCE (expo-auth-session) |

## Próximos passos sugeridos

- Pastas automáticas por atleta no Drive (escrita)
- Tags, competições e datas de treino
- Upload direto da câmera para a pasta do atleta
- Contas de treinador / login na nuvem (Supabase, Firebase, etc.)
- Build de loja (EAS Build) e app desktop (Electron/Tauri) se quiser instalável no PC

## Licença

Projeto inicial — use e adapte como preferir.
