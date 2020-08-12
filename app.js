/* express setup 

   - include and instantiate express
   - serve assets from public
   - set a port
   - include and use body-parser for reading form contents
*/

const express = require(`express`)
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

const parser = require(`body-parser`)
const urlEncodedParser = parser.urlencoded({extended:true})
const jsonParser = parser.json()

/* mongo setup 

  - include and instantiate MongoClient
  - get mongo connection string from .env
  - connect with creds
*/

const MongoClient = require('mongodb').MongoClient

const dotenv = require(`dotenv`).config()
const mongocreds = process.env.MONGOCREDS

const port = 3000
app.listen( port, () => { console.log("listening")})

MongoClient
  .connect( mongocreds, { useUnifiedTopology: true })

/* define routes and do stuff */ 

  .then( connectedClient => {

      const database = connectedClient.db('new-morning')
      const rolls = database.collection(`rolls`)

      /* */

      app.get(`/`, urlEncodedParser, (req, res) => {

        console.log(`we're in the get`)

        database.collection(`rolls`).find().toArray()
          .then( result => {

            res.render( `index.ejs`, {rolls: result }) /* rolls is the variable name that gets passed to the templating engine, and rollvalues is the results object from the find().toArray() assigned to it */
          })
      })

      /* post: add a new roll from a form */

      app.post( `/newroll`, urlEncodedParser , (req, res) => {

        rolls.insertOne( req.body )
          .then( result => { 
            
            res.redirect(`/`)
          })
          .catch(error => console.error(error))
      })

      /* put: test updating an existing roll */

      app.put(`/update`, jsonParser, (req,res) => {

        // console.log(`rolls exists:` + rolls)
        console.log(`req.body.player:` + req.body.player )

        rolls.findOneAndUpdate(
            { player: 'tom'},
            { $set: 
              {
                player: req.body.player 
              }
            },
            { upsert: false }
          )          
          .then( result => {

            res.json(`success`)
          })
          .catch(error => console.error(error))
      })

      app.delete(`/delete`, jsonParser, (req,res) => {

        console.log(`req.body.player to delete:` + req.body.player)

        rolls.remove({ player: req.body.player })
          .then( result => {          
            res.json(`Deleted one record.`)
          })
          .catch( err => console.log(err))
      })

      /* end put */ 

    }) /* /then */
  .catch( error => { console.error(error) })
