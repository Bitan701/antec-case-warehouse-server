const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const app = express()

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vpxsj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
async function run() {
	try {
		await client.connect()
		const productCollection = client.db('project-data').collection('casedb')

		//get all products
		app.get('/products', async (req, res) => {
			console.log('query', req.query)

			const query = {}
			const cursor = productCollection.find(query)
			const products = await cursor.toArray()

			res.send(products)
		})

		// Get number of products
		app.get('/productCount', async (req, res) => {
			const count = await productCollection.estimatedDocumentCount()
			res.send({ count })
		})

		//see single product with id
		app.get('/products/:id', async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const product = await productCollection.findOne(query)
			res.send({ product })
		})

		// post new product
		app.post('/products', async (req, res) => {
			const newCase = req.body
			const result = await productCollection.insertOne(newCase)
			res.send(result)
		})

		//update a product quantity
		app.put('/products/:id', async (req, res) => {
			const id = req.params.id
			const updatedUser = req.body
			const filter = { _id: ObjectId(id) }
			const options = { upsert: true }
			const updatedDoc = {
				$set: {
					quantity: updatedUser.quantity,
				},
			}
			const result = await productCollection.updateOne(
				filter,
				updatedDoc,
				options
			)
			res.send(result)
		})
	} finally {
	}
}
run().catch(console.dir)

app.get('/', (req, res) => {
	res.send('running case server')
})

app.listen(port, () => {
	console.log('Listening to port', port)
})
