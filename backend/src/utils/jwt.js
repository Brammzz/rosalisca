import jwt from "jsonwebtoken";

export const generateJWToken = (res, userId) => {
  try {
    const cookie = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("user", cookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return cookie;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Erro ao gerar token JWT" };
  }
};
