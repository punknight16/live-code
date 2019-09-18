var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var poolData = {
  UserPoolId : 'us-west-2_UocH9lg6f', // your user pool id here
  ClientId : '3qkpkfad9kf59s5n66gc347dra' // your app client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function doRegister(email, password, userType, liveVideo, liveAudio, cb){
	var cognitoUser;
	var dataUserType = {
    Name : 'custom:userType',
    Value : userType
  };
  var dataLiveVideo = {
    Name : 'custom:liveVideo',
    Value : liveVideo
  };
  var dataLiveAudio = {
    Name : 'custom:liveAudio',
    Value : liveAudio
  };
  var attributeUserType = new AmazonCognitoIdentity.CognitoUserAttribute(dataUserType);
  var attributeLiveVideo = new AmazonCognitoIdentity.CognitoUserAttribute(dataLiveVideo);
  var attributeLiveAudio = new AmazonCognitoIdentity.CognitoUserAttribute(dataLiveAudio);

  var customData = [attributeUserType, attributeLiveVideo, attributeLiveAudio];
	userPool.signUp(email, password, customData, null, function(err, result){
	    if (err) {
	        console.log(err);
	        return cb(err.message);
	    }
	    cognitoUser = result.user;
	    console.log('user name is ' + cognitoUser.getUsername());
	    return cb(null, cognitoUser);
	});
};