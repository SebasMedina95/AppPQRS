import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED: string = envs.JWT_SEED;

export class JwtAdapter {

    async generateToken( payload: any, duration: string = "4h" ) {

        return new Promise( (resolve) => {
            jwt.sign( payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
                
                if( err ) return resolve(null);
                return resolve(token);

            })
        })

    }

    async validateToken<T>( token: string ): Promise<T | null> {

        return new Promise( (resolve) => {

            jwt.verify( token, JWT_SEED, (err, decoded) => {

                if( err ) return resolve(null);
                resolve( decoded as T );

            });

        })

    }

}