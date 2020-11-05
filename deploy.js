var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/autodeploy', secret: 'cary101' }) 
// 上面的 secret 保持和 GitHub 后台设置的一致
const { spawn } = require('child_process');

function run_cmd() {
    const bat = spawn('cmd.exe', ['/c', 'deploy.bat']);

    bat.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });
}


// 第一次启动
const start = spawn('cmd.exe', ['/c', 'start.bat']);

start.stdout.on('data', (data) => {
    console.log(data.toString());
});

start.stderr.on('data', (data) => {
    console.error(data.toString());
});

start.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
});

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(7777)
// 这里是监听的端口号

handler.on('error', function (err) {
    console.error('Error:', err.message)
})

handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);
    run_cmd();
})

/*
handler.on('issues', function (event) {
console.log('Received an issue event for % action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
*/