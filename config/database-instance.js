let isProduction = !!process.env.NODE_ENV

const user = 'sgpa_auth'
const password = 'S$slf#1'

module.exports = {
  prd1: {
    user,
    password,
    connectString: isProduction ? '200.219.213.200:1521/AGMPRD1' : '10.10.0.72:1521/AGMPRD1',
  },
  prd: {
    user,
    password,
    connectString: isProduction ? '200.219.213.203:1521/AGMPRD' : '10.10.0.71:1521/AGMPRD',
  },
  qas:{
    user,
    password,
    connectString: isProduction ? '200.219.213.202:1521/AGMQAS' : '10.10.0.65:1521/AGMQAS',
  },
  slf2:{
    user,
    password,
    connectString: isProduction ? '200.219.213.200:1521/SLFPRD2' : '10.10.0.73:1521/SLFPRD2',
  },
  slf3:{
    user,
    password,
    connectString: isProduction ? '200.219.213.200:1521/SLFPRD3' : '10.10.0.74:1521/SLFPRD3'
  }
}