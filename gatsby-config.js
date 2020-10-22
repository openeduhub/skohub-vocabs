require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `SkoHub-Vocabs`,
    description: `Static site generator for Simple Knowledge Management Systems (SKOS)`,
    author: `@gatsbyjs`,
  },
  pathPrefix: `${process.env.PATH_PREFIX || ''}`,
  plugins: [
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'data',
        path: `${__dirname}/data`,
      },
    },
  ],
}
