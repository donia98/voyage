const hashPassword = require('./hashPassword');
const validateEmail = require('./validateEmail');
const { addUser } = require('../model/queries/users');
const { addPerson } = require('../model/queries/person');
const { addBusiness } = require('../model/queries/business');

exports.get = (req, res) => {
  if (req.isUser) {
    res.redirect('/');
  } else {
    res.render('sign_up', {
      style: 'style', dom: 'sign_up', title: 'sign up', style_special: 'sign_up', vald: 'validation',
    });
  }
};

exports.post = (request, response) => {
  const data = request.body;
  const { email, password, type } = data;
  if (email && password) {
    hashPassword(password, (err, hash) => {
      if (err) {
        response.send({ message: 'ERROR' });
      } else if (validateEmail(email)) {
        addUser(data, hash)
          .then((result) => {
            const userId = result.rows[0].id;
            if (type === 'person') { // type = 0 represents person
              addPerson(userId, data)
                .then(() => {
                  response.send({ message: 'Person has been added successful', pass: true });
                }).catch(() => {
                  response.send({ message: ' username already token', pass: false });
                });
            } else if (type === 'business') { // type = 1 represents business
              addBusiness(userId, data)
                .then(() => {
                  response.send({ message: 'Business has been added successful', pass: true });
                }).catch(() => {
                  response.send({ message: 'Business name already exists', pass: false });
                });
            }
          })
          .catch(() => {
            response.send({ message: ' email already exists', pass: false });
          });
      } else {
        response.send({ message: ' not valid email', pass: false });
      }
    });
  }
};
