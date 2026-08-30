import axios from "axios"
import { type UserJSONResponse } from "../domain/User"

class UserService {

    async login(email: string, password: string): Promise<UserJSONResponse> {
        const response = await axios.post<UserJSONResponse>(
            import.meta.env.VITE_API_URL + "/auth/login",
            { email, password }
        )
        return response.data
    }

}

export const userService = new UserService()