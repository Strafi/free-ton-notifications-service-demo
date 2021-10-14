const express = require('express');
const cors = require('cors');
const sse = require('./api/sse.js');
const api = require('./api/routes/index.js');

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
	console.log(`Request_Endpoint: ${req.method} ${req.url}`);
	next();
});
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(cors());

app.use(api);
app.use(express.static('static'));

app.get('/test/stream', sse.init);

function sent() {
	sse.send('test', 'notification-received');
}

setInterval(sent, 1000);

app.get('*', (req, res) => {
	res.status(404).json({
		msg: 'Not Found'
	});
});

app.listen(port, () => console.log(`BACK_END_SERVICE_PORT: ${port}`));
