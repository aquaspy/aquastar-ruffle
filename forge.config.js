const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './icon.png'
  },
  rebuildConfig: {},
  makers: [
    // Windows: Squirrel installer (explicitly target Windows)
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'], // Added to ensure Windows builds are generated
      config: {
        arch: 'x64'
      }
    },
    // macOS: ZIP
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        arch: ['x64', 'arm64']
      }
    },
    // Linux: AppImage
    {
      name: '@reforged/maker-appimage',
      platforms: ['linux'], // Explicitly target Linux
      config: {
        arch: ['x64', 'arm64']
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
