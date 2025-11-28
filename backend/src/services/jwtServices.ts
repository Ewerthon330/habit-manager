import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { IJwtPayload } from '../interfaces/interfaces'
config()

if (!process.env.JWTSECRET) {
    throw new Error('Variável de ambiente JWTSECRET não foi definida.')
}

const JWT_SECRET = process.env.JWTSECRET;

const sign = (data: IJwtPayload): string => {
    return jwt.sign(data, JWT_SECRET, {expiresIn: '1h'})
}

const verify = (token: string): IJwtPayload => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'string') {
            throw new Error('Payload do token é inválido');
        }

        return decoded as IJwtPayload;
    } catch (error) {
        throw new Error ('Token inválido ou expirado');
    }
};

export default {
    sign,
    verify
}