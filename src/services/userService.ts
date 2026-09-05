import axios from "axios"
import { type UserJSONResponse } from "..//dto/UserDTO"

class UserService {

    async login(email: string, password: string): Promise<UserJSONResponse> {
        const response = await axios.post<UserJSONResponse>(
            import.meta.env.VITE_API_URL + "/auth",
            { email, password }
        )
        return response.data
    }

}

export const userService = new UserService()