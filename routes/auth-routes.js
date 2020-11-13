const express = require('express');
const authRoutes = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const campus = req.body.campus;
  const course = req.body.course;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  if (password.length < 7) {
    res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    return;
  }

  if (!campus) {
    res.status(400).json({ message: 'Please add your campus.' });
    return;
  }


  if (!course) {
    res.status(400).json({ message: 'Please add your course.' });
    return;
  }

  User.findOne({ username })
    .then(foundUser => {
      if (foundUser) {
        res.status(400).json({ message: 'Username taken. Choose another one.' });
        return;
      }


      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        campus,
        course
      });

      newUser.save()
        .then(() => {
          req.session.currentUser = newUser
          res.status(200).json(newUser);
        })
        .catch(err => {
          res.status(400).json({ message: 'Saving user to database went wrong.' });
        })
    })
    .catch(err => next(err))
})


authRoutes.post("/login", (req,res,next) => {
  const {username, password} = req.body;
  
  User.findOne({username})
    .then( userFromDB => {
      console.log('userFromDb', userFromDB)
      if (!userFromDB) {
        return next(new Error('No user with that username'))
      }

      // compareSync
      if (bcrypt.compareSync(password, userFromDB.password) !== true) {
        return next(new Error('Wrong credentials'))
      } else {
        req.session.currentUser = userFromDB
        res.json(userFromDB)
      }
    }).catch(err =>  res.status(400).json({ message: 'Oopps!! Something went wrong...' }))
})

authRoutes.post('/edit', (req, res, next) => {
  const { username, campus, course } = req.body
  console.log("req.sessions 🥺 =", req.session.currentUser)
   const userId = req.session.currentUser._id

  User.findByIdAndUpdate(userId, { username, campus, course }).then(user => {
    res.json(user)
  }).catch(next)
})

authRoutes.post("/logout", (req,res,next) => {
  req.session.destroy()
  res.json({message: 'Your are now logged out.'})
})

authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.session.currentUser) {
      res.status(200).json(req.session.currentUser);
      return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});





module.exports = authRoutes;