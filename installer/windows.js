const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, "Amplify Launcher-win32-ia32"),
    authors: 'Amplify Devs',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Amplify Launcher.exe',
    setupExe: 'amplifysetup.exe',
    setupIcon: path.join(rootPath, 'build', 'amp_icon.ico')
  })
}