import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import UserModel from "../modules/auth/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

// Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log(`_________________email: ${username}`);
    const user = await UserModel.findByEmail(username).select("+password");

    if (!user) return done(null, false, { message: "User not found" });

    const isMatch = await user.checkPassword(password);
    if (!isMatch) return done(null, false, { message: "Invalid password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: "Incorrect password" });

    return done(null, user);
  })
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    (payload, done) => {
      try {
        const user = UserModel.findById(payload._id);
        if (user) return done(null, user);
        else return done(null, false);
      } catch (e) {
        done(e, false);
      }
    }
  )
);

// passport.serializeUser((user: any, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj: any, done) => {
//   done(null, obj);
// });

export default passport;
