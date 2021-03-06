const axios = require('axios').default;

function getSampleObjects(medium) {
  const periods = [
    `dateBegin=-8000&dateEnd=-1000`,
    `dateBegin=-1000&dateEnd=500`,
    `dateBegin=500&dateEnd=1400`,
    `dateBegin=1400&dateEnd=1600`,
    `dateBegin=1600&dateEnd=1800`,
    `dateBegin=1800&dateEnd=1900`,
    `dateBegin=1900&dateEnd=2019`,
  ];

  const objects = periods.map(period => {
    const apiQuery = `https://collectionapi.metmuseum.org/public/collection/v1/search?medium=${medium}&hasImages=true&${period}&q=*`;
    return axios
      .get(apiQuery)
      .then(response => {
        const { objectIDs } = response.data;
        if (!objectIDs) return false;
        const randomIndex = Math.floor(Math.random() * objectIDs.length);
        const randomObjectID = objectIDs[randomIndex];

        return axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectID}`
        );
      })
      .then(response => {
        const object = response.data;
        return object;
      })
      .catch(err => console.error(err));
  });
  return objects;
}

module.exports = getSampleObjects;

/* Promise.all(getSampleObjects(media[2]))
  .then(res => console.log(res))
  .catch(err => console.log(err));
*/
