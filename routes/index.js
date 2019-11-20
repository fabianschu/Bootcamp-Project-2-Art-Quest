const express = require('express');
const getSampleObjects = require('../evalPreferences/evalPreferences');

const selectQuest = require(`../evalPreferences/selectQuest`);

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/details', (req, res, next) => {
  res.render('details');
});

router.get('/test', (req, res, next) => {
  Promise.all(getSampleObjects('Paintings'))
    .then(objects => {
      res.send(objects);
    })
    .catch(err => console.log(err));
});

router.get('/assess/:medium', (req, res, next) => {
  const media = {
    painting: 'Paintings',
    sculpture: 'Sculpture',
    furniture: 'Furniture',
    music: 'Musical+instruments',
  };

  if (!Object.keys(media).includes(req.params.medium)) {
    return res.redirect('/');
  }

  const selectedMedium = media[req.params.medium];
  console.log(selectedMedium);
  Promise.all(getSampleObjects(selectedMedium))
    .then(objects => {
      res.render('assess', { objects, selectedMedium });
    })
    .catch(err => console.log(err));
});

router.post('/assess', (req, res, next) => {
  const departments = {
    'American Decorative Arts': '1',
    'Ancient Near Eastern Art': '3',
    'Arms and Armor': '4',
    'Arts of Africa, Oceania, and the Americas': '5',
    'Asian Art': '6',
    'The Cloisters': '7',
    'The Costume Institute': '8',
    'Drawings and Prints': '9',
    'Egyptian Art': '10',
    'European Paintings': '11',
    'European Sculpture and Decorative Arts': '12',
    'Greek and Roman Art': '13',
    'Islamic Art': '14',
    'The Robert Lehman Collection': '15',
    'The Libraries': '16',
    'Medieval Art': '17',
    'Musical Instruments': '18',
    Photographs: '19',
    'Modern Art': '21',
  };
  // const parsedObj = JSON.parse(approvedObjs.replace(/'(.+)':/g, '"$1":'));
  // const approvedObjIds = Object.keys(parsedObj);
  const approvedObjIds = Object.keys(req.body);
  const randomIndex = Math.floor(Math.random() * approvedObjIds.length);
  const modelObjId = approvedObjIds[randomIndex];
  console.log(req.body[modelObjId]);
  const [year, department, culture, medium] = JSON.parse(
    req.body[modelObjId].replace(/'/g, '"')
  );
  selectQuest({
    objectId: approvedObjIds[randomIndex],
    date: year,
    departmentId: departments[department],
    q: culture,
    medium,
  })
    .then(obj => {
      const questItem = obj.data;
      console.log(obj.data);
      res.render('details', { questItem });
    })
    .catch(err => console.log(err));
});

module.exports = router;
