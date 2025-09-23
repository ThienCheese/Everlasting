import db from '../../database/connection.js';

const User ={
    async findByEmail(email){
        return db('users').where({email}).first();
    }
};

export default User;