'use strict';

const path = require('path')
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'mock.json'), {});
const middlewares = jsonServer.defaults({});

server.use(middlewares);
server.use(jsonServer.bodyParser)

server.patch('/collection', async (req, res) => {
    const db = router.db;

    const resBody = {};

    try {
        patch('todos');
        patch('columns');
        patch('notifications');
        db.write();
        res.json(resBody);
    } catch (e) {
        console.error(e);
        res.json({});
        res.sendStatus(400);
    }

    function patch(key) {
        const newItems = req.body[key];
        if (!!newItems && Array.isArray(newItems) && newItems.length) {
            const table = db.get(key).value();
            resBody[key] = [];
            newItems.forEach(newItem => {
                const originIndex = table.findIndex(v => v.id === newItem.id);
                if (originIndex >= 0) {
                    const patched = {...table[originIndex], ...newItem};
                    table[originIndex] = patched
                    resBody[key].push(patched);
                }
            });
        }
    }
});

server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
});