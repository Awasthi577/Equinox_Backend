import { userInterface, UserService } from "../../services/user"

const queries = {
    getUserToken: async (_: any, payload: userInterface) => {
        const token = await UserService.getUserToken(payload);
        return token;
    },
    getCurrentLoggedInUser: async (_: any, pay: any, context: any) => {
        console.log(context)
        if (context && context.user) {
            const id = context.user.id;
            const user = await UserService.getUserById(id);
            return user;
        }
        throw ("dont know who you are!")
    }
}


const mutations = {
    createUser: async (_: any, payload: userInterface) => {
        await UserService.createUser(payload);
        const jwtToken = await UserService.getUserToken(payload);
        return jwtToken
    },
    updateUserName: async (_: any, { newUserName }: { newUserName: string }, context: any) => {
        console.log(context)
        if (context && context.user) {
            const { email, id } = context.user;
            try {
                await UserService.changeUserName(email, id, newUserName);
            } catch (error) {
                return "invalid request"
            }
            return "userName updated successfully"
        }
        throw ("not Authorised, Login first")
    }
}

export const resolvers = { queries, mutations }