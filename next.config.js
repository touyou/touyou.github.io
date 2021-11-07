const withLinaria = require('next-linaria')

const repoName = '/nextjs-linaria'
/** @type {import('next').NextConfig} */
module.exports = withLinaria({
  reactStrictMode: true,
  linaria: {
    /* linaria options here */
  }
})
