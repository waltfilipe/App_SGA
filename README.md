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
