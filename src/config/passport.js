const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Set in .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set in .env
      callbackURL: '/auth/google/callback', // Endpoint for Google's redirect
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if not found
          user = new User({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            profile_image: profile.photos[0].value,
            status: true, // Email is verified through Google
          });
          await user.save();
        }

        done(null, user); // Pass the user object to Passport
        // console.log(profile);
        
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
