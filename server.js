const express = require('express')
const path = require('path')
const session = require('express-session')
const axios = require('axios')
const app = express()

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'tajni_kljuc',
    resave: false,
    saveUninitialized: true
    }
))

app.get('/', (req,res)=>{
    const history = req.session.history || []
    res.status(200).render('home', {history})
})

app.get('/location/:location', async (req,res)=>{
    const {location} = req.params
    console.log(location)
    try {
        const apiKey = 'AIzaSyCIsZLWmx9jxkljcExp54p2tHnynOF1ydU'; 
    
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=activities+in+${location}&key=${apiKey}`
        );
    
        const activities = response.data.results;
        activities.splice(4)
        for(place of activities){
            // Assuming 'place' is the object containing place details from the API response
            if (place.photos && place.photos.length > 0) {
                const photoReference = place.photos[0].photo_reference;
                const apiKey = 'AIzaSyCIsZLWmx9jxkljcExp54p2tHnynOF1ydU';
                const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
                place.photoUrl = photoUrl
            } else {
                console.log('No photos available for this place.');
            }
        }
        res.status(200).render('location', {location: location, activities: activities})
      } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).redirect('/')
      }
})

app.post('/submit', (req,res)=>{
    const {location} = req.body;
    if(location){
        if(!req.session.history){
            req.session.history = []
        }
        
        if (!req.session.history.includes(location)){
            if(req.session.history.length >= 4){
                req.session.history.shift()
            }
            req.session.history.push(location)
        }
        res.redirect(`/location/${location}`)
    }else{
        res.status(400).redirect('/')
    }
    
})


app.all('*', (req,res)=>{
    res.status(404).send('<h1>Error 404: Page Not Found</h1>')
})


app.listen(3000, ()=>{
    console.log('Listening on port 3000...')
})