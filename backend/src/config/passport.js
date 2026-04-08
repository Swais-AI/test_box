const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }

        // Check if user exists
        let user = db.findUserByEmail(email);

        if (!user) {
          // Create new user with no user_type
          user = {
            id: Date.now().toString(), // Simple string ID
            email,
            name: profile.displayName || email.split('@')[0],
            first_name: profile.name?.givenName || '',
            last_name: profile.name?.familyName || '',
            phone_number: null,
            dob: null,
            user_type: null,
            createdAt: new Date().toISOString()
          };
          db.addUser(user);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
