const express =require('express');
const bodyparser =require('body-parser')

const promoRouter = express.Router({mergeParams: true});

promoRouter.use(bodyparser.json());

promoRouter.route('/')
.get((req,res,next) => {
    res.end('Will send all the promotions to you!');
})

.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /promotions');
});



promoRouter.route('/:promoId')
.get((req,res,next) => {
    res.end('Will send details of the promotion: ' + req.params.promoId +' to you!');
})

.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})

.put((req, res, next) => {
  res.write('Updating the promotion: ' + req.params.promoId + '\n');
  res.end('Will update the promotion: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting promotion: ' + req.params.promoId);
})

module.exports = promoRouter



