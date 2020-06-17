const express =require('express');
const bodyparser =require('body-parser')

const leaderRouter = express.Router({mergeParams: true});

leaderRouter.use(bodyparser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})

.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})

.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /leaders');
});



leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})

.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})

.put((req, res, next) => {
  res.write('Updating the leader: ' + req.params.leaderId + '\n');
  res.end('Will update the leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
})

module.exports = leaderRouter;




