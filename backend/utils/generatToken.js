import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// generate token signed
export const generateAuthToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

export const generateVerificationToken = () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.
        createHash('sha256')
        .update(rawToken)
        .digest('hex');
    return { rawToken, hashedToken };
}

export const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV==='production'?'none':'lax',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

