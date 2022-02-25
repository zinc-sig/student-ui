module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/assignments',
          permanent: true,
        },
      ]
    },
  }