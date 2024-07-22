import jwt from 'jsonwebtoken';


export const generateTokenandCookie = (userId, res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })
    res.cookie("jwt",token , {
        httpOnly: true, // this means that the cookie cannot be accessed by the client side scripts
        maxAge: 1000 * 60 * 60 * 24 * 15, // this means that the cookie will expire in 15 days
        sameSite: 'strict'  // this means that the cookie will only be sent in a first-party context (for CSRF protection) 
    })
    return token;
}
