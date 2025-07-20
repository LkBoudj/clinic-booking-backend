import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import UserModel, { IUser } from "../modules/auth/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

// Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await UserModel.findByEmail(username)
      .select("+password")
      .populate("roles", "name _id")
      .exec();

    if (!user) return done(null, false, { message: "User not found" });

    const isMatch = await user.checkPassword(password);

    if (!isMatch) return done(null, false, { message: "Invalid password" });

    const { first_name, last_name, email, avatar, roles } = user;
    return done(null, { first_name, last_name, email, avatar, roles });
  })
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.id)
          .select("id first_name last_email avatar email roles")
          .populate("roles", "name -_id")
          .exec();
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
