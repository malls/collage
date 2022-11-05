const db = require('../app/rediser'),
	garden = require('../lib/garden');

async function show(req, res) {
	console.log('show')

	const cachedData = await db.keys('*');
	var data = [];
	for (var i = 0; i < cachedData.length; i++) {
		data[i] = garden.prettyString(cachedData[i]);
	};

	console.log('Loading main page data:', { data });
	res.render('index', { title: 'Garden Party Club', data });
}

async function getRedisData(req, res) {
	let data = {};
	let keys = await db.keys('*');

	for (let k of keys) {
		data[k] = await await db.hGetAll(k);
	}

	console.log({ data });
	res.render('data', { data });
}

module.exports = {
	show,
	getRedisData
};