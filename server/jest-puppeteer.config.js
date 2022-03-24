module.exports = {
    launch: {
        headless: false,
        devtools: true,
        timeout: 30000
    },
    server: {
        command: 'tsc && node ./build',
        port: 1337,
        launchTimeout: 20000,
        debug: true,
    },
}