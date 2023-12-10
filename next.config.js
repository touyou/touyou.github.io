module.exports = (phase, { defaultConfig }) => {
  /** @type {imoprt('next').NextConfig} */
  const nextConfig = {
    ...defaultConfig,
    experimental: {
      typedRoutes: true
    }
  }
  return nextConfig;
}
