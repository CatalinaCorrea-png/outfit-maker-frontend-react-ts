import axios from "axios"
import { type UserJSONResponse } from "..//dto/UserDTO"
import type { AuthRegisterRequest } from "../dto/AuthRegisterRequest"
import type { AuthRegisterResponse } from "../dto/AuthRegisterResponse"

class UserService {

    async login(email: string, password: string): Promise<UserJSONResponse> {
        const response = await axios.post<UserJSONResponse>(
            import.meta.env.VITE_API_URL + "/auth",
            { email, password }
        )
        return response.data
    }

    async register(request: AuthRegisterRequest): Promise<AuthRegisterResponse> {
        const response = await axios.post<AuthRegisterResponse>(
            import.meta.env.VITE_API_URL + "/auth/register",
            { ...request }
        )
        return response.data
    }

}

export const userService = new UserService()