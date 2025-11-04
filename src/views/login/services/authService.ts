import axios from "axios";
import apiClient from "../../../api/api"; 
import { BaseUser, UserRoleInCompany } from "../../../contexts/AuthContext";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: BaseUser;
  roles: UserRoleInCompany[];
}

export const loginWithCredentials = async (email: string, password: string): Promise<LoginData> => {
  try {
    const tokenParams = new URLSearchParams();
    tokenParams.append('username', email); 
    tokenParams.append('password', password);

    const tokenResponse = await axios.post<TokenResponse>(
      `${apiUrl}/api/token`,
      tokenParams,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    const [userResponse, rolesResponse] = await Promise.all([
      apiClient.get<BaseUser>(`${apiUrl}/api/users/me`),
      apiClient.get<UserRoleInCompany[]>(`${apiUrl}/api/users/me/roles`)
    ]);

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      user: userResponse.data,
      roles: rolesResponse.data,
    };

  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 401) {
        throw new Error("Email o contraseña incorrectos.");
      } else {
        throw new Error("Ocurrió un error en el servidor. Intente más tarde.");
      }
    }
    throw new Error("No se pudo conectar al servidor.");
  }
};
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('roles');
  
};