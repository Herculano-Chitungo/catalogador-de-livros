/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mongodbUri = exports.getMongoDbUri = void 0;
const tslib_1 = __webpack_require__(1);
const node_fs_1 = tslib_1.__importDefault(__webpack_require__(5));
const node_path_1 = tslib_1.__importDefault(__webpack_require__(6));
const defaultMongoUri = 'mongodb+srv://admin:123@cluster0.q69ozlb.mongodb.net/catalogo_livros?retryWrites=true&w=majority&appName=Cluster0';
const envFilePath = node_path_1.default.resolve(process.cwd(), '.env.local');
function readMongoUriFromEnvFile() {
    if (!node_fs_1.default.existsSync(envFilePath)) {
        return null;
    }
    const envFileContents = node_fs_1.default.readFileSync(envFilePath, 'utf8');
    const mongoLine = envFileContents
        .split(/\r?\n/)
        .find((line) => line.startsWith('MONGODB_URI='));
    if (!mongoLine) {
        return null;
    }
    return mongoLine.slice('MONGODB_URI='.length).trim().replace(/^"|"$/g, '');
}
function getMongoDbUri() {
    return process.env.MONGODB_URI ?? readMongoUriFromEnvFile() ?? defaultMongoUri;
}
exports.getMongoDbUri = getMongoDbUri;
exports.mongodbUri = getMongoDbUri();


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("cors");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.livroRouter = void 0;
const express_1 = __webpack_require__(2);
const get_collection_1 = __webpack_require__(11);
const mongodb_1 = __webpack_require__(7);
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const collection = await (0, get_collection_1.getCollection)(req.app, 'livros');
        const livros = await collection.find({}).toArray();
        const formatados = livros.map(l => ({ ...l, id: l._id.toString() }));
        res.json(formatados);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
});
router.post('/', async (req, res) => {
    try {
        const collection = await (0, get_collection_1.getCollection)(req.app, 'livros');
        const novoLivro = req.body;
        delete novoLivro.id;
        delete novoLivro._id;
        const resultado = await collection.insertOne(novoLivro);
        res.status(201).json({ ...novoLivro, _id: resultado.insertedId });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar livro' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const collection = await (0, get_collection_1.getCollection)(req.app, 'livros');
        const { id } = req.params;
        const dadosAtualizados = { ...req.body };
        delete dadosAtualizados.id;
        delete dadosAtualizados._id;
        let filtro = { id: id };
        if (mongodb_1.ObjectId.isValid(id)) {
            filtro = { $or: [{ _id: new mongodb_1.ObjectId(id) }, { id: id }] };
        }
        const resultado = await collection.updateOne(filtro, { $set: dadosAtualizados });
        if (resultado.matchedCount === 0) {
            const insertRes = await collection.insertOne(dadosAtualizados);
            return res.json({ ...dadosAtualizados, _id: insertRes.insertedId });
        }
        res.json({ message: 'Atualizado com sucesso' });
    }
    catch (error) {
        console.error('Erro no PUT:', error);
        res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const collection = await (0, get_collection_1.getCollection)(req.app, 'livros');
        const { id } = req.params;
        let filtro = { id: id };
        if (mongodb_1.ObjectId.isValid(id)) {
            filtro = { $or: [{ _id: new mongodb_1.ObjectId(id) }, { id: id }] };
        }
        await collection.deleteOne(filtro);
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro no DELETE:', error);
        res.status(500).json({ error: 'Erro ao remover livro' });
    }
});
exports.livroRouter = router;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCollection = void 0;
const mongodb_1 = __webpack_require__(7);
const mongodb_uri_1 = __webpack_require__(4);
let client;
async function getCollection(arg1, arg2) {
    if (!client) {
        client = new mongodb_1.MongoClient(mongodb_uri_1.mongodbUri);
        await client.connect();
    }
    const collectionName = typeof arg2 === 'string' ? arg2 : arg1;
    return client.db('catalogo_livros').collection(collectionName);
}
exports.getCollection = getCollection;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authRouter = void 0;
const express_1 = __webpack_require__(2);
const get_collection_1 = __webpack_require__(11);
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', async (req, res, next) => {
    try {
        const { usuario, senha } = req.body;
        const user = await (await (0, get_collection_1.getCollection)(req.app, 'usuarios')).findOne({ usuario, senha });
        if (user) {
            res.json({ success: true, message: 'Autenticado com sucesso', usuario: user.usuario });
        }
        else {
            res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
        }
    }
    catch (error) {
        return next(error);
    }
});


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(2));
const path = tslib_1.__importStar(__webpack_require__(3));
const mongodb_uri_1 = __webpack_require__(4);
const mongodb_1 = __webpack_require__(7);
const cors_1 = tslib_1.__importDefault(__webpack_require__(8));
const body_parser_1 = __webpack_require__(9);
const livro_router_1 = __webpack_require__(10);
const auth_router_1 = __webpack_require__(12);
const app = (0, express_1.default)();
// Usar CORS antes dos middlewares de roteamento:
app.use((0, cors_1.default)());
// Processar corpo da requisição HTTP antes das rotas que necessitam desse corpo:
app.use((0, body_parser_1.json)());
mongodb_1.MongoClient.connect(mongodb_uri_1.mongodbUri).then((client) => {
    app.locals.db = client.db('catalogo_livros');
    console.log(`Conectado ao MongoDB.`);
}).catch(err => {
    console.error(err);
});
app.use('/assets', express_1.default.static(path.join(__dirname, 'assets')));
app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to api!' });
});
app.use('/api/livros', livro_router_1.livroRouter);
app.use('/api/auth', auth_router_1.authRouter);
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
    console.log(`MongoDB connection configured from ${mongodb_uri_1.mongodbUri}`);
});
server.on('error', console.error);

})();

/******/ })()
;