import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/userSchema.js"; // Adjust the import path based on your file structure

const passportUser = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }

          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
};

export default passportUser;
