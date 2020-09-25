if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://chris:chris1234@ds239055.mlab.com:39055/myapp-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/myapp-dev'}
}