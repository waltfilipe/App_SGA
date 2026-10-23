import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

/** Escopo somente leitura do Drive — suficiente para listar e reproduzir vídeos. */
export const GOOGLE_DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

export function getGoogleClientId(): string | undefined {
  return process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
}

export function isGoogleConfigured(): boolean {
  return Boolean(getGoogleClientId());
}

export function useGoogleDriveAuth() {
  const clientId = getGoogleClientId();
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'videoatletas' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId ?? 'missing-client-id',
      redirectUri,
      scopes: GOOGLE_DRIVE_SCOPES,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    DISCOVERY,
  );

  return { request, response, promptAsync, redirectUri, clientId };
}
