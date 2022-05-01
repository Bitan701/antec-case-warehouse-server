const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb')

const app = express()

//middleware
app.use(cors())
app.use(express.json())

const uri =
	'mongodb+srv://dbadmin:<password>@cluster0.vpxsj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
client.connect((err) => {
	const collection = client.db('test').collection('devices')
	console.log('casedb connected')
	// perform actions on the collection object
	client.close()
})

app.get('/', (req, res) => {
	res.send('running case server')
})

app.listen(port, () => {
	console.log('Listening to port', port)
})
