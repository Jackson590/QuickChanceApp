const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const router = express.Router();

// ================= GOOGLE LOGIN =================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Here you can save/find user in DB
    return done(null, profile);
  }
));

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Send token/user back to Flutter
    res.json({ user: req.user });
  }
);

// ================= GITHUB LOGIN =================
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", 
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

module.exports = router;
