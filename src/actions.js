const axios = require('axios');

/**
 * Description of the action goes here
 * @param  {String} params.name=value Description of the parameter goes here
 * @param  {Number} [params.age] Optional parameter
 */
async function yourCustomAction(state, event, params) {
  return state
}

module.exports = {
  health_headline: async (state, event) => {
    const API_KEY = '92c883128839445987f58bf181e05d61'
    let headlines;

    await axios.get("https://newsapi.org/v2/top-headlines?sources=medical-news-today&apiKey=92c883128839445987f58bf181e05d61").then((response) => {
      headlines = response.data.articles;
      console.log(headlines);
    });

    return {...state};
  }
}
