module.exports = {
    apps: [{
        name: 'xxxxxx',
        script: './dist/main.js',
        instances: 4,
        exec_mode: "cluster"
    }]
}