import bcrypt from 'bcrypt'




export const Hash=({plaintext,salt=process.env.SALT_ROUND}={})=>{
const hashPAssword=bcrypt.hashSync(plaintext,parseInt(salt))
return hashPAssword
}

export const compare=({plaintext,hashValue}={})=>{
const match=bcrypt.compareSync(plaintext,hashValue)
return match
}