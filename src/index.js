const express = require('express');
const cors = require('cors');
const config = require('./shared/config')
const stuffRoutes = require("./routes/stuff")
const studentsRoutes = require("./routes/students")
const groupsRoutes = require('./routes/groups')
const directionRoutes = require('./routes/direction');
const { BadRequestError, NotFoundError } = require('./shared/error');

const app = express();
  
app.use(express.json())
app.use(cors())

app.use(stuffRoutes)
app.use(studentsRoutes)
app.use(groupsRoutes)
app.use(directionRoutes)

app.use((err, req, res, next) => {
  let status = 500;
  if(err instanceof BadRequestError){
     status = 400;
  }else if(err instanceof NotFoundError){
    status = 404;
  }
  console.log(err);
  res.status(status).json({error: err.message})
})

app.listen(config.port, () => {
  console.log(`Server ${config.port}-portda ishlayapti`);
});
