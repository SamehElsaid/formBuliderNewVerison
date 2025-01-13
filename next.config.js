const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  reactStrictMode: false,
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'en',
    localeDetection: true
  },
  env: {
    API_URL: 'https://localhost:7101/api'
  },
  images: {
    domains: []
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
      'react/jsx-dev-runtime.js': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
      'react/jsx-runtime.js': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js')
    }

    return config
  }
}
