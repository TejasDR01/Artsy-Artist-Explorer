const express = require('express');
const axios = require('axios');
const authMiddleware = require('./middlewares/auth_middleware');
const Favorite = require('./models/Favorite');
const fs = require('fs').promises;
const os = require('os');
let ARTSY_TOKEN = "";
const app = express.Router();

async function readToken(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return data;
        } catch (error) {
            return null;
        }
}

const writeToken = async (filePath, text)=>{
        try {
            await fs.writeFile(filePath, text, 'utf8');
        } catch (error) {
            console.error(`Token write failed (local): ${error}`);
        }
}
const main = async ()=>{
  ARTSY_TOKEN = await readToken("token.txt");
  console.log(ARTSY_TOKEN);
}
main();

const login = async ()=>{
    const data = {
        client_id: '', // enter your artsy client_id
        client_secret: '' // enter your artsy client_secret
    };

    try {
        const res = await axios.post('https://api.artsy.net/api/tokens/xapp_token', data);
        if (res.status === 201) {
            const token = res.data.token;
            ARTSY_TOKEN = token;
            await writeToken('token.txt', token);
            console.log(ARTSY_TOKEN);
        } else {
            console.error(res.data);
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        if (error.response && error.response.data) {
            console.error('Response data:', error.response.data);
        }
    }
}

const performArtistSearch = async (req, res) => {
  try {
      const response = await axios.get(`https://api.artsy.net/api/search?q=${req.query.keyword}&size=10&type=artist`, {
          headers: { 'X-XAPP-Token': ARTSY_TOKEN }
      });
      const result = [];
      response.data._embedded.results.forEach(i => {
        result.push({
          pic_url: i._links.thumbnail.href,
          title: i.title,
          id: i._links.self.href.split("/").pop() // .pop() gets the last element
        });
      });
      res.json(result);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token might be invalid, attempting to refresh...');
      try {
          await login();
          await performArtistSearch(req, res); // Pass req and res
      } catch (loginError) {
          console.error('Login failed:', loginError.message);
          res.status(500).json({ error: 'Error fetching artist data'  });
      }
    } else {
      console.log(error);
      res.status(500).json({ error: 'Error fetching artist data' });
    }  
  }
}

const getArtistDetails = async (req, res) => {
  try {
      const response = await axios.get(`https://api.artsy.net/api/artists/${req.query.id}`, {
          headers: { 'X-XAPP-Token': ARTSY_TOKEN }
      });
      const data = response.data;
      result={
          name: data.name,
          birthday: data.birthday,
          deathday: data.deathday,
          nationality: data.nationality,
          biography: data.biography
      }
      res.json(result);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token might be invalid, attempting to refresh...');
      try {
          await login();
          await getArtistDetails(req, res); // Pass req and res
      } catch (loginError) {
          console.error('Login failed:', loginError.message);
          res.status(500).json({ error: 'Error fetching artist data'  });
      }
    } else {
      console.log(error);
      res.status(500).json({ error: 'Error fetching artist data' });
    }
  }
}

const getSimilarArtists = async (req, res) => {
  try {
      const response = await axios.get(` https://api.artsy.net/api/artists?similar_to_artist_id=${req.query.id}`, {
          headers: { 'X-XAPP-Token': ARTSY_TOKEN }
      });
      const result = [];
      response.data._embedded.artists.forEach(i => {
        result.push({
          pic_url: i._links.thumbnail.href,
          name: i.name,
          id: i.id 
        });
      });
      res.json(result);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token might be invalid, attempting to refresh...');
      try {
          await login();
          await getSimilarArtists(req, res); // Pass req and res
      } catch (loginError) {
          console.error('Login failed:', loginError.message);
          res.status(500).json({ error: 'Error fetching artist data'  });
      }
    } else {
      console.log(error);
      res.status(500).json({ error: 'Error fetching artist data' });
    }
  }
}

const getArtistArtworks = async (req, res) => {
  try {
      const response = await axios.get(` https://api.artsy.net/api/artworks?artist_id=${req.query.id}&size=10`, {
          headers: { 'X-XAPP-Token': ARTSY_TOKEN }
      });
      const result = [];
      response.data._embedded.artworks.forEach(i => {
        result.push({
          pic_url: i._links.thumbnail.href,
          title: i.title,
          id: i.id,
          date: i.date 
        });
      });
      res.json(result);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token might be invalid, attempting to refresh...');
      try {
          await login();
          await getArtistArtworks(req, res); // Pass req and res
      } catch (loginError) {
          console.error('Login failed:', loginError.message);
          res.status(500).json({ error: 'Error fetching artist data'  });
      }
    } else {
      console.log(error);
      res.status(500).json({ error: 'Error fetching artist data' });
    }
  }
}

const getArtworkGenes = async (req, res) => {
  try {
      const response = await axios.get(`https://api.artsy.net/api/genes?artwork_id=${req.query.id}`, {
          headers: { 'X-XAPP-Token': ARTSY_TOKEN }
      });
      const result = [];
      response.data._embedded.genes.forEach(i => {
        result.push({
          pic_url: i._links.thumbnail.href,
          name: i.name,
          id: i.id
        });
      });
      res.json(result);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token might be invalid, attempting to refresh...');
      try {
          await login();
          await getArtworkGenes(req, res); // Pass req and res
      } catch (loginError) {
          console.error('Login failed:', loginError.message);
          res.status(500).json({ error: 'Error fetching artist data'  });
      }
    } else {
      console.log(error);
      res.status(500).json({ error: 'Error fetching artist data' });
    }
  }
}

const addFavorite = async (req, res) => {
  const { artistId } = req.body;
  try {
      const response = await axios.get(`https://api.artsy.net/api/artists/${artistId}`, {
        headers: { 'X-XAPP-Token': ARTSY_TOKEN }
      });
      const data = response.data;
      result={
          userId: req.user.id,
          artistId: artistId, 
          artistName: data.name,
          birthday: data.birthday,
          deathday: data.deathday,
          nationality: data.nationality,
          thumbnail: data._links.thumbnail ? data._links.thumbnail.href: "assets/shared/missing_image.png",
          addedAt: new Date()
      }
      const favorite = new Favorite(result);
      await favorite.save();
      res.status(201).json(favorite);
  } catch (error){
    if (error.response && error.response.status === 401) {
      console.log('Token might be invalid, attempting to refresh...');
      try {
          await login();
          await addFavorite(req, res); // Pass req and res
      } catch (loginError) {
          console.error('Login failed:', loginError.message);
          res.status(500).json({ error: 'Error fetching artist data'  });
      }
    } else {
      console.log(error);
      res.status(500).json({ error: 'Error adding artist data to favorites' });
    }
    
  }
}

app.get('/artists/search', performArtistSearch);
app.get('/artists', getArtistDetails);
app.get('/artists/similar', getSimilarArtists);
app.get('/artists/artworks', getArtistArtworks);
app.get('/artists/artworks/genes', getArtworkGenes);
app.post('/favorites', authMiddleware, addFavorite);

app.get('/favorites', authMiddleware, async (req, res) => {
  try{
    const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(favorites);
  }catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching artist data from favorites' });
  }
});

app.delete('/favorites', authMiddleware, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.user.id, artistId: req.query.id });
    res.json({ message: 'Removed from favorites' });
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: 'Error removing artist data from favorites' });
  }
});

module.exports = app;