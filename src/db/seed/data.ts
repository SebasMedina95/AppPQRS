import { BcryptAdapter } from "../../config/bcryptjs.adapter";
import { IUser } from "../../interfaces/users.interface";

const bcrypt = new BcryptAdapter();

export const userData: IUser[] = [
    {
        typeDocument: "CC",
        document: "1217819003",
        fullName: "Luis Antonio Carriel",
        email: "luisantonio@correo.com",
        emailValidated: true,
        password: bcrypt.hash("_LuisAntonio123"),
        roles: ["USER"],
        img: null,
        address: "Carrera 250 # 23 - 432 - Dummie",
        phone: "6043219011",
        cellPhone: "3129100011",
        description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        createDateAt: new Date()
    }
]
