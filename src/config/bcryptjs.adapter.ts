import bcrypt, { compareSync, genSaltSync, hashSync } from 'bcryptjs';

//NOTA: También lo podíamos hacer como una clase
// export const bcryptAdapter = {

//     hash: (password: string) => {
//         const salt = genSaltSync();
//         return hashSync(password, salt);
//     },

//     compare: (password: string, hashed: string) => {
//         return compareSync(password, hashed);
//     }

// }

export class BcryptAdapter {

    hash( password: string ){
        const salt = genSaltSync();
        return hashSync(password, salt);
    }

    compare(password: string, hashed: string) {
        return compareSync(password, hashed);
    }

}